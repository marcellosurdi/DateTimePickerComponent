const paths = require( './project-paths' );
const common = require( './webpack.common' );
const webpack = require( 'webpack' );
const { merge } = require( 'webpack-merge' );

// env indica le variabili d'ambiente, argv indica le opzioni passate negli NPM script
module.exports = ( env, argv ) => {
  return merge( common, {
      mode: 'development',

      // Controlla la generazione dei file Source Maps
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
        // devServer.contentBase rappresenta l'indirizzo delle risorse statiche (ovvero non processate da WebPack)
        // Se devServer.contentBase non è specificato l'indirizzo è la directory principale del progetto
        contentBase: paths.static, // contentBase: false,

        // Indica al dev-server di monitorare i file indicati da devServer.contentBase.
        // Se abilitato, un cambiamento a questi file innesca un ricaricamento di pagina completo
        watchContentBase: true,

        // Hot Module Replacement consente un aggiornamento dei moduli a runtime senza un ricaricamento di pagina completo
        hot: true,

        port: 3001,

        // openPage: 'www/www.dev.dragosailor/dist/',

        // proxy: {
        //   '/api/': 'http://localhost:3000/www/www.dev.dragosailor/'
        // },
      },

      plugins: [
        new webpack.EnvironmentPlugin( { BUILD: false } ),
      ],
    }
  );
};
