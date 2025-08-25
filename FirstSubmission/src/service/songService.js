import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { mapSongDBToModel } from '../utils/utils.js';
import NotFoundError from '../exceptions/notFoundError.js';

export default class SongsService {
  // Private variable
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  /**
   * Service function for add new song
   * @param request request payload from handler
   * @returns song_id
   */
  async addSong(request) {
    const id = nanoid(16);
    const { title, year, genre, performer, duration, albumId } = request;

    const query = {
      text: `
        INSERT INTO songs (song_id, title, year, genre, performer, duration, "albumId")
        VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING song_id
      `,
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    // TODO : ADD ERROR HANDLING

    return result.rows[0].song_id;
  }

  /**
   * Service function for getting all the songs in database including uusing some query parameter
   * @param {null} [performer=""||null] this paramater is for querying, i do "" or null since if performer is empty it will became undefined, in order to able query i need to make this as a null
   * @param {null} [title=""||null]  this paramater is for querying, i do "" or null since if title is empty it will became undefined, in order to able query i need to make this as a null
   * @returns all array of song from songs table including searching from query parameter
   */
  async getAllSongs(title = '' || null, performer = '' || null) {
    const query = {
      text: `
        SELECT * FROM songs 
        WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%' ) 
        AND ($2::text IS NULL OR performer ILIKE '%' || $2 || '%' )
      `,
      values: [title, performer],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapSongDBToModel).map((song) => {
      return { id: song.id, title: song.title, performer: song.performer };
    });
  }

  /**
   * Service function for getting song using song_id as a parameter
   * @param id request parameter
   * @returns song detail information with same id as requested
   */
  async getSongById(id) {
    const query = {
      text: `
        SELECT * FROM songs WHERE song_id = $1
      `,
      values: [id],
    };
    const result = await this._pool.query(query);

    const song = result.rows.map(mapSongDBToModel);
    const notFound = song.filter((song_id) => song_id.id === id)[0];
    if (!notFound) {
      throw new NotFoundError('Lagu tidak ditemukan!');
    }
    return song[0];
  }

  /**
   * Service function for updating song information using song_id as a parameter and request payload
   * @param id request paramater
   * @param request request payload (body)
   * @returns song_id of updated song
   */
  async updateSongById(id, request) {
    const { title, year, genre, performer, duration, albumId } = request;
    const query = {
      text: `
        UPDATE songs
        SET title=$1,year=$2,genre=$3,performer=$4,duration=$5,"albumId"=$6
        WHERE song_id = $7
        RETURNING song_id
      `,
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    const notFound = result.rowCount == 0;
    if (notFound) {
      throw new NotFoundError('Lagu tidak ditemukan!');
    }
  }

  /**
   * Service function for deleting song using song_id as a paramater
   * @param id request parameter
   * @returns song_id of deleted song
   */
  async deleteSong(id) {
    const query = {
      text: `
        DELETE FROM songs WHERE song_id = $1
        RETURNING song_id
      `,
      values: [id],
    };
    const result = await this._pool.query(query);
    const notFound = result.rowCount == 0;
    if (notFound) {
      throw new NotFoundError('Lagu tidak ditemukan!');
    }
  }
}
