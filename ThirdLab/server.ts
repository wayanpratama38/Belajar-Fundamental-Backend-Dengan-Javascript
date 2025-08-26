'use strict';

import Hapi from '@hapi/hapi';
import BookServices from './src/services/postgres/booksService';
import bookPlugin from "./src/api/notes/index"
import { BooksValidator } from './src/validator/books';

declare module 'bun' {
  interface ENV {
    PORT : number,
    HOST : string,
  }
}

const init = async () : Promise<void> => {
  const bookService = new BookServices()
  const server : Hapi.Server =  Hapi.server({
    port: process.env.PORT,
    host : process.env.HOST,
    routes : {
      cors : {
        origin : ['*'],
      }
    }
  });

  await server.register([{
    plugin : bookPlugin,
    options : {
      service : bookService,
      validator : BooksValidator
    }
  }
  ])
  await server.start();
  console.log(`Server berjalan pada port ${server.info.uri}`);
};


init();