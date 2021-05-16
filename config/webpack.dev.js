const paths = require( './project-paths' );
const common = require( './webpack.common' );
const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );

module.exports = ( env, argv ) => {
  return merge( common, {
      mode: 'development',

      devtool: 'inline-source-map',

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

      output: {
        filename: 'js/[name].js',
      },

      devServer: {
        contentBase: paths.static,
        watchContentBase: true,
        hot: true,
        port: 3000,
      },

      plugins: [
        new webpack.EnvironmentPlugin( { BUILD: false } ),
      ],
    }
  );
};
