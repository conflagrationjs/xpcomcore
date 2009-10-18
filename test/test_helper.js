require("stdlib/rubygems");
gem("riot-js");
require("riot");

XULTestRunner.atExit = function() {
  Riot.run();
}