import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import S3Service from '../../storage/S3Service.js';

export default new (class AlbumRepositories {
  constructor() {
    this.pool = new Pool();
  }

  // Verify album
  async verifyAlbumExistence(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [albumId],
    };

    return (await this.pool.query(query)).rowCount > 0;
  }

  // Create new album
  async createNewAlbum({ name, year }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO albums(id,name,year) VALUES ($1,$2,$3) RETURNING id',
      values: [id, name, year],
    };

    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Get album by id
  async getAlbumById(id) {
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [id],
    };

    const album = (await this.pool.query(albumQuery)).rows[0];
    if (!album) {
      return album;
    }
    const songQuery = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [album.id],
    };

    const songs = (await this.pool.query(songQuery)).rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    const response = {
      id: album.id,
      name: album.name,
      coverUrl: album.cover,
      year: album.year,
      songs,
    };

    return response;
  }

  // Update album by id
  async updateAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      values: [name, year, id],
    };

    return (await this.pool.query(query)).rows[0];
  }

  // DElete album by id
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    return (await this.pool.query(query)).rows[0];
  }

  // Add album cover
  async addAlbumCover(file, albumId) {
    const fileName = `${Date.now()}-${file.originalname}`;
    // console.log(file);
    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    const fileLocation = await S3Service.writeFile(file, {
      fileName,
      contentType: file.mimetype,
    });

    const query = {
      text: 'UPDATE albums SET cover=$1 WHERE id=$2',
      values: [fileLocation, albumId],
    };

    const result = (await this.pool.query(query)).rows;
    return result;
  }
})();
