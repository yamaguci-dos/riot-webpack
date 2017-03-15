const webpack = require('webpack')
const webpackMerge = require('webpack-merge');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


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
const common_scss = {
    entry: {
        common: './scss/common.scss' // コンパイル対象ファイルのpath
    },
    output: {
        path: './build/', // コンパイル後に出力するpath
        filename: '[name].css' // [name] には entry の key の値が入る（今回では common ）
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize!sass-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
}

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
module.exports = [config,common_scss];
