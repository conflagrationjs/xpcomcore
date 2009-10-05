XULTestCase.create("Sys Test", function(setup, teardown, test) {

  test("Sys.tempDir should return a string path to the OS temporary directory", function(){
    var tempDir = Sys.tempDir;
    this.assert(tempDir);
    this.assert(tempDir.length > 0);
  });
  
  test("Sys.run should execute the given command and return the exit status in an object", function(){
    var result = Sys.run("exit", "47");
    this.assertEqual(47, result.exitStatus);
  });
  
  test("Sys.run should execute the given command and return the output in an object", function(){
    var result = Sys.run("echo", "foo bar baz");
    this.assertEqual("foo bar baz\n", result.output);
  });
  
});