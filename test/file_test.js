XULTestCase.create("File Test", function(setup, teardown, test) {
  setup(function() {
  });

  test("File.join should properly put together strings", function() {
    this.assertEqual($CURRENT_FILE, File.join($CURRENT_DIRECTORY, "file_test.js"));
  });
  
  test("File.read without a maxBytes argument should read the entire contents of a file if it exists", function() {
    this.assertEqual("var love = true;", File.read(File.join($CURRENT_DIRECTORY, "fixtures", "love.js")));
  });  

  test("File.read with a maxBytes argument should read the given number of bytes from a file", function() {
    this.assertEqual("var love", File.read(File.join($CURRENT_DIRECTORY, "fixtures", "love.js"), 8));
  });
});