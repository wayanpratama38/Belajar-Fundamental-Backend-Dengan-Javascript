/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'varchar',
      primaryKey: true,
    },
    username: {
      type: 'varchar',
      notNull: true,
    },
    password: {
      type: 'varchar',
      notNull: true,
    },
    fullname: {
      type: 'varchar',
      notNull: true,
    },
  });
};