const path = require( 'path' );
const paths = require( './project-paths' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );


const config = {
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
  ],
};


module.exports = config;