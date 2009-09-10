require 'pathname'
here = (Pathname(__FILE__).parent)

task :test do
  ENV['XPCOMCORE'] = (Pathname(__FILE__).parent + "bootstrap.js").expand_path.to_s
  exec("xultest", "-testDir", (Pathname(__FILE__).parent + "test/").expand_path.to_s)
end

task :default => :test

namespace :docs do
  doc_dir = here + "doc"
  
  desc "Builds the documentation"
  task :build do
    raise "jsdoc.pl does not seem to be in your PATH." if `which jsdoc.pl`.chomp.empty?
    system(%Q[jsdoc.pl --project-name XPCOMCore -r -d "#{doc_dir}" "#{here + "lib"}"])
  end
  
  task :clean do
    FileUtils.rm_rf(doc_dir)
    FileUtils.mkdir(doc_dir)
  end
  
  task :commit do
    system(%Q[cd #{here} && git add "doc" && git commit -m "Updating docs"])    
  end
end

task :release => ['docs:clean', 'docs:build', 'docs:commit'] do
  system(%Q[cd #{here} && git push])
end