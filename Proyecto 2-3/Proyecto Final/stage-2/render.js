
// Al igual que en el Stage 1, el trabajo de este archivo
// es única y exclusivamente manipular etiquetas HTML para no contaminar al motor battle.js.
// Ningún cálculo lógico se hace acá, solo se pintan datos en pantalla

import { TYPE_COLORS } from "../stage-1/render.js";
import { GAME_STATE, addLog } from "./battle.js"
import TRAINER_CONFIG from "../trainer.config.js";

export function renderBattlefield(playerData, opponentData) {
    
    // 1. Inyectamos los nombres en el HTML
    document.getElementById('player-name').textContent = playerData.name.toUpperCase();
    document.getElementById('opponent-name').textContent = opponentData.name.toUpperCase();

    // 2. Pintamos el HP directamente en los textos visuales
    // Este HP ya viene calculado y sobreescrito desde battle.js
    document.getElementById('player-hp-current').textContent = playerData.hp;
    document.getElementById('player-hp-max').textContent = playerData.hp;
    
    document.getElementById('opponent-hp-current').textContent = opponentData.hp;
    document.getElementById('opponent-hp-max').textContent = opponentData.hp;

    document.getElementById('player-hp-bar').style.backgroundColor = TYPE_COLORS[playerData.types[0]];
    document.getElementById('opponent-hp-bar').style.backgroundColor = TYPE_COLORS[opponentData.types[0]];


    // 3. Creamos los elementos <img> y les acomodamos las clases CSS de sprite
    const playerSprite = document.createElement('img');
    playerSprite.src = playerData.imgUrl;
    playerSprite.classList.add('sprite');
    playerSprite.id = 'player-sprite'; // se le asigna ID para luego inyectarle animaciones de daño
    
    const opponentSprite = document.createElement('img');
    opponentSprite.src = opponentData.imgUrl;
    opponentSprite.classList.add('sprite');
    opponentSprite.id = 'opponent-sprite';

    // 4. Se inyectan los elementos de imagen (pokemones) creados dentro del DOM de la arena
    // Se establece la celda central como punto de inicio por default del jugador
    document.getElementById('p-cell-2').appendChild(playerSprite);
    document.getElementById('e-cell-1').appendChild(opponentSprite);
    
    // Se activa el indicador visual de posición actual y se le asigna el color en base al tipo de pokemon

    const playerCell = document.getElementById('p-cell-2')
    const opponentCell = document.getElementById('e-cell-1')

    playerCell.classList.add('active')
    playerCell.style.borderBottomColor = TYPE_COLORS[playerData.types[0]]
    playerCell.style.background = `radial-gradient(ellipse at bottom, ${TYPE_COLORS[playerData.types[0]]}33, transparent 70%)`;
    

    opponentCell.classList.add('active')
    opponentCell.style.borderBottomColor = TYPE_COLORS[opponentData.types[0]]
    opponentCell.style.background = `radial-gradient(ellipse at bottom, ${TYPE_COLORS[opponentData.types[0]]}33, transparent 70%)`;

    // Se le asignan colores a las cajas de stats
    document.getElementById('opponent-stats').style.borderColor = TYPE_COLORS[opponentData.types[0]]
    document.getElementById('player-stats').style.borderColor = TYPE_COLORS[playerData.types[0]]
    
    
}


// Actualiza visualmente el tamaño (ancho %) y texto de la barra de vida
export function updateHealthBar(playerType, currentHP, maxHP) {
    // Convertimos la vida en porcentaje
    const percentage = (currentHP / maxHP) * 100; 
    const bar = document.getElementById(`${playerType}-hp-bar`);
    const text = document.getElementById(`${playerType}-hp-current`);
    
    if (bar) bar.style.width = `${percentage}%`; // se le da ancho porcentual a la barra 
    if (text) text.textContent = currentHP;
}

// Ejecuta una animacion de sacudida y brillo cuando un pokemon recibe daño
export function animateHit(playerType) {
    const sprite = document.getElementById(`${playerType}-sprite`);
    if (!sprite) return; // defensive programming, no queremos que por un error el programa intente renderizar un sprite que no existe y bote todo el programa 

    // Agregamos la clase que tiene el CSS de shake y brillo
    sprite.classList.add('hit');

    // La quitamos despues de 300ms para que se pueda repetir en el proximo golpe
    setTimeout(() => {
        sprite.classList.remove('hit');
    }, 300);
}

export function animateAttack(playerType) {
    const sprite = document.getElementById(`${playerType}-sprite`);
    if (!sprite) return;

    sprite.classList.add('attack-anim')

    setTimeout(() => {
        sprite.classList.remove('attack-anim')
    }, 300);
}
    

// Escribe un mensaje en el log de batalla y hace scroll hacia abajo
export function renderLog(message, pokemonName, type = 'system') {
    const logContent = document.getElementById('log-content');
    if (!logContent) return;

    // JS haria esto -> <div class='log-entry player'> </div>, necesario para el CSS
    const entry = document.createElement('div');
    entry.classList.add('log-entry', type);

    if (type === 'player') {
        entry.style.color = TYPE_COLORS[GAME_STATE.player.stats.types[0]]
    } else if (type === 'opponent') {
        entry.style.color = TYPE_COLORS[GAME_STATE.opponent.stats.types[0]]
    } else {
        entry.style.color = '#C026D3';
    }

    // se agrega como innerHTML en lugar de textContent para poder darle estilos a partes del mensaje
    entry.innerHTML = `> ${pokemonName.toUpperCase()}: ${message}`;
    
    // prepend() inyecta los nuevos elementos AL PRINCIPIO del contenedor
    // empujando los viejos hacia el fondo
    logContent.prepend(entry);
}

/**
 
// param es una manera de tipar un parametro. Es una etiqueta de control de calidad para indicar que tipo de dato va ahi
@param {number} cellIndex - Índice de la celda 1, 2 o 3
 */

export function showWarning(cellIndex) {
    // Buscamos la celda dentro de la fila del jugador (player-row)
    const platform = document.querySelector(`.player-row .cell:nth-child(${cellIndex})`);
    if (platform) platform.classList.add('warning');
}


//  Quita la alerta roja una vez que el ataque ha pasado

export function hideWarning(cellIndex) {
    const platform = document.querySelector(`.player-row .cell:nth-child(${cellIndex})`);
    if (platform) platform.classList.remove('warning');
}

/**
 * Actualiza visualmente el cooldown 
 * @param {number} percentage - Valor del 0 al 100
 */
export function updateCooldownUI(percentage) {
    const bar = document.querySelector('.cooldown-fill-inner');
    if (bar) bar.style.width = `${percentage}%`;
}


 // Mueve el sprite del jugador a la celda indicada y aplica estilos de plataforma activa
export function updatePlayerPosition(newPosition, type) {
    const playerSprite = document.getElementById('player-sprite'); // creado arriba en renderBattlefield
    const newCell = document.getElementById(`p-cell-${newPosition}`); 
    
    // 1. Limpiamos estilos de todas las celdas del jugador
    /*
      querySelectorAll devuelve una lista de elementos que coinciden con un selector de CSS
      busca player-row, se mete y luego busca .cell
      Se obtienen a la vez todas las celdas pertenecientes a la fila del jugador
      para eliminarles los estilos de iluminacion activa 
    */
    document.querySelectorAll('.player-row .cell').forEach(cell => {
        cell.classList.remove('active');
        cell.style.borderBottomColor = '';
        cell.style.background = '';
    });

    // 2. Teletransportamos el sprite a la nueva celda
    if (newCell && playerSprite) {
        newCell.appendChild(playerSprite);
        
        // 3. Se aplica el brillo de plataforma activa basado en el tipo
        newCell.classList.add('active');
        newCell.style.borderBottomColor = TYPE_COLORS[type];
        newCell.style.background = `radial-gradient(ellipse at bottom, ${TYPE_COLORS[type]}33, transparent 70%)`;
    }
}

/**
 * Fase 5: Muestra la pantalla de fin de juego y asigna los textos
 */
export function showEndScreen(isWin) {
    const endScreen = document.getElementById('end-screen');
    const endTitle = document.getElementById('end-title');
    const endMessage = document.getElementById('end-message');
    
    endScreen.classList.remove('hidden');
    
    if (isWin) {
        addLog(TRAINER_CONFIG.winMessage, GAME_STATE.player.stats.name, 'player');
        endTitle.textContent = "¡HAS GANADO!";
        
        // Renderizamos en pantalla grande los mensajes traídos de tu configuración
        endMessage.textContent = `${TRAINER_CONFIG.winMessage}`;
        endMessage.style.color = '#A855F7';
        endTitle.style.color = TYPE_COLORS[GAME_STATE.player.stats.types[0]];
        
    } else {
        addLog(TRAINER_CONFIG.loseMessage, GAME_STATE.player.stats.name, 'player');
        endTitle.textContent = "¡HAS PERDIDO!";
        
        // Renderizamos en pantalla grande los mensajes de derrota
        endMessage.textContent = `${TRAINER_CONFIG.loseMessage}`;
        endMessage.style.color = '#C026D3';
        endTitle.style.color = TYPE_COLORS[GAME_STATE.opponent.stats.types[0]];
    }
}

// Oculta la pantalla para permitir reiniciar el juego

export function hideEndScreen() {
    document.getElementById('end-screen').classList.add('hidden');
}



