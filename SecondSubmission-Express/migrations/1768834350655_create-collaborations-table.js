/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(16)',
      references: 'users',
      onDelete: 'CASCADE',
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(16)',
      references: 'playlists',
      onDelete: 'CASCADE',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('collaborations');
};
