// ==========================================
// api.js: EL ENCARGADO DE HABLAR CON LA POKEAPI
// ==========================================

// Guardar la base de la URL en una constante para no repetirla en cada llamada a las rutas.
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Se usa "export async function" porque esta función hace consultas a una API externa,
// lo cual toma tiempo. Al declararla como "async" permite usar la palabra "await"
// (esperar la respuesta HTTP sin congelar la interfaz del navegador)
// y así evitar cadenas de promesas con ".then()"
export async function fetchPokemonData(pokemonName, signal = null) {
    // Manejamos posibles errores de red o nombres de Pokémon inexistentes
    try {
        // La API requiere que el nombre esté en minúsculas y sin espacios
        const cleanName = pokemonName.toLowerCase().trim();
        
        // El fetch básico para conectarse a la base de datos (método GET).
        // Usamos 'await' para decirle a JS: "Pause el código aquí y no siga
        // leyendo hacia abajo hasta que la PokeAPI devuelva el 100% de los datos"
        // Sin esto, el codigo seguiria ejecutandose y la variable estaria vacia (undefined) por no haber esperado la respuesta de la API
        
        // Se pasa el 'signal' del AbortController como opción del fetch
        // Si main.js cancela el controlador, el fetch lanza un AbortError automáticamente.

        const response = await fetch(`${POKEAPI_BASE}/pokemon/${cleanName}`, { signal });
        
        // Validamos la propiedad nativa 'ok' del paquete HTTP Response
        // Si el estado de conexión al servidor fracasa (Ej: Obtenemos un Error 404 No Encontrado), 
        // la propiedad '.ok' será Falsa devolviendo un (!response.ok = true).
        // Se ejecuta un "throw" para que el bloque 'catch' lo atrape inmediatamente.

        if (!response.ok) {
            throw new Error("Pokémon salvaje no encontrado");
        }
        
        // Se pausa el código nuevamente mientras el navegador descarga, abre y transforma
        // toda esa carga bruta de internet (JSON) en objetos nativos para poder leer la data
        const data = await response.json();
        
        
        // Cortamos el arreglo de movimientos para quedarnos solo con los primeros 4
       // ya que "moves" es un arreglo de movimientos
        const firstFourMoves = data.moves.slice(0, 4)

        // Creamos un array de promesas, donde cada promesa es una llamada a la API para obtener los detalles de cada movimiento
        const firstFourMovesPromises = firstFourMoves.map(move => fetch(move.move.url))
        const RAW_MOVES = await Promise.allSettled(firstFourMovesPromises) // Esperamos a que todas las promesas se resuelvan antes de continuar 

       // De los 4 reportes, nos quedamos SOLO con los que fueron exitosos
       const successMoves = RAW_MOVES.filter(move => move.status === 'fulfilled')

       
       // Se toma el .value de cada "response" que devuleven las 4 promesas, y lo abrimos con JSON 
       const PARSED_MOVES = await Promise.allSettled(successMoves.map(move => move.value.json()))


        // De casa JSON abierto y exitoso, nos quedamos solo con el nombre del movimiento
        const finalMoves = PARSED_MOVES
        .filter(result => result.status === 'fulfilled')
        .map(result => ({
            name: result.value.name,
            power: result.value.power || 10 // Si no tiene poder, le ponemos 10
        }))
       
 
        
        // Optimizamos memoria: filtramos el objeto gigante de la API y extraemos lo útil
        const filteredData = {
            name: data.name,
            imgUrl: data.sprites.front_default, // Sprite pixel-art clásico
            hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
            // Oiga JS: vaya a data, use stat para referenciar el elemento actual, abra la caja de "stat",
            // ubique name, si es igual a "attack", entonces tome el valor de base_stat
            attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
            defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
            speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,

            // '.map()' itera la lista sucia. Se usa una "Arrow Function" (Lambda) anónima: '(item => item.type.name)'
            // La variable 'item' la creo yo y la funcion se encarga de recorrer la lista de tipos y extraer el nombre
            types: data.types.map(item => item.type.name),

            // Array limpio de los 4 movimientos: cada uno con su nombre y poder de daño
            moves: finalMoves

        };

        console.log(filteredData)
        
        return filteredData;

    } catch (error) {
        // En caso de cancelación por AbortController, regresamos null tal cual manda el estándar
        if (error.name === 'AbortError') return null;
        
        console.error("Fallo local en api.js:", error.message);
        return null;
    }
}
