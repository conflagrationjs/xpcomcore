/** 
 * @fileoverview This file defines the implementation of our File object.
 */

/**
 * This will have docs when it actually does something
 */
function File() {};

/** 
 * Joins the given string arguments together using the operating system's native path
 * separator.
 * @param {String} Set of strings to join together.
 * @type String
 */
File.join = function() {
  var file = $Cc["@mozilla.org/file/local;1"].createInstance($Ci.nsILocalFile);
  file.initWithPath(arguments[0]);
  
  for(var i = 1; i < arguments.length; i++) {
    file.append(arguments[i]);
  }
  
  return file.path;
};

/** 
 * Reads the given number of bytes (or the entire contents if the argument is ommitted)
 * from the specified file
 * @param {String} Path to a file.
 * @param {int} Optional - number of bytes to read from the file.
 * @type String
 */
File.read = function(filePath, maxBytes) {
  var file = $Cc["@mozilla.org/file/local;1"].createInstance($Ci.nsILocalFile);
  file.initWithPath(filePath);
  var fileInputStream = $Cc["@mozilla.org/network/file-input-stream;1"].createInstance($Ci.nsIFileInputStream);
  var scriptableStream = $Cc["@mozilla.org/scriptableinputstream;1"].createInstance($Ci.nsIScriptableInputStream);
  fileInputStream.init(file, -1, -1, 0);
  scriptableStream.init(fileInputStream);
  try {
    return scriptableStream.read(maxBytes || scriptableStream.available());
  } finally {
    scriptableStream.close();
  }
};