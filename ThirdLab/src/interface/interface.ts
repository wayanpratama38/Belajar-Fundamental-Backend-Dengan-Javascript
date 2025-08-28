import type { Register } from "./booksInterface";

/**
 * Interface yang membentuk buku
 * @property {string} id - ID unik untuk buku, terdiri dari 16 karakter.
 * @property {string} name - Judul dari buku.
 * @property {number} year - Tahun buku diterbitkan.
 * @property {string} author - Penulis buku.
 * @property {string} summary - Ringkasan singkat isi buku.
 * @property {string} publisher - Penerbit buku.
 * @property {number} pageCount - Jumlah total halaman buku.
 * @property {number} readPage - Halaman terakhir yang telah dibaca.
 * @property {boolean} finished - Status apakah buku sudah selesai dibaca.
 * @property {boolean} reading - Status apakah buku sedang dibaca.
 * @property {string} insertedAt - Tanggal buku ditambahkan (format ISO String).
 * @property {string} updatedAt - Tanggal buku terakhir diperbarui (format ISO String).
 */
interface Book {
  id: string,
  name: string,
  year: number,
  author: string,
  summary: string,
  publisher: string,
  pageCount: number,
  readPage: number,
  finished: boolean,
  reading: boolean,
  insertedAt: string,
  updatedAt: string,
}


/**
 * Input when creating new book
 * No id or timestamps yet - it will be generated in services
 */
interface InputBook {
  name: string;
  year: number;
  author: string;
  summary: string;
  publisher: string;
  pageCount: number;
  readPage: number;
  reading: boolean;
}

interface BookPayload {
  name: string,
  year: number,
  author: string,
  summary: string,
  publisher: string,
  pageCount: number,
  readPage: number,
  reading: boolean
}


interface BookQuery {
  reading: boolean,
  finished: boolean,
  name: string,
}

interface BookParams {
  bookId: string
}


// interface AddBook {
//   title: String,
//   body: String,
//   tags: String,
// }

interface BooksValidatorInterface {
  validatePayload(payload: InputBook | Partial<InputBook>): void
}

interface UsersValidatorInterface {
  validatePayload(payload : Register) : void
}

export type { Book, BookPayload, BookQuery, BookParams, InputBook, BooksValidatorInterface, UsersValidatorInterface };
