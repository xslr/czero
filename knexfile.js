const { stage } = require('./config')

const development = {
  client: 'pg',
  connection: stage.db,
  acquireConnectionTimeout: 10000,
  pool: {
    min: 0,
    max: 10
  },
  migrations: {
    directory: 'knex_migrations',
  },
  seeds: {
    directory: 'knex_seeds',
  },
}

const production = {
  client: 'pg',
  connection: stage.db,
  acquireConnectionTimeout: 10000,
  pool: {
    min: 0,
    max: 10
  },
  migrations: {
    directory: 'knex_migrations',
  },
  seeds: {
    directory: 'knex_seeds',
  },
}

const configs = {
  development,
  production,
}

const knexConfig = configs[process.env.NODE_ENV]

module.exports = {
  knexConfig,
  stage,
};
