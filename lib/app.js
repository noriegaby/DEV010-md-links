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
  
  async function listMarkdownFilesInDirectory(directoryPath) {
    const absolutePath = resolvePath(directoryPath);
  
    try {
      // Verificar si el directorio existe de manera asíncrona
      const stats = await fs.promises.stat(absolutePath);
  
      if (!stats.isDirectory()) {
        throw new Error('La ruta proporcionada no es un directorio válido.');
      }
  
      // Leer el directorio de manera asíncrona y obtener la lista de archivos
      const files = await fs.promises.readdir(absolutePath);
  
      // Filtrar los archivos que tengan la extensión ".md"
      const markdownFiles = files.filter((file) => file.toLowerCase().endsWith('.md'));
  
      return markdownFiles;
    } catch (error) {
      throw error;
    }
  }
  

function unirRutas(ruta1, ruta2) {
  // Utiliza path.join para unir las dos rutas
  return path.join(ruta1, ruta2);
}


  
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
