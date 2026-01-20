/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
 pgm.createTable("playlist_song_activities",{
  id : {
   type : "VARCHAR(16)",
   primaryKey : true
  },
  playlist_id : {
   type : "VARCHAR(16)",
   references : 'playlists',
   onDelete : "CASCADE",
   notNull : true
  },
  song_id : {
   type : "VARCHAR(16)",
   references : "songs",
   onDelete : "CASCADE",
   notNull : true
  },
  user_id : {
   type : "VARCHAR(16)",
   references : "users",
   onDelete : "CASCADE",
   notNull : true
  },
  action : {
   type : "TEXT",
   notNull : true
  },
  time : {
   type : "TEXT",
   notNull : true
  }
 })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
 pgm.dropTable("playlist_song_activities")
};
