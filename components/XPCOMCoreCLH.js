Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
const Cc = Components.classes;
const Ci = Components.interfaces;

var XPCOMCoreCommandLineHandler = function() {
  if (arguments.callee.__singletonInstance__) { return arguments.callee.__singletonInstance__; };
  this.wrappedJSObject = this;
  arguments.callee.__singletonInstance__ = this;
};

XPCOMCoreCommandLineHandler.prototype = {
  args: [],
  classDescription: "XPCOMCore Command Line Handler",
  contractID: "@conflagrationjs.org/xpcomcore/generic-command-line-handler-clh;1",
  classID: Components.ID("{b5730df0-b859-11de-8a39-0800200c9a66}"),
  helpInfo: "",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver, Ci.nsICommandLineHandler]),
  _xpcom_categories: [{category: "command-line-handler", entry: "a-xpcomcore"}],
  
  handle: function(cmdLine) {
    for (var i = 0; i < cmdLine.length; i++) { this.args.push(cmdLine.getArgument(i)); }
  }
  
};

NSGetModule = function(compMgr, fileSpec) {
  return XPCOMUtils.generateModule([XPCOMCoreCommandLineHandler]);
};