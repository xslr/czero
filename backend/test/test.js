const app = require('../app');
const supertest = require('supertest');
const { knex } = require('../models/dbconnection');
const request = supertest(app);

const apiSuffix = '/api/v0';
const epLogin = apiSuffix + '/' + 'login';
const epRegister = apiSuffix + '/' + 'user';
const epModifyUser = apiSuffix + '/' + 'user';


it('server hello', async done => {
  const response = await request.get(apiSuffix)

  expect(response.status).toBe(200)
  expect(response.text).toBe('nothing here')

  done()
})


it('login user', async done => {
  const response = await request.post(epLogin)
      .send({
        email: 'Jenkins@microsoft.com',
        password: 'password1',
      });

  expect(response.type).toBe('application/json');
  expect(response.status).toBe(200)
  expect(response.body.authToken).not.toBeNull();

  done()
})


afterAll(async(done) => {
  await knex.destroy()
  done()
})
