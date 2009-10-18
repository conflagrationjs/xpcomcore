/** 
 * @fileoverview This file defines the implementation of our Sys namespace.
 */

/**
 * @namespace Sys namespace used for things such as executing external commands.
 */
 
var Sys = {
  
  /** 
   * This getter returns the current temp directory as returned by the XPCOM directory service.
   * @returns {String} The path to the temp directory
   */
  get tempDir() {
    return $Cc["@mozilla.org/file/directory_service;1"].getService($Ci.nsIProperties).get("TmpD", $Ci.nsIFile).path;
  },
  
  /** 
   * Runs the command given as the first parameter with the arguments given as the remaining
   * parameters and returns an object containing the exit status (as the exitStatus property)
   * and command output (as the output property).
   * @param {String[]} parameters First parameter is command name, rest are arguments to
   * invoke the command with.
   * @returns {Object} Object with 'exitStatus' and 'output' properties.
   */
  run: function() {
    var tempDir = Sys.tempDir;
    var popenHelper = File.join(XPCOMCoreConfig.getProperty('binRoot'), "popen_helper.sh");
    var file = new XPCBuiltins.nsILocalFile(popenHelper);

    var process = $Cc["@mozilla.org/process/util;1"].createInstance($Ci.nsIProcess);
    process.init(file);
    
    var args = Array.prototype.slice.call(arguments);
    var procArgs = [tempDir, "stdout"].concat(args);
    
    process.run(false, procArgs, procArgs.length);
    
    var outputPipe = File.join(tempDir, process.pid + ".stdout.pipe");
    var outputPipeFile = new XPCBuiltins.nsILocalFile(outputPipe);

    var thread = $Cc["@mozilla.org/thread-manager;1"].getService($Ci.nsIThreadManager).currentThread;
        
    var output = null;
    while (!outputPipeFile.exists()) {
      thread.processNextEvent(false);
    };
    
    output = File.read(outputPipe);
        
    while (process.exitValue < 0) {
      thread.processNextEvent(false);
    }

    return({exitStatus: process.exitValue, output: output});
  }
};
