module.exports = {

  development: {
    client: 'pg',
    connection: {
      host:     'localhost',
      port:     5432,
      database: 'noodles_dev',
      user:     'capn_noodles',
      password: 'capn_noodles',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'knex_migrations',
    },
    seeds: {
      directory: 'knex_seeds',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host:     'localhost',
      port:     5432,
      database: 'noodles_prod',
      user:     'capn_noodles',
      password: 'capn_noodles',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'knex_migrations',
    },
    seeds: {
      directory: 'knex_seeds',
    },
  },

};
