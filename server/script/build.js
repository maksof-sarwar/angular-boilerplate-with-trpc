require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: ['index.ts'],
    external: ['express', 'cors', 'trpc-panel', 'gpt-3-encoder'],
    minify: true,
    format: 'cjs',
    outdir: 'dist',
    bundle: true,
    metafile: true,
    color: true,
    minifyWhitespace: true,
    platform: 'node',
  })
  .catch(() => process.exit(1));
