module.exports = {
  'env': { 'browser': true, 'es6': true, 'node': true },
  'extends': ['eslint:recommended'],
  'globals': { 'Atomics': 'readonly', 'SharedArrayBuffer': 'readonly' },
  'rules': {
    'linebreak-style': ['error', 'unix'],
    'quotes': [0, 'single', { 'avoidEscape': true }],
    'semi': ['error', 'never']
  },
  'parserOptions': {
    'sourceType': 'module'
  },
  'overrides': [
    {
      'files': ['**/*.ts', '**/*.tsx'],
      'env': { 'browser': true, 'es6': true, 'node': true },
      'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      'globals': { 'Atomics': 'readonly', 'SharedArrayBuffer': 'readonly' },
      'parser': '@typescript-eslint/parser',
      'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'project': './tsconfig.json',
      },
      'plugins': ['@typescript-eslint'],
      'rules': {
        'linebreak-style': ['error', 'unix'],
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-inferrable-types': 0,
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-namespace': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-loss-of-precision': 0,
        'no-useless-escape': 0,
        'prefer-const': 0,
        'no-case-declarations': 0,
        'no-control-regex': 0,
        'no-prototype-builtins': 0,
        'no-inner-declarations': 0
      },
    }
  ]
}
