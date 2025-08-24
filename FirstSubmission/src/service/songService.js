import { nanoid } from "nanoid";
import { Pool } from "pg";
import { mapSongDBToModel } from "../utils/utils.js";

export default class SongsService {
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  async addSong(request) {
    const id = nanoid(16);
    const { title, year, genre, performer, duration, albumId } = request
    console.log("IN SERVICE",title,year,genre,performer,duration,albumId)
    const query = {
      text: `
        INSERT INTO songs (song_id, title, year, genre, performer, duration, "albumId")
        VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING song_id
      `,
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      ]
    };
    const result = await this._pool.query(query);
    console.log(result.rows[0].song_id);
    if (!result.rows[0]) {
    throw new Error('Lagu gagal ditambahkan');
  }
    return result.rows[0].song_id;
  }

  async getAllSongs() {
    const query = await this._pool.query("SELECT * FROM songs");
    const result = query.rows.map(mapSongDBToModel);
    console.log(result);
    return result;
  }

  async getSongById(id) {
    console.log(id);
    const query = {
      text : `
        SELECT * FROM songs WHERE song_id = $1
      `,
      values : [id]
    }
    const result = await this._pool.query(query)
    console.log(result);
    return result.rows[0];
  }

  async updateSongById(id,request) { 
    const { title, year, genre, performer, duration, albumId } = request
    const query = {
      text : `
        UPDATE songs
        SET title=$1,year=$2,genre=$3,performer=$4,duration=$5,"albumId"=$6
        WHERE id == $7
        RETURNING id
      `,
      values : [title,year,genre,performer,duration,albumId,id]
    }  
    const result = await this._pool.query(query);
    console.log(result);
    return result;
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
    console.log(result)
    return result;
  }
}
