var config = require('./webpack.base.config.js')
var HtmlWebpackPlugin = require('html-webpack-plugin');

config.output = {
	path: './dist',
	filename: '[name].js'
},
config.plugins = [
	new HtmlWebpackPlugin({  
	    filename: 'index.html',
	    template: 'src/index.html',
	    inject: true
    })
]

module.exports = config