'use strict';

import Hapi from '@hapi/hapi';
import routes from './src/api/notes/routes';

const init = async () : Promise<void> => {
  const server : Hapi.Server =  Hapi.server({
    port: 9000,
    host : 'localhost',
    routes : {
      cors : {
        origin : ['*'],
      }
    }
  });


  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada port ${server.info.uri}`);
};


init();