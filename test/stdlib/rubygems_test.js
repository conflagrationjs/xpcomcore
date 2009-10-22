require("test_helper");
require("stdlib/rubygems");

if (Gem.isSupported) {

  Riot.context("RubyGems", function(should) {

    asserts("This space intentionally left blank.", true);

    // should("have Sys.tempDir return a string path to the OS temporary directory", function(){
    //   var tempDir = XPCBuiltins.nsILocalFile(Sys.tempDir);
    //   return tempDir.exists();
    // }).equals(true);
  
  });

} else {
  puts("Warning - Gem support isn't available on your system so the RubyGems support tests will be skipped.");
}
