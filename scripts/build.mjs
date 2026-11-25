import {mkdir,copyFile,rm} from 'node:fs/promises';
const files=['index.html','on-tap-toan-lop-1.html','on-tap-toan-lop-1-de-2.html','hoc-cach-lam.html','motion.js','.nojekyll'];
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const f of files)await copyFile(f,'dist/'+f);
console.log('Built '+files.length+' static files in dist/');
