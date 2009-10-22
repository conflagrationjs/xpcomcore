require("test_helper");

var fileTestPaths = { dir: $CURRENT_DIRECTORY, file: $CURRENT_FILE };

Riot.context("File", function() {
  should("concatenate paths", function(){
    return File.join(fileTestPaths.dir, "file_test.js");
  }).equals(fileTestPaths.file);

  should("read the entire contents of a file with File.read without a maxBytes argument", function(){
    return File.read(File.join(fileTestPaths.dir, "fixtures", "love.js"));
  }).equals("var love = true;");
  
  should("read the given numbers of bytes using File.read with a maxBytes argument", function(){
    return File.read(File.join(fileTestPaths.dir, "fixtures", "love.js"), 8);
  }).equals("var love");

  should("not throw an exception with a maxBytes argument of 0 to File.read", function(){
    return File.read(File.join(fileTestPaths.dir, "fixtures", "love.js"), 0);
  }).equals("");

  should("not throw an exception when reading an empty file", function(){
    return File.read(File.join(fileTestPaths.dir, "fixtures", "empty"));
  }).equals("");
  
  should("throw an exception with a non existent file given to File.read", function(){
    File.read("/tmp/ohmanihopethisfiledoesntexist");
  }).raises("File.NoSuchFileError");
  
});
