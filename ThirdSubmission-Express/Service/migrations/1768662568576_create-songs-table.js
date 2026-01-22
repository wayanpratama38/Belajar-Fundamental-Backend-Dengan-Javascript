/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR',
      notNull: true,
    },
    duration: {
      type: 'integer',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(16)',
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
  pgm.dropTable('songs');
};
