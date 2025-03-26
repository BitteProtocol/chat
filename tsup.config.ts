import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // Your main entry point
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  noExternal: ['bn.js'],
  minify: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    };
  },
  esbuildOptions(options) {
    options.assetNames = '[name]';
  },
  loader: {
    '.css': 'copy', // Ensures CSS files are copied to dist
  },
  onSuccess: 'npx @tailwindcss/cli -i ./src/styles.css -o ./dist/styles.css', // Compiles Tailwind CSS
});
