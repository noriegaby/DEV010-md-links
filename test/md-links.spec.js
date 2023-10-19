const {
  resolvePath,
  fileExists,
  isMarkdownFile,
  readFileContent,
  extractLinksFromMarkdown, 
  validateLink,
} = require('../lib/app'); 

const path = require('path');
const fs = require('fs'); 


describe('resolvePath', () => {
  it('debería convertir una ruta relativa en una absoluta', () => {
    const relativePath = 'miArchivo.md';
    const absolutePath = resolvePath(relativePath);
    expect(path.isAbsolute(absolutePath)).toBe(true);
  });

  it('debería mantener una ruta absoluta sin cambios', () => {
    const absolutePath = '/ruta/absoluta/miArchivo.md';
    const result = resolvePath(absolutePath);
    expect(result).toBe(absolutePath);
  });
});

describe('fileExists', () => {
  it('debería retornar true si el archivo existe', () => {
    const filePath = 'ejemplo.md'; 
    const absolutePath = resolvePath(filePath);
    const result = fileExists(absolutePath);
    expect(result).toBe(true);
  });

  it('debería retornar false si el archivo no existe', () => {
    const filePath = 'archivoInexistente.md'; // Asegúrate de que este archivo no exista
    const absolutePath = resolvePath(filePath);
    const result = fileExists(absolutePath);
    expect(result).toBe(false);
  });
});

describe('isMarkdownFile', () => {
  it('debería retornar true para un archivo con extensión .md', () => {
    const filePath = 'miArchivo.md';
    const absolutePath = resolvePath(filePath);
    const result = isMarkdownFile(absolutePath);
    expect(result).toBe(true);
  });

  it('debería retornar false para un archivo sin extensión .md', () => {
    const filePath = 'miArchivo.txt';
    const absolutePath = resolvePath(filePath);
    const result = isMarkdownFile(absolutePath);
    expect(result).toBe(false);
  });
});


describe('readFileContent', () => {
  it('debería resolver con el contenido del archivo', async () => {
    const filePath = 'ejemplo.md'; 
    const absolutePath = resolvePath(filePath);
    const expectedContent = '[Node.js](https://nodejs.org/) Este es el contenido del archivo';
    
    // Simulamos la lectura de archivos utilizando jest.mock
    jest.mock('fs', () => ({
      promises: {
        readFile: async (path) => {
          if (path === 'archivoInexistente.md') {
            throw new Error('Error al leer el archivo');
          }
          return 'Contenido del archivo';
        },
      },
    }));
    

    const content = await readFileContent(absolutePath);
    expect(content).toBe(expectedContent);
  });

  it('debería rechazar con un error si ocurre un error al leer el archivo', async () => {
    const filePath = 'archivoInexistente.md'; // Asegúrate de que este archivo no exista
    const absolutePath = resolvePath(filePath);
    
    // Simulamos un error al leer el archivo
    jest.mock('fs', () => ({
      readFile: (callback) => {
        callback(new Error('Error al leer el archivo'), null);
      },
    }));

    await expect(readFileContent(absolutePath)).rejects.toThrow('Error al leer el archivo');
  });
});


describe('extractLinksFromMarkdown', () => {
  it('debería extraer enlaces correctamente de un archivo Markdown', () => {
    const tempFilePath = path.join(__dirname, 'temp.md'); // Ruta del archivo temporal

    // Contenido Markdown
    const markdownContent = `
      [link 1](https://link1.com)
      [link 2](https://link2.com)
      [link 3](https://link3.com)
    `;

    // Crea el archivo temporal
    fs.writeFileSync(tempFilePath, markdownContent, 'utf8');

    // Llama a la función para extraer enlaces
    const links = extractLinksFromMarkdown(tempFilePath);

    // Verifica que la función devuelva una lista de enlaces
    expect(Array.isArray(links)).toBe(true);

    // Verifica que se hayan extraído los enlaces correctamente
    expect(links).toEqual([
      { text: 'link 1', href: 'https://link1.com', file: tempFilePath },
      { text: 'link 2', href: 'https://link2.com', file: tempFilePath },
      { text: 'link 3', href: 'https://link3.com', file: tempFilePath },
    ]);

    // Elimina el archivo temporal después de la prueba
    fs.unlinkSync(tempFilePath);
  });

  it('debería retornar una lista vacía si el archivo Markdown no contiene enlaces', () => {
    const tempFilePath = path.join(__dirname, 'temp2.md'); // Ruta del archivo temporal

    // Contenido sin enlaces
    const markdownContent = 'Este archivo no contiene enlaces.';

    // Crea el archivo temporal
    fs.writeFileSync(tempFilePath, markdownContent, 'utf8');

    // Llama a la función para extraer enlaces
    const links = extractLinksFromMarkdown(tempFilePath);

    // Verifica que la función devuelva una lista vacía
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBe(0);

    // Elimina el archivo temporal después de la prueba
    fs.unlinkSync(tempFilePath);
  });
});


describe('validateLink', () => {
  test('debe validar un enlace existente correctamente', () => {
    const link = { text: 'Node.js', href: 'https://nodejs.org/' }; // Enlace de ejemplo

    return validateLink(link)
      .then((validatedLink) => {
        expect(validatedLink.status).toBe(200); // Comprueba el estado del enlace (código 200 para éxito)
        expect(validatedLink.ok).toBe('ok'); // Comprueba que el enlace está "ok"
      });
  });

  test('debe manejar un enlace inexistente correctamente', () => {
    const link = { text: 'Enlace inexistente', href: 'http://url_inexistente.com' }; // Enlace inexistente

    return validateLink(link)
      .then((validatedLink) => {
        expect(validatedLink.status).toBe('N/A'); // Comprueba que el estado es "N/A" (no disponible)
        expect(validatedLink.ok).toBe('fail'); // Comprueba que el enlace está en estado "fail"
      });
  });
});

