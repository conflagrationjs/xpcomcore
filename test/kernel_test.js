XULTestCase.create("Kernel Test", function(setup, teardown, test) {
  setup(function() {
    // FIXME: Replace with real File class.
    this.File = Components.Constructor("@mozilla.org/file/local;1", $Ci.nsILocalFile, "initWithPath");
    $LOAD_PATH.push(this.File($CURRENT_FILE).parent.path + "/fixtures");
  });
  
  test("Kernel() function should mix its properties into the passed in scope", function(){
    var newScope = {};
    this.assertNotEqual(0, Kernel.prototype.__count__);
    this.assertEqual(0, newScope.__count__);
    Kernel(newScope);
    this.assertEqual(Kernel.prototype.__count__, newScope.__count__);
  });
  
  
  test("$CURRENT_FILE should be exposed as a getter that returns a value that is not a function", function(){
    this.assertNotEqual("function", typeof($CURRENT_FILE));
  });

  test("$CURRENT_FILE should end in kernel_test.js", function(){
    this.assertMatch(/kernel_test.js$/, $CURRENT_FILE);
  });


  test("$CURRENT_DIRECTORY should be exposed as a getter that returns a value that is not a function", function(){
    this.assertNotEqual("function", typeof($CURRENT_DIRECTORY));
  });

  test("$CURRENT_DIRECTORY should end in test", function(){
    this.assertMatch(/test$/, $CURRENT_DIRECTORY);
  });
  
  
  test("load should throw an exception when you give it a non-existent resource", function() {
    this.assertRaise("LoadError", function() {
      load("some-junk");
    });
  });

  test("load should return true when it can load a file successfully", function() {
    this.assertEqual(true, load("love.js"));
  });
  
  test("load should bubble up a syntax error if the loaded file is syntactically whack", function() {
    this.assertRaise("SyntaxError", function() { load("syntax_error.js") });
  });
  
  test("load should allow loading a resource multiple times", function() {
    load("love.js");
    this.assertEqual(true, love);

    love = false;
    load("love.js");
    this.assertEqual(true, love);
  });
  
  test("load works when using absolute paths", function() {
    love = false;
    
    var absolutePath = this.File($CURRENT_FILE).parent.path + "/fixtures/love.js";
    // FIXME: this is unix-only and janky:
    this.assertMatch(/^\//, absolutePath);
    
    load(absolutePath);
    this.assertEqual(true, love);
  });
  
  
  test("require should load a file the first time (just like load)", function() {
    this.assertEqual(true, require("love"));
  });
  
  test("require should return false if the resource has already been loaded", function() {
    require("mad_love");
    this.assertEqual(false, require("mad_love"));
  });

  test("require should not load a resource that's already been loaded", function() {
    require("mad_world");
    this.assertEqual(true, mad_world);

    mad_world = false;
    require("mad_world");
    this.assertEqual(false, mad_world);
  });
  
  test("should expose a $ENV object that allows for getting environment variables", function() {
    this.assert($ENV.get('HOME'));
  });
  
  test("should expose a $ENV object that allows for setting environment variables", function() {
    $ENV.set('XPCOMCORETEST', "testing");
    this.assertEqual($ENV.get('XPCOMCORETEST'), "testing");
  });
  
});