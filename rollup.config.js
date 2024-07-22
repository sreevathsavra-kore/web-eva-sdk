import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
// import nodePolyfills from 'rollup-plugin-polyfill-node';

import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import alias from '@rollup/plugin-alias';


const globals_var = {
  react: 'React',
  'react-dom': 'ReactDOM',
  util: 'util',
  stream: 'stream',
  path: 'path',
  http: 'http',
  https: 'https',
  url: 'url',
  fs: 'fs',
  assert: 'assert',
  tty: 'tty',
  os: 'os',
  zlib: 'zlib',
  events: 'events'
};

const createConfig = (input, dir, name) => ({
  input,
  output: [
    {
      dir: `dist/${dir}`,
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      exports: 'auto',
    },
    {
      dir: `dist/${dir}`,
      format: 'esm',
      entryFileNames: '[name].esm.js',
    },
    {
      dir: `dist/${dir}`,
      format: 'umd',
      name,
      entryFileNames: '[name].umd.js',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    }
  ],
  external: Object.keys(globals_var),
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    json(),
    builtins(),
    globals(),
    alias({
      entries: [
        { find: 'util', replacement: './util-polyfill.js' }
      ]
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react']
    }),
    terser()
  ]
});

export default [
  createConfig('src/index.js', '.', 'EvaUIReact'),
  createConfig('src/components/index.js', 'components', 'Components'),
  createConfig('src/history/index.js', 'history', 'History')
];