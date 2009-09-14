XULTestCase.create("Kernel Test", function(setup, teardown, test) {
  
  test("it would be swell if i wrote a test", function(){
    try {
      throw(new LoadError("whupz"));
    } catch (e) {
      puts("got an exception: " + e + "\n" + e.stack);
    }
  });
  
});