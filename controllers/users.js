const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const schema = require('../models/schema')
const validator = require('validator')

const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  user: 'capn_noodles',
  password: 'capn_noodles',
  database: 'noodles',
  port: 5432,
})


function isAddUserRequestValid(fields) {
  let isValid = true

  isValid &= validator.isEmail(fields.email)

  return isValid
}


async function addUser(req, res) {
  const body = req.body
  
  const query = 'INSERT INTO tbl_user (\
    first_name, middle_name, last_name, email, phone_number,\
    address_line1, address_line2, address_line3)\
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8);'
  const queryVals = [
    body.first_name,
    body.middle_name,
    body.last_name,
    body.email,
    body.phone_number,
    body.address_line1,
    body.address_line2,
    body.address_line3
  ]

  status = 201
  result = ''

  if (isAddUserRequestValid(req.body))
  {
    try {
      result = await pool.query(query, queryVals);
      console.log(`rowcount=${result.rowCount}`)
      console.log(`result=${result}`)
    } catch (err) {
      console.error(err)
    }  
  } else {
    status = 400  // invalid request
    result = {
      reason: 'One of the user data fields is invalid',
      original_request: JSON.stringify(req.body),
    }
  }

  res.status(status).send(result)
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
