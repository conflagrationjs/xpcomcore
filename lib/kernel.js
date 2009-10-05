/** 
 * @fileoverview This file specifies a set of globally useful features/shortcuts
 * and defines our "Kernel" object, which is the base for doing a lot of simple
 * things with XPCOMCore such as loading in other files and printing to the
 * console.
 */

/** 
 * @class Exception representing an error loading a file.
 * @extends Error
 * @constructor
 * @param {String} message The error message to be given for this exception.
 * @returns {Error}
 */
function LoadError(message) {
  var err = new Error(message);
  err.name = arguments.callee.name;
  return err;
};

/** 
 * @class Exception representing an error determining what the path to the currently executing file is.
 * @extends Error
 * @constructor
 * @param {String} message The error message to be given for this exception.
 * @returns {Error}
 */
function SelfConceptError(message) {
  var err = new Error(message);
  err.name = arguments.callee.name;
  return err;
};

/**
 * A pseudo-constructor to make JSDoc happy and actually document things in {@link Kernel}.
 * If this method is called with an argument, all properties from {@link Kernel} are taken
 * and defined as the return value of getter methods set on the given object.
 * @class Our central 'class' containing a lot of properties and methods we need to
 * build the rest of XPCOMCore on top of.
 * @param {Object} mixinScope Optional argument, any object to mix {@link Kernel}'s properties
 * into.
 * @return The prototype object of the Kernel function.
 */
function Kernel(mixinScope) {
  var myPrototype = arguments.callee.prototype;
  if (mixinScope) {
    // FIXME - figure out a better way than this object jammed in here to special case our
    // methods we really want to be calling getters when they're mixed in.
    var callingGetters = {'$CURRENT_FILE': {defaultArgs: [2]}, '$CURRENT_DIRECTORY': {defaultArgs: [3] }};
    var makeGetter = function(attr) { return function() { return myPrototype[attr]; } };
    var makeCallingGetter = function(attr, argsArray) { 
      return function() { 
        return myPrototype[attr].apply(this, argsArray); 
      }
    };
        
    for (var p in myPrototype) { 
      if (callingGetters[p]) {
        mixinScope.__defineGetter__(p, makeCallingGetter(p, callingGetters[p].defaultArgs || []));
      } else {
        mixinScope.__defineGetter__(p, makeGetter(p)); 
      }
    };
    
    // Load up our standard library into the mixinScope.
    var standardLibraries = ['file', 'sys'];
    var standardLibraryLoader = function() {
      standardLibraries.forEach(function(library) { require(library); }, this);
    };
    standardLibraryLoader.call(mixinScope);
  };
  return myPrototype;
};

Kernel.prototype = {
  /** 
   * A shortcut constant to Components.classes.
   */
  $Cc: Components.classes,

  /** 
   * A shortcut constant to Components.interfaces.
   */
  $Ci: Components.interfaces,

  /** 
   * A shortcut constant to Components.results.
   */
  $Cr: Components.results,

  /** 
   * A shortcut constant to Components.utils.
   */
  $Cu: Components.utils,
  
  /** 
   * Taking inspiration from Ruby, this defines the set of paths to check when
   * trying to load a file via either {@link Kernel#load} or {@link Kernel#require}.
   * @type Array
   */
  $LOAD_PATH: [XPCOMCoreConfig.getProperty('libRoot')],

  /** 
   * Taking inspiration from Ruby, this defines the currently loaded files that
   * have been loaded through {@link Kernel#require}.
   * @type Array
   */
  $LOADED_FEATURES: ["kernel.js"],
  
  /** 
   * Taking inspiration from Ruby, this method tries to determine the filesystem path to
   * the caller code of this method.
   * NOTE - when {@link Kernel} is mixed into an object, this function gets mixed in via
   * a special case behaviour that makes it a getter that actually calls the function 
   * rather than returning the function object itself. This is to facilitate being able
   * to call '$CURRENT_FILE' in your code rather than '$CURRENT_FILE()'. The stackTraversalDepth
   * parameter is there for this reason, since we need to traverse the stack further than
   * normal to find the calling scope than we normally would.
   * @returns {String} The path to the current file
   * @param {int} stackTraversalDepth Optional argument, how far to look up the stack to
   * figure out who called us. The default is usually safe.
   * @throws {SelfConceptError} Thrown when we can't figure out what the filesystem
   * path to the current file is.
   */
  $CURRENT_FILE: function(stackTraversalDepth) {
    try {
      var stackTraversalDepth = stackTraversalDepth || 1;
      var ioService = $Cc["@mozilla.org/network/io-service;1"].getService($Ci.nsIIOService);
      // FIXME - UGH. This is so seedy.
      // Traverse up the stack as far as needed to get our caller's stack frame. Sometimes we need to
      // traverse more than one level up, like when this function is actually called from a getter
      // property that references it.
      var callerStack = Components.stack;
      for (var i = 0; i < stackTraversalDepth; i++) {
        callerStack = callerStack.caller;
      }
      // Split based on the stupid fucking " -> " Gecko puts in the filename and get the last entry
      var ostensiblyUs = callerStack.filename.split(" -> ").slice(-1);
      var callerFileURI = ioService.newURI(ostensiblyUs, null, null);
      // QI for an nsIFileURL which lets us get a handle on an actual file attribute and automagically does
      // resource: URL resolution for us
      callerFileURI.QueryInterface($Ci.nsIFileURL);
      // And theoretically, we can now get a handle on an nsIFile and return the path of that.
      return callerFileURI.file.path;
    } catch(e) {
      throw(new SelfConceptError("The filesystem location of the current file could not be determined. -- " + e));
    }
  },
  
  /** 
   * This method tries to determine the filesystem path to parent directory of the caller 
   * code of this method NOTE - see the note on $CURRENT_FILE, as the same applies here.
   * @returns {String} The path to the current directory
   * @param {int} stackTraversalDepth Optional argument, how far to look up the stack to
   * figure out who called us. The default is usually safe.
   * @throws {SelfConceptError} Thrown when we can't figure out what the filesystem
   * path to the parent directory of the current file is.
   */
  $CURRENT_DIRECTORY: function(stackTraversalDepth) {
    var stackTraversalDepth = stackTraversalDepth || 2;
    var currentFilePath = Kernel.prototype.$CURRENT_FILE(stackTraversalDepth);
    
    var fileObject = $Cc["@mozilla.org/file/local;1"].createInstance($Ci.nsILocalFile);
    fileObject.initWithPath(currentFilePath);

    return fileObject.parent.path;
  },
  
  /**
   * Returns a reference to an object allowing for get()/set() on environment variables.
   * @type nsIEnvironment
   */
   
  $ENV: Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment),
  
  /** 
   * Prints a string to standard out, without a trailing newline.
   * @param {String} str String to print to standard out.
   */
  print: function(str) {
    dump(str);
  },
  
  /** 
   * Prints a string to standard out, with a trailing newline.
   * @param {String} str String to print to standard out.
   */
  puts: function(str) {
    print(str + "\n");
  },
  
  /**
   * Searches {@link Kernel#$LOAD_PATH} for files to load into the current global scope.
   * Files loaded via this method will not be added to {@link Kernel#$LOADED_FEATURES} and hence
   * can be repeatedly loaded and executed.
   * @param {String} featurePath Full or relative path including file extension to try and load.
   * @returns {Boolean} True if the file was loaded succesfully
   * @throws {LoadError} Thrown when we can't find the specified file in any directories specified
   * in {@link Kernel#$LOAD_PATH}.
   */
  load: function(featurePath) {
    var loader = $Cc["@mozilla.org/moz/jssubscript-loader;1"].getService($Ci.mozIJSSubScriptLoader);
    var foundFile = null;
    // FIXME - so this is kinda shitty. We have an empty entry here so we default to just trying to load 
    // from an absolute path
    var loadPath = $LOAD_PATH.concat([""]);
    var loadPathLength = loadPath.length;
    // FIXME - mozilla bug here. if i use foreach on array it ignores the granted security privileges
    for (var i = 0; i < loadPathLength; i++) {
      var potentialFile = $Cc["@mozilla.org/file/local;1"].createInstance($Ci.nsILocalFile);
      potentialFile.initWithPath(loadPath[i] + "/" + featurePath);
      if (potentialFile.exists()) { 
        foundFile = potentialFile; 
        break;
      }
    };
    if (foundFile) {
      foundFile.normalize();
      loader.loadSubScript("file://" + encodeURI(foundFile.path));
      return true;
    } else {
      throw(new LoadError("no such file to load -- " + featurePath));
    }
  },

  /**
   * Searches {@link Kernel#$LOAD_PATH} for features to load into the current global scope.
   * Files loaded via this method will be added to {@link Kernel#$LOADED_FEATURES} and hence two 
   * consecutive calls to this method will not load and execute the code twice.
   * @returns {Boolean} True if successful, false if the specified feature has already been required.
   * @param {String} featurePath Full or relative path without the file extension to try and require.
   * @throws {LoadError} Thrown when we can't find the specified feature in any directories specified
   * in {@link Kernel#$LOAD_PATH}.
   */  
  require: function(feature) {
    var jsFeature = feature + ".js";
    if ($LOADED_FEATURES.indexOf(jsFeature) == -1) {
      load(jsFeature);
      $LOADED_FEATURES.push(jsFeature);
      return true;
    } else {
      return false;
    }
  }
};