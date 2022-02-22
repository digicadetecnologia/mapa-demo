const { merge } = require('webpack-merge');
var prodEnv = require('./.env.dev')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    PROXY: 'http://localhost:8083/proxy',
})
