// Convenience shortcuts

Cc = Components.classes;
Ci = Components.interfaces;
Cr = Components.results;
Cu = Components.utils;

const $LOAD_PATH = [XPCOMCore.libRoot];
const $LOADED_FEATURES = ["kernel.js"];

// FIXME - better exceptions.
const LoadError = {name: "LoadError", message: "Could not load file"};

const Kernel = {
  
  print: function(str) {
    dump(str);
  },
  
  puts: function(str) {
    print(str + "\n");
  },

  load: function(featurePath) {
    var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
    var foundFile = null;
    var loadPathLength = $LOAD_PATH.length;
    // FIXME - mozilla bug here. if i use foreach on array it ignores the granted security privileges
    for (var i = 0; i < loadPathLength; i++) {
      var potentialFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
      potentialFile.initWithPath($LOAD_PATH[i] + "/" + featurePath);
      if (potentialFile.exists()) { foundFile = potentialFile; }
    };
    if (foundFile) {
      foundFile.normalize();
      loader.loadSubScript("file://" + encodeURI(foundFile.path));
      $LOADED_FEATURES.push(featurePath)  
    } else {
      throw(LoadError);
    }
  },
  
  require: function(feature) {
    var jsFeature = feature + ".js";
    if ($LOADED_FEATURES.indexOf(jsFeature) == -1) {
      load(jsFeature);
      return true;
    } else {
      return false;
    }
  }
}

// FIXME - i just puked in my mouth a little.
for (p in Kernel) { eval('var ' + p + ' = Kernel[p];'); }