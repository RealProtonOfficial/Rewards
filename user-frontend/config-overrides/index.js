const webpack = require('webpack');

module.exports = function override(config, env) {

    console.log('config-overrides: override(config:'+config+', env:'+env+')');
    console.log('config = ', config);
    console.log('env = ', env);
    console.log('config-overrides: override(config, env)', config, env);

    config.resolve.fallback = {
        fs: require.resolve('fs')
        , process: require.resolve("process")
        , 'process/browser': require.resolve('process/browser')
        , "buffer": require.resolve("buffer/")
    };

    config.plugins.push(
        new webpack.ProvidePlugin({
              process: 'process/browser'
            , Buffer: ['buffer', 'Buffer']
        })
    );

    return config;
}
