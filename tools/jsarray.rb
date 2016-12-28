require 'json'
require 'optparse'

opts = {
  name: 'words'
}

OptionParser.new do |parser|
  parser.on('-n', '--name name', 'Name of array') do |name|
    opts[:name] = name
  end
end.parse!

a = []

while (l = $stdin.gets)
  a << l.strip
end

puts "var #{opts[:name]} = #{a.to_json};"
