const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); 

function resolvePath(filePath) {
  // Verificar si la ruta es absoluta, si no, convertirla
  return path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
}

function fileExists(absolutePath) {
  // Verificar si el archivo existe
  return fs.existsSync(absolutePath);
}

function isMarkdownFile(absolutePath) {
  // Verificar si el archivo es formato Markdown (extensión .md)
  return path.extname(absolutePath).toLowerCase() === '.md';
}

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
function validateLink(link) {
    // Esta función valida un enlace y retorna una promesa con la información del enlace validado.
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
  

module.exports = {
  resolvePath,
  fileExists,
  isMarkdownFile,
  readFileContent,
  extractLinksFromMarkdown,
  validateLink,
};
