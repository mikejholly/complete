package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"sort"
)

type freqItem struct {
	Count int
	Text  string
}

type freqItemSlice []freqItem

func (p freqItemSlice) Len() int           { return len(p) }
func (p freqItemSlice) Less(i, j int) bool { return p[i].Count > p[j].Count }
func (p freqItemSlice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

func main() {
	args := os.Args
	if len(args) < 2 {
		fmt.Println("Input file required")
		os.Exit(1)
	}

	fileName := args[1]

	wordCounts, err := countWords(fileName)
	if err != nil {
		panic(err)
	}

	for _, item := range sortFreq(wordCounts) {
		fmt.Printf("%d\t%s\n", item.Count, item.Text)
	}
}

func countWords(fileName string) (map[string]int, error) {
	f, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}

	s := bufio.NewScanner(f)
	s.Split(bufio.ScanWords)

	m := make(map[string]int)

	r, _ := regexp.Compile("[^\\w']+")

	for s.Scan() {
		ws := r.Split(s.Text(), -1)

		for _, w := range ws {
			if len(w) > 2 {
				m[w]++
			}
		}
	}

	return m, nil
}

func sortFreq(wordCounts map[string]int) freqItemSlice {
	items := make(freqItemSlice, 10)

	for k, v := range wordCounts {
		item := freqItem{
			Text:  k,
			Count: v,
		}
		items = append(items, item)
	}

	sort.Sort(items)

	return items
}
