import { nanoid } from "nanoid";
import { Pool } from "pg";

export default class SongsService {
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  async addSong(request) {
    const id = nanoid(16);
    const { title, year, genre, performer, duration, albumId } = request

    const query = {
      text: `
        INSERT INTO songs
        (id,title,year,genre,performer,duration,albumId) 
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id;
      `,
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId
      ]
    }
    const result = await this._pool.query(query);
  }

  async getAllSongs() {
    const result = this._pool.query("SELECT * FROM songs");
    return result;
  }

  async getSongById(id) {
    const query = {
      text : `
        SELECT * FROM songs WHERE id == $1
      `,
      values : [id]
    }
    const result = await this._pool.query(query)
    return result;
  }

  async updateSongById(id,request) { 
    const { title, year, genre, performer, duration, albumId } = request
    const query = {
      text : `
        UPDATE songs
        SET title=$1,year=$2,genre=$3,performer=$4,duration=$5,albumId=$6
        WHERE id == $7
        RETURNING id
      `,
      values : [title,year,genre,performer,duration,albumId,id]
    }  
    const result = await this._pool.query(query);
  }

  async deleteSong(id) {
    const query = {
      text : `
        DELETE * FROM songs WHERE id == $1
        RETURNING id
      `,
      values : [id]
    }
    const result = await this._pool.query(query);
  }
}
