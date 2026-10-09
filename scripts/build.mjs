import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'content.js', 'public']) {
  await cp(file, file === 'public' ? 'dist' : `dist/${file}`, { recursive: true });
}
console.log('Built Ninja Destiny Wiki → dist/');
