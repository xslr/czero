const development = {
  port: process.env.SERVER_PORT || 3000,
  ip: process.env.SERVER_IP || '127.0.0.1',
  saltingRounds: 10,

  // database access
  db: {
    host:     process.env.DB_HOST || 'db',
    port:     process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'noodles',
    user:     process.env.DB_USER || 'capn_noodles',
    password: process.env.DB_PASS || 'capn_noodles',

    connectRetryCount: process.env.DB_CONNECT_RETRY_COUNT || 3,
    connectRetryInterval: process.env.DB_CONNECT_RETRY_INTERVAL_MS || 4000,
  },

  // payments info
  merchantKey: 'B3EAvK71',
  merchantSalt: 'dKemnHwDbX',
}

const production = {
  port: process.env.PORT || 3010,
  ip: process.env.SERVER_IP || '127.0.0.1',
  saltingRounds: 20,

  // TODO: update to prod keys
  merchantKey: 'B3EAvK71',
  merchantSalt: 'dKemnHwDbX',
}

const configs = {
  development,
  production
}

const environment = process.env.NODE_ENV  // development or production
const stage = configs[environment]

module.exports = {
  development,
  production,
  stage,
}
