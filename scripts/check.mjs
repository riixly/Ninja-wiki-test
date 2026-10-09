import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { scrolls } from '../content.js';

// Verify content, referenced assets, and syntax before deploying the static site.
for (const file of ['app.js', 'content.js', 'scripts/build.mjs', 'theme-boot.js', 'entrance.js']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
assert.equal(new Set(scrolls.map(s => s.id)).size, scrolls.length, 'Scroll IDs must be unique');
const html = await readFile('index.html', 'utf8');
for (const item of scrolls) {
  assert.match(item.id, /^[a-z0-9-]+$/);
  assert(html.includes(`id="i-${item.icon}"`), `Missing icon: ${item.icon}`);
  for (const match of item.body.matchAll(/data-open="([^"]+)"/g)) {
    assert(scrolls.some(s => s.id === match[1]), `Invalid scroll link: ${match[1]}`);
  }
}
const app = await readFile('app.js', 'utf8');
for (const match of app.matchAll(/\$\('#([^']+)'\)/g)) {
  assert(html.includes(`id="${match[1]}"`), `Missing element: ${match[1]}`);
}
const styles = await readFile('styles.css', 'utf8');
for (const match of styles.matchAll(/url\('\/(.*?)'\)/g)) await access(`public/${match[1]}`);
for (const path of ['public/favicon.svg', 'public/scroll-sound.mp3', 'public/downloads/Shinobi_Fishing_Macro_v4.zip']) await access(path);
// The entrance must exist, ship with the build, and prevent music before Begin.
for (const path of ['entrance.css', 'entrance.js']) await access(path);
assert(html.includes('id="entrance"') && html.includes('id="entrance-begin"'), 'Missing entrance UI');
assert(html.includes('Begin Your Ninja Destiny'), 'Missing entrance button label');
assert(html.includes('src="/entrance.js"'), 'Missing entrance script');
assert(app.includes("if (window.ninjaEntranceUnlocked !== true) return;"), 'Music is not entrance-gated');
assert(app.includes("document.addEventListener('ninja:begin'"), 'Entrance does not unlock soundtrack');
assert(app.includes("document.addEventListener('ninja:entered', syncHash)"), 'Deep links do not resume after entrance');
const entrance = await readFile('entrance.js', 'utf8');
assert(entrance.includes("window.ninjaEntranceUnlocked = false"), 'Entrance must begin locked');
assert(entrance.includes("document.dispatchEvent(new Event('ninja:begin'))"), 'Begin must start music by click');
const build = await readFile('scripts/build.mjs', 'utf8');
assert(build.includes("'entrance.css', 'entrance.js'"), 'Entrance files missing from deployment');

const exam = scrolls.find(s => s.id === 'chunin-exams');
assert(exam.body.indexOf('Neji') < exam.body.indexOf('Rock Lee') && exam.body.indexOf('Rock Lee') < exam.body.indexOf('Sasuke'));
assert(exam.body.includes('health does not refill'));
assert(exam.body.includes('cannot level up'));
console.log('Passed: JavaScript syntax, article links, element IDs, assets, and Chunin guide content.');
