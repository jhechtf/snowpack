const postcss = require('postcss');
const { resolve } = require('path');
const { existsSync } = require('fs');
/**
 * 
 * @param {any} snowpackConfig 
 * @param {any} options 
 * @returns {import('snowpack').SnowpackPlugin}
 */
module.exports = function postcssPlugin(snowpackConfig, options) {
  return {
    name: '@snowpack/postcss-transform',
    async transform({ fileExt, contents }) {
      // Get current working directory.
      const cwd = process.cwd();
      // Grab our necessary options
      const { input = ['.css'], config } = options;
      if (!input.includes(fileExt) || !contents) return;
      // where is our postcss configuration location?
      const configLoc = resolve(cwd, 'postcss.config.js' || config);
      // make sure it exists; postcss will not work without plugins.
      if (!existsSync(configLoc)) throw Error('No PostCSS config specified');
      // it exists, we grab the configuration.
      const postcssConfig = require(configLoc);
      // process the results.
      const processed = await postcss(postcssConfig.plugins)
        .process(contents, {
          // needed to keep an error about sourcemaps from popping up.
          from: undefined
        });

      if (processed.css) return processed.css;
    },
  };
};
