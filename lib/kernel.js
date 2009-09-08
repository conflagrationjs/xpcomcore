const Kernel = {
  
  print: function(str) {
    dump(str);
  },
  
  puts: function(str) {
    print(str + "\n");
  }
}

// FIXME - i just puked in my mouth a little.
for (p in Kernel) { eval('var ' + p + ' = Kernel[p];'); }

// Convenience shortcuts
Cc = Components.classes;
Ci = Components.interfaces;
Cr = Components.results;
Cu = Components.utils;

const $LOAD_PATH = [XPCOMCore.libRoot];
const $LOADED_FEATURES = ["kernel.js"];
