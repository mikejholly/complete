manifest.json:
	ruby -e "require 'yaml'; require 'json'; y = YAML.load_file('manifest.yml'); puts JSON.pretty_generate(y)" > manifest.json

clean:
	rm manifest.json
