require("test_helper");

Riot.context("Kernel", function(should, setup) {
  
  setup(function() {
    $LOAD_PATH.push(File.join($CURRENT_DIRECTORY, "fixtures"));
  });
  
  should("mix its properties into the passed in scope when used as a function", function(){
    var newScope = {};
    Kernel(newScope);
    return newScope.__count__;
  }).equals(Kernel.prototype.__count__);
  
  should("expose $CURRENT_FILE as a getter that returns a value that is a string", function(){
    return $CURRENT_FILE;
  }).isTypeOf("string");

  should("have $CURRENT_FILE end in kernel_test.js", function(){
    return $CURRENT_FILE;
  }).matches(/kernel_test.js$/);

  should("expose $CURRENT_DIRECTORY as a getter that returns a value that is a string", function(){
    return $CURRENT_DIRECTORY;
  }).isTypeOf("string");

  should("have $CURRENT_DIRECTORY end in test", function(){
    return $CURRENT_DIRECTORY;
  }).matches(/test$/);
  
  should("throw an exception when you give load a non-existent resource", function() {
    load("some-junk");
  }).raises("LoadError");

  should("return true when load can load a file successfully", function() {
    return load("love.js");
  }).equals(true);
  
  should("bubble up a syntax error if the loaded file is syntactically whack", function() {
    load("syntax_error.js");
  }).raises("SyntaxError");
  
  should("allow loading a resource multiple times", function() {
    load("love.js");
    love = false;
    load("love.js");
    return love;
  }).equals(true);
  
  should("allow loading using absolute paths", function() {
    love = false;
    var absolutePath = File.join($CURRENT_DIRECTORY, "fixtures", "love.js");
    // FIXME: this is unix-only and janky:
    if (!absolutePath.match(/^\//)) { throw("Expected an absolute path."); }
    
    load(absolutePath);
    return love;
  }).equals(true);
  
  should("have require return true the first time (just like load)", function() {
    return require("love");
  }).equals(true);
  
  should("have require return false if the resource has already been loaded", function() {
    require("mad_love");
    return require("mad_love");
  }).equals(false);

  should("not require a resource that's already been loaded", function() {
    require("mad_world");
    if (!mad_world) { throw("Expected mad_world to be true"); }

    mad_world = false;
    require("mad_world");
    return mad_world;
  }).equals(false);
  
  should("expose a $ENV object that allows for getting environment variables", function() {
    return $ENV.get('HOME');
  }).isTypeOf('string');
  
  should("expose a $ENV object that allows for setting environment variables", function() {
    $ENV.set('XPCOMCORETEST', "testing");
    return $ENV.get('XPCOMCORETEST');
  }).equals("testing");
  
});