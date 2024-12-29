module.exports = function override(config, env) {
  // Add fallbacks for node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
  };

  return config;
};
