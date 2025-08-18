'use strict';

import Hapi from '@hapi/hapi';
import BookServices from './src/services/inMemory/booksService';
import bookPlugin from "./src/api/notes/index"

const init = async () : Promise<void> => {
  const bookService = new BookServices()
  const server : Hapi.Server =  Hapi.server({
    port: 9000,
    host : 'localhost',
    routes : {
      cors : {
        origin : ['*'],
      }
    }
  });

  await server.register([{
    plugin : bookPlugin,
    options : {
      service : bookService
    }
  }
  ])
  await server.start();
  console.log(`Server berjalan pada port ${server.info.uri}`);
};


init();