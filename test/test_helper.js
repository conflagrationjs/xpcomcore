require("stdlib/rubygems");
gem("riotjs");
require("riot");

XULTestRunner.atExit = function() {
  Riot.run();
}
