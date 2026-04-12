# README

**Live GitHub Pages URL**: [https://xjdevs.github.io/Web1_TEC/](https://xjdevs.github.io/Web1_TEC/)

**Your favorite Pokémon and why**
De niño mi papá me compraba figuritas de pokemon y una vez me compro un Darkrai, desde ese momento agarre afinidad al personaje. Ademas, su estilo y su concepto me gusta mucho.

**Your Definitive Move name, flavor text, and what inspired the name**
- **Name**: Dark Void
- **Flavor Text**: "READY FOR A NIGHTMARISH SLEEP!?"
- **Inspiration**: Me inspire por la tematica de Darkrai. Dark Void se traduce como un vacio negro, manda a dormir a sus oponentes en una pesadilla eterna en el vacio.

**For each of the three core concepts: where it appears in both stages, with file and approximate line number**

1. **POKEMON NAME**
   - **Stage 1**: Aparece en `stage-1/main.js` (~Línea 53) cuando se le solicita a la PokeAPI usar el nombre de tu `TRAINER_CONFIG.favoritePokemon`.
   - **Stage 2**: Aparece en `stage-2/render.js` (~Líneas 12-13) luego de extraerse de la memoria para renderizar tu nombre estático en la arena de batalla.

2. **DEFINITIVE MOVE NAME**
   - **Stage 1**: Únicamente declarado de manera global en el archivo de configuración `trainer.config.js` (~Línea 15).
   - **Stage 2**: Aparece en `stage-2/battle.js` (~Línea 166) en la constante `ultimateName` justo en el método principal donde desatas el ataque One-Hit KO.

3. **FLAVOR TEXT**
   - **Stage 1**: Declarado globalmente en `trainer.config.js` (~Línea 16).
   - **Stage 2**: Utilizado directamente en `stage-2/battle.js` (~Línea 170) para imprimir la anotación dramática en el panel inferior después del golpe.

**Known issues or incomplete parts**
- Hay un problema mínimo de FOUC (Flash of Unstyled Content) en el que al hacer refresh primero sale la pantalla sin estilo y medio segundo después recién se abren los elementos.
- Existió un bug donde el mensaje de alerta/error de la barra de búsqueda no desaparecía o se quitaba de la pantalla aunque ya se hubiese corregido o encontrado el pokemon.
- El LocalStorage tiene que borrarse manualmente; de lo contrario, el sistema asume que la sesión sigue abierta y sí permite ingresar directamente a la Fase 2 copiando el link desde la página principal saltándose todo el buscador.
