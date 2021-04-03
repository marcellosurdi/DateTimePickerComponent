const paths = require( './project-paths' );
const common = require( './webpack.common' );
const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );
// Estrae il codice CSS in file separati. Per ogni file JS che importa codice CSS genera un file
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
// Ottimizza e minifica i file CSS
const CssMinimizerWebpackPlugin = require( 'css-minimizer-webpack-plugin' );
// Aggiunge attributi personalizzati ai tag inseriti da html-webpack-plugin
// @see https://www.npmjs.com/package/html-tag-attributes-plugin
const HtmlTagAttributesPlugin = require( 'html-tag-attributes-plugin' );

// env indica le variabili d'ambiente, argv indica le opzioni passate negli NPM script
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

        // new HtmlTagAttributesPlugin({
        //   link( tag ) {
        //     if( !/critical/.test( tag.attributes.href ) ) {
        //       return {
        //         media: 'print',
        //         onload: "this.media='all'; this.onload=null;"
        //       };
        //     }
        //   }
        // }),
      ],

      optimization: {
        // @see https://webpack.js.org/guides/caching/
        moduleIds: 'deterministic',
        runtimeChunk: 'single',

        // splitChunks: {
        //   cacheGroups: {
        //     critical: {
        //       name: 'critical',
        //       test: /critical/,
        //       chunks: 'all',
        //       enforce: true,
        //     },
        //   },
        // },

        minimizer: [
          new TerserWebpackPlugin( {} ),
          new CssMinimizerWebpackPlugin()
        ],
      },
    }
  );
}
