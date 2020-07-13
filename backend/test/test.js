const app = require('../app');
const supertest = require('supertest');
const { knex } = require('../models/dbconnection');
const request = supertest(app);

const apiSuffix = '/api/v0';
const epLogin = apiSuffix + '/' + 'login';
const epRegister = apiSuffix + '/' + 'user';
const epModifyUser = apiSuffix + '/' + 'user';
const epGetUser = apiSuffix + '/' + 'user';


async function doLogin(name, pass) {
  const response = await request.post(epLogin)
      .send({
        email: name,
        password: pass,
      });

  expect(response.type).toBe('application/json');
  expect(response.status).toBe(200)
  expect(response.body.authToken).not.toBeNull();

  return response.body.authToken;
}


beforeEach(async () => {
  await knex.migrate.rollback(null, true)
  await knex.migrate.latest()
  await knex.seed.run()
});


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


it('get user data', async done => {
  let token = await doLogin('Jenkins@microsoft.com', 'password1');

  let body = {
  };

  const response = await request.get(epModifyUser)
      .set('Authorization', 'Bearer ' + token)
      .send(body);

  expect(response.type).toBe('application/json');
  expect(response.status).toBe(200)
  expect(response.body.authToken).toBeUndefined();

  done()
})


it('register new user', async done => {
  let userData = {
    firstName: 'ANew',
    lastName: 'User',
    email: 'anew@user.com',
    password: 'superpass',
  };

  const response = await request.post(epRegister)
      .send(userData);

  // console.log(response)

  expect(response.type).toBe('application/json');
  expect(response.status).toBe(201)

  done()
})


it('register existing user', async done => {
  let userData = {
    firstName: 'Copy',
    lastName: 'Cat',
    email: 'Leroy@microsoft.com',
    password: 'password1',
  };

  const response = await request.post(epRegister)
      .send(userData);

  // console.log(response)

  expect(response.type).toBe('application/json');
  expect(response.status).toBe(422)
  expect(response.body.resultCode).not.toBeNull();
  expect(response.body.reason).not.toBeNull();

  done()
})


it('modify user data', async done => {
  let token = await doLogin('Jenkins@microsoft.com', 'password1');

  let body = {
    userUpdate: {
      email: 'Jenkins@microsoft.com',
      firstName: 'Alline',
      lastName: 'Terminator',
    }
  };

  const response = await request.patch(epModifyUser)
      .set('Authorization', 'Bearer ' + token)
      .send(body);

  console.log(response.body)

  expect(response.type).toBe('application/json');
  expect(response.status).toBe(200)
  expect(response.body.user).not.toBeUndefined()

  done()
})

afterAll(async(done) => {
  await knex.destroy()
  done()
})
