import {
  addBookHandler,
  deleteBookById,
  getBookByIdHanlder,
  getBooksHandler,
  updateBookById
} from './handler.js';
import Hapi, { type ServerRoute } from "@hapi/hapi";
import type { BookHandler } from '../../interface/handlerInterface.js';


// const routes : Hapi.ServerRoute[] = [
//   {
//     method : 'POST',
//     path : '/books',
//     handler : addBookHandler,
//     options: {
//       payload: {
//         parse: true,
//         allow: 'application/json'
//       }
//     }
//   },
//   {
//     method : 'GET',
//     path : '/books',
//     handler : getBooksHandler
//   },
//   {
//     method : 'GET',
//     path : '/books/{bookId}',
//     handler : getBookByIdHanlder
//   },
//   {
//     method : 'PUT',
//     path : '/books/{bookId}',
//     handler : updateBookById
//   },
//   {
//     method : 'DELETE',
//     path : '/books/{bookId}',
//     handler : deleteBookById,
//   }
// ];
// export default routes;



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


module.exports = routes;