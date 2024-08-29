const { babel } = require('@rollup/plugin-babel')
const commonjs  = require("@rollup/plugin-commonjs")
const { nodeResolve } = require('@rollup/plugin-node-resolve')

let pkg = require('./package.json')

module.exports = {
  input: 'index.js',
  plugins: [
    commonjs(),
    babel(),
    nodeResolve()
  ],
  output: [
    {
      file: pkg.main,
      format: 'es',
      name: 'd3',
      sourcemap: true,
      globals: {
        'd3-selection': 'd3',
        'd3-dispatch': 'd3',
        'd3-shape': 'd3',
        'd3-drag': 'd3'
      }
    }
  ]
};
