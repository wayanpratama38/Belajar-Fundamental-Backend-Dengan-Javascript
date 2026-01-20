import { nanoid } from 'nanoid';
import { Pool } from 'pg';

export default new (class CollaborationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    return (await this.pool.query(query)).rowCount > 0;
  }

  // Create new collaboration
  async createNewCollaboration(playlistId, userId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO collaborations(id,user_id,playlist_id) VALUES ($1,$2,$3) RETURNING id',
      values: [id, userId, playlistId],
    };

    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Delete collaborations
  async deleteNewCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    await this.pool.query(query);
  }
})();
