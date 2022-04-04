require('dotenv').config();

/** @type {import('typeorm').ConnectionOptions} */
module.exports = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: ['src/entities/**/*{.ts,.js}'],
  logging: false,
  synchronize: true
};
