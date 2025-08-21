import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import type { InputBook, Book } from '../../interface/interface';

export default class BooksService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();
  }

  // Add new book
  async addBook(input: InputBook): Promise<string> {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = input.pageCount === input.readPage;

    const query = {
      text: `
        INSERT INTO books
        (id, name, year, author, summary, publisher, "pageCount", "readPage", finished, reading, "insertedAt", "updatedAt")
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING id
      `,
      values: [
        id,
        input.name,
        input.year,
        input.author,
        input.summary,
        input.publisher,
        input.pageCount,
        input.readPage,
        finished,
        input.reading,
        insertedAt,
        updatedAt
      ]
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getAllBooks(): Promise<Book[]> {
    const result = await this._pool.query("SELECT * FROM books");
    return result.rows;
  }

  async getBookById(id: string): Promise<Book | null> {
    const query = {
      text: 'SELECT * FROM books WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async editBookById(id: string, input: Partial<InputBook>): Promise<void> {
    const updatedAt = new Date().toISOString();
    const finished = input.pageCount === input.readPage;

    const query = {
      text: `
        UPDATE books 
        SET name=$1, year=$2, author=$3, summary=$4, publisher=$5, "pageCount"=$6, "readPage"=$7, finished=$8, reading=$9, "updatedAt"=$10
        WHERE id=$11
        RETURNING id
      `,
      values: [
        input.name,
        input.year,
        input.author,
        input.summary,
        input.publisher,
        input.pageCount,
        input.readPage,
        finished,
        input.reading,
        updatedAt,
        id
      ]
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new Error("Book not found");
  }

  async deleteBookById(id: string): Promise<void> {
    const query = {
      text: 'DELETE FROM books WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new Error("Book not found");
  }
}
