const path = require('path')
const resolve = p => path.resolve(__dirname, p)
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	entry: {
		app: [
			resolve('src/js/main.js')
		]
	},
	output: {
		path: resolve('public'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: isProd
						? ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: ['css-loader', 'sass-loader']
						})
						:  ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.js|jsx$/,
				use:  'babel-loader',
				exclude: /node_modules/
			}
		]
	}
}

if (isProd) {
	module.exports.devtool = '#source-map'
	module.exports.output = Object.assign({}, module.exports.output, {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[id].[chunkhash].js'
	})
	module.exports.plugins = (module.exports.plugins || []).concat([
		new ExtractTextPlugin({
			filename: '[name].[contenthash].css'
		}), // extract css to seperate files
		new HtmlWebpackPlugin({
			template: 'index.ejs',
			inject: true,
			chunksSortMode: 'dependency'
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: true
		}), // minify for prod build
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		})
	])
} else {
	module.exports.entry.app = [
		'webpack-hot-middleware/client',
		'react-hot-loader/patch'
	].concat(module.exports.entry.app)
	module.exports.devtool = '#eval-source-map'
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.HotModuleReplacementPlugin()
	])
}