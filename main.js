function trieCreate(trie, dict) {
    dict.forEach(function(word, i) {
        if (word.length > 2) {
            trieInsert(trie, word, i + 1);
        }
    });
    return trie;
}

function trieInsert(trie, word, score) {
    word.split('').forEach(function(l) {
        if (!trie[l]) trie[l] = {};
        trie = trie[l];
    });
    trie[0] = score;
}

function trieFind(trie, find, prefix, results) {
    find.split('').forEach(function(l) {
        if (!trie[l]) return;
        trie = trie[l];
        prefix += l;
    });
    if (trie[0]) {
        results.push([prefix, trie[0]]);
    }
    Object.keys(trie).forEach(function(k) {
        trieFind(trie, k, prefix, results);
    });
    return results;
}

function getSuggestions(word) {
    return trieFind(trie, word, '', []);
}

function getInputCurrentWord(el) {
    var parts = el.value.split(' ');
    return parts[parts.length - 1];
}

function key(event) {
    var el = event.target;
    var word = getInputCurrentWord(el);
    var sugs = getSuggestions(word.toLowerCase());

    sugs = sugs.sort(function(a, b) {
        return a[1] - b[1];
    }).map(function(w) {
        return w[0];
    });

    console.log(event.keyCode);
    console.log(sugs);

    if (event.keyCode == 27) {
        el.value = el.value.substring(0, el.value.length - word.length) + sugs[0] + ' ';
    }
}

function attachListeners() {
    var els = document.getElementsByTagName('input');
    Array.from(els).forEach(function(el) {
        el.addEventListener("keyup", key);
    });
}

function main() {
    var doc = document.documentElement;
    new MutationObserver(attachListeners).observe(doc, {
        childList: true,
        subtree: true
    });
};

// TODO: capture weighting of word usage
var trie = trieCreate({}, dict);

main();
