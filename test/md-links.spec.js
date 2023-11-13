const {
  resolvePath,
  fileExists,
  isMarkdownFile,
  readFileContent,
  extractLinksFromMarkdown,
  validateLink,
  listMarkdownFilesInDirectory,
  unirRutas,
} = require('../lib/app'); 

const fs = require('fs');
const path = require('path');


//resolvePath:
describe('resolvePath', () => {
  it('debería convertir una ruta relativa en una absoluta', () => {
     // Arrange (Preparar) proporcionar la informacion 
    const relativePath = 'miArchivo.md';
     // Act (Actuar) usar las funciones
    const absolutePath = resolvePath(relativePath);
      // Assert (Afirmar) resultado esperado
    expect(path.isAbsolute(absolutePath)).toBe(true);
  });

  it('debería mantener una ruta absoluta sin cambios', () => {
    // Arrange (Preparar) proporcionar la informacion
    const absolutePath = '/ruta/absoluta/miArchivo.md';
    // Act (Actuar) usar las funciones
    const result = resolvePath(absolutePath);
    // Assert (Afirmar) resultado esperado
    expect(result).toBe(absolutePath);
  });
});

//fileExists:
describe('fileExists', () => {
  it('debería retornar true si el archivo existe', () => {
     // Arrange (Preparar) proporcionar la informacion
    const filePath = 'ejemplo.md'; 
     // Act (Actuar) usar las funciones
    const absolutePath = resolvePath(filePath);
    const result = fileExists(absolutePath);
     // Assert (Afirmar) resultado esperado
    expect(result).toBe(true);
  });

  it('debería retornar false si el archivo no existe', () => {
    // Arrange (Preparar) proporcionar la informacion
    const filePath = 'archivoInexistente.md'; // Asegúrate de que este archivo no exista
     // Act (Actuar) usar las funciones
    const absolutePath = resolvePath(filePath);
    const result = fileExists(absolutePath);
    // Assert (Afirmar) resultado esperado
    expect(result).toBe(false);
  });
});

//isMarkdownFile:
describe('isMarkdownFile', () => {
  it('debería retornar true para un archivo con extensión .md', () => {
    // Arrange (Preparar) proporcionar la informacion
    const filePath = 'miArchivo.md';
    // Act (Actuar) usar las funciones
    const absolutePath = resolvePath(filePath);
    const result = isMarkdownFile(absolutePath);
    // Assert (Afirmar) resultado esperado
    expect(result).toBe(true);
  });

  it('debería retornar false para un archivo sin extensión .md', () => {
     // Arrange (Preparar) proporcionar la informacion
    const filePath = 'miArchivo.txt';
    // Act (Actuar) usar las funciones
    const absolutePath = resolvePath(filePath);
    const result = isMarkdownFile(absolutePath);
    // Assert (Afirmar) resultado esperado
    expect(result).toBe(false);
  });
});

//readFileContent:
describe('readFileContent', () => {
  it('debería resolver con el contenido del archivo', async () => {
     // Arrange (Preparar) proporcionar la informacion
    const filePath = 'ejemplo.md'; 
    // Act (Actuar) usar las funciones
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
       // Assert (Afirmar) resultado esperado
    expect(content).toBe(expectedContent);
  });

  it('debería rechazar con un error si ocurre un error al leer el archivo', async () => {
     // Arrange (Preparar) proporcionar la informacion
    const filePath = 'archivoInexistente.md'; // Este archivo no existe
    // Act (Actuar) usar las funciones
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

//extractLinksFromMarkdown:
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

     // Assert (Afirmar) resultado esperado
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

//validateLink:
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

describe('listMarkdownFilesInDirectory', () => {
  it('debería listar archivos Markdown en un directorio válido', async () => {
    const tempDirPath = path.join(__dirname, 'tempDir'); // Ruta del directorio temporal

    // Crea un directorio temporal
    fs.mkdirSync(tempDirPath);

    // Crea archivos Markdown dentro del directorio temporal
    const markdownFiles = ['file1.md', 'file2.md', 'file3.txt'];
    for (const file of markdownFiles) {
      fs.writeFileSync(path.join(tempDirPath, file), 'Contenido del archivo', 'utf8');
    }

    // Llama a la función para listar archivos Markdown
    const result = await listMarkdownFilesInDirectory(tempDirPath);

    // Verifica que la función devuelva una lista de archivos Markdown
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2); // Debería haber dos archivos Markdown en el directorio

    // Elimina el directorio temporal después de la prueba
    fs.rmdirSync(tempDirPath, { recursive: true });
  });

  it('debería listar archivos Markdown en un directorio existente', async () => {
    const directoryPath = path.join(__dirname, '../docs'); 
    const markdownFiles = await listMarkdownFilesInDirectory(directoryPath);

    expect(Array.isArray(markdownFiles)).toBe(true);
    expect(markdownFiles).toHaveLength(5); // deben haber 5 archivos Markdown en el directorio de prueba
    expect(markdownFiles).toContain ["01-milestone.md", "02-milestone.md", "03-milestone.md", "04-milestone.md", "05-milestone.md"];

  });

  it('debería manejar un directorio sin archivos Markdown', async () => {
    const directoryPath = __dirname; // Directorio actual que no contiene archivos Markdown
    const markdownFiles = await listMarkdownFilesInDirectory(directoryPath);

    expect(Array.isArray(markdownFiles)).toBe(true);
    expect(markdownFiles).toHaveLength(0);
  });
});

describe('unirRutas', () => {
  // Arrange: Preparar los datos necesarios para la prueba
  it('debería unir dos rutas correctamente', () => {
    // Arrange
    const ruta1 = 'ruta1';
    const ruta2 = 'ruta2';

    // Act: Realizar la acción o llamado a la función que se va a probar
    const rutaCompleta = unirRutas(ruta1, ruta2);
    
    // Assert: Verificar que el resultado obtenido es el esperado
    const expectedPath = 'ruta1\\ruta2';
    expect(rutaCompleta).toBe(expectedPath);
  });

  // Arrange: Preparar los datos necesarios para la prueba
  it('debería manejar rutas vacías', () => {
    // Arrange
    const ruta1 = '';
    const ruta2 = 'ruta2';

    // Act: Realizar la acción o llamado a la función que se va a probar
    const rutaCompleta = unirRutas(ruta1, ruta2);

    // Assert: Verificar que el resultado obtenido es el esperado
    expect(rutaCompleta).toBe('ruta2');
  });
});
