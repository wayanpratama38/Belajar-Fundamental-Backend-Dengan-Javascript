/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'varchar',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar',
      references: 'playlists(id)',
    },
    song_id: {
      type: 'varchar',
      references: 'songs(song_id)',
    },
    user_id: {
      type: 'varchar',
      references: 'users(id)',
    },
    action: {
      type: 'varchar',
      notNull: true,
    },
    time: {
      type: 'varchar',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
