require 'pathname'
require 'yaml'
here = (Pathname(__FILE__).parent)

task :test do
  ENV['XPCOMCORE'] = Pathname(__FILE__).parent.expand_path.to_s
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
    system(%Q[cd "#{here}" && git add "doc" && git commit -m "Updating docs"])    
  end
end

task :build => ['version:update_files', 'docs:clean', 'docs:build', 'docs:commit']

task :release => :build do
  system(%Q[cd #{here} && git push])
end

namespace :version do
  version_file = here + "VERSION.yml"
  
  task :update_files do
    component_file = (Pathname(__FILE__).parent + "components/XPCOMCore.js").expand_path
    current = YAML.load_file(version_file.to_s)
    version_string = "#{current['version']['major']}.#{current['version']['minor']}.#{current['version']['patch']}"
    js_marker_comment = "// DO NOT REMOVE THIS COMMENT OR MOVE THIS LINE. THIS LINE IS AUTO-GENERATED FROM A RAKE TASK. @XPCOMCORE_VERSION@"
    js_version_string = "var XPCOMCoreVersion = '#{version_string}'; #{js_marker_comment}\n"
    new_file = component_file.readlines.collect do |line|
      next line unless line =~ /@XPCOMCORE_VERSION@/
      js_version_string
    end
    
    component_file.open('w') { |f| f << new_file.join }
    puts "Updated '#{component_file}' to reflect VERSION.yml"
    system(%Q[cd "#{here}" && git add "#{component_file}" && git commit -m "Updating version to '#{version_string}'" "#{component_file}"])
  end
  
  namespace :bump do
    bumper = lambda do |version_part|
      current = YAML.load_file(version_file.to_s)
      puts "Current version is: #{current['version']['major']}.#{current['version']['minor']}.#{current['version']['patch']}"
      current['version'][version_part] += 1
      version_file.open('w') { |f| f << YAML.dump(current) }
      puts "Current version is now: #{current['version']['major']}.#{current['version']['minor']}.#{current['version']['patch']}"
    end
    
    desc "Bumps the major version"
    task(:major) { bumper.call('major') }
    
    desc "Bumps the minor version"
    task(:minor) { bumper.call('minor') }
    
    desc "Bumps the patch version"
    task(:patch) { bumper.call('patch') }
  end
end