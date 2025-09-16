/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('user_album_likes',{
        id : {
            type : 'varchar',
            primaryKey : true
        },
        user_id : {
            type : 'varchar',
            references : 'users(id)'
        },
        album_id : {
            type : 'varchar',
            references : 'albums(album_id)'
        }
    });
};