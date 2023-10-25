const mdLinks = require('./mdLinks');
const program = require('commander');

program
  .version('1.0.0')
  .description('Un CLI para buscar links, status, file de un archivo .md en una ruta ingresada');

program
  .command('buscar <ruta> [validate]')
  .description('Procesa una ruta')
  .action((ruta, validate) => {
    const filePath = ruta;
    const validateOption = validate === 'true';

    console.log('Ruta proporcionada:', filePath);
    console.log('Opción validate:', validateOption);

    mdLinks(filePath, { validate: validateOption })
      .then((links) => {
        const linkData = links.map((link) => {
          return {
            href: link.href,
            text: link.text,
            file: link.file,
            status: validateOption ? link.status : 'N/A',
            ok: validateOption ? `${link.status === 200 ? 'ok' : 'fail'}` : 'N/A',
          };
        });

        console.log('Enlaces encontrados:', links.length);
        console.table(linkData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

program.parse(process.argv);

