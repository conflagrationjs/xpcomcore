/** 
 * @fileoverview This file defines the implementation of our File object.
 */

/**
 * @class File class used for things such as creating filesystem paths, reading files, etc.
 */
function File() {};

/** 
 * @class Exception representing an error loading a file.
 * @extends Error
 * @constructor
 * @param {String} message The error message to be given for this exception.
 * @returns {Error}
 */
File.NoSuchFileError = function(message) {
  var err = new Error(message);
  err.name = "File.NoSuchFileError";
  return err;
};

/** 
 * Joins the given string arguments together using the operating system's native path
 * separator.
 * @param {String[]} components Set of strings to join together.
 * @returns {String} The resulting path.
 */
File.join = function() {
  var file = new XPCBuiltins.nsILocalFile(arguments[0]);
  
  for(var i = 1; i < arguments.length; i++) {
    file.append(arguments[i]);
  }
  
  return file.path;
};

/** 
 * Reads the given number of bytes (or the entire contents if the argument is ommitted)
 * from the specified file
 * @param {String} filePath Path to a file.
 * @param {int} [maxBytes] Number of bytes to read from the file. Defaults to entire file.
 * @returns {String} The data read from the given file.
 */
File.read = function(filePath, maxBytes) {
  var file = new XPCBuiltins.nsILocalFile(filePath);

  if (!file.exists()) { throw(new File.NoSuchFileError("No such file or directory - " + filePath)); };

  var fileInputStream = $Cc["@mozilla.org/network/file-input-stream;1"].createInstance($Ci.nsIFileInputStream);
  fileInputStream.init(file, -1, -1, 0);
  
  var binaryInputStream = $Cc["@mozilla.org/binaryinputstream;1"].createInstance($Ci.nsIBinaryInputStream);
  binaryInputStream.setInputStream(fileInputStream);
  
  try {
    return binaryInputStream.readBytes((maxBytes == null) ? binaryInputStream.available() : maxBytes);
  } catch (e if e.result == $Cr.NS_ERROR_FAILURE) {
    // FIXME - hack
    // If we hit this, we're probably trying to read from a special device like a pipe. Fall back to
    // reading a byte at a time and returning when we likely hit EOF (as indicated by another exception)
    var output = '';
    while (true) {
      try {
        output = output + binaryInputStream.readBytes((maxBytes == null) ? 1 : maxBytes);
        if (maxBytes != null) { return output; }
      } catch (e if e.result == $Cr.NS_ERROR_FAILURE) {
        return output;
      }
    };
  } finally {
    binaryInputStream.close();
  }
};