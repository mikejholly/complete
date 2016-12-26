'use strict';

var displayId = 'complete-display';

function trieCreate(trie, dict) {
    dict.forEach(function(word, i) {
        if (word.length > 2) {
            trieInsert(trie, word, i + 1);
        }
    });
    return trie;
}

function trieInsert(trie, word, score) {
    if (word.match(/\d+/)) return;
    word.toLowerCase().split('').forEach(function(l) {
        if (!trie[l]) trie[l] = {};
        trie = trie[l];
    });
    if (trie['tn']) return;
    trie['tn'] = [word, score];
}

function trieFind(trie, find, prefix, results) {
    find.toLowerCase().split('').forEach(function(l) {
        if (!trie[l]) return;
        trie = trie[l];
        prefix += l;
    });
    if (trie['tn']) {
        results.push(trie['tn']);
    }
    Object.keys(trie).forEach(function(k) {
        if (k == 'tn') return;
        trieFind(trie, k, prefix, results);
    });
    return results;
}

function getSuggestions(word) {
    return trieFind(TRIE, word, '', []);
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

    setDisplay(el, word, sugs);

    if (event.keyCode == 17) {
        el.value = el.value.substring(0, el.value.length - word.length) + sugs[0] + ' ';
    }

    return false;
}

function setDisplay(el, word, sugs) {
    var body = document.querySelector('body');
    var d = body.querySelector('#' + displayId);
    var pos = el.getBoundingClientRect();

    if (!d) {
        d = document.createElement('span');
        d.id = displayId;
        body.appendChild(d);
    }

    // TODO: calculate exact offsets
    d.style.top = (pos.top - 30) + 'px';
    d.style.left = (pos.left - 10) + 'px';
    d.innerText = sugs.slice(0, 4).join(' ');
}

function attachListeners() {
    var els = document.getElementsByTagName('input');
    Array.from(els).forEach(function(el) {
        el.addEventListener('keyup', key);
    });
}

function main() {
    new MutationObserver(attachListeners).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
};


var TRIE = trieCreate({}, dict);

main();
