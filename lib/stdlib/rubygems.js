// UNDOCUMENTED DONT USE THIS UNTIL IT'S TESTED.

var Gem = {
  command: "xpcomcore-gem",
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
}

var gem = function(gemName) {
  return Gem.gem(gemName);
}
