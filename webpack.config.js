const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSCSS = new ExtractTextPlugin('common.css');

const common = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './app/app.js',
    },
    output: {
        path: __dirname + '/build/',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tag$/,
                exclude: /(node_modules)/,
                loader: 'riot-tag-loader'
            },
            {
                test: /\.js|\.tag$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-riot']
                }
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules)/,
                use: extractSCSS.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader?minimize",
                        "sass-loader"
                    ]
                })
            }

        ]
    },
    resolve: {
        extensions: ['.js', '.tag', '.scss']
    },
    plugins: [
        //new webpack.BannerPlugin({banner: 'Banner', raw: true, entryOnly: true}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.ProvidePlugin({riot: 'riot'}),
        extractSCSS
    ],
};

config = '';
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    config = webpackMerge(common, {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                },
                minimize: true
            }),
            new UnminifiedWebpackPlugin()

        ]
    });
} else {
    config = webpackMerge(common, {
        devtool: "source-map",
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                }
            }),
        ]
    });
}
module.exports = config;
