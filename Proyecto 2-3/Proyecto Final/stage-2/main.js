

import TRAINER_CONFIG from '../trainer.config.js'; 
import { initBattle } from './battle.js';
import { renderBattlefield } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // con esto validamos que la info de stage 1 haya llegado sana y salva
    console.log("¡Arena lista! Entrenador conectado para pelear:", TRAINER_CONFIG.name);

});
