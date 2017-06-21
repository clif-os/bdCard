const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
module.exports = {
  context: __dirname,
  devtool: 'cheap-module-source-map',
  entry: {
    bundle: './src/index.jsx',
    vendor: ['react', 'mapbox-gl'],
  },
  output: {
    path: path.resolve(__dirname, 'src/'),
    publicPath: 'src/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      webworkify: 'webworkify-webpack',
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
    },
    modules: ['node_modules', 'src'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
      __DEV__: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: 'node_modules',
      loader: 'babel',
      query: {
        presets: ['es2015', 'react', 'stage-0']
      },
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.js$/,
      include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
      loader: 'worker',
    },
    {
      test: /mapbox-gl.+\.js$/,
      loader: 'transform/cacheable?brfs',
    },
    {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader',
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    },
    {
      test: '/\.(jpg|png)$/', //eslint-disable-line
      loader: 'url-loader?mimetype=image/png'
    }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
