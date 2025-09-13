/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'varchar',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar',
      references: 'playlists(id)',
    },
    user_id: {
      type: 'varchar',
      references: 'users(id)',
    },
  });
};