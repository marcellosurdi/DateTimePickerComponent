const version = JSON.stringify( require( '../package.json' ).version ).replace( /"/g, '' );
const paths = require( './project-paths' );
const common = require( './webpack.common' );
const { merge } = require( 'webpack-merge' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CssMinimizerWebpackPlugin = require( 'css-minimizer-webpack-plugin' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );


module.exports = ( env, argv ) => {
   return merge( common, {
      mode: 'production',

      devtool: false,

      entry: {
        "date-time-picker-component": paths.src + '/export.js',
      },


      module: {
        rules: [
          {
            test: /\.(css|scss)$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              'css-loader',
              'sass-loader',
            ],
          },
        ],
      },

      output: {
        filename: 'js/[name].min.js',

        library: {
          name: 'DateTimePickerComponent',
          type: 'umd',
        },
      },

      plugins: [
        new MiniCssExtractPlugin({
          filename: 'css/[name].min.css',
        }),

        new HtmlWebpackPlugin({
          filename: 'index_' + version + '.html',
          title: 'date-time-picker-component@' + version,
          template: paths.static + '/tpl/export.html',
          inject: false,
          minify: false,
        }),
      ],

      optimization: {
        minimizer: [
          new TerserWebpackPlugin( {} ),
          new CssMinimizerWebpackPlugin()
        ],
      },
    }
  );
}
