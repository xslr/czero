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


function onAddUserSuccess(req, rsp, res) {
  result = res
  rsp.status(resultCode.HTTP_201_CREATED).send(JSON.stringify(res))

  // console.log(`rowcount=${result.rowCount}`)
  // console.log(`result=${JSON.stringify(result)}`)
}


function onAddUserError(req, rsp, err) {
  console.error(`Error executing transaction: ${err}`)
  let ecode = resultCode.HTTP_500_INTERNAL_SERVER_ERROR
  let result = err

  if (23505 === Number(err.code)) {
    ecode = resultCode.HTTP_422_UNPROCESSABLE_ENTITY
    result = {
      ecode: resultCode.ERR_ACCOUNT_EXISTS,
      reason: 'User account was not created because specified email is already registered.',
    }
  }
  rsp.status(ecode).send(result)
}


async function addUser(req, rsp) {
  status = 201
  result = ''

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
    .then(result => onAddUserSuccess(req, rsp, result))
    .catch(err => onAddUserError(req, rsp, err))
  } else {
    status = 400  // invalid request
    result = {
      reason: 'One of the user data fields is invalid',
      original_request: JSON.stringify(req.body),
    }
    rsp.status(status).send(result)
  }
}


async function login(req, res) {

}


module.exports = {
  addUser,
  login: (req, res) => {
    /*
    const { name, password } = req.body;

    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if(!err) {
        User.findOne({name}, (err, user) => {
          if (!err && user) {
            // We could compare passwords in our model instead of below as well
            bcrypt.compare(password, user.password).then(match => {
              if (match) {
                status = 200;
                // Create a token
                const payload = { user: user.name };
                const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options);

                // console.log('TOKEN', token);
                result.token = token;
                result.status = status;
                result.result = user;
              } else {
                status = 401;
                result.status = status;
                result.error = `Authentication error`;
              }
              res.status(status).send(result);
            }).catch(err => {
              status = 500;
              result.status = status;
              result.error = err;
              res.status(status).send(result);
            });
          } else {
            status = 404;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
    */
  },

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
