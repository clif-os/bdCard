var path = require('path');
var transform = require('transform-loader');

module.exports = {
  context: __dirname,
  entry: {
    bundle: [ './src/main.js'],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'webworkify': 'webworkify-webpack-dropin',
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
      'gl-matrix': path.resolve('./node_modules/gl-matrix/dist/gl-matrix.js'),
    },
    modules: ['node_modules', 'src']
  },
  output: {
    path: path.join(__dirname, 'src/'),
    publicPath: 'src/', // relative path for github pages
    filename: '[name].js', // no hash in main.js because index.html is a static page
    chunkFilename: '[hash]/js/[id].js',
    hotUpdateMainFilename: '[hash]/update.json',
    hotUpdateChunkFilename: '[hash]/js/[id].update.js'
  },
  node: {
    fs: "empty"
  },
  module: {
    postLoaders: [{
      include: /node_modules\/mapbox-gl/,
      loader: 'transform-loader',
      query: 'brfs',
    }],
    loaders: [{
      test: /\.js$/,
      exclude: 'node_modules',
      loader: 'babel',
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    },
    {
      test: /mapbox-gl.+\.js$/,
      include: path.join(__dirname, "lib"),
      loader: 'transform/cacheable?brfs'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },


    {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader'
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: '/\.(jpg|png)$/', //eslint-disable-line
      loader: 'url-loader?mimetype=image/png'
    }
    ]
  }
};
