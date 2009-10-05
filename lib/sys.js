/** 
 * @fileoverview This file defines the implementation of our Sys object.
 */

/**
 * @class Sys object used for things such as executing external commands.
 */
 
var Sys = {
  
  get tempDir() {
    return $Cc["@mozilla.org/file/directory_service;1"].getService($Ci.nsIProperties).get("TmpD", $Ci.nsIFile).path;
  },
  
  run: function() {
    var tempDir = Sys.tempDir;
    var file = $Cc["@mozilla.org/file/local;1"].createInstance($Ci.nsILocalFile);
    var popenHelper = File.join(XPCOMCoreConfig.getProperty('binRoot'), "popen_helper.sh");
    file.initWithPath(popenHelper);
    var process = $Cc["@mozilla.org/process/util;1"].createInstance($Ci.nsIProcess);
    process.init(file);
    
    var args = Array.prototype.slice.call(arguments);
    var procArgs = [tempDir, "stdout"].concat(args);
    
    process.run(false, procArgs, procArgs.length);
    
    var outputPipe = File.join(tempDir, process.pid + ".stdout.pipe");

    var outputPipeFile = $Cc["@mozilla.org/file/local;1"].createInstance($Ci.nsILocalFile);
    outputPipeFile.initWithPath(outputPipe);
    
    var output = null;
    while (!outputPipeFile.exists()) {
      null;
    };
    
    output = File.read(outputPipe);
    
    return({exitStatus: process.exitValue, output: output});
  }
};
