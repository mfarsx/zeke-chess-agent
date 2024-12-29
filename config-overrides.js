const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add fallbacks for node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
  };

  // Add rule for web workers
  config.module.rules.push({
    test: /\.js$/,
    loader: "file-loader",
    options: {
      name: "[name].[ext]",
    },
  });

  return config;
};
