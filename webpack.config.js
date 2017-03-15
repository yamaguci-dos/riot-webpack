const webpack = require('webpack')
const webpackMerge = require('webpack-merge');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

const common = {
    // 対象のjsファイル
    entry: './app/app.js',
    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.tag$/,
                exclude: /node_modules/,
                loader: 'riotjs-loader'
            }
        ],
        loaders: [
            {
                test: /\.js|\.tag$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-riot']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.tag']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.ProvidePlugin({riot: 'riot'})
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
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new UnminifiedWebpackPlugin()

        ]
    });
} else {
    config = webpackMerge(common, {
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
