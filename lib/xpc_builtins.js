/** 
 * @fileoverview This file defines the implementation of our XPCBuiltins namespace.
 */

/**
 * @namespace XPCBuiltins namespace used for holding constructors for standard XPCOM objects.
 */
 
var XPCBuiltins = {
  
  nsILocalFile: Components.Constructor("@mozilla.org/file/local;1", $Ci.nsILocalFile, "initWithPath")
  
};