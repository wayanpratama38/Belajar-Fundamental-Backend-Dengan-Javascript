import { nanoid } from "nanoid";
import { Pool } from "pg";

export default class SongsService {
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  async addSong(request) {
    const songId = nanoid(16);
    const { title, year, genre, performer, duration, albumId } = request

    const query = {
      text: `
        INSERT INTO songs
        (songId,title,year,genre,performer,duration,albumId) 
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING songId;
      `,
      values: [
        songId,
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

  async getSongById(songId) {
    const query = {
      text : `
        SELECT * FROM songs WHERE songId == $1
      `,
      values : [songId]
    }
    const result = await this._pool.query(query)
    return result;
  }

  async updateSongById(songId,request) { 
    const { title, year, genre, performer, duration, albumId } = request
    const query = {
      text : `
        UPDATE songs
        SET title=$1,year=$2,genre=$3,performer=$4,duration=$5,albumId=$6
        WHERE songId == $7
        RETURNING songId
      `,
      values : [title,year,genre,performer,duration,albumId,songId]
    }  
    const result = await this._pool.query(query);
  }

  async deleteSong(songId) {
    const query = {
      text : `
        DELETE * FROM songs WHERE songId == $1
        RETURNING songId
      `,
      values : [songId]
    }
    const result = await this._pool.query(query);
  }
}
