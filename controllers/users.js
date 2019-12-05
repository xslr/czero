const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const schema = require('../models/schema')
const validator = require('validator')
const {knex} = require('../models/dbconnection')
const {ResultCode, HttpStatus, mkResult} = require('../result_code')
const environment = process.env.NODE_ENV; // development
const stage = require('../config')[environment];


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
  result = {}
  status = HttpStatus.HTTP_201_CREATED

  if (1 == res.rowCount) {
    result = mkResult(ResultCode.OK_ACCOUNT_CREATED, 'User account created')
  } else {
    result = mkResult(ResultCode.ERR_UNKNOWN, 'Unknown error while creating user account.')
    result.extra = JSON.stringify(res)
    status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  }

  rsp.status(HttpStatus.HTTP_201_CREATED).send(result)
}


function onAddUserQueryError(req, rsp, err) {
  console.error(`Error executing transaction: ${err}`)
  let httpStatus = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let result = err

  if (23505 === Number(err.code)) {
    httpStatus = HttpStatus.HTTP_422_UNPROCESSABLE_ENTITY
    result = {
      resultCode: ResultCode.ERR_ACCOUNT_EXISTS,
      reason: 'User account was not created because specified email is already registered.',
    }
  }
  rsp.status(httpStatus).send(result)
}


async function addUser(req, rsp) {
  if (isAddUserRequestValid(req.body)) {
    const hashedPassword = bcrypt.hashSync(req.body.password, stage.saltingRounds)
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
            pwHash: hashedPassword,
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
    httpStatus = HttpStatus.HTTP_400_BAD_REQUEST
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
  let httpStatus = HttpStatus.HTTP_401_UNAUTHORIZED
  let result = mkResult(ResultCode.ERR_INCORRECT_LOGIN, 'Incorrect credentials')

  if (Array.isArray(res) && res.length > 0) {
    const compareRes = bcrypt.compareSync(req.body.password, res[0].pwHash)
    if (compareRes) {
      httpStatus = HttpStatus.HTTP_200_OK
      result = mkResult(ResultCode.OK_LOGIN_SUCCESS, 'Credentials accepted')
      result.token = getAuthToken(res[0].email)
    }
  }
  rsp.status(httpStatus).send(result)
}


function onLoginQueryError(req, rsp, err) {
  console.log(err)
  rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send(err)
}


async function login(req, rsp) {
  const { email, password } = req.body

  return knex('tblEmailLogin')
    .select('email', 'pwHash', 'userId')
    .from('tblEmailLogin')
    .where({
      email: email
    })
    .then(res => onLoginQuerySuccess(req, rsp, res))
    .catch(err => onLoginQueryError(req, rsp, err))
}


module.exports = {
  addUser,
  login,

  getAll: (req, rsp) => {
  },

  update: (req, rsp) => {
  },

  deactivate: (req, rsp) => {},

  requestReset: (req, rsp) => {},

  setNewPassword: (req, rsp) => {},
}
