import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import UserRepositories from '../../users/repositories/UserRepositories.js';
import SongRepositories from '../../songs/repositories/SongRepositories.js';
import RedisService from '../../cache/RedisService.js';

export default new (class PlaylistRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async isPlaylistAvailable(playlistName = '', playlistId = '', userId = '') {
    let query = {
      text: '',
      values: [],
    };

    if (playlistName.length > 0) {
      query = {
        text: 'SELECT * FROM playlists WHERE name = $1',
        values: [playlistName],
      };
    }

    if (playlistId.length > 0) {
      query = {
        text: 'SELECT * FROM playlists WHERE id = $1',
        values: [playlistId],
      };
    }

    if (playlistId.length > 0 && userId.length > 0) {
      query = {
        text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
        values: [playlistId, userId],
      };
    }

    return (await this.pool.query(query)).rowCount > 0;
  }

  async isPlaylistCollaborate(playlistId, userId) {
    const query = {
      text: 'SELECT p.id FROM playlists p LEFT JOIN collaborations c ON c.playlist_id = p.id WHERE p.id = $1 AND (p.owner=$2 OR c.user_id=$2)',
      values: [playlistId, userId],
    };
    return (await this.pool.query(query)).rowCount > 0;
  }

  // Create new playlists
  async createNewPlaylist(playlistName, userId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlists(id,name,owner) VALUES ($1,$2,$3) RETURNING id',
      values: [id, playlistName, userId],
    };

    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Get all playlists
  async getAllPlaylists(userId) {
    const query = {
      text:
   `
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
      values: [userId],
    };

    const result = (await this.pool.query(query)).rows;

    // Cache
    const forCache = result.map((res) => JSON.stringify(res));
    await RedisService.set(`playlists:${userId}`, JSON.stringify(forCache));

    // return result;
    return result;
  }

  // Get playlist by Id
  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    return (await this.pool.query(query)).rows[0];
  }

  // Delete playlist
  async deletePlaylist(playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId],
    };

    await this.pool.query(query);
  }

  // Add songs into playlists
  async addSongIntoPlaylist(playlistId, songId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_song(id,playlist_id,song_id) VALUES ($1,$2,$3) RETURNING ID',
      values: [id, playlistId, songId],
    };

    await this.pool.query(query);
  }

  // Get song in playlist
  async getSongsInPlaylist(playlistId) {
    const query = {
      text: 'SELECT * FROM playlist_song WHERE playlist_id = $1',
      values: [playlistId],
    };

    // query to database and mapping the result to be response wanted
    const result = await Promise.all((await this.pool.query(query)).rows.map(async (song) => {
      const songData = await SongRepositories.getSongById(song.song_id);
      return {
        id: song.id,
        title: songData.title,
        performer: songData.performer,
      };
    }));

    // get the playlist information
    const playlistData = await this.getPlaylistById(playlistId);

    // Get the username by id
    const userData = await UserRepositories.getUserById(playlistData.owner);

    return {
      id: playlistData.id,
      name: playlistData.name,
      username: userData.username,
      songs: result,
    };
  }

  // Delete song in playlists
  async deleteSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_song WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    await this.pool.query(query);
  }

  // Add to playlist song activities
  async addPlaylistSongAcitivities(playlistId, songId, userId, action) {
    const id = nanoid(16);
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities(id,playlist_id,song_id,user_id,action,time) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = (await this.pool.query(query)).rows;
    return result;
  }

  // Get playlist activities
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
   JOIN songs s ON s.id = psa.song_id
   JOIN users u ON u.id = psa.user_id
   WHERE psa.playlist_id = $1   
   `,
      values: [playlistId],
    };
    const result = (await this.pool.query(query)).rows.map((song) => ({
      username: song.username,
      title: song.title,
      action: song.action,
      time: song.time,
    }));

    const response = {
      playlistId,
      activities: result,
    };

    // Set to cache
    await RedisService.set(`playlistActivities:${playlistId}`, JSON.stringify(response));
    return response;
  }
})();
