require("test_helper");

Riot.context("XPCBuiltins", function(should) {

  should("have the constructor for nsILocalFile should return an nsILocalFile QI'd object", function() {
    var localFile = new XPCBuiltins.nsILocalFile("/");
    return localFile.toString();
  }).matches(/nsILocalFile/);
    
});