/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(16)',
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(16)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    album_id: {
      type: 'VARCHAR(16)',
      notNull: true,
      references: 'albums',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
