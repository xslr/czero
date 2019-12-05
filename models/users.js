const { Pool } = require('pg')
// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

/*
// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // login
  email: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  password_hash: {
    type: 'String',
    required: true,
    trim: true,
  },
  // contact information
  first_name: {
    type: 'String',
    required: false,
    trim: true,
    unique: false,
  },
  last_name: {
    type: 'String',
    required: false,
    trim: true,
    unique: false,
  },
  salutation: {
    type: 'String',
    required: false,
    trim: true,
    unique: false,
  },
  phone_number1: {
    type: 'String',
    required: false,
    trim: true,
    unique: false,
  },
  phone_number2: {
    type: 'String',
    required: false,
    trim: true,
    unique: false,
  },
  mailing_address: {
    type: 'String',
    required: false,
    trim: true,
    unique: false,
  },
  active: {
    type: 'Bool',
    required: false,
    unique: false,
    default: true,
  }
});

// encrypt password before save
userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
      next();
    } else {
      bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
        if (err) {
          console.log('Error hashing password for user', user.name);
          next(err);
        } else {
          user.password = hash;
          next();
        }
      });
    }
  });

module.exports = mongoose.model('User', userSchema);
*/
module.exports = []
