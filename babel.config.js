module.exports = {
    plugins: [
      'babel-plugin-transform-typescript-metadata',
      ['@babel/plugin-transform-typescript', { 'legacy': true, allowDeclareFields: true }],
      ['@babel/plugin-proposal-decorators', { 'legacy': true }],
      ['@babel/plugin-proposal-private-methods', { 'loose': true }],
      ['@babel/plugin-proposal-class-properties', { 'loose': true }]
    ],
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript'
    ]
  }