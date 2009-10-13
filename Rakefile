require 'pathname'
require 'yaml'
require 'jsdoc-toolkit/doc_task'
require 'english'

# TODO - fix this rakefile because it sucks sucks sucks

here = (Pathname(__FILE__).parent.expand_path)

task :test do
  ENV['XPCOMCORE'] = (Pathname(__FILE__).parent.expand_path + "bootstrapper.js").to_s
  exec(ENV['XULTEST'] || "xultest", "--", "-testDir", (Pathname(__FILE__).parent + "test/").expand_path.to_s)
end

task :default => :test

namespace :docs do
  doc_dir = here + "doc"
  jsdoc_loc = here + "etc/jsdoc-toolkit"
  
  JsDocToolkit::DocTask.new(:build) do |doc|
    doc.jsdoc_dir = 'doc'
    doc.jsdoc_files << 'lib'
  end
  
  task :clean do
    system(%Q[cd "#{here}" && git rm -rf "doc/*"])    
    FileUtils.rm_rf(doc_dir)
    FileUtils.mkdir(doc_dir)
  end
  
  task :commit do
    system(%Q[cd "#{here}" && git add "doc" && git commit -m "Updating docs"])    
  end
  
  task :update_gh_pages do
    current_branch = `cd "#{here}" && git branch 2> /dev/null | grep -e '\\* ' | sed 's/^..\\(.*\\)/\\1/'`.chomp
    system(%Q[cd "#{here}" && git checkout gh-pages && git rm -rf doc && git checkout master doc && git add doc && git commit -m "Updating docs for GH pages" && git checkout -f #{current_branch}])
  end

end

task :build => ['version:update_files', 'docs:clean', 'docs:build', 'docs:commit', 'docs:update_gh_pages']


task :release => :build do
  system(%Q[cd #{here} && git push])
end

namespace :version do
  properties_file = here + "build_properties.yml"
  
  ghetto_template = lambda do |file, identifier, new_val|
    js_marker_comment = "// DO NOT REMOVE THIS COMMENT OR MOVE THIS LINE. THIS LINE IS AUTO-GENERATED FROM A RAKE TASK. @#{identifier}@"
    
    new_file = file.readlines.collect do |line|
      next line unless line =~ /#{Regexp.escape(js_marker_comment)}/
      "#{new_val} #{js_marker_comment}#{$RS}"
    end
    
    
    file.open('w') { |f| f << new_file.join }
    puts "Updated '#{file}' to reflect build_properties.yml"
    
    system(%Q[cd "#{here}" && git add "#{file}" && git commit -m "Updating from build_properties.yml" "#{file}"])
  end
  
  
  task :update_component do
    component_file = (Pathname(__FILE__).parent + "components/XPCOMCore.js").expand_path
    current = YAML.load_file(properties_file.to_s)
    version_string = "#{current['version']['major']}.#{current['version']['minor']}.#{current['version']['patch']}"

    js_version_string = "var XPCOMCoreVersion = '#{version_string}';"
    ghetto_template.call(component_file, 'XPCOMCORE_VERSION', js_version_string)
  end
  
  task :update_bootstrapper do
    bootstrapper_file = (Pathname(__FILE__).parent + "bootstrapper.js").expand_path
    properties = YAML.load_file(properties_file.to_s)
    gecko_min_version = properties['gecko']['min_version']

    gecko_min_version_string = "const requiredMinGeckoVersion = '#{gecko_min_version}';"
    ghetto_template.call(bootstrapper_file, 'MIN_GECKO_VERSION', gecko_min_version_string)
  end
  
  task :update_files => [:update_component, :update_bootstrapper]
  
  namespace :bump do
    bumper = lambda do |version_part|
      current = YAML.load_file(properties_file.to_s)
      puts "Current version is: #{current['version']['major']}.#{current['version']['minor']}.#{current['version']['patch']}"
      current['version'][version_part] += 1
      properties_file.open('w') { |f| f << YAML.dump(current) }
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