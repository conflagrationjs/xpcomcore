// UNDOCUMENTED DONT USE THIS UNTIL IT'S TESTED.

var Gem = {
  command: "xpcomcore-gem",
  get isSupported() {
    if (arguments.callee.__memoizedResult__ === undefined) { 
      var gemCommandResult = Sys.run("which", this.command);
      arguments.callee.__memoizedResult__ = (gemCommandResult.exitStatus === 0);
    }
    return arguments.callee.__memoizedResult__;
  },
  
  gem: function(gemName) {
    var cmdReturn = Sys.run(this.command, gemName);
    if (cmdReturn.exitStatus != 0) {
      // TODO - throw appropriate exception here.
      throw("Gem " + gemName + " wasn't found.");
    } else {
      var gemDetails = JSON.parse(cmdReturn.output);
      $LOAD_PATH.push(gemDetails.libDir);
      return true;
    }
  }
};

Gem.LoadError = function(message) {
  var err = new Error(message);
  err.name = "Gem.LoadError";
  return err;
};

var gem = function(gemName) {
  return Gem.gem(gemName);
};
