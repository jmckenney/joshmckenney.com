var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'dist/bundle.js',
        path: __dirname,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',

                    // Could also be write as follow:
                    // use: 'css-loader?modules&importLoader=2&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                // modules: true,
                                sourceMap: true,
                                importLoaders: 2,
                                // localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        'sass-loader'
                    ]
                }),
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("dist/css/styles.css")
    ],
    devtool: 'inline-source-map'
};