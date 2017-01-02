'use strict';

function trieInsertMany(trie, words) {
    words.forEach(function(word, i) {
        if (word.length > 2) {
            trieInsert(trie, word, i + 1);
        }
    });
}

function trieInsert(trie, word, score) {
    if (word.match(/\d+/)) return;

    word.toLowerCase().split('').forEach(function(l) {
        if (!trie[l]) trie[l] = {};
        trie = trie[l];
    });

    if (!trie['last']) {
        trie['last'] = [];
    }

    var found = false;
    trie['last'].forEach(function(r) {
        if (r[0] == word) {
            found = true;
        }
    });

    if (!found) {
        trie['last'].push([word, score]);
    }
}

function trieFind(trie, find, prefix, results) {
    find.toLowerCase().split('').forEach(function(l) {
        if (!trie[l]) return;
        trie = trie[l];
        prefix += l;
    });

    if (trie['last']) {
        trie['last'].forEach(function(r) {
            results.push(r);
        });
    }

    Object.keys(trie).forEach(function(k) {
        if (k == 'last') return;
        trieFind(trie, k, prefix, results);
    });

    return results;
}

function getSuggestions(word) {
    return trieFind(TRIE, word, '', []);
}

function getInputCurrentWord(el) {
    var parts = el.value.trim().split(' ');
    return parts[parts.length - 1];
}

function keyDown(event) {
    var el = event.target;

    if (OPEN && event.keyCode == KEY_TRIGGER) {
        COMPLETE = true;
        event.preventDefault();
    }
}

function keyUp(event) {
    var el = event.target;
    var word = getInputCurrentWord(el);

    if (word.length < 2) {
        killDisplay();
        return;
    }

    var sugs = getSuggestions(word);

    if (event.keyCode == KEY_SPACE) {
        trieInsert(TRIE, word, NEW_WORD_SCORE);
        return;
    }

    sugs = sugs.sort(function(a, b) {
        return a[1] - b[1];
    }).map(function(w) {
        return w[0];
    });

    setDisplay(el, word, sugs);

    if (COMPLETE) {
        COMPLETE = false;
        completeWord(el, word, sugs);
        killDisplay();
        event.preventDefault();
    }
}

function completeWord(el, word, sugs) {
    el.value = el.value.substring(0, el.value.length - word.length) + sugs[0] + ' ';
}

function setDisplay(el, word, sugs) {
    OPEN = true;

    var body = document.querySelector('body');
    var d = document.getElementById(DISPLAY_ID);

    if (!d) {
        d = createDisplay();
        body.appendChild(d);
    }

    positionDisplay(el, d);
    setDisplayHTML(d, sugs);
    attachClickListeners(el, word, d);
}

function setDisplayHTML(d, sugs) {
    var html = '';

    sugs.slice(0, 4).forEach(function(s) {
        html += '<span class="word">' + s + '</span>';
    });

    d.innerHTML = html;
}

function createDisplay() {
    var d = document.createElement('span');
    d.id = DISPLAY_ID;
    return d;
}

function positionDisplay(el, d) {
    var pos = el.getBoundingClientRect();
    d.style.top = (pos.top + window.pageYOffset - 25) + 'px';
    d.style.left = (pos.left - 2) + 'px';
}

function attachClickListeners(el, word, d) {
    d.querySelectorAll('.word').forEach(function(n) {
        n.addEventListener('click', function(e) {
            completeWord(el, word, [n.innerText]);
            killDisplay();
            el.focus();
        });
    });
}

function killDisplay() {
    OPEN = false;
    var d = document.getElementById(DISPLAY_ID);
    if (d) d.remove();
}

function attachListeners() {
    var els = document.querySelectorAll('input[type=text], textarea');

    Array.from(els).forEach(function(el) {
        el.addEventListener('keydown', keyDown);
        el.addEventListener('keyup', keyUp);
    });
}

function ingestPage() {
    var words = document.body.innerText.split(/[^\w']+/);
    trieInsertMany(TRIE, words);
}

function main() {
    new MutationObserver(attachListeners).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    trieInsertMany(TRIE, dict);
    console.log(TRIE);
    ingestPage();
}

var NEW_WORD_SCORE = 0;
var DISPLAY_ID = 'complete-display';
var TRIE = {};
var KEY_SPACE = 32;
var KEY_TRIGGER = 9;
var COMPLETE = false;
var OPEN = false;

main();
