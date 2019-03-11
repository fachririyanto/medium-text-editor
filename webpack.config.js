const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// define app path
const BUILD_DIR = path.resolve(__dirname, 'dist')
const APP_DIR = path.resolve(__dirname, 'development')

module.exports = {
    entry: APP_DIR + '/script.js',
    output: {
        path: BUILD_DIR,
        filename: 'script.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    { loader: 'babel-loader' }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({})
    ]
}