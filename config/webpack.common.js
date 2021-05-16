const path = require( 'path' );
const version = JSON.stringify( require( '../package.json' ).version ).replace( /"/g, '' );
const paths = require( './project-paths' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );


const config = {
  entry: {
    main: paths.src + '/main.js',
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ]
          }
        }
      },

      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        },
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        },
      }
    ],
  },

  output: {
    path: paths.build,
    publicPath: '/',
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: true,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    }
  },

  plugins: [
    new CleanWebpackPlugin( {} ),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'index@' + version,
      template: paths.static + '/tpl/index.html',
      chunks: [ 'main' ],
      // scriptLoading: 'defer',
    }),
  ],
};


module.exports = config;
