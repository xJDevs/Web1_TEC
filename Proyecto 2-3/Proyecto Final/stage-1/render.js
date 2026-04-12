// ==========================================
// render.js: EL PINTOR / MODIFICADOR DEL HTML

// Este archivo es el responsable de la manipulación del DOM
// Exporta funciones pequeñitas que únicamente se dedican a inyectar información 
// al HTML usando "document.getElementById". Así se evita que la lógica "pensante" 
// se ensucie con la lógica "dibujante"

// DICCIONARIO DE DATOS MAESTRO (Object Map)
// Almacena la relación entre los tipos de Pokémon y nuestra paleta de colores oficial.
// Se ubica intencionalmente en el Scope Global para que 
// cualquier función pueda leerlo como una constante universal
// sin tener que recrearlo en memoria múltiples veces. Reemplaza el uso de 18 condicionales if/else
    
export const TYPE_COLORS = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705898',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};


export function drawPlayerCard(pokemonData) {


    // 1. Mapeamos las etiquetas vacías del HTML usando sus IDs únicos
    const nameEl = document.getElementById('player-name');
    const spriteEl = document.getElementById('player-sprite');
    const typesEl = document.getElementById('player-types');
    const hpBarEl = document.getElementById('player-hp-bar');
    const cardEl = document.getElementById('player-card')
    const hpSpan = document.getElementById('player-hp-label')
    const playerBattleBtn = document.getElementById('player-start-battle-btn')
    
    // Elementos requeridos de Fase 1
    const extraStatsEl = document.getElementById('player-extra-stats');
    const movesEl = document.getElementById('player-moves');

    // Se le da color al player card
    // Se extrae el color principal de mi pokemon
    const primaryColor = TYPE_COLORS[pokemonData.types[0]]
    cardEl.style.setProperty('--type-color', primaryColor) // aplica esta regla de color a todo el css "card"

    cardEl.style.border = 'solid';
    cardEl.style.borderColor = primaryColor // border color no existe en "card", se tiene que declarar explicitamente
    cardEl.style.boxShadow = `0 0 12px ${primaryColor}`

    hpBarEl.style.backgroundColor = primaryColor
    hpBarEl.style.boxShadow = `0 0 12px ${primaryColor}`

    hpSpan.style.color = primaryColor
    hpSpan.style.textShadow = `0 0 12px ${primaryColor}`

    typesEl.style.color = primaryColor
    typesEl.style.textShadow = `0 0 12px ${primaryColor}`

    nameEl.style.textShadow = `0 0 12px ${primaryColor}`  // desplazamiento + desenfoque + color: efecto neon

    playerBattleBtn.style.background = primaryColor
    playerBattleBtn.style.boxShadow = `0 4px 0 ${primaryColor}99`; // 99 = 60% opacidad en hex
    playerBattleBtn.style.color = '#0D0F14'; 
    


    // 2. Inyectamos textos directamente en el DOM 
    // La propiedad nativa '.innerText' elimina los placeholders ('---' o '???')
    // ubicados en el HTML y sobreescribe de manera instantánea la pantalla con el contenido real 
    nameEl.innerText = `${pokemonData.name}`;
    typesEl.innerText = pokemonData.types.join(' | '); // Une la lista separándola con "|"

    // Inyectamos las base stats con algo de arte ASCII para decoración y los 4 movimientos obligatorios
    extraStatsEl.innerHTML = `ATK: <strong>${pokemonData.attack}</strong> | DEF: <strong>${pokemonData.defense}</strong> | SPD: <strong>${pokemonData.speed}</strong>`;
    movesEl.innerHTML = `MOVES: <strong>${pokemonData.moves.map(m => m.name).join(', ')}</strong>`;
    
    // Mini-estilos inyectados directamente
    extraStatsEl.classList.add('hp-label');
    extraStatsEl.style.color = primaryColor;
    extraStatsEl.style.fontSize = '0.5rem';
    extraStatsEl.style.marginTop = '12px';
    extraStatsEl.style.textAlign = 'center';
    extraStatsEl.style.textShadow = `0 0 12px ${primaryColor}`
    
    movesEl.classList.add('hp-label');
    movesEl.style.color = primaryColor
    movesEl.style.fontSize = '0.5rem';
    movesEl.style.marginTop = '6px';
    movesEl.style.textAlign = 'center';
    movesEl.style.opacity = '0.8';
    movesEl.style.textShadow = `0 0 12px ${primaryColor}`

    // 3. Inyectamos la dirección de la foto traída de internet directamente al atributo 'src'
    spriteEl.src = pokemonData.imgUrl;
    
    // 4. Quitamos la clase utilitaria '.hidden'
    // Al quitarle esa restricción, el navegador dibuja la imagen de inmediato
    spriteEl.classList.remove('hidden');

    // 5. Reiniciamos visualmente la barra de vida a su máxima capacidad
    hpBarEl.style.width = '100%';

    // 6. Ocultamos el esqueleto de carga temporal y revelamos el contenido real
    document.getElementById('player-skeleton').classList.add('hidden');
    document.getElementById('player-content').classList.remove('hidden');
}

export function drawOpponentCard(pokemonData) {
    // Obtenemos elementos rivales 
    const nameEl = document.getElementById('opponent-name');
    const spriteEl = document.getElementById('opponent-sprite');
    const typesEl = document.getElementById('opponent-types');
    const hpBarEl = document.getElementById('opponent-hp-bar');
    const cardEl = document.getElementById('opponent-card')
    const hpSpan = document.getElementById("opponent-hp-label")
    
    // stats requeridos de Fase 1 para el rival
    const extraStatsEl = document.getElementById('opponent-extra-stats');
    const movesEl = document.getElementById('opponent-moves');
    

    const primaryOpColor = TYPE_COLORS[pokemonData.types[0]]

    cardEl.style.border = 'solid';
    cardEl.style.borderColor = primaryOpColor 
    cardEl.style.boxShadow = `0 0 12px ${primaryOpColor}`

    nameEl.style.textShadow = `0 0 12px ${primaryOpColor}`

    hpBarEl.style.backgroundColor = primaryOpColor
    hpBarEl.style.boxShadow = `0 0 12px ${primaryOpColor}`
    

    hpSpan.style.color = primaryOpColor
    hpSpan.style.textShadow = `0 0 12px ${primaryOpColor}`
    
    typesEl.style.color = primaryOpColor
    typesEl.style.textShadow = `0 0 12px ${primaryOpColor}`
    
 
    

  nameEl.innerText = pokemonData.name;
  typesEl.innerText = pokemonData.types.join(' | ');
  
  extraStatsEl.innerHTML = `ATK: <strong>${pokemonData.attack}</strong> | DEF: <strong>${pokemonData.defense}</strong> | SPD: <strong>${pokemonData.speed}</strong>`;

  movesEl.innerHTML = `MOVES: <strong>${pokemonData.moves.map(m => m.name).join(', ')}</strong>`;

  extraStatsEl.classList.add('hp-label');
  extraStatsEl.style.color = primaryOpColor;
  extraStatsEl.style.fontSize = '0.5rem';
  extraStatsEl.style.marginTop = '12px';
  extraStatsEl.style.textAlign = 'center';
  extraStatsEl.style.textShadow = `0 0 12px ${primaryOpColor}`

  movesEl.classList.add('hp-label');
  movesEl.style.color = primaryOpColor;
  movesEl.style.fontSize = '0.5rem';
  movesEl.style.marginTop = '6px';
  movesEl.style.textAlign = 'center';
  movesEl.style.opacity = '0.8';
  movesEl.style.textShadow = `0 0 12px ${primaryOpColor}`
 
  spriteEl.src = pokemonData.imgUrl;
  spriteEl.classList.remove('hidden');

  // Revelamos el HP que estaba oculto hasta encontrar un oponente
  document.getElementById('opponent-stats').classList.remove('hidden');
  hpSpan.classList.remove('hidden');

  hpBarEl.style.width = '100%';

  // Ocultamos el esqueleto de carga del oponente y revelamos los verdaderos datos
  document.getElementById('opponent-skeleton').classList.add('hidden');
  document.getElementById('opponent-content').classList.remove('hidden');

  // El botón de batalla toma el color del tipo del oponente
  const battleBtn = document.getElementById('start-battle-btn');
  battleBtn.style.background = primaryOpColor;
  battleBtn.style.boxShadow = `0 4px 0 ${primaryOpColor}99`; // 99 = 60% opacidad en hex
  battleBtn.style.color = '#0D0F14'; 
}

// Función para limpiar los estilos del oponente
export function clearOpponentStyles() {
    const cardEl = document.getElementById('opponent-card');
    const nameEl = document.getElementById('opponent-name');
    
    // Al igualar una regla ".style" a comillas vacías '', el navegador la elimina por completo
    // obligando al bloque a volver a usar el gris predeterminado del archivo style.css
    cardEl.style.border = '';
    cardEl.style.boxShadow = '';
    nameEl.style.textShadow = '';
}

// Pintor de la Trainer Card
export function renderTrainerCard(config) {
    document.getElementById('trainer-card-name').innerText = `[ TRAINER: ${config.name.toUpperCase()} ]`;
    document.getElementById('trainer-card-hometown').innerText = `Origin: ${config.hometown}`;
    document.getElementById('trainer-card-catchphrase').innerText = `» ${config.catchphrase} «`;
}
