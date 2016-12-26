words.js:
	head -100000 out.txt | awk '{print $2}' | ruby jsarray.rb -n dict > words.js

manifest.json:
	ruby yaml2json.rb manifest.yml > manifest.json

out.txt:
	go run freq.go en.txt > out.txt

clean:
	rm manifest.json out.txt words.js
