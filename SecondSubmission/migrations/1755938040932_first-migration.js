/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('albums', {
    album_id: {
      type: 'varchar',
      primaryKey: true,
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
  });
  pgm.createTable('songs', {
    song_id: {
      type: 'varchar',
      primaryKey: true,
    },
    title: {
      type: 'varchar',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    genre: {
      type: 'varchar',
      notNull: true,
    },
    performer: {
      type: 'varchar',
      notNull: true,
    },
    duration: {
      type: 'integer',
    },
    albumId: {
      type: 'varchar',
      references: 'albums(album_id)',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
