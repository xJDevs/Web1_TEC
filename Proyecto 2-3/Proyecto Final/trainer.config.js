// La configuración central del entrenador.
// Usar "export default" permite importar este objeto de JS
// desde cualquier otra parte del proyecto (Stage 1 y Stage 2)

const TRAINER_CONFIG = {
  name: "Joe",
  hometown: "Desampa",
  catchphrase: "Mas vivos que nunca!",

  favoritePokemon: "darkrai",
  nickname: "Darks",
  
  // Customizacion de la ultimate/movimiento especial
  definitiveMoveName: "Dark Void",
  definitiveMoveFlavor: "Used to lull opponents into a deep, nightmarish sleep, effectively incapacitating them.",
  
  // Mensajes de victoria o derrota que saldrán en pantalla grande al finalizar el Stage 2
  winMessage: "I WINNNN!",
  loseMessage: "I'll be your nightmare!"
};

// Exportar el objeto. 
// Hacer esto convierte el JS en un "módulo" (ESM), lo que permite sacarlo 
// de aquí e importarlo en los demás archivos usando: import TRAINER from './trainer.config.js'
export default TRAINER_CONFIG;
