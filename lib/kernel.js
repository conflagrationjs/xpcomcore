// Convenience shortcuts
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

// Taking some inspiration from Ruby here...
const $LOAD_PATH = [XPCOMCore.libRoot];
const $LOADED_FEATURES = ["kernel.js"];

const $FILE = function() {
  var ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var thisFile = (new Error).stack.split("\n")[2].split("@")[1].split(" -> ").slice(-1)[0].split(/:[0-9]/)[0];
  var thisFileURI = ioService.newURI(thisFile, null, null);
  
  if (thisFileURI.scheme == "resource") {
    var resProt = ioService.getProtocolHandler("resource").QueryInterface(Components.interfaces.nsIResProtocolHandler);
    return ioService.newURI(resProt.resolveURI(thisFileURI), null, null).QueryInterface(Ci.nsIURL).path;
  } else if (thisFileURI.scheme == "file") {
    return thisFileURI.QueryInterface(Ci.nsIURL).path;
  } else {
    // FIXME - throw an appropriate exception here.
    return null;
  }
}

// FIXME - better exceptions.
const LoadError = {name: "LoadError", message: "Could not load file"};

const Kernel = {
  
  print: function(str) {
    dump(str);
  },
  
  puts: function(str) {
    print(str + "\n");
  },

  load: function(featurePath) {
    var loader = Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Ci.mozIJSSubScriptLoader);
    var foundFile = null;
    // FIXME - so this is kinda shitty. We have an empty entry here so we default to just trying to load 
    // from an absolute path
    var loadPath = $LOAD_PATH.concat([""]);
    var loadPathLength = loadPath.length;
    // FIXME - mozilla bug here. if i use foreach on array it ignores the granted security privileges
    for (var i = 0; i < loadPathLength; i++) {
      var potentialFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
      potentialFile.initWithPath(loadPath[i] + "/" + featurePath);
      if (potentialFile.exists()) { 
        foundFile = potentialFile; 
        break;
      }
    };
    if (foundFile) {
      foundFile.normalize();
      loader.loadSubScript("file://" + encodeURI(foundFile.path));
      $LOADED_FEATURES.push(featurePath)  
    } else {
      throw(LoadError);
    }
  },
  
  require: function(feature) {
    var jsFeature = feature + ".js";
    if ($LOADED_FEATURES.indexOf(jsFeature) == -1) {
      load(jsFeature);
      return true;
    } else {
      return false;
    }
  }
}

// FIXME - i just puked in my mouth a little.
for (p in Kernel) { eval('var ' + p + ' = Kernel[p];'); }