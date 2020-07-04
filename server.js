const app = require('./app');
const { preLaunchCheck } = require('./utils.js')

const { stage } = require('./config.js')

preLaunchCheck()
  .then(res => {
    app.listen(`${stage.port}`, () => {
      console.log(`Server now listening at ${stage.ip}:${stage.port}`)
    })
  })
  .catch(console.error)
