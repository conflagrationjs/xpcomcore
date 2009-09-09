task :test do
  require 'pathname'
  ENV['XPCOMCORE'] = (Pathname(__FILE__).parent + "bootstrap.js").expand_path.to_s
  exec("xultest", "-testDir", (Pathname(__FILE__).parent + "test/").expand_path.to_s)
end

task :default => :test