
// Al igual que en el Stage 1, el trabajo de este archivo
// es única y exclusivamente manipular etiquetas HTML para no contaminar al motor battle.js.
// Ningún cálculo lógico se hace acá, solo se pintan datos en pantalla

import { TYPE_COLORS } from "../stage-1/render.js";

export function renderBattlefield(playerData, opponentData) {
    
    // 1. Inyectamos los nombres en el HTML
    document.getElementById('player-name').textContent = playerData.name;
    document.getElementById('opponent-name').textContent = opponentData.name;

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

export function updateHealthBar(targetId, newHP) {
    // Actualiza visualmente el tamaño (ancho %) de la barra de vida en pantalla
}
