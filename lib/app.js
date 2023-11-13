const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); 

// Función para resolver la ruta de un archivo
function resolvePath(filePath) {
  // Verificar si la ruta es absoluta; si no, convertirla en una ruta absoluta
  return path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
}

// Función para verificar si un archivo existe en la ruta proporcionada
function fileExists(absolutePath) {
  // Verificar si el archivo existe
  return fs.existsSync(absolutePath);
}

// Función para verificar si un archivo tiene la extensión ".md" (formato Markdown)
function isMarkdownFile(absolutePath) {
  return path.extname(absolutePath).toLowerCase() === '.md';
}

// Función para leer el contenido de un archivo de manera asíncrona y retornar una promesa
function readFileContent(absolutePath) {
  return new Promise((resolve, reject) => {
    // Leer el contenido del archivo
    fs.readFile(absolutePath, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Error al leer el archivo'));
      } else {
        resolve(data);
      }
    });
  });
}

// Función para extraer enlaces de un archivo Markdown
function extractLinksFromMarkdown(filePath) {
  // Leer el contenido del archivo especificado en filePath
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  // Expresión regular para encontrar enlaces
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s^)]+)\)/g;
  const links = [];

  // Buscar todos los enlaces en el contenido del archivo
  let match;
  while ((match = linkRegex.exec(markdownContent)) !== null) {
    const text = match[1];
    const href = match[2];
    links.push({ text, href, file: filePath });
  }

  // Retorna la lista de enlaces encontrados
  return links;
}

// Función para validar un enlace y retornar una promesa con la información del enlace validado
function validateLink(link) {
  return fetch(link.href)
    .then((response) => {
      link.status = response.status;
      link.ok = response.ok ? 'ok' : 'fail';
      return link;
    })
    .catch((error) => {
      link.status = 'N/A'; // Si ocurre un error, el estado es "N/A" (no disponible)
      link.ok = 'fail';
      return link;
    });
}

function listMarkdownFilesInDirectory(directoryPath) {
  // Resuelve la ruta del directorio para garantizar que sea una ruta absoluta
  const absolutePath = resolvePath(directoryPath);

  // Devolver una nueva promesa asíncrona
  return new Promise((resolve, reject) => {
    // Verificar si el directorio existe
    fs.promises.stat(absolutePath)
      .then((stats) => {
        // Verificar si la ruta proporcionada es un directorio válido
        if (!stats.isDirectory()) {
          // Rechazar la promesa si no es un directorio valido
          reject(new Error('La ruta proporcionada no es un directorio válido.'));
        } else {
          // Leer el directorio de manera asíncrona y obtener la lista de archivos
          return fs.promises.readdir(absolutePath);
        }
      })
      .then((files) => {
        // Filtrar los archivos que tengan la extensión ".md"
        const markdownFiles = files.filter((file) => file.toLowerCase().endsWith('.md'));
        
        // Resolver la promesa con la lista de archivos Markdown
        resolve(markdownFiles);
      })
      .catch((error) => {
        // Rechazar la promesa en caso de error
        reject(error);
      });
  });
}



// Función para unir dos rutas utilizando path.join
function unirRutas(ruta1, ruta2) {
  return path.join(ruta1, ruta2);
}

// Exportar las funciones para ser utilizadas en otros módulos
module.exports = {
  resolvePath,
  fileExists,
  isMarkdownFile,
  readFileContent,
  extractLinksFromMarkdown,
  validateLink,
  listMarkdownFilesInDirectory,
  unirRutas,
};
