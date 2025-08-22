import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

// const external = ['sm-crypto'];

const babelOptions = {
  babelHelpers: 'bundled',
  presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: false }]],
};

const input = {
  index: 'src/index.ts',
  sm2: 'src/sm2.ts',
  sm3: 'src/sm3.ts',
  sm4: 'src/sm4.ts',
  helpers: 'src/helpers.ts',
};

export default defineConfig([
  // Node.js CommonJS (Node 16+)
  {
    input,
    output: {
      dir: 'dist',
      entryFileNames: ({ name }) => {
        if (name.includes('node_modules')) {
          return name.replaceAll('node_modules/', '_dependencies/') + '.cjs';
        }
        return '[name].cjs'
      },
      preserveModules: true,
      preserveModulesRoot: 'src',
      format: 'cjs',
      exports: 'named',
    },
    // external,
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          noEmit: true
        },
      }),
      babel(babelOptions),
      // terser(),
    ],
  },

  // 浏览器 ESM
  {
    input,
    output: {
      dir: 'dist',
      entryFileNames: ({ name }) => {
        if (name.includes('node_modules')) {
          return name.replaceAll('node_modules/', '_dependencies/') + '.js';
        }
        return '[name].js'
      },
      preserveModules: true,
      preserveModulesRoot: 'src',
      format: 'esm',
    },
    // external,
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      babel(babelOptions),
      // terser({
      //
      // }),
    ],
  },

  // 浏览器 UMD
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'SMCryptoPro',
    },
    // external,
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      babel(babelOptions),
      terser(),
    ],
  },
]);
