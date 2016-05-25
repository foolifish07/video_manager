var config = require('./webpack.base.config.js')
var HtmlWebpackPlugin = require('html-webpack-plugin');

config.output = {
	path: './dist',
	filename: '[name].[hash].js',
};
config.devServer= {
    hot: true,
    inline: true,
    progress: true,
    historyApiFallback: true,
    proxy: {
    	// http://0.0.0.0:8080/Contest/715/balloon_data/
    	'/api/*': {
	    	target: 'http://localhost:3000',
	        secure: false,
	        rewrite: function(req) {
	        	console.log('dddddddddddddddddddddddddd');
		      	//req.url = req.url.replace( /^\/data/, 'Contest/715/balloon/data/');
		    },
        },
        '/stylesheets/*': {
	    	target: 'http://localhost:3000',
	        secure: false,
	        rewrite: function(req) {
		      	//req.url = req.url.replace( /^\/data/, 'Contest/715/balloon/data/');
		    },
        },
        '/javascripts/*': {
	    	target: 'http://localhost:3000',
	        secure: false,
	        rewrite: function(req) {
		      	//req.url = req.url.replace( /^\/data/, 'Contest/715/balloon/data/');
		    },
        },
        '/images/*': {
	    	target: 'http://localhost:3000',
	        secure: false,
	        rewrite: function(req) {
		      	//req.url = req.url.replace( /^\/data/, 'Contest/715/balloon/data/');
		    },
        },

        '/files/*': {
	    	target: 'http://localhost:3000',
	        secure: false,
	        rewrite: function(req) {
	        	console.log('files')
		      	//req.url = req.url.replace( /^\/data/, 'Contest/715/balloon/data/');
		    },
        },
        '/socket.io/*': {
        	target: 'http://localhost:3000',
	        secure: false,
	        rewrite: function(req) {
	        	console.log('socketio')
		      	//req.url = req.url.replace( /^\/data/, 'Contest/715/balloon/data/');
		    },	
        }
    }
},
config.plugins = [
	new HtmlWebpackPlugin({  
	    filename: 'index.html',
	    template: 'src/index.html',
	    inject: 'body' 
    })
]
config.devtool = 'eval-source-map'

module.exports = config