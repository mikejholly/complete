require 'yaml'
require 'json'

unless !ARGV[0].nil? && File.exist?(ARGV[0])
  puts 'Usage: yaml2json <path-to-yaml-file>'
  abort
end

y = YAML.load_file(ARGV[0])

puts JSON.pretty_generate(y)
