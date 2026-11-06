import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {normalizePath,definitions,artwork} from '../renderer.js';

// Regression: the original Figma letters start with Z, which is invalid as
// the first SVG path command. Tolerant image renderers missed this defect.
assert.equal(normalizePath('Z M1 2 L3 4 Z'),'M1 2 L3 4 Z');
assert.equal(normalizePath('  Z z  M0 0 Q1 2 3 4 Z'),'M0 0 Q1 2 3 4 Z');
assert.equal(normalizePath('M1 2 L3 4 Z'),'M1 2 L3 4 Z');
assert.equal(normalizePath('Z'),'');
const context={window:{}};
vm.runInNewContext(await readFile(new URL('../design.js',import.meta.url),'utf8'),context);
const {paths,layouts}=context.window.TAVAKOLI_DESIGN;
const markup=definitions(paths);
const emitted=new Map([...markup.matchAll(/<path id="path-([^"]+)" d="([^"]*)"/g)].map(match=>[match[1],match[2]]));
assert.equal(emitted.size,Object.keys(paths).length);
let repaired=0,textNodes=0,glyphs=0;
for(const [id,d] of Object.entries(paths)){
  const output=emitted.get(id);
  assert.ok(!output||/^[Mm]/.test(output),`Invalid first SVG command for path ${id}`);
  assert.equal(output,normalizePath(d));
  if(/^\s*[zZ]/.test(d))repaired++;
  else assert.equal(output,d.trim(),`Unchanged geometry modified: ${id}`);
}
function check(n){
  if(n.type==='TEXT'&&n.text){
    textNodes++;assert.ok(n.glyphs.length,`Missing glyphs: ${n.id}`);
    const svg=artwork(n,`test-${textNodes}`);
    for(const g of n.glyphs){
      glyphs++;assert.ok(emitted.has(g.path),`Missing referenced path ${g.path}`);
      assert.ok(svg.includes(`href="#path-${g.path}"`));
    }
  }
  n.children.forEach(check);
}
Object.values(layouts).forEach(check);
assert.ok(repaired>0,'Regression fixture must contain original leading close commands');
console.log(`PASS: ${repaired} invalid leading close commands repaired; ${emitted.size} valid path definitions; ${textNodes} text elements and ${glyphs} glyph references across mobile and desktop.`);
