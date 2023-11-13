// Importar funciones desde el módulo 'app' 
const {
  resolvePath,
  fileExists,
  isMarkdownFile,
  readFileContent,
  extractLinksFromMarkdown,
  validateLink,
} = require('./lib/app');

// Función principal para buscar y extraer enlaces en un archivo Markdown
function mdLinks(filePath, options = {}) {
  // Resuelve la ruta del archivo de relativa a una ruta absoluta
  const absolutePath = resolvePath(filePath);

  // Verificar si el archivo existe
  if (!fileExists(absolutePath)) {
    // Retornar una promesa rechazada si la ruta no es válida o el archivo no existe
    return Promise.reject(new Error('Ruta no válida. El archivo no existe.'));
  }

  // Verificar si el archivo es un archivo Markdown
  if (!isMarkdownFile(absolutePath)) {
    // Retornar una promesa rechazada si el archivo no es un archivo Markdown
    return Promise.reject(new Error('El archivo no es Markdown (.md).'));
  }

  // Leer el contenido del archivo
  return readFileContent(absolutePath)
    .then((data) => {
      // Verificar si el archivo está vacío
      if (!data.trim()) {
        // Retornar una promesa rechazada si el archivo está vacío
        return Promise.reject(new Error('Archivo vacío.'));
      }

      // Extraer y retornar los enlaces del archivo Markdown
      const links = extractLinksFromMarkdown(absolutePath);

      // Si la opción de validación es true
      if (options.validate) {
        // Validar cada enlace y retornar una promesa para cada validación
        const linkPromises = links.map((link) => validateLink(link));
        return Promise.all(linkPromises);
      }

      // Si la opción de validación es false, retornar solo los enlaces
      return Promise.resolve(links);
    });
}

// Exportar la función mdLinks para que sea utilizada en index.js
module.exports = mdLinks;
