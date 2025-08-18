import { nanoid } from 'nanoid';
import type { Book, BookPayload, BookQuery, BookParams } from "../../interface/interface.js";
import books  from './books.js';
import Hapi from "@hapi/hapi";


export const addBookHandler  = (request : Hapi.Request, h : Hapi.ResponseToolkit) => {

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload as BookPayload;
  
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage) ? true : false;

  const newBook : Book = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  if (!name) {
    const response = h.response({
      status    : 'fail',
      message   : 'Gagal menambahkan buku. Mohon isi nama buku'
    });

    response.code(400);
    return response;
  }


  if (readPage>pageCount) {
    const response = h.response({
      status  : 'fail',
      message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book)=> book.id===id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status : 'success',
      message : 'Buku berhasil ditambahkan',
      data : {
        bookId : id,
      }
    });
    response.code(201);
    return response;
  }
};

export const getBooksHandler = (request : Hapi.Request, h : Hapi.ResponseToolkit) => {
  const { reading, finished, name } = request.query as BookQuery;

  let filteredBooks : Book[] = books;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (String(reading) === '1'));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (String(finished) === '1'));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

export const getBookByIdHanlder = (request : Hapi.Request, h : Hapi.ResponseToolkit) => {
  const { bookId } = request.params as BookParams;

  const book = books.filter((b)=>b.id===bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status : 'fail',
      message : 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status : 'success',
    data : {
      book : book
    }
  });

  response.code(200);
  return response;
};

export const updateBookById = (request : Hapi.Request, h : Hapi.ResponseToolkit) => {

  const { bookId } = request.params as BookParams;
  const payload = request.payload as BookPayload;
  const { name, pageCount, readPage} = payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book)=>book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  if (name === undefined || name.trim() === '') {
    const response = h.response({
      status : 'fail',
      message : 'Gagal memperbarui buku. Mohon isi nama buku'
    });

    response.code(400);
    return response;
  }

  if (readPage>pageCount) {
    const response = h.response({
      status  : 'fail',
      message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  books[index] = {
    ...books[index]!,
    ...payload,
    finished : pageCount === readPage,
    updatedAt
  };


  const response = h.response({
    status : 'success',
    message : 'Buku berhasil diperbarui'
  });
  response.code(200);
  return response;
};


export const deleteBookById = (request : Hapi.Request, h : Hapi.ResponseToolkit) => {
  const { bookId } = request.params;

  const index = books.findIndex((book)=>book.id===bookId);


  if (index===-1){
    const response = h.response({
      status : 'fail',
      message : 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  if (bookId === undefined) {
    const response = h.response({
      status : 'fail',
      message : 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status : 'success',
    message : 'Buku berhasil dihapus'
  });
  response.code(200);
  return response;
};

