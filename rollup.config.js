import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'
import svgr from '@svgr/rollup'

const packageJson = require('./package.json')

export default {
  input: 'src/components/widgets/StreamFactoring/borrow/index.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      name: 'react-lib',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return
    warn(warning)
  },
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    json(),
    svgr({ exportType: 'named', jsxRuntime: 'automatic' }),
    postcss(),
    terser(),
  ],
}
