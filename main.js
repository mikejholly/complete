'use strict';


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

    if (word.length < 2) {
        killDisplay();
        return;
    }

    sugs = sugs.sort(function(a, b) {
        return a[1] - b[1];
    }).map(function(w) {
        return w[0];
    });

    setDisplay(el, word, sugs);

    if (event.keyCode == 17) {
        el.value = el.value.substring(0, el.value.length - word.length) + sugs[0] + ' ';
        killDisplay();
    }

    return false;
}

function setDisplay(el, word, sugs) {
    var body = document.querySelector('body');
    var d = document.getElementById(displayId);
    var pos = el.getBoundingClientRect();

    if (!d) {
        d = document.createElement('span');
        d.id = displayId;
        body.appendChild(d);
    }

    d.style.top = (pos.top + window.pageYOffset - 30) + 'px';
    d.style.left = (pos.left - 2) + 'px';

    var html = '';
    sugs.slice(0, 4).forEach(function(s) {
        html += '<span class="word">' + s + '</span>';
    });

    d.innerHTML = html;
}

function killDisplay() {
    var d = document.getElementById(displayId);
    if (d) d.remove();
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

var displayId = 'complete-display';
var TRIE = trieCreate({}, dict);

main();
