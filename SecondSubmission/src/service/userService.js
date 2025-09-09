import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import AuthorizationError from '../exceptions/authorizationError.js';
import ClientError from '../exceptions/clientError.js';
import AuthenticationError from '../exceptions/authenticationError.js';
import NotFoundError from '../exceptions/notFoundError.js';

export default class UserService {
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  async verifyUserId(userId) {
    const query = {
      text: `
        SELECT * FROM users WHERE id = $1
      `,
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async verifyUserCredential(username, password) {
    // VERIFY USERNAME
    const verifyQuery = {
      text: `
                SELECT id,password FROM users WHERE username = $1
            `,
      values: [username],
    };
    const verifyResult = await this._pool.query(verifyQuery);

    if (verifyResult.rowCount == 0) {
      throw new AuthenticationError('Username Tidak ditemukan!');
    }

    // VERIFY PASSWORD
    const { id, password: hashedPassword } = verifyResult.rows[0];
    const verifyPassword = await bcrypt.compare(password, hashedPassword);
    if (!verifyPassword) {
      throw new AuthenticationError('Password yang dimasukkan salah!');
    }

    return id;
  }

  async verifyUsername(username) {
    const query = {
      text: `
                SELECT * FROM users WHERE username = $1
            `,
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rowCount == 0) {
      return true;
    }
    return false;
  }

  async addUser(username, password, fullname) {
    const duplicateUsername = await this.verifyUsername(username);

    if (!duplicateUsername) {
      throw new ClientError('Username sudah digunakan');
    }
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `
                INSERT INTO users(id,username,password,fullname) 
                VALUES($1,$2,$3,$4)
                RETURNING id
            `,
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
}
