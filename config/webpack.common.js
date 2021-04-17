const path = require( 'path' );
const version = JSON.stringify( require( '../package.json' ).version ).replace( /"/g, '' );
const paths = require( './project-paths' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );


const config = {
  // La proprietà entry indica quale modulo usare per iniziare a strutturare il grafico delle dipendenze interne
  // Il grafico rappresenta da quali altri moduli e librerie dipende l'entry point (direttamente e indirettamente)
  // Il valore predefinito è ./src/index.js
  entry: {
    main: paths.src + '/main.js',
    // photoswipe: {
    //   import: paths.src + '/photoswipe.js',
    //   dependOn: [ 'main' ],
    // },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: [ '@babel/preset-env' ]
          // }
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

  // La proprietà output indica a WebPack dove creare i bundle e come nominarli
  // Il valore predefinito è ./dist/main.js
  output: {
    path: paths.build,

    // Specifica l'URL pubblico della directory di output per il browser
    publicPath: '/',

    // Indica al webpack quali funzionalità ES possono essere utilizzate nel codice di runtime generato
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
    // Rimuove automaticamente tutti gli asset inutilizzati in fase di rebuild
    new CleanWebpackPlugin({
        // Il valore false è utile per le build incrementali innescate dall'opzione --watch
        // cleanStaleWebpackAssets: false
    }),

    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve( __dirname, '../api' ),
    //       to: paths.build + '/api'
    //     },
    //     {
    //       from: paths.static + '/img',
    //       to: paths.build + '/img'
    //     },
    //     {
    //       from: paths.static + '/favicon.ico',
    //     },
    //   ],
    // }),
  ],
};





[ 'index' ].forEach( ( file ) => {
  let name, chunks;

  if( typeof file == 'string' ) {
    name = file;
    chunks = [ 'main' ]
  } else {
    name = Object.keys( file )[0];
    chunks = Object.values( file )[0];
  }

  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: name + '.html',
      title: name + '@' + version,
      template: paths.static + '/tpl/' + name + '.html',
      chunks: chunks,
      // scriptLoading: 'defer',
    })
  );
});





module.exports = config;
