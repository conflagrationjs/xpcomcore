require("test_helper");

Riot.context("Sys", function() {

  should("have Sys.tempDir return a string path to the OS temporary directory", function(){
    var tempDir = XPCBuiltins.nsILocalFile(Sys.tempDir);
    return tempDir.exists();
  }).equals(true);
  
  should("have Sys.run execute the given command and return the exit status in an object", function(){
    return Sys.run("exit", "47").exitStatus;
  }).equals(47);
  
  should("have Sys.run execute the given command and return the output in an object", function(){
    return Sys.run("echo", "foo bar baz").output;
  }).equals("foo bar baz\n");
  
});
