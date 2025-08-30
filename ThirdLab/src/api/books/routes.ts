
import Hapi, { type ServerRoute } from "@hapi/hapi";
import type { BookHandler } from '../../interface/handlerInterface.js';

// TYPESCRIPT
const routes = (handler: BookHandler) : ServerRoute[] => [
  {
    method : 'POST',
    path : '/books',
    handler : handler.postBookHandler
  },
  {
    method : 'GET',
    path : '/books',
    handler : handler.getBooksHandler
  },
  {
    method : 'GET',
    path : '/books/{id}',
    handler : handler.getBookByIdHandler
  },
  {
    method : 'PUT',
    path : '/books/{id}',
    handler : handler.putBookByIdHandler
  },
  {
    method : 'DELETE',
    path : '/books/{id}',
    handler : handler.deleteBookByIdHandler
  }
]


export default routes;