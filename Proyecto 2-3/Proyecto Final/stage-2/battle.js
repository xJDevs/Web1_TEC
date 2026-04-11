// ==========================================
// battle.js: EL MOTOR LÓGICO DE LA PELEA
// ==========================================

// Este archivo se encargará de hacer los cálculos numéricos de daño,
// llevar el control matemático de la vida (HP) de ambos Pokémon y manejar la lógica de victoria


import { renderBattlefield, updatePlayerPosition, updateHealthBar, animateHit, renderLog } from './render.js'

/*
  Patron de diseño de estado global (State Object) que funciona como fuente de la verdad
  Centraliza todas las variables dinamicas que sufren cambios durante el ciclo de vida de la partida
  Permite que diferentes funciones consulten o modifiquen la informacion sin depender de variables locales aisladas
  Mantiene sincronizada la logica del juego con lo que se renderiza en la pantalla
*/

export const GAME_STATE = {
    player: {
        hp: 0,
        position: 2,
        locked: false,
        definitiveUsed: false,
        attackOnCooldown: false,
        stats: null // Aquí irán los tipos, nombre, etc
    },
    opponent: {
        hp: 0,
        position: 2,
        locked: false,
        definitiveUsed: false,
        attackOnCooldown: false,
        stats: null
    },
    phase: 'battle',
    log: []
};


// Agrega un mensaje al estadolog y lo manda a renderizar en pantalla
export function addLog(message, pokemonName, type = 'system') {
    GAME_STATE.log.push({ message, pokemonName });
    renderLog(message, pokemonName, type);
}

export function initBattle() {

    // 1. Recuperamos los datos de los pokemones de la fase 1 guardados en local storage 
    const rawPlayer = localStorage.getItem('playerData')
    const rawOpponent = localStorage.getItem('opponentData')

    /*
      2. JSON.parse revierte el stringify que hizo Stage 1
      localStorage solo almacena strings, así que sin este paso
      las variables serían texto crudo en vez de objetos accesibles
    */
    const player = JSON.parse(rawPlayer)
    const opponent = JSON.parse(rawOpponent)

    /*
      Se modifican los stats de HP antes de pintar: 
      Se sobreescribe el HP raw de la API por la vida real de batalla * 2.5
      Math.floor redondea el resultado de la multiplicación hacia el entero inferior más cercano
      Esto evita decimales
    */
    player.hp = Math.floor(player.hp * 2.5)
    opponent.hp = Math.floor(opponent.hp * 2.5)

    /*
      Se separa estrictamente el estado dinamico de los datos estaticos
      El HP cambia durante la batalla  y por eso se duplica su valor en dos variables 
      Si se editara el HP del objeto original, estariamos modificando los datos que vienen directo de la API 
      Los "stats" enteros se guardan por referencia para no perder la informacion original 
      (tipos, imagenes, nombre) que se requiere para redibujar la UI
    */
    GAME_STATE.player.hp = player.hp;
    GAME_STATE.player.stats = player;

    GAME_STATE.opponent.hp = opponent.hp;
    GAME_STATE.opponent.stats = opponent;

    // 4. Renderizamos el campo de batalla
    renderBattlefield(player, opponent)

    // 5. Encendemos el receptor de teclado
    setupControls();
}


// Escucha las teclas y actualiza la posición en el estado

function setupControls() {
    /*
      El parametro 'e' representa el objeto Event inyectado por el navegador cuando el usuario presiona una tecla
      Contiene metadatos del teclado como la tecla pulsada, el codigo hardware de la tecla, si se presiono shift, control, etc
    */
    window.addEventListener('keydown', (e) => {
        // Si el personaje está bloqueado, no se mueve
        if (GAME_STATE.player.locked) return;

        if (e.key === 'ArrowLeft' && GAME_STATE.player.position > 1) {
            GAME_STATE.player.position--;
            updatePlayerUI();
        } else if (e.key === 'ArrowRight' && GAME_STATE.player.position < 3) {
            GAME_STATE.player.position++;
            updatePlayerUI();
        }
    });
}



function updatePlayerUI() {
    updatePlayerPosition(GAME_STATE.player.position, GAME_STATE.player.stats.types[0]);
}

/**
 * Funcion de prueba: resta 20 de HP al oponente y dispara la animacion
 */
export function handleAttack(playerType) {
    // Para usar una variable como llave en un objeto, debes usar paréntesis cuadrados (Bracket Notation)
    GAME_STATE[playerType].hp -= 20;
    if (GAME_STATE[playerType].hp < 0) GAME_STATE[playerType].hp = 0;

    // Actualizamos visuales usando la HP actual guardada y la vida máxima estática guardada en stats
    updateHealthBar(playerType, GAME_STATE[playerType].hp, GAME_STATE[playerType].stats.hp);
    animateHit(playerType);
    addLog(`¡Ataque exitoso! ${GAME_STATE[playerType].stats.name} tiene ${GAME_STATE[playerType].hp} HP`, GAME_STATE[playerType].stats.name, playerType);
}
