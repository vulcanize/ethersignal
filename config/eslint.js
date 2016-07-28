// Inspired by https://github.com/airbnb/javascript but less opinionated.

// We use eslint-loader so even warnings are very visibile.
// This is why we only use "WARNING" level for potential errors,
// and we don't use "ERROR" level at all.

// In the future, we might create a separate list of rules for production.
// It would probably be more strict.

var WARNING = 1;

module.exports = {
  root: true,

  parser: 'babel-eslint',

  extends: 'trails/react',
  parserOptions: {
    sourceType: 'module',
  },

  rules: {
    'new-cap': [ 'error', { 'capIsNew': false }]
  },

  settings: {
    'import/ignore': [
      'node_modules',
      '\\.(json|css|jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$',
    ],
    'import/extensions': ['.js'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.json']
      }
    }
  }

};
