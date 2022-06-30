const webpack = require('webpack');

// config-overrides.js
module.exports = function override(config, env) {
  // New config, e.g. config.plugins.push...

  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        process: require.resolve('process/browser'),
        zlib: require.resolve('browserify-zlib'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        assert: require.resolve('assert'),
      },
    },
    plugins: [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
  };
};
