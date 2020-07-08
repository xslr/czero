const app = require('../app');
const supertest = require('supertest');
const { knex } = require('../models/dbconnection');
const request = supertest(app);

const apiSuffix = '/api/v0';
const epLogin = apiSuffix + '/' + 'login';
const epRegister = apiSuffix + '/' + 'user';
const epModifyUser = apiSuffix + '/' + 'user';


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


/*
Modify user data WILLFAIL
    ${token}=  login should succeed  email=Alline@example.com  password=password1

    &{userUpdate}=  create dictionary  firstName=Alline  lastName=Terminator
    &{data}=  create dictionary  userUpdate=${userUpdate}
    &{headers}=  create dictionary  ${auth_hdr_field}=Bearer ${token}
    ${resp}  patch request  app_server  ${app_suffix}/${ep_modify_user}  json=${data}  headers=${headers}
    log  ${resp.status_code}
    log  ${resp.content}
    should be equal as integers  ${resp.status_code}  200

 */

// it('modify user data WILLFAIL', async done => {
//   let userData = {
//     firstName: 'Copy',
//     lastName: 'Cat',
//     email: 'Leroy@microsoft.com',
//     password: 'password1',
//   };

//   const response = await request.post(epRegister)
//       .send(userData);

//   // console.log(response)

//   expect(response.type).toBe('application/json');
//   expect(response.status).toBe(422)
//   expect(response.body.resultCode).not.toBeNull();
//   expect(response.body.reason).not.toBeNull();

//   done()
// })

afterAll(async(done) => {
  await knex.destroy()
  done()
})
