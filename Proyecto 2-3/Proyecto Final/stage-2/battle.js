// ==========================================
// battle.js: EL MOTOR LÓGICO DE LA PELEA
// ==========================================

// Este archivo se encargará de hacer los cálculos numéricos de daño,
// llevar el control matemático de la vida (HP) de ambos Pokémon y manejar la lógica de victoria


import { renderBattlefield, updatePlayerPosition, updateHealthBar, animateHit, renderLog, showWarning, hideWarning, animateAttack, updateCooldownUI, showEndScreen, hideEndScreen} from './render.js'
import TRAINER_CONFIG from '../trainer.config.js';

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

    // Renderizamos el campo de batalla
    renderBattlefield(player, opponent)

    // Renderizamos barras de poder al 100% al iniciar
    updateCooldownUI(100);

    //  Encendemos el receptor de teclado
    setupControls();

    // Activamos el botón de reinicio de partida de la Fase 
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) restartBtn.addEventListener('click', resetBattle);

    // Conectamos el botón UI "Ataque Definitivo"
    const btnDefinitive = document.getElementById('btn-definitive');
    if (btnDefinitive) btnDefinitive.addEventListener('click', triggerDefinitive);

    // Conectamos la Radio (BGM)
    const btnMusic = document.getElementById('btn-music');
    const bgm = document.getElementById('battle-bgm');
    if (btnMusic && bgm) {
        bgm.volume = 0.2; // 20% de volumen para que no aturda
        btnMusic.addEventListener('click', () => {
            if (bgm.paused) {
                bgm.play();
                btnMusic.innerText = '🔊';
            } else {
                bgm.pause();
                btnMusic.innerText = '🔈';
            }
        });
    }

    // Encendemos la Inteligencia Artificial del enemigo
    planEnemyAttack();
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

        if (e.key === 'Enter') {
            // Protección: Si el ataque se está cooling down, se ignora
            if (GAME_STATE.player.attackOnCooldown) return;

            addLog('LANZA UN ATAQUE', GAME_STATE.player.stats.name, 'player')
            handleAttack('opponent')
            animateAttack('player')

            // Iniciamos la animación progresiva para vaciar y llenar la barra amarilla
            startCooldown();
        }

        // Habilidad Definitiva One-Hit KO. Asignada a Shift
        if (e.key === 'Shift') {
            triggerDefinitive();
        }
    });
}

export function triggerDefinitive() {
    // Validación de seguridad: Solo permite ejecutarse si es "Falso" el uso previo o no está bloqueado
    if (GAME_STATE.player.locked || GAME_STATE.player.definitiveUsed) return;
    
    GAME_STATE.player.definitiveUsed = true; // Bloquea la recarga futura

    const ultimateName = TRAINER_CONFIG.definitiveMoveName;
            addLog(`DESATA SU ATAQUE DEFINITIVO CON <span style="color: #ce8eff; font-weight: bold;">>${ultimateName.toUpperCase()}<</span>!`, GAME_STATE.player.stats.name, 'player');
    
    // Imprimimos el Flavor Text como una entrada de sistema
    addLog(`${TRAINER_CONFIG.definitiveMoveFlavor}`, GAME_STATE.player.stats.name, 'player');

    // Ignora cualquier defensa o matematica y vacía la barra del enemigo a cero
    GAME_STATE.opponent.hp = 0;
    updateHealthBar('opponent', 0, GAME_STATE.opponent.stats.hp);
    animateHit('opponent');
    animateAttack('player');

    // Revisamos si con este ataque terminó el juego, eliminando el colosal timeout
    checkEndGame();
}



function updatePlayerUI() {
    updatePlayerPosition(GAME_STATE.player.position, GAME_STATE.player.stats.types[0]);
}


 // Se le da vida al enemigo 
function planEnemyAttack() {
    // Si alguno murió, se frena el juego por completo 
    if (GAME_STATE.player.hp <= 0 || GAME_STATE.opponent.hp <= 0) return;

    // Escoge un tiempo de espera aleatorio (entre 3s y 10s)
    const delayMs = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;

    setTimeout(() => {
        // Escoge una celda aleatoria para atacar (1, 2, o 3)
        const targetCell = Math.floor(Math.random() * 3) + 1;
        
        // Dispara la advertencia visual
        showWarning(targetCell);
        addLog(`prepara un ataque en la celda ${targetCell}...`, GAME_STATE.opponent.stats.name, 'opponent');

        // Da 2 segundos para que el jugador se mueva antes de atacar 
        setTimeout(() => executeEnemyAttack(targetCell), 2500);
    }, delayMs);
}


function executeEnemyAttack(targetCell) {
    // Protección: Si el oponente murió mientras se preparaba el ataque, se cancela para que no ataque desde la tumba
    if (GAME_STATE.opponent.hp <= 0) {
        hideWarning(targetCell);
        return;
    }

    // Se apaga la advertencia visual porque el rayo ya cayó
    hideWarning(targetCell);

    // Si el jugador estaba en esa celda cuando cayó el ataque, se recibe el golpe
    if (GAME_STATE.player.position === targetCell) {
        animateAttack('opponent')
        addLog(`¡Impacto directo!`, GAME_STATE.opponent.stats.name, 'opponent');
        handleAttack('player'); 
    } else {
        // Si no estaba, logra esquivar
        addLog(`logró esquivar el ataque rápidamente!`, GAME_STATE.player.stats.name, 'player');
    }

    // Se vuelve a invocar a sí misma para preparar el siguiente golpe (recursividad)
    planEnemyAttack();
}

// Función dinámica que aplica daño al OBJETIVO recibido en la función
export function handleAttack(targetType) {
    // Deducimos quién es el atacante. Si la víctima es el oponente, el atacante es el jugador y viceversa)
    const attackerType = targetType === 'opponent' ? 'player' : 'opponent';
    
    // El ATACANTE usa su poder de ataque. El TARGET usa su poder de defensa
    const attackPower = GAME_STATE[attackerType].stats.attack;
    const targetDefense = GAME_STATE[targetType].stats.defense;
    
    // Fórmula de Daño Base
    let damage = Math.floor(attackPower - (targetDefense / 2));
    if (damage <= 0) damage = 1; // medida de seguridad en caso de que algun pokemon tenga demasiada defensa y pueda recibir al menos 1 de daño
    
    // Se le resta vida a la victima 
    GAME_STATE[targetType].hp -= damage;
    if (GAME_STATE[targetType].hp < 0) GAME_STATE[targetType].hp = 0;

    // Actualizamos la barra de vida de la víctima
    updateHealthBar(targetType, GAME_STATE[targetType].hp, GAME_STATE[targetType].stats.hp);
    animateHit(targetType);
    addLog(`recibe un daño de ${damage} puntos!`, GAME_STATE[targetType].stats.name, targetType);

    // Revisamos si alguien murió después de este golpe
    checkEndGame();
}



 // Animacion del Cooldown
 // Apaga el permiso de atacar y rellena la barra de 0 a 100 de forma fluida

function startCooldown() {
    GAME_STATE.player.attackOnCooldown = true;
    const cooldownDurationMs = 2000; // 2 segundos de recarga
    let startTime = null;

    function animateCooldown(timestamp) {
        if (!startTime) startTime = timestamp;
        
        const elapsed = timestamp - startTime;
        let progress = (elapsed / cooldownDurationMs) * 100;

        if (progress > 100) progress = 100;

        updateCooldownUI(progress);

        if (progress < 100) {
            requestAnimationFrame(animateCooldown);
        } else {
            // Recarga completada
            GAME_STATE.player.attackOnCooldown = false;
        }
    }

    requestAnimationFrame(animateCooldown);
}

 //Finalización del juego. 
 //Revisa si alguna vida llegó a 0 y detiene todo el proceso.
 
function checkEndGame() {
    if (GAME_STATE.player.hp <= 0 || GAME_STATE.opponent.hp <= 0) {
        // Bloqueamos al jugador inmediatamente para que no pueda moverse ni atacar en el fondo
        GAME_STATE.player.locked = true; 
        
        // Si la vida del enemigo es <= 0, es victoria (true)
        const isWin = GAME_STATE.opponent.hp <= 0;
        
        // Le damos 1.5 segundos de gracia a la pantalla para que el jugador 
        // alcance a ver con calma que el enemigo bajó a cero y lea el log antes del modal gigante
        setTimeout(() => {
            showEndScreen(isWin);
        }, 3000);
    }
}


 // Reinicio de Partida 
function resetBattle() {
    // Restaurar Vidas y Estado
    GAME_STATE.player.hp = GAME_STATE.player.stats.hp;
    GAME_STATE.opponent.hp = GAME_STATE.opponent.stats.hp;
    
    GAME_STATE.player.position = 2; // Centro
    GAME_STATE.player.locked = false;
    GAME_STATE.player.definitiveUsed = false;
    GAME_STATE.player.attackOnCooldown = false;
    
    GAME_STATE.log = []; // Limpiamos la memoria de la bitácora

    // 2. Restaurar Pantalla Mágicamente sin recargar página (SPA)
    hideEndScreen(); // Ocultamos el banner de victoria/derrota
    updateHealthBar('player', GAME_STATE.player.hp, GAME_STATE.player.stats.hp);
    updateHealthBar('opponent', GAME_STATE.opponent.hp, GAME_STATE.opponent.stats.hp);
    updatePlayerPosition(GAME_STATE.player.position, GAME_STATE.player.stats.types[0]);
    updateCooldownUI(100);

    // Limpiamos los textos viejos en el HTML
    const logContent = document.getElementById('log-content');
    if (logContent) logContent.innerHTML = '';
    
    // 3. Toque de inicio nuevo
    addLog("¡LA BATALLA COMIENZA DE NUEVO!", "SISTEMA", "system");

    // 4. Volver a despertar la Inteligencia Artificial (Que se había apagado por el HP de la partida anterior)
    planEnemyAttack();
}