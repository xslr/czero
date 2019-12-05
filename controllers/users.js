const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const schema = require('../models/schema')
const validator = require('validator')
const connParam = require('../models/dbconnection')
const pool = connParam.pool
const knex = connParam.knex
const resultCode = require('../result_code')


function isAddUserRequestValid(fields) {
  let isValid = true

  try {
    isValid &= validator.isEmail(fields.email)
  } catch (err) {
    isValid = false
  }

  return isValid
}


function onAddUserQuerySuccess(req, rsp, res) {
  result = res
  rsp.status(resultCode.HTTP_201_CREATED).send(JSON.stringify(res))

  // console.log(`rowcount=${result.rowCount}`)
  // console.log(`result=${JSON.stringify(result)}`)
}


function onAddUserQueryError(req, rsp, err) {
  console.error(`Error executing transaction: ${err}`)
  let httpStatus = resultCode.HTTP_500_INTERNAL_SERVER_ERROR
  let result = err

  if (23505 === Number(err.code)) {
    httpStatus = resultCode.HTTP_422_UNPROCESSABLE_ENTITY
    result = {
      code: resultCode.ERR_ACCOUNT_EXISTS,
      reason: 'User account was not created because specified email is already registered.',
    }
  }
  rsp.status(httpStatus).send(result)
}


async function addUser(req, rsp) {
  if (isAddUserRequestValid(req.body)) {
    knex.transaction(trx => {
      return trx
        .insert({
          createdAt: new Date().toUTCString(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          status: 'active',
        }, 'id')
        .into('tblUser')
        .then(id => {
          // console.log(`--> id is ${id}:${typeof id}:${id.toString()}`)
          return trx.insert({
            email: req.body.email,
            pwHash: req.body.password,
            userId: id[0],
          })
          .into('tblEmailLogin')
          .catch(err => {
            console.error(`Error inserting into login table: ${err}`)
            throw err
          })
        })
        .catch(err => {
          console.error(`Error while inserting: ${err}`)
          throw err
        })
    })
    .then(result => onAddUserQuerySuccess(req, rsp, result))
    .catch(err => onAddUserQueryError(req, rsp, err))
  } else {
    httpStatus = resultCode.HTTP_400_BAD_REQUEST
    result = {
      reason: 'One of the user data fields is invalid',
      original_request: JSON.stringify(req.body),
    }
    rsp.status(httpStatus).send(result)
  }
}


function getAuthToken(email) {
  // Create a token
  const payload = { email: email }
  const options = { expiresIn: '2d', issuer: 'https://rnm.sg' }
  const secret = process.env.JWT_SECRET
  const token = jwt.sign(payload, secret, options)

  return token
}


function onLoginQuerySuccess(req, rsp, res) {
  let httpStatus = resultCode.HTTP_401_UNAUTHORIZED
  let result = {
    code: resultCode.ERR_INCORRECT_LOGIN,
    reason: 'Incorrect credentials',
  }

  if (Array.isArray(res) && res.length > 0) {
    httpStatus = resultCode.HTTP_200_OK
    result = {
      code: resultCode.OK_LOGIN_SUCCESS,
      reason: 'Credentials accepted',
      token: getAuthToken(res[0].email)
    }
  }
  rsp.status(httpStatus).send(result)
}


function onLoginQueryError(req, rsp, err) {
  console.log(err)
  rsp.status(resultCode.HTTP_500_INTERNAL_SERVER_ERROR).send(err)
}


async function login(req, rsp) {
  const { email, password } = req.body

  return knex('tblEmailLogin')
    .select('email', 'userId')
    .from('tblEmailLogin')
    .where({
      email: email,
      pwHash: password,
    })
    .then(res => onLoginQuerySuccess(req, rsp, res))
    .catch(err => onLoginQueryError(req, rsp, err))
}


module.exports = {
  addUser,
  login,

  getAll: (req, res) => {
    /*
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      if (!err) {
        User.find({}, (err, users) => {
          if (!err) {
            res.send(users);
          } else {
            console.log('Error', err);
          }
        });
      } else {
        let result = {}
        result.status = 500
        result.error = 'Database connection error'
        res.status(result.status).send(result)
      }
    });
    */
  },

  update: (req, res) => {
  },

  deactivate: (req, res) => {},

  requestReset: (req, res) => {},

  setNewPassword: (req, res) => {},
}
