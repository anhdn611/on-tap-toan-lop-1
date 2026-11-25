import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const dir=resolve(process.argv[2]||'dist');
const files=await readdir(dir);
for(const f of ['index.html','on-tap-toan-lop-1.html','on-tap-toan-lop-1-de-2.html','hoc-cach-lam.html','motion.js','.nojekyll'])assert(files.includes(f),f+' is missing');
const browser=await chromium.launch({headless:true});
try{
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=f=>pathToFileURL(join(dir,f)).href;
await page.goto(url('index.html'));
await page.locator('a[href="hoc-cach-lam.html"]').click();
await page.waitForURL('**/hoc-cach-lam.html');
assert.equal(await page.locator('.tile').count(),44);
for(let n=0;n<44;n++){
 await page.locator('.tile').nth(n).click();
 for(let j=0;j<3;j++){
  assert.match(await page.locator('#counter').innerText(),new RegExp('Dạng '+(n+1)+'/44 · Bước '+(j+1)+'/3'));
  assert((await page.locator('#explain').innerText()).length>5);
  assert((await page.locator('#source').innerText()).startsWith('Nguồn dạng bài:'));
  assert(await page.locator('#visual').locator('svg,div').count()>0);
  if(j<2)await page.locator('#next').click();
 }
 await page.locator('#menu').click();
}
assert.match(await page.locator('#summary').innerText(),/44\/44/);
assert.deepEqual(errors,[]);
await page.emulateMedia({reducedMotion:'no-preference'});
await page.locator('.tile').nth(11).click();
await page.locator('#next').click();
assert.equal(await page.locator('.motion-scene').count(),1);
assert(await page.locator('#visual').evaluate(el=>el.getAnimations({subtree:true}).length)>0);
await page.locator('#speed').selectOption('1.5');
await page.locator('#play').click();
await page.waitForTimeout(100);
await page.locator('#play').click();
assert.equal(await page.locator('#play').getAttribute('aria-pressed'),'false');
await page.locator('#replay').click();
assert.match(await page.locator('#counter').innerText(),/Bước 1\/3/);
assert.deepEqual(errors,[]);
for(const f of ['on-tap-toan-lop-1.html','on-tap-toan-lop-1-de-2.html']){await page.goto(url(f));assert.match(await page.title(),/Toán/);assert((await page.locator('body').innerText()).length>20)}
assert.deepEqual(errors,[]);
console.log('Passed: 44 lessons, 132 steps, animation, speed, pause/replay, two quiz pages.');
}finally{await browser.close()}
