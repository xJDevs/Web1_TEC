// La configuración central del entrenador.
// Usar "export default" permite importar este objeto de JS
// desde cualquier otra parte del proyecto (Stage 1 y Stage 2)

const TRAINER_CONFIG = {
  name: "Joe",
  hometown: "Desampa Town",
  catchphrase: "Darker than ever!",
  battleCry: 'STOPPPP!',

  favoritePokemon: "darkrai",
  nickname: "Darks",
  
  // Customizacion de la ultimate/movimiento especial
  definitiveMoveName: "Dark Void",
  definitiveMoveFlavor: "READY FOR A NIGHTMARISH SLEEP!?",
  
  // Mensajes de victoria o derrota que saldrán en pantalla grande al finalizar el Stage 2
  winMessage: "DARKNESS WILL ALWAYS BE AROUND US",
  loseMessage: "I'LL BE YOUR NIGHTMARE!"
};

// Exportar el objeto. 
// Hacer esto convierte el JS en un "módulo" (ESM), lo que permite sacarlo 
// de aquí e importarlo en los demás archivos usando: import TRAINER from './trainer.config.js'
export default TRAINER_CONFIG;
