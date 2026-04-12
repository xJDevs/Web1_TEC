// ==========================================
// main.js: ENTRY POINT / CONTROLADOR PRINCIPAL
// ==========================================

// Este es el punto de entrada principal que conecta todo (el Entry Point).
// Básicamente se encarga de importar herramientas como la API o los renderizadores,
// y decirle a la página en qué orden exacto arrancar todo el proceso.
// Se usa la importación de módulos para traer la configuración central del proyecto

// Importamos la configuración del entrenador (nombre, pokémon favorito, etc.)
import TRAINER_CONFIG from '../trainer.config.js'; 

// Sintaxis de Desestructuración con llaves { }: 
// A diferencia de la importación anterior (que pasa un objeto entero por default),
// aquí se extraen únicamente { funciones específicas }  (estrategia para ahorrar memoria)
// Es necesario escribir sus nombres exactos

import { fetchPokemonData } from './api.js';
import { drawPlayerCard, drawOpponentCard, clearOpponentStyles, renderTrainerCard } from './render.js';


// Este bloque opera como una medida de seguridad vital en JavaScript Vanilla.
// "DOMContentLoaded" garantiza que el script espere a que todo el esqueleto HTML sea procesado/cargado por completo
// Intentar manipular elementos gráficos antes de esto generaría el clásico error colapsador: "Cannot set properties of null".
document.addEventListener('DOMContentLoaded', async () => {
    
    // Inicialización del controlador de lógica (Fase 1).
    console.log("Archivos de Stage 1 renderizados. Identidad precargada:", TRAINER_CONFIG.name);


    // se renderiza el trainer card 
    renderTrainerCard(TRAINER_CONFIG);

    // ==========================================
    //           GESTIÓN DE ESTADO GLOBAL
    // ==========================================

    // Se tulizaran para guardar la data de los pokemones en el storage del navegador 
    let PlayerPokemonDataGlobal = null; 
    let RivalPokemonDataGlobal = null; 



    // ==========================================
    // BLOQUE 1: CARGA AUTOMÁTICA DEL JUGADOR
    // ==========================================

    // Encendemos el esqueleto de carga y apagamos el contenido viejo
    document.getElementById('player-content').classList.add('hidden');
    document.getElementById('player-skeleton').classList.remove('hidden');

    // Traemos la data desde la POKE API pasando como parametro el nombre de mi Pokemon 
    const playerPokemonData = await fetchPokemonData(TRAINER_CONFIG.favoritePokemon);
    
    if (playerPokemonData) {
        PlayerPokemonDataGlobal = playerPokemonData; // Guardamos el resultado del fetch en la variable global
        drawPlayerCard(playerPokemonData); // funcion que se encarga de renderizar la data en el html
    }

    // ==========================================
    //           CONEXIÓN DEL BUSCADOR 
    // ==========================================

    // 1. Obtenemos los elementos del HTML
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('pokemon-search-input');
    const searchError = document.getElementById('search-error');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const playerStartBattleBtn = document.getElementById('player-start-battle-btn');



    // ==========================================
    //           D E B O U N C E 
    // ==========================================

    // Variables de estado del sistema de búsqueda en vivo
    // Viven fuera de los callbacks para persistir entre ejecuciones

    let debounceTimer = null;     // Guarda el ID del setTimeout activo para poder referenciarlo y cancelarlo
    let activeController = null;  // Guarda el AbortController del fetch en vuelo para poder referenciarlo y matarlo

    // Escucha cada tecla del usuario
    searchInput.addEventListener('input', async () => {

        // Limpieza visual: ocultar errores y botón de combate de búsquedas anteriores
        searchError.classList.add('hidden');
        startBattleBtn.classList.add('hidden');

        const query = searchInput.value.trim().toLowerCase();
        if (!query) return; // Caja vacía no hacer nada

        // ---- CAPA 1: DEBOUNCE ----
        // Cancela el timer anterior y crea uno nuevo de 300ms.
        // Solo si el usuario para de tipear ≥300ms, el código de adentro se ejecuta.
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {

            // ---- CAPA 2: ABORTCONTROLLER ----
            if (activeController) activeController.abort();
            
            // Aislar el controlador para esta ejecución específica
            const myController = new AbortController();
            activeController = myController;

            document.getElementById('opponent-content').classList.add('hidden');
            document.getElementById('opponent-skeleton').classList.remove('hidden');

            // ---- CAPA 3: FETCH PROTEGIDO ----
            const opponentData = await fetchPokemonData(query, myController.signal);

            // Validar usando nuestro propio controlador local aislado, no el global que cambia
            if (myController.signal.aborted) return;

            if (opponentData === null) {

                searchError.classList.remove('hidden');
                document.getElementById('opponent-skeleton').classList.add('hidden');
                //  Resetear el título de nombre 
                document.getElementById('opponent-name').innerText = '? ? ?';
                clearOpponentStyles(); // setea los valores por defecto de la tarjeta del oponente

            } else {
                // Si todo salió bien, apagamos el esqueleto y encendemos la tarjeta
                drawOpponentCard(opponentData);
                startBattleBtn.classList.remove('hidden');
                // se guarda la data del pokemon rival en la variable global que se almacenara en browser storage
                RivalPokemonDataGlobal = opponentData; 
                playerStartBattleBtn.classList.remove('hidden'); 
                // se muestra el boton de iniciar batalla de mi pokemon
            }

        }, 300);
    });

    // BUSCADOR MANUAL (botón) — conservado como respaldo
    searchBtn.addEventListener('click', async () => {
        
        // Fase de Limpieza: Ocultar errores y botones viejos si se hace una nueva búsqueda
        searchError.classList.add('hidden');
        startBattleBtn.classList.add('hidden'); 
        
        // Atrapamos la palabra tipeada y la limpiamos 
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return; // Si la caja estaba vacía al tocar el botón, cancelamos el proceso

        // Encendemos el esqueleto del rival
        document.getElementById('opponent-content').classList.add('hidden');
        document.getElementById('opponent-skeleton').classList.remove('hidden');

        // 3. Corremos el tren asíncrono y le embutimos la palabra del usuario
        const opponentData = await fetchPokemonData(query);

        if (opponentData === null) {
            // Si el bloque Catch de api.js se quejó y nos devolvió NULL, destapamos el error rojo
            searchError.classList.remove('hidden');
            document.getElementById('opponent-skeleton').classList.add('hidden');
            document.getElementById('opponent-name').innerText = '? ? ?';

        } else {
            // A este punto, todo salio bien: Pasamos la data al dibujante y revelamos el botón "¡ESTOY LISTO!"
            drawOpponentCard(opponentData);
            startBattleBtn.classList.remove('hidden');
            RivalPokemonDataGlobal = opponentData;
        }
    });

        startBattleBtn.addEventListener('click', () => {
        // Validación de seguridad: si no hay rival en memoria, que no crashee la pagina 
        if (!RivalPokemonDataGlobal) return;

        // 1. Guardar en el storage del navegador
        localStorage.setItem('playerData', JSON.stringify(PlayerPokemonDataGlobal));
        localStorage.setItem('opponentData', JSON.stringify(RivalPokemonDataGlobal));

        // 2. Transición / Viaje físico cambiando la carpeta del URL
        window.location.href = '../stage-2/index.html';
    });



});