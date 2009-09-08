(function(backStage) {
  if (typeof(COMPONENTS) == 'undefined') {
    throw("Please define a COMPONENTS array before loading XPCOMCore.");
  };
  
  var requiredMinGeckoVersion = '1.9.0'; // RequiredMinGeckoVersion - Do not remove this comment.
  var xpcomCoreVersion = '0.1.0'; // XPCOMCoreVersion - Do not remove this comment.
  
  var checkGeckoVersion = function() {
    var versionComparator = Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator);
    var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
    if (versionComparator.compare(appInfo.platformVersion, requiredMinGeckoVersion) < 0) {
      throw("Gecko version '" + appInfo.platformVersion + "' is unable to use XPCOMCore.");
    }
  };
  
  var setupXPCOMCore = function() {
    Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
    
    var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    var resProt = ioService.getProtocolHandler("resource").QueryInterface(Components.interfaces.nsIResProtocolHandler);
    // FIXME IN GENERAL - refactor all this shit code
    
    var ourResourceURIString = function() {
      // FIXME - Great. All this is a dance around the fact line #289 of mozJSSubScriptLoader.cpp in mozilla 1.9.1
      // thinks that the best way to delimit script files is with a fucking ASCII arrow YOU FUCKS
      var thisResource = (new Error).stack.split("\n")[2].split("@")[1].split(" -> ").slice(-1)[0].split(/:[0-9]/)[0];
      return thisResource;
    };
    
    var ourResourceURI = function() {
      return ioService.newURI(ourResourceURIString(), null, null).QueryInterface(Components.interfaces.nsIURL);
    };
    
    // FIXME - hilariously non-cross-platform
    var ourLibDir = function() {
      var thisDir = ioService.newURI(resProt.resolveURI(ourResourceURI()), null, null).QueryInterface(Components.interfaces.nsIURL).directory;
      return thisDir + "lib/";
    };

    // FIXME - hilariously non-cross-platform
    var setupResourceSubstition = function() {
      resProt.setSubstitution("xpcomcore", ioService.newURI("file://" + ourLibDir(), null, null));
    };
    
    setupResourceSubstition();
    var libDirectory = ourLibDir();

    // Private XPCOMCoreMCP method. This is the jank that finally sets up our resouce substition 
    // and loads Kernel methods into the given scope and .
    var loadKernel = function(scope) {

      // Copy properties from Kernel to the scope as getters as part of the kernel loading
      // TODO - skip non-function properties
      for (p in scope.Kernel) {
        scope.__defineGetter__(p, function() { return scope.Kernel[p] });
      }
    };
    
    // XPCOMCoreMCP is a singleton
    var xpcomCoreInstance = null;
    var XPCOMCoreMCP = function() { 
      if (xpcomCoreInstance) { return xpcomCoreInstance; }
      xpcomCoreInstance = this.wrappedJSObject = this;
      
    };
    
    XPCOMCoreMCP.prototype = {
      classDescription: "XPCOMCore Core Object",
      contractID: "@conflagrationjs.org/xpcomcore/core;1",
      classID: Components.ID("{f562f600-9c25-11de-8a39-0800200c9a66}"),
      QueryInterface: XPCOMUtils.generateQI(),
      _xpcom_categories: [{category: "JavaScript global property", entry: "XPCOMCoreMCP"}],
      
      get version() { return new String(xpcomCoreVersion); },
      get libRoot() { return new String(libDirectory); },
      
      loadInto: function(loadScope) {
        if (!loadScope || loadScope.XPCOMCoreLoaded) {
          return false;
        } else {
          loadKernel(loadScope);
          loadScope.XPCOMCoreLoaded = true;
          return true;
        }
      }
    };
    
    backStage.XPCOMCoreMCP = XPCOMCoreMCP;
    // Make sure we actually register the component or everything blows up
    COMPONENTS.push(XPCOMCoreMCP);

  };
  
  try {
    checkGeckoVersion();
    setupXPCOMCore();
  } catch (e) {
    dump("Couldn't register XPCOMCore: " + e + "\n");
  }

})(this);