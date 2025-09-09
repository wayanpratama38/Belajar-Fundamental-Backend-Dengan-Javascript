/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.dropTable('playlist_songs', { ifExists: true, cascade: true });

  pgm.createTable('playlist_songs', {
    id: {
      primaryKey: true,
      type: 'varchar',
    },
    playlist_id: {
      type: 'varchar',
      references: 'playlists(id)',
    },
    song_id: {
      type: 'varchar',
      references: 'songs(song_id)',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
