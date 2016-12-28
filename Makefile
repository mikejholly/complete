words.js: tools/out.txt
	head -100000 tools/out.txt | awk '{print $$2}' | ruby tools/jsarray.rb -n dict > words.js

manifest.json:
	ruby tools/yaml2json.rb manifest.yml > manifest.json

tools/out.txt:
	go run tools/freq.go tools/en.txt > tools/out.txt

clean:
	rm manifest.json tools/out.txt words.js
