import { Pool } from 'pg'
import { nanoid } from 'nanoid';
import type { AddBook, InputBook } from '../../interface/interface';


class BooksService {
  private _pool: any
  constructor() {
    this._pool = new Pool();
  }

  // add new Book
  async addBook(input: AddBook) {
    const id: string = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO books VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, input.title, input.body, input.tags, createdAt, updatedAt]
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }
}
