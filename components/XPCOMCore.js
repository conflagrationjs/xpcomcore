Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
var XPCOMCoreVersion = '0.5.4'; // DO NOT REMOVE THIS COMMENT OR MOVE THIS LINE. THIS LINE IS AUTO-GENERATED FROM A RAKE TASK. @XPCOMCORE_VERSION@
const $Cc = Components.classes;
const $Ci = Components.interfaces;

var ioService = $Cc["@mozilla.org/network/io-service;1"].getService($Ci.nsIIOService);
var libRoot = ioService.newURI("resource://xpcomcore/lib", null, null).QueryInterface($Ci.nsIFileURL).file.path;
var binRoot = ioService.newURI("resource://xpcomcore/bin", null, null).QueryInterface($Ci.nsIFileURL).file.path;

// NOTE - XPCOMCore is a singleton
var XPCOMCore = function() { 
  if (arguments.callee.__singletonInstance__) { return arguments.callee.__singletonInstance__; };

  // Private method that does the work of loading the XPCOMCore kernel
  // into the given scope.
  var loadKernel = function(importScope) {
    var loader = $Cc["@mozilla.org/moz/jssubscript-loader;1"].getService($Ci.mozIJSSubScriptLoader);
    loader.loadSubScript("resource://xpcomcore/lib/kernel.js", importScope);
  };
  
  // Private method to actually kick off the importing of kernel into the given
  // import scope.
  var import = function(importScope, importKernel) {
    if (importScope.__XPCOMCoreLoaded__) {
      return false;
    } else {
      loadKernel(importScope);
      // FIXME - defineGetter explodes when it's a 'Window' object for some reason. Fine for
      // ChromeWindow and fine for BackstagePass though. Weird.
      // importScope.__defineGetter__('__XPCOMCoreLoaded__', function() { return true; });
      importScope.__XPCOMCoreLoaded__ = true;
      // Automatically mix Kernel into the scope if importKernel is true
      if (importKernel) { importScope.Kernel(importScope); };
      return true;
    }
  };
  
  // FIXME - hack. hijacking the nsIWritableVariant interface so we can have a constructor that works
  // FIXME - and to boot, for reasons i dont understand, we wrap the scope in another object, hence the options
  // hash. which might be useful anyway.
  this.setFromVariant = function(options) {
    if (!options.scope) { return false; }
    return import(options.scope, !(options.importKernel === false));
  };

  arguments.callee.__singletonInstance__ = this;
  // HACK HACK HACK - this is so we can get a reference to the real constructor
  // from the bootstrapper.
  this.__specialConstructor__ = arguments.callee;  
};

// FIXME - maybe? might not really be a 'bug'
// Bahaha - we rely on http://mxr.mozilla.org/mozilla1.8/source/js/src/xpconnect/src/xpcwrappedjsclass.cpp#528
// (as written about in http://weblogs.mozillazine.org/weirdal/archives/019778.html) to expose a getProperty
// method on this object to allow for getting arbitrary properties.
var XPCOMCoreInterfaces = [$Ci.nsIClassInfo, $Ci.nsIPropertyBag, $Ci.nsIWritableVariant];

XPCOMCore.prototype = {
  classDescription: "XPCOMCore Core Object",
  contractID: "@conflagrationjs.org/xpcomcore/core;1",
  classID: Components.ID("{f562f600-9c25-11de-8a39-0800200c9a66}"),
  QueryInterface: XPCOMUtils.generateQI(XPCOMCoreInterfaces),
  _xpcom_categories: [{category: "JavaScript global property", entry: "XPCOMCoreConfig"}],
  
  // implemented for nsIClassInfo
  getInterfaces: function(aCountRef) {
    aCountRef.value = XPCOMCoreInterfaces.length;
    return XPCOMCoreInterfaces;
  },
  
  // implemented for nsIClassInfo  
  getHelperForLanguage: function(aLanguage) { return null; },
  
  // implemented for nsIClassInfo
  implementationLanguage: $Ci.nsIProgrammingLanguage.JAVASCRIPT,
  
  // implemented for nsIClassInfo
  flags: $Ci.nsIClassInfo.SINGLETON,
  
  get version() { return new String(XPCOMCoreVersion); },
  get libRoot() { return new String(libRoot); },
  get binRoot() { return new String(binRoot); }
  
};

var XPCOMCoreConstructorInterfaces = [$Ci.nsIClassInfo, $Ci.nsIXPCConstructor, $Ci.nsIXPCScriptable];

// Singleton
var XPCOMCoreConstructor = function() {
  if (arguments.callee.__singletonInstance__) { return arguments.callee.__singletonInstance__; };
  var ctor = Components.Constructor("@conflagrationjs.org/xpcomcore/core;1", Components.interfaces.nsIWritableVariant, "setFromVariant");
  arguments.callee.__singletonInstance__ = ctor;
  return ctor;
};

XPCOMCoreConstructor.prototype = {
  classDescription: "XPCOMCore Core Object Constructor Hack",
  contractID: "@conflagrationjs.org/xpcomcore/core-constructor;1",
  classID: Components.ID("{b5762b40-a0ec-11de-8a39-0800200c9a66}"),
  QueryInterface: XPCOMUtils.generateQI(XPCOMCoreConstructorInterfaces),
  _xpcom_categories: [{category: "JavaScript global property", entry: "XPCOMCore"}],
  
  // implemented for nsIClassInfo
  getInterfaces: function(aCountRef) {
    aCountRef.value = XPCOMCoreConstructorInterfaces.length;
    return XPCOMCoreConstructorInterfaces;
  },
  
  // implemented for nsIClassInfo  
  getHelperForLanguage: function(aLanguage) { return null; },
  
  // implemented for nsIClassInfo
  implementationLanguage: $Ci.nsIProgrammingLanguage.JAVASCRIPT,
  
  // implemented for nsIClassInfo
  flags: $Ci.nsIClassInfo.SINGLETON
}

NSGetModule = function(compMgr, fileSpec) {
  return XPCOMUtils.generateModule([XPCOMCore, XPCOMCoreConstructor]);
};