XULTestCase.create("XPCBuiltins Test", function(setup, teardown, test) {

  test("constructor for nsILocalFile should return an nsILocalFile QI'd object", function() {
    var localFile = new XPCBuiltins.nsILocalFile("/");
    this.assertMatch(/nsILocalFile/, localFile.toString());
  });
    
});