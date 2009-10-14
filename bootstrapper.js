var EXPORTED_SYMBOLS = ['XPCOMCore', 'XPCOMCoreConfig'];
const requiredMinGeckoVersion = '1.9.0'; // DO NOT REMOVE THIS COMMENT OR MOVE THIS LINE. THIS LINE IS AUTO-GENERATED FROM A RAKE TASK. @MIN_GECKO_VERSION@
const $Cc = Components.classes;
const $Ci = Components.interfaces;

var checkGeckoVersion = function() {
  var versionComparator = $Cc["@mozilla.org/xpcom/version-comparator;1"].getService($Ci.nsIVersionComparator);
  var appInfo = $Cc["@mozilla.org/xre/app-info;1"].getService($Ci.nsIXULAppInfo);
  if (versionComparator.compare(appInfo.platformVersion, requiredMinGeckoVersion) < 0) {
    throw("Gecko version '" + appInfo.platformVersion + "' is unable to use XPCOMCore.");
  }
};

// Check we're even compatible with this version of Gecko before doing anything else.
checkGeckoVersion();

// Set up a resource substitution for our current directory location
var ioService = $Cc["@mozilla.org/network/io-service;1"].getService($Ci.nsIIOService);
var resProt = ioService.getProtocolHandler("resource").QueryInterface($Ci.nsIResProtocolHandler);
var currentDir = ioService.newURI(Components.stack.filename, null, null).QueryInterface($Ci.nsIFileURL).file.parent;
resProt.setSubstitution("xpcomcore", ioService.newFileURI(currentDir));

// Register our XPCOM Components
var componentsDir = ioService.newURI("resource://xpcomcore/components", null, null).QueryInterface($Ci.nsIFileURL).file;
Components.manager.QueryInterface($Ci.nsIComponentRegistrar).autoRegister(componentsDir);

// Now we're registered, export a reference to the service for the component that's bootstrapping us,
// since "Javascript global property"/"Javascript global constructor" don't get exported into the
// BackstagePass environment.
const XPCOMCore = $Cc["@conflagrationjs.org/xpcomcore/core-constructor;1"].createInstance();
const XPCOMCoreConfig = $Cc["@conflagrationjs.org/xpcomcore/core;1"].createInstance();