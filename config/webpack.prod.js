const paths = require( './project-paths' );
const common = require( './webpack.common' );
const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
const CssMinimizerWebpackPlugin = require( 'css-minimizer-webpack-plugin' );

module.exports = ( env, argv ) => {
   return merge( common, {
      mode: 'production',

      devtool: false,

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
        filename: 'js/[name].[contenthash].js',
      },

      plugins: [
        new webpack.EnvironmentPlugin( { BUILD: ( env && env.BUILD ) ? env.BUILD : false } ),

        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
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
