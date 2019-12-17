const bcrypt = require('bcrypt')
const { stage } = require('../config')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE "tblUser" RESTART IDENTITY CASCADE')
    .finally(function () {
      // Inserts seed entries
      return knex('tblUser').insert([
        { status: 'active', firstName: 'Alline', middleName: '', lastName: 'Viator', phone: '9018209312', addressLine1: '', addressLine2: '', addressCity: '', addressZip: '324214', addressCountry: 'India', },
        { status: 'inactive', firstName: 'Mirna', middleName: '', lastName: 'Vanatta', phone: '9325709832', addressLine1: '', addressLine2: '', addressCity: '', addressZip: '435253', addressCountry: 'Singapore', },
        { status: 'active', firstName: 'Brendon', middleName: '', lastName: 'Valenza', phone: '5832932984', addressLine1: '', addressLine2: '', addressCity: '', addressZip: '891723', addressCountry: 'Malaysia', },
        { status: 'inactive', firstName: 'Leroy', middleName: '', lastName: 'Rowell', phone: '129039801', addressLine1: '', addressLine2: '', addressCity: '', addressZip: '98241', addressCountry: 'Germany', },
      ])
    })
    .then(function () {
      // Inserts seed entries
      return knex('tblEmailLogin').insert([
        { userId: 1, email: 'Alline@example.com',  pwHash: bcrypt.hashSync('password1', stage.saltingRounds) },
        { userId: 2, email: 'Mirna@gmail.com',     pwHash: bcrypt.hashSync('password1', stage.saltingRounds) },
        { userId: 3, email: 'Brendon@yahoo.com',   pwHash: bcrypt.hashSync('password1', stage.saltingRounds) },
        { userId: 4, email: 'Leroy@microsoft.com', pwHash: bcrypt.hashSync('password1', stage.saltingRounds) },
      ])
    })
}
