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

// export just the knex config for current environment, and nothing else.
// Or knex cli gets confused
module.exports = configs[stage.environment] || development
