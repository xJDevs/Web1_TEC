
class Libro {
    constructor(titulo, autor, genero, anio) {
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.anio = anio;
        this.disponible = true;
    }

    info () {
        return `${this.titulo} de ${this.autor} (${this.anio}) - ${this.disponible ? "Disponible" : "Prestado"}`; 
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
        genero = genero.toLowerCase();

        for (let i = 0; i < this.libros.length; i++) {
            if (this.libros[i].genero.toLowerCase() === genero) {
                librosGenero.push(this.libros[i]);
            }
    }
    console.log(librosGenero);
    return librosGenero;
}


    prestar(titulo) {


        for (let i = 0; i < this.libros.length; i++) {
        
        if (this.libros[i].titulo.toLowerCase() === titulo.toLowerCase()) {

            if (this.libros[i].disponible === false) {
                console.log(`El libro ${titulo} no esta disponible`);
                return
            }

            this.libros[i].disponible = false;
            console.log(`Libro ${titulo} prestado`);
            return 
        }
        
    };

    throw new Error(`El libro ${titulo} no existe en la base de datos`)
}


    estadisticas() {

        let disponibles = 0;
        let prestados = 0;

        for (let i = 0; i < this.libros.length; i++) {
            this.libros[i].disponible ? disponibles++ : prestados++
        }

        console.log(`=======RESUMEN======
Total de libros: ${this.libros.length}
Libros disponibles: ${disponibles}
Libros prestados: ${prestados}`);
    }

}

// Agregar 5 libros

const miBiblioteca = new Biblioteca("Mi Biblioteca");

miBiblioteca.agregarLibro(
    new Libro("Cien años de soledad", "García Márquez", "Ficción", 1967),
  );
  miBiblioteca.agregarLibro(
    new Libro("El código Da Vinci", "Dan Brown", "Thriller", 2003),
  );
  miBiblioteca.agregarLibro(
    new Libro("Breve historia del tiempo", "Stephen Hawking", "Ciencia", 1988),
  );
  // ... agrega 2 libros más de tu elección
  
  // Duplicado (debe mostrar error)
  miBiblioteca.agregarLibro(
    new Libro("El código Da Vinci", "Dan Brown", "Thriller", 2003),
  );
  
  // Prestar un libro y volver a intentarlo
  try {
    miBiblioteca.prestar("Cien años de soledad");
    miBiblioteca.prestar("Cien años de soledad"); // ya prestado
  } catch (error) {
    console.error("Error:", error.message);
  }
  
  // Estadísticas
  miBiblioteca.estadisticas();
    



