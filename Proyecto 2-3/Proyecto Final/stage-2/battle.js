// ==========================================
// battle.js: EL MOTOR LÓGICO DE LA PELEA
// ==========================================

// Este archivo se encargará de hacer los cálculos numéricos de daño,
// llevar el control matemático de la vida (HP) de ambos Pokémon y manejar la lógica de victoria

import { renderBattlefield } from './render.js'

/*
  El State Object: La memoria oficial de la partida a la que todos consultarán
  Actúa como la única fuente de la verdad centralizando las variables dinámicas de la batalla en tiempo real
  Permite controlar de forma global las posiciones, niveles de vitalidad y bloqueos para evitar desincronizaciones
  Inician en estados logicos default y se modificaran conforme avanza la partida
*/
export const GAME_STATE = {
    player: {
        hp: 0,
        position: 2,
        locked: false,
        definitiveUsed: false,
        attackOnCooldown: false,
    },
    opponent: {
        hp: 0,
        position: 2,
        locked: false,
        definitiveUsed: false,
        attackOnCooldown: false,
    },
    phase: 'battle',
    log: []
};

export function initBattle() {

    // 1. Recuperamos los datos de los pokemones de la fase 1 guardados en local storage 
    const rawPlayer = localStorage.getItem('playerData')
    const rawOpponent = localStorage.getItem('opponentData')

    // 2. Se valida que ambos pokemones se hayan cargado correctamente, si no, se redirige al usuario a la fase 1
    if (!rawPlayer || !rawOpponent) {
        console.log('No se encontro data en LocalStorage. Redirigiendo a la Fase 1')
        window.location.href = '../stage-1/index.html'
        return 
    }

    /*
      3. JSON.parse revierte el stringify que hizo Stage 1
      localStorage solo almacena strings, así que sin este paso
      las variables serían texto crudo en vez de objetos accesibles
    */
    const player = JSON.parse(rawPlayer)
    const opponent = JSON.parse(rawOpponent)

    /*
      Se modifican los stats de HP antes de pintar: 
      Se sobreescribe el HP crudo de la API por la vida real de batalla * 2.5
      Se implementa Math.floor para redondear el resultado de la multiplicación hacia el entero inferior más cercano
      Esto evita valores fraccionarios en el motor de juego si el HP inicial de la API multiplicado por 2.5 produce un decimal
    */
    player.hp = Math.floor(player.hp * 2.5)
    opponent.hp = Math.floor(opponent.hp * 2.5)

    // Se actualiza el estado global con los datos de los pokemones
    GAME_STATE.player.hp = player.hp
    GAME_STATE.opponent.hp = opponent.hp
    

    // 4. Llamamos al pintor
    renderBattlefield(player, opponent)
}

export function handleAttack() {
    // Restar vida e invocar al render explícitamente para que actualice su barra
}
