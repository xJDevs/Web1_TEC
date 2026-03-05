
class Libro {
    constructor(titulo, autor, genero, anio) {
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.anio = anio;
        this.disponible = true;
    }

    info () {
        console.log(`${this.titulo} de ${this.autor} (${this.anio}) - ${this.disponible ? "Disponible" : "Pestado"}` ); 
    }
}

const harryPotter = new Libro("Harry Potter", "J.K. Rowling", "Fantasía", 1997);
const dune = new Libro("Dune", "Frank Herbert", "SciFi", 1965);
const foundation = new Libro("Foundation", "Isaac Asimov", "SciFi", 1951);
const elSenorDeLosAnillos = new Libro("El Señor de los Anillos", "J.R.R. Tolkien", "Fantasía", 1954);
const orgulloYPrejuicio = new Libro("Orgullo y Prejuicio", "Jane Austen", "Romance", 1813);
const cienAnosDeSoledad = new Libro("Cien Años de Soledad", "Gabriel García Márquez", "Realismo mágico", 1967);

class Biblioteca {
    constructor(nombre) {
        this.nombre = nombre;
        this.libros = [];
    }

    agregarLibro(Libro) {
        for (let i = 0; i < this.libros.length; i++) {
            if (this.libros[i].titulo === Libro.titulo) {
                console.error(`No se pudo agregar. El libro ${Libro.titulo} ya se encuentra en la base de datos`)
                return
            }
        }
        this.libros.push(Libro)
        console.log("Libro agregado"); 
        return
    }

    buscarPorGenero(genero) {
        const librosGenero = [];

        
        
    }
    
}
/* PRUEBAS 
const libreria = new Biblioteca ('MundoLibro')

libreria.agregarLibro(dune)
libreria.agregarLibro(dune)
libreria.agregarLibro(harryPotter)
*/ 