import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import NotFoundError from '../../exceptions/notFoundError.js';
import AuthenticationError from '../../exceptions/authenticationError.js';
import AuthorizationError from '../../exceptions/authorizationError.js';

export default class CollaborationService {
  _pool;

  constructor() {
    this._pool = new Pool();
  }

  // service for POST /collaborations
  async postCollaborationService(playlistId, userId) {
    const id = `collaboration-${nanoid(16)}`;
    const query = {
      text: `
                INSERT INTO collaborations 
                VALUES($1,$2,$3)
                RETURNING id
            `,
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  // service for DELETE /collaborations
  async deleteCollaborationService(playlistId, userId) {
    const query = {
      text: `
                DELETE FROM collaborations
                WHERE user_id = $1 AND playlist_id = $2 
            `,
      values: [userId, playlistId],
    };
    await this._pool.query(query);
  }

  // verify collaborator
  async verifyCollaborator(playlistId, userId) {
    // const userQuery = {
    //   text : `
    //     SELECT * FROM users WHERE id = $1
    //   `,
    //   values : [userId]
    // }

    // const userResult = await this._pool.query(userQuery);
    // if(userResult.rowCount === 0 ){
    //   throw new NotFoundError("User tidak ditemukan")
    // }

    // const playlistQuery = {
    //   text : `
    //     SELECT * FROM playlists WHERE id = $1
    //   `,
    //   values : [playlistId]
    // }

    // const playlistResult = await this._pool.query(playlistQuery);
    // if(playlistResult.rowCount === 0 ){
    //   throw new NotFoundError("Playlist tidak ditemukan")
    // }
    
    const query = {
      text: `
                SELECT 1 FROM collaborations WHERE playlist_id = $1 AND user_id = $2
            `,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if(result.rowCount === 0 ) {
      throw new AuthorizationError('Bukan Kolaborator')
    }
  }
}
