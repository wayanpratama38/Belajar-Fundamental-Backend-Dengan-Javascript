import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import AuthorizationError from '../../exceptions/authorizationError.js';
import CollaborationService from '../collaborations/collaborationService.js';
import NotFoundError from '../../exceptions/notFoundError.js';

export default class PlaylistService {
  _pool;
  _collaborationService;

  constructor() {
    this._pool = new Pool();
    this._collaborationService = new CollaborationService();
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    // check playlist availability
    const query = {
      text: `
                SELECT owner FROM playlists WHERE id = $1
            `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Tidak ditemukan playlistnya');
    }

    // check ownership is it collaborator or owner
    const playlist = result.rows[0];
    if (ownerId != playlist.owner) {
      await this._collaborationService.verifyCollaborator(playlistId, ownerId);
    } else {
      if (playlist.owner !== ownerId) {
        throw new AuthorizationError(
          'Tidak memiliki akses kepada playlist ini!',
        );
      }
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      } else if (error instanceof NotFoundError) {
        throw error;
      }
    }
  }

  async addPlaylistActivities(playlistId, songId, userId, action) {
    const id = `playlist-activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: `
                INSERT INTO playlist_song_activities
                VALUES($1,$2,$3,$4,$5,$6)
            `,
      values: [id, playlistId, songId, userId, action, time],
    };
    await this._pool.query(query);
  }

  // service for POST/playlists
  async addPlaylist(name, userid) {
    const playlistId = `playlist-${nanoid(16)}`;
    const query = {
      text: `
      INSERT INTO playlists
      VALUES($1,$2,$3) 
      RETURNING id
      `,
      values: [playlistId, name, userid],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  // service for GET/playlists
  async getPlaylist(ownerId) {
    const query = {
      text: `
      SELECT p.id, p.name, u.username
      FROM playlists p
      LEFT JOIN users u ON p.owner = u.id
      WHERE p.owner = $1
      UNION
      SELECT p.id, p.name, u.username
      FROM collaborations c
      JOIN playlists p ON c.playlist_id = p.id
      LEFT JOIN users u ON p.owner = u.id
      WHERE c.user_id = $1
    `,
      values: [ownerId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // service for DELETE/playlists/{id}
  async deletePlaylist(playlistId) {
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
      if (
        checkOwnershipResult.rows[0].user_id !==
        checkOwnershipResult.rows[0].owner
      ) {
        throw new AuthorizationError('Tidak memiliki akses');
      }
    }
    const query = {
      text: `
                DELETE FROM playlists WHERE id = $1
            `,
      values: [playlistId],
    };

    const playlistSongQuery = {
      text: `
        DELETE FROM playlist_songs WHERE playlist_id = $1
      `,
      values: [playlistId],
    };

    await this._pool.query(playlistSongQuery);
    await this._pool.query(query);
  }

  // service for POST/playlists/{id}/songs
  async addSongIntoPlaylist(playlistId, songId) {
    const id = `playlist_songs-${nanoid(16)}`;
    const checkSongQuery = {
      text: `
        SELECT * FROM songs WHERE song_id = $1
      `,
      values: [songId],
    };
    const songNotFound = (await this._pool.query(checkSongQuery)).rowCount == 0;
    if (songNotFound) {
      throw new NotFoundError('Musik tidak ditemukan');
    }
    const query = {
      text: `
                INSERT INTO playlist_songs
                VALUES($1,$2,$3)
                RETURNING id
            `,
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  // service for GET/playlists/{id}/songs
  async getSongInPlaylist(playlistId) {
    const query = {
      text: `
                SELECT
                p.id AS playlist_id,
                p.name AS playlist_name,
                p.owner AS playlist_owner,
                u.username,
                s.song_id,
                s.title,
                s.performer
                FROM playlists p
                LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
                LEFT JOIN songs s ON ps.song_id = s.song_id
                LEFT JOIN users u ON p.owner = u.id
                WHERE p.id = $1
            `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].playlist_name,
      username: result.rows[0].username,
      songs: result.rows
        .filter((r) => r.song_id !== null)
        .map((r) => ({
          id: r.song_id,
          title: r.title,
          performer: r.performer,
        })),
    };
    return playlist;
  }

  // service for DELETE/playlists/{id}/songs
  async deleteSongInPlaylist(songId, playlistId) {
    const checkSongQuery = {
      text: `
        SELECT * FROM songs WHERE song_id = $1
      `,
      values: [songId],
    };
    const songNotFound = (await this._pool.query(checkSongQuery)).rowCount == 0;
    if (songNotFound) {
      throw new NotFoundError('Musik tidak ditemukan');
    }
    const query = {
      text: `
                DELETE FROM playlist_songs
                WHERE song_id = $1 AND playlist_id = $2
            `,
      values: [songId, playlistId],
    };
    await this._pool.query(query);
  }

  // service for GET/playlists/{id}/activities
  //nama user,dan title musiknya
  async getPlaylistActivities(playlistId) {
    const query = {
      text: `
                SELECT 
                psa.song_id as song_id,
                psa.user_id as user_id,
                psa.action as action,
                psa.time as time,
                u.username as username,
                s.title as title
                FROM playlist_song_activities psa
                JOIN playlists p ON p.id = psa.playlist_id
                JOIN songs s ON s.song_id = psa.song_id
                JOIN users u ON u.id = psa.user_id
                WHERE psa.playlist_id = $1
            `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Aktivitas tidak ditemukan');
    }
    const activitiesResponse = {
      playlistId: playlistId,
      activities: result.rows
        .filter((row) => row != null)
        .map((row) => ({
          username: row.username,
          title: row.title,
          action: row.action,
          time: row.time,
        })),
    };
    return activitiesResponse;
  }
}
