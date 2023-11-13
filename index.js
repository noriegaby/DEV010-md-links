// Importar módulos y funciones necesarias
const mdLinks = require('./mdLinks');
const program = require('commander'); //consola
const { listMarkdownFilesInDirectory, unirRutas } = require('./lib/app');

// Configuración básica del programa y descripción
program
  .version('1.0.0')
  .description('Un CLI para buscar links, status, file de un archivo .md en una ruta ingresada');

// Comando 'buscar' que procesa una ruta y busca enlaces en archivos Markdown
program
  .command('buscar <ruta> [validate]')
  .description('Procesa una ruta')
  .action((ruta, validate) => {
    const filePath = ruta;
    const validateOption = validate === 'true';

    console.log('Ruta proporcionada:', filePath);
    console.log('Opción validate:', validateOption);

    // Llamar a la función 'mdLinks' para buscar enlaces en la ruta especificada
    mdLinks(filePath, { validate: validateOption })
      .then((links) => {
        // Mapear los enlaces para mostrar información específica
        const linkData = links.map((link) => {
          return {
            href: link.href,
            text: link.text,
            file: link.file,
            status: validateOption ? link.status : 'N/A', // Mostrar el estado solo si se selecciona la opción 'validate' true
            ok: validateOption ? `${link.status === 200 ? 'ok' : 'fail'}` : 'N/A', // Mostrar 'ok' si el estado es 200, 'fail' de lo contrario
          };
        });

        console.log('Enlaces encontrados:', links.length);
        console.table(linkData); // Mostrar los enlaces en una tabla
      })
      .catch((error) => {
        console.error('Error:', error); // Manejar errores en la búsqueda de enlaces
      });
  });

// Comando 'listar-archivos' que lista los archivos .md en un directorio
program
  .command('listar-archivos <ruta>')
  .description('Lista los archivos .md en un directorio')
  .action((ruta) => {
    const directoryPath = ruta;

    // Utilizar la función 'listMarkdownFilesInDirectory' para obtener la lista de archivos Markdown
    listMarkdownFilesInDirectory(directoryPath)
      .then((markdownFiles) => {
        console.log('Archivos Markdown encontrados en el directorio:', markdownFiles.length);
        console.log('Lista de archivos Markdown:');
        console.log(markdownFiles);
      })
      .catch((error) => {
        console.error('Error:', error); // Manejar errores en la lista de archivos
      });
  });

// Comando 'unir-rutas' que une dos rutas
program
  .command('unir-rutas <ruta1> <ruta2>')
  .description('Une dos rutas')
  .action((ruta1, ruta2) => {
    // Llama a la función 'unirRutas' para combinar dos rutas
    const rutaCompleta = unirRutas(ruta1, ruta2);
    console.log('Ruta completa:', rutaCompleta);
  });

// Analizar los argumentos ingresados en la línea de comandos
program.parse(process.argv);
