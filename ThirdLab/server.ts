'use strict';

import Hapi from '@hapi/hapi';
import BookServices from './src/services/postgres/booksService';
import bookPlugin from "./src/api/books/index"
import { BooksValidator } from './src/validator/books';
import { userPlugin } from './src/api/users';
import UsersService from './src/services/postgres/usersService';
import { UsersValidator } from './src/validator/users';

declare module 'bun' {
  interface ENV {
    PORT : number,
    HOST : string,
  }
}

const init = async () : Promise<void> => {
  const bookService = new BookServices();
  const userService = new UsersService();
  const server : Hapi.Server =  Hapi.server({
    port: process.env.PORT,
    host : process.env.HOST,
    routes : {
      cors : {
        origin : ['*'],
      }
    }
  });

  await server.register([
    {
      plugin : userPlugin,
      options : {
        service : userService,
        validator : UsersValidator
      },
    },
    {
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