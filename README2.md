# Markdown Links

## Índice

* [1. Descripción](#1-descripción)
* [2. Funcionalidades principales](#2-funcionalidades-principales)
* [3. ¿Cómo utilizar el programa?](#3-¿cómo-utilizar-el-programa?)

## 1. Descripción

Este programa está diseñado para trabajar con archivos Markdown, ofreciendo diversas funcionalidades útiles para gestionar y analizar estos archivos. A continuación, se proporciona una breve descripción de las funciones clave:

## 2. Funcionalidades Principales
# Resolución de Rutas
**Función: resolvePath**

Descripción: Convierte rutas relativas en rutas absolutas para asegurar la consistencia en la manipulación de archivos.
Verificación de Existencia de Archivo
**Función: fileExists**

Descripción: Verifica la existencia de un archivo en la ruta proporcionada.
Validación de Archivo Markdown
**Función: isMarkdownFile**

Descripción: Determina si un archivo en la ruta proporcionada tiene la extensión ".md", identificando así los archivos Markdown.
# Lectura de Contenido de Archivo
**Función: readFileContent**

Descripción: Lee el contenido de un archivo de manera asíncrona.
Extracción de Enlaces de Archivo Markdown
**Función: extractLinksFromMarkdown**

Descripción: Busca enlaces en un archivo Markdown utilizando expresiones regulares y devuelve una lista de objetos que contienen información sobre cada enlace.
# Validación de Enlace
**Función: validateLink**

Descripción: Valida un enlace haciendo una solicitud HTTP y proporciona información sobre el estado y la disponibilidad del enlace.
# Listado de Archivos Markdown en un Directorio
**Función: listMarkdownFilesInDirectory**

Descripción: Lista los archivos Markdown en un directorio específico.
Unión de Rutas
**Función: unirRutas**

Descripción: Utiliza path.join para combinar dos rutas y proporciona la ruta resultante.

## 3. ¿Cómo utilizar el programa?
**1. Descargar el directorio**
El programa está alojado en GitHub y se instala desde allí, puedes hacerlo mediante el siguiente comando npm:
*npm install noriegaby/DEV010-md-links*

**2. Buscar en un Archivo Markdown**
Para buscar enlaces en un archivo Markdown, utiliza el siguiente comando:
*node index.js buscar [RUTA_DEL_ARCHIVO] [VALIDAR_ENLACES]*

Ejemplo: node index.js buscar README.md true
Esto buscará enlaces en el archivo README.md y validará cada enlace.

**3. Buscar en un Archivo Markdown sin Validar Enlaces**
Si no deseas validar los enlaces al buscar, puedes hacerlo de la siguiente manera:
*node index.js buscar [RUTA_DEL_ARCHIVO] false*

Ejemplo: node index.js buscar README.md false
Esto buscará enlaces en el archivo README.md sin validar los enlaces.

**4. Listar Archivos Markdown en un Directorio**
Para listar los archivos Markdown en un directorio, utiliza el siguiente comando:
*node index.js listar-archivos [RUTA_DEL_DIRECTORIO]*

Ejemplo: node index.js listar-archivos .
Esto mostrará la lista de archivos Markdown en el directorio actual.

**5. Unir Rutas**
Para unir dos rutas, utiliza el siguiente comando:
*node index.js unir-rutas [RUTA1] [RUTA2]*

Ejemplo: node index.js unir-rutas /home/Laboratoria/ ./test
Esto unirá las rutas /home/Laboratoria/ y ./test, devolviendo la ruta combinada.
