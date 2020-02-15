const bcrypt = require('bcryptjs')
const { stage } = require('../config')

exports.seed = function(knex) {
  return knex.raw('TRUNCATE users RESTART IDENTITY CASCADE')
    .finally(function () {
      // Inserts seed entries
      return knex('users').insert([
        { status: 'active',   first_name: 'Alline',  middle_name: '', last_name: 'Viator',  phone: '9018209312', address_line1: '', address_line2: '', address_city: '', address_zip: '324214', address_country: 'India', },
        { status: 'inactive', first_name: 'Mirna',   middle_name: '', last_name: 'Vanatta', phone: '9325709832', address_line1: '', address_line2: '', address_city: '', address_zip: '435253', address_country: 'Singapore', },
        { status: 'active',   first_name: 'Brendon', middle_name: '', last_name: 'Valenza', phone: '5832932984', address_line1: '', address_line2: '', address_city: '', address_zip: '891723', address_country: 'Malaysia', },
        { status: 'inactive', first_name: 'Leroy',   middle_name: '', last_name: 'Rowell',  phone: '129039801',  address_line1: '', address_line2: '', address_city: '', address_zip: '98241',  address_country: 'Germany', },
        { status: 'inactive', first_name: 'Jenkins', middle_name: '', last_name: 'Randall', phone: '129039801',  address_line1: '', address_line2: '', address_city: '', address_zip: '98241',  address_country: 'Uganda', },
      ])
    })
    .then(function () {
      // Inserts seed entries
      const pwHash = bcrypt.hashSync('password1', stage.saltingRounds)
      return knex('email_logins').insert([
        { user_id: 1, email: 'Alline@example.com',    password_hash: pwHash },
        { user_id: 2, email: 'Mirna@gmail.com',       password_hash: pwHash },
        { user_id: 3, email: 'Brendon@yahoo.com',     password_hash: pwHash },
        { user_id: 4, email: 'Leroy@microsoft.com',   password_hash: pwHash },
        { user_id: 5, email: 'Jenkins@microsoft.com', password_hash: pwHash },
      ])
    })
}
