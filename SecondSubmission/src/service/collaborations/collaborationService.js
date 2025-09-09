import { nanoid } from 'nanoid';
import { Pool } from 'pg';
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
    return result.rows[0].id;
  }

  // service for DELETE /collaborations
  async deleteCollaborationService(playlistId, userId, userCredential) {
    const checkOwnershipQuery = {
      text: `
        SELECT 
        c.user_id,
        p.owner
        FROM collaborations c
        LEFT JOIN playlists p ON c.playlist_id = p.id
        WHERE c.playlist_id = $1
      `,
      values: [playlistId],
    };
    const checkOwnershipResult = await this._pool.query(checkOwnershipQuery);
    if (checkOwnershipResult.rowCount !== 0) {
      if (userId === userCredential) {
        throw new AuthorizationError('Tidak memiliki akses');
      }
    }
    const query = {
      text: `
                DELETE FROM collaborations
                WHERE playlist_id = $1 AND user_id = $2
            `,
      values: [playlistId, userId],
    };
    await this._pool.query(query);
  }

  // verify collaborator
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `
                SELECT 1 FROM collaborations WHERE playlist_id = $1 AND user_id = $2
            `,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthorizationError('Bukan Kolaborator');
    }
  }
}
