/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addColumns('albums',{
        cover : {
            type : 'varchar',
            notNull : false,
            default : null
        }
    })
};