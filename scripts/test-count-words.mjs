import assert from "node:assert/strict";

const MAX = 200;

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

assert.equal(countWords("  one   two  "), 2);
assert.equal(countWords("বাংলা টেক্সট"), 2);
const long = Array.from({ length: 201 }, (_, i) => `w${i}`).join(" ");
assert.equal(countWords(long) <= MAX, false);
console.log("count-words: ok");
