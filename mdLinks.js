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
    // Resuelve la ruta del archivo
    const absolutePath = resolvePath(filePath);
  
    // Verificar si el archivo existe
    if (!fileExists(absolutePath)) {
      return Promise.reject(new Error('Ruta no válida. El archivo no existe.'));
    }
  
    // Verificar si el archivo es un archivo Markdown
    if (!isMarkdownFile(absolutePath)) {
      return Promise.reject(new Error('Formato incorrecto. El archivo no es Markdown (.md).'));
    }
  
    // Leer el contenido del archivo
    return readFileContent(absolutePath)
      .then((data) => {
        // Verificar si el archivo está vacío
        if (!data.trim()) {
          return Promise.reject(new Error('Archivo vacío.'));
        }
  
        // Extraer y retornar los enlaces del archivo Markdown
        const links = extractLinksFromMarkdown(absolutePath);
  
        // Si la opción de validación está habilitada
        if (options.validate) {
          const linkPromises = links.map((link) => validateLink(link));
          return Promise.all(linkPromises);
        }
  
        return Promise.resolve(links);
      });
  }
  
  module.exports = mdLinks;
  