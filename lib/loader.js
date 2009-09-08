// FIXME - If we're still backstage, load differently. Need a better way to check for being backstage.
// FIXME - wow, this is all so seedy.
var _coreObj = null;
if (this.toString() == "[object BackstagePass]" && typeof(XPCOMCore) == 'undefined') {
  _coreObj = new this.XPCOMCoreMCP();
} else if (this.XPCOMCoreMCP && typeof(XPCOMCore) == 'undefined') {
  var privileges = 'UniversalXPConnect UniversalBrowserRead UniversalBrowserWrite ' +
                   'UniversalPreferencesRead UniversalPreferencesWrite CapabilityPreferencesAccess UniversalFileRead';
  netscape.security.PrivilegeManager.enablePrivilege(privileges);
  _coreObj = this.XPCOMCoreMCP.wrappedJSObject;
};

const XPCOMCore = _coreObj;

var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("resource://xpcomcore/kernel.js");