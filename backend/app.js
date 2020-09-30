const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { validateLoginToken } = require('./utils')


const app = express()
const router = express.Router()
const routes = require('./routes/index.js')
// const { routeDebugger } = require('./routes/debug')
const { stage, environment } = require('./config.js')

// TODO: enable cors for selected domains only before going live
app.use(cors())

app.use(bodyParser.raw({type: 'image/jpeg'}))
app.use(bodyParser.json({type: 'application/json'}))
app.use(bodyParser.urlencoded({
  extended: true
}))

// FIXME: temporarily added for testing bolt checkout
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('views', __dirname)

if (environment !== 'production') {
  app.use(logger('dev'))
}

// router.use(routeDebugger)
routes.public(router)
router.use(validateLoginToken)
routes.restricted(router)

app.use(stage.apiSuffix, router)

module.exports = app
