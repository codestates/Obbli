require('dotenv').config()

module.exports = {
  type: 'mysql',
  host: process.env.USER_HOST,
  port: process.env.USER_PORT,
  username: process.env.USER_NAME,
  password: process.env.USER_PASSWORD,
  database: process.env.USER_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['src/entity/*.entity.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
}


