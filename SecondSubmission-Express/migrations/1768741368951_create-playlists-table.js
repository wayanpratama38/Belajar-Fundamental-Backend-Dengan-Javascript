/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(16)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
  });

  pgm.createTable('playlist_song', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(16)',
      notNull: true,
      references: 'playlists',
      onDelete: 'CASCADE',
    },
    song_id: {
      type: 'VARCHAR(16)',
      notNull: true,
      references: 'songs',
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
  pgm.dropTable('playlist_song');
  pgm.dropTable('playlists');
};
