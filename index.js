const mdLinks = require('./mdLinks'); // Importa la función mdLinks desde el archivo mdLinks.js
const filePath = 'README.md'; // Ruta del archivo Markdown a procesar

mdLinks(filePath, { validate: true }) // Llama a la función mdLinks con la opción de validación habilitada
  .then((links) => {
    console.log('Enlaces encontrados:', links.length); // Imprime la cantidad de enlaces encontrados
    console.log(links); // Imprime la lista de enlaces, incluyendo información de validación
  })
  .catch((error) => {
    console.error('Error:', error); // Maneja errores e imprime un mensaje de error en la consola
  });
