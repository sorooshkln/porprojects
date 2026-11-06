import {spawn} from 'node:child_process';
import {writeFile,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

// Exercise the actual HTTP server using the same Node executable as the test.
// Port 0 chooses a free test port and leaves Nardoon's port 3000 untouched.
const root=fileURLToPath(new URL('../',import.meta.url));
const child=spawn(process.execPath,['scripts/live-server.mjs'],{cwd:root,env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
let output='';const probe=`assets/reload-check-${process.pid}.txt`,controller=new AbortController();
const deadline=setTimeout(()=>{controller.abort();child.kill();},15000);
try {
 const origin=await new Promise((resolve,reject)=>{
  child.stdout.on('data',data=>{output+=data;const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});
  child.once('error',reject);child.once('exit',code=>reject(new Error(`Server exited ${code}`)));
 });
 const get=path=>fetch(origin+path,{signal:controller.signal});
 let response=await get('/');assert.equal(response.status,200);assert.match(await response.text(),/EventSource\('\/__live\/events'\)/);
 response=await get('/design.js');assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/javascript/);
 response=await get('/assets/fonts/DoranFaNum-Regular.ttf');assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'font/ttf');
 response=await get('/assets/images/39001b160d0fd7d8b269db351e9bc8c0b94886b0');assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/png');
 for(const path of ['/package.json','/.git/config','/scripts/live-server.mjs','/assets/%2e%2e/%2e%2e/package.json'])assert.equal((await get(path)).status,404,path);
 response=await fetch(origin+'/',{method:'POST',signal:controller.signal});assert.equal(response.status,405);
 const events=await get('/__live/events'),reader=events.body.getReader(),decoder=new TextDecoder();
 assert.match(decoder.decode((await reader.read()).value),/event: ready/);
 await writeFile(root+probe,'live reload probe');
 let received='';while(!received.includes('event: change'))received+=decoder.decode((await reader.read()).value);
 assert.match(received,/data: reload/);await reader.cancel();
 console.log(`PASS: Node ${process.versions.node}; HTTP, JavaScript, fonts, images, path isolation, methods and automatic reload.`);
} finally {
 clearTimeout(deadline);controller.abort();await unlink(root+probe).catch(()=>{});child.kill('SIGTERM');
}
