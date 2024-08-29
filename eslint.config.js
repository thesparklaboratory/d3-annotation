const babelParser = require("@babel/eslint-parser");

module.exports = {
  languageOptions: {
    parser: babelParser,
  },
  rules: {
    "array-bracket-spacing": 0,
    curly: 0,
    indent: [2, 2],
    "no-var": 2,
    "object-curly-spacing": 0,
    quotes: 0,
    eqeqeq: 2,
    "eol-last": 0,
    "prefer-const": 0,
    "no-cond-assign": 0,
    "space-before-blocks": 2,
    "no-unused-vars": 2,
    "no-loop-func": 0,
    "no-extra-parens": 2,
    "dot-notation": 2,
    "comma-dangle": 2,
    "no-unused-expressions": [
      2,
      { allowShortCircuit: true, allowTernary: true },
    ],
    "no-multiple-empty-lines": 0,
    "no-sequences": 0,
  },
};
