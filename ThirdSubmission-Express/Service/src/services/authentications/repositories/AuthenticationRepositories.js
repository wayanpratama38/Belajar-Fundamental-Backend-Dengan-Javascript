import { Pool } from 'pg';

export default new (class AuthenticationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  // Keep refresh token to database
  async addRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES ($1)',
      values: [refreshToken],
    };

    await this.pool.query(query);
  }

  // Delete refresh token from database
  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    await this.pool.query(query);
  }

  // Verify refresh token from database
  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    return (await this.pool.query(query)).rowCount > 0;
  }
})();
