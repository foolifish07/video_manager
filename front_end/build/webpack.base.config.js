var path = require('path');
var srcPath = path.join(__dirname, '../src');
var distPath = path.join(__dirname, '../dist');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main: './src/main.js',
        //bootstrap :"./src/bootstrap.min.css",
        //vue: ['vue']
	},
	output: {
		path: './dist',
		filename: '[name].[hash].js'
	},

	module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style!css'},
            //{ test: /\.css$/, loader: 'style!css!autoprefixer'},
            { test: /\.less/, loader: 'style!css!autoprefixer!less'},
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader'},
            { test: /\.(html|tpl)$/, loader: 'html-loader' },
        ]
    },
    vue: {
        loaders: {
            css: 'style!css!autoprefixer!less'
        },
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        //extensions: ['', '.js', '.vue'],
        // global name 
        alias: {
            filter: './src/filters',
            components: './src/components',
        },
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({  // Also generate a test.html
          filename: 'index.html',
          template: 'src/index.html',
          inject: 'body' 
        })
    ]
}