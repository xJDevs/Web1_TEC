
// Seguimos usando el cuarto que aloja todos los imports centralizados (main).
import TRAINER_CONFIG from '../trainer.config.js'; 
import { initBattle } from './battle.js';
import { renderBattlefield } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Aquí validaremos que la info de Stage 1 haya llegado sana y salva.
    // Para lograr esto en el futuro usaremos nuestro famoso LocalStorage de manera sutil.
    console.log("¡Arena lista! Entrenador conectado para pelear:", TRAINER_CONFIG.name);

});
