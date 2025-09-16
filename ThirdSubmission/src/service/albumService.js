import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import { mapAlbumDBToModel } from '../utils/utils.js';
import NotFoundError from '../exceptions/notFoundError.js';
import ClientError from '../exceptions/clientError.js';

export default class AlbumsService {
  // Private variable
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  /**
   * Service function for adding new album into database
   * @param request request payload (body)
   * @returns album_id
   */
  async addAlbum(request) {
    const id = nanoid(16);
    const { name, year } = request;

    const query = {
      text: `
               INSERT INTO albums
               VALUES($1,$2,$3)
               RETURNING album_id 
            `,
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    return result.rows[0].album_id;
  }

  /**
   * Service function to get specify album information including songs with same album_id value
   * @param album_id request paramater
   * @returns album detail information
   */
  async getAlbumById(album_id) {
    const albumQuery = {
      text: `
                SELECT * FROM albums WHERE album_id = $1
            `,
      values: [album_id],
    };

    const songQuery = {
      text: `
                SELECT * FROM songs WHERE "albumId" = $1 and "albumId" IS NOT NULL
            `,
      values: [album_id],
    };
    const albumResult = await this._pool.query(albumQuery);
    const songResult = await this._pool.query(songQuery);

    if (albumResult.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = mapAlbumDBToModel(albumResult.rows[0]);
    const songs = songResult.rows.map((song) => ({
      id: song.song_id,
      title: song.title,
      performer: song.performer,
    }));
    return { ...album, songs };
  }

  /**
   * Service function for updating album information using album_id and request payload as a function parameter
   * @param album_id request paramater
   * @param request request payload (body)
   */
  async updateAlbumById(album_id, request) {
    const { name, year } = request;
    const query = {
      text: `
                UPDATE albums
                SET name=$1, year=$2
                WHERE album_id=$3
            `,
      values: [name, year, album_id],
    };
    const result = await this._pool.query(query);
    const notFound = result.rowCount == 0;
    if (notFound) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  /**
   * Service function for deleting specify album using album_id as a function parameter
   * @param album_id request parameter
   */
  async deleteAlbumById(album_id) {
    const query = {
      text: `
                DELETE FROM albums WHERE album_id = $1
            `,
      values: [album_id],
    };
    const result = await this._pool.query(query);
    const notFound = result.rowCount == 0;
    if (notFound) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  // service for POST/albums/{id}/covers
  async postAlbumCover(albumId,coverUrl){
    const query = {
      text : `
        UPDATE albums
        SET cover=$1
        WHERE album_id = $2
      `,
      values : [coverUrl,albumId]
    }
    await this._pool.query(query);
  }

  // service for POST/albums/{id}/likes
  async postLikeAlbum(albumId,userId){
    // create id
    const likeId = `album-like-${nanoid(16)}`
    const query = {
      text : `
        INSERT INTO user_album_likes
        values($1,$2,$3)
        RETURNING id
      `,
      values : [likeId,userId,albumId]
    }

    await this._pool.query(query);
  }

  // service for DELETE/albums/{id}/likes
  async deleteLikeAlbum(albumId,userId){
    const query = {
      text : `
        DELETE FROM user_album_likes
        WHERE album_id = $1 AND user_id = $2
      `,
      values : [albumId,userId]
    }
    await this._pool.query(query);
  } 

  // service for GET/albums/{id}/likes
  async getLikeAlbum(albumId){
    const query = {
      text : `
        SELECT COUNT(*) FROM user_album_likes 
        WHERE album_id = $1
      `,
      values : [albumId]
    }
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  // check already like album or not
  async checkUserLikeAlbum(albumId,userId){
    const checkLikeQuery = {
      text : `
        SELECT id FROM user_album_likes 
        WHERE user_id = $1 AND album_id = $2 
      `,
      values : [userId,albumId]
    }

    const checkLike = await this._pool.query(checkLikeQuery);
    if(checkLike.rowCount != 0 ){
      throw new ClientError('Sudah di like!')
    } 
  }

  // check if album available
  async checkAlbumAvailable(albumId){
    const query = {
      text : `
        SELECT * FROM user_album_likes 
        WHERE album_id = $1
      `,
      values : [albumId]
    }

    const result = await this._pool.query(query);
    if(result.rowCount===0){
      throw new NotFoundError('Album tidak ditemukan')
    }
  }
}

