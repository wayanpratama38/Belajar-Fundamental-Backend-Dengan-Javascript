import { nanoid } from 'nanoid';
import { Pool } from 'pg';

export default new (class SongRepositories {
  constructor() {
    this.pool = new Pool();
  }

  // verify song exist or not
  async isSongAvailable(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    return (await this.pool.query(query)).rowCount > 0;
  }

  // Create new song
  async createNewSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO songs(id,title,year,genre,performer,duration,album_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Get all song
  async getAllSong({ title, performer }) {
    const query = {
      text: 'SELECT * FROM songs',
    };

    const result = (await this.pool.query(query)).rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    if (title !== '' && performer !== '') {
      const finalResult = result
        .filter((song) => song.performer.toLowerCase().includes(performer))
        .filter((song) => song.title.toLowerCase().includes(title));
      return finalResult;
    }

    if (title !== '') {
      const finalResult = result.filter((song) => song.title.toLowerCase().includes(title));
      return finalResult;
    }

    if (performer !== '') {
      const finalResult = result.filter((song) => song.performer.toLowerCase().includes(performer));
      return finalResult;
    }

    return result;
  }

  // Get song by id
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Update song by id
  async updateSongById(
    id,
    {
      title, year, genre, performer, duration, albumId,
    },
  ) {
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = (await this.pool.query(query)).rows[0];
    return result;
  }

  // Delete song by id
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    return (await this.pool.query(query)).rows[0];
  }
})();
