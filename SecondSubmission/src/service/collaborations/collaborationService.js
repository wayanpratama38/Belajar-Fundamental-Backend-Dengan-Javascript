import { nanoid } from 'nanoid';
import { Pool } from 'pg';

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
    const query = {
      text: `
                SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2
            `,
      values: [playlistId, userId],
    };
    await this._pool.query(query);
  }
}
