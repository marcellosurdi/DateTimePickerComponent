// Per i percorsi dei file si usa il modulo path integrato in Node anteponendogli la variabile globale __dirname
// Questo allo scopo di prevenire problemi di percorso dei file tra i differenti sistemi operativi
const path = require( 'path' );

module.exports = {
  // Percorso dei file sorgente
  src: path.resolve( __dirname, '../src' ),
  // Percorso dei file generati durante la build
  build: path.resolve( __dirname, '../dist' ),
  // Percorso dei file statici non processati da WebPack
  static: path.resolve( __dirname, '../static' ),
}
