const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('server hello', async done => {
  const response = await request.get('/api/v0')

  expect(response.status).toBe(200)
  // console.log()
  expect(response.text).toBe('nothing here')
  // expect(response.body.message).toBe('nothing here')
  done()
})
