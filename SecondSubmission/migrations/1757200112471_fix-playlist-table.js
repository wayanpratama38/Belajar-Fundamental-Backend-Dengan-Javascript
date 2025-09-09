/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.dropTable('playlists', { ifExists: true, cascade: true });

  pgm.createTable('playlists', {
    id: {
      type: 'varchar',
      primaryKey: true,
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    owner: {
      type: 'varchar',
      references: 'users(id)',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
