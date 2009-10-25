require("stdlib/rubygems");
gem("riotjs-xpcc");
require("riot");

XULTestRunner.atExit = function() {
  Riot.run();
}
