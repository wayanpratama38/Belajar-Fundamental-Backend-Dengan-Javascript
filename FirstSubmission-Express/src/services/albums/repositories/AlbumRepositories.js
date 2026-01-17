import { nanoid } from "nanoid";
import { Pool } from "pg";

export default new (class AlbumRepositories {
  constructor() {
    this.pool = new Pool();
  }

  // Create new album
  async createNewAlbum({ name, year }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO albums(id,name,year) VALUES ($1,$2,$3) RETURNING id",
      values: [id, name, year],
    };

    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Get album by id
  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id=$1",
      values: [id],
    };

    const result = (await this.pool.query(query)).rows[0];

    return result;
  }

  // Update album by id
  async updateAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id",
      values: [name, year, id],
    };

    return (await this.pool.query(query)).rows[0];
  }

  // DElete album by id
  async deleteAlbumById(id) {
    const query = {
      text: "DELETE * FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    return (await this.pool.query(query)).rows[0];
  }
})();
