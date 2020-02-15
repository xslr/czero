const development = {
  port: process.env.APPSERVER_PORT || 3000,
  ip: process.env.APPSERVER_IP || '127.0.0.1',
  saltingRounds: 10,

  hostname: process.env.APPSERVER_HOSTNAME || 'http://localhost',  // TODO: set to 'https://rnm.sg' on prod
  apiSuffix: process.env.api_suffix || '/api/v0',  // TODO: set to 'https://rnm.sg' on prod

  // database access
  db: {
    host:     process.env.DB_HOST || '127.0.0.1',
    port:     process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'noodles_dev',
    user:     process.env.DB_USER || 'capn_noodles',
    password: process.env.DB_PASS || 'capn_noodles',

    connectRetries: process.env.DB_CONNECT_RETRY_COUNT || 3,
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

const environment = process.env.NODE_ENV || 'development'  // development or production
let stage = configs[environment]
stage.apiUrl = stage.hostname + stage.apiSuffix

module.exports = {
  development,
  production,
  stage,
  environment
}
