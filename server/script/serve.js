const esbuild = require('esbuild');
async function watch() {
  await esbuild
    .build({
      entryPoints: ['index.ts'],
      minify: false,
      format: 'cjs',
      outdir: 'dist',
      bundle: true,
      loader: { '.ts': 'ts' },
      external: ['express', 'cors', '@prisma/client', 'trpc-panel', 'gpt-3-encoder'],
      platform: 'node',
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
  console.log('Looking for changes ...');
}
watch();
