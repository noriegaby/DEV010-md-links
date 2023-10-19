const mdLinks = require('./mdLinks'); // Importa la función mdLinks desde el archivo mdLinks.js
const program = require('commander');

program
  .version('1.0.0')
  .description('Un CLI para buscar links, status, file de un archivo .md en una ruta ingresada');

program
  .command('buscar <ruta>')
  .description('Procesa una ruta')
  .action((ruta) => {
    console.log('Ruta proporcionada:', ruta);
   
  
const filePath = ruta; // Ruta del archivo Markdown a procesar, la ingresa el usuario (node index.js procesar archivo.md)

mdLinks(filePath, { validate: true }) // Llama a la función mdLinks con la opción de validación habilitada
  .then((links) => {
    console.log('Enlaces encontrados:', links.length); // Imprime la cantidad de enlaces encontrados
    console.log(links); // Imprime la lista de enlaces, incluyendo información de validación
  })
  .catch((error) => {
    console.error('Error:', error); // Maneja errores e imprime un mensaje de error en la consola
  });

});
program.parse(process.argv);
/*  se utiliza para tomar los argumentos de la línea de comandos que están en process.argv y procesarlos de acuerdo a las definiciones previamente establecidas en programa utilizando commander  */