const version = JSON.stringify( require( '../package.json' ).version ).replace( /"/g, '' );
const paths = require( './project-paths' );
const common = require( './webpack.common' );
const { merge } = require( 'webpack-merge' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = ( env, argv ) => {
  return merge( common, {
      mode: 'development',

      devtool: 'inline-source-map',

      entry: {
        dev: paths.src + '/dev.js',
      },

      module: {
        rules: [
          {
           test: /\.(css|scss)$/,
           use: [
             'style-loader',
             'css-loader',
             'sass-loader',
           ],
          },
        ],
      },

      devServer: {
        contentBase: paths.static,
        watchContentBase: true,
        hot: true,
        port: 3001,
      },

      plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          title: 'index@' + version,
          template: paths.static + '/tpl/dev.html',
        }),
      ],
    }
  );
};
