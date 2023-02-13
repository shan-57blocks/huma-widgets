module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: [
    '.eslintrc.js',
    'config-overrides.js',
    'cypress.config.ts',
    'cypress',
    'babel.config.js',
    'webpack.cosmos.js',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/no-unescaped-entities': 'off',
    'jsx-quotes': 'off',
    semi: 'off',
    '@typescript-eslint/semi': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'no-param-reassign': 'off',
    'react/require-default-props': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    '@typescript-eslint/no-shadow': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
}
