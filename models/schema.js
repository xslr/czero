const tables = [
  {
    name: 'tbl_operator',
    columns: [
      'user_id',  // foreign key on tbl_user.id
    ],
  },
  {
    name: 'tbl_email_login',
    columns: [
      'email',
      'password',
      'user_id',  // foreign key to tbl_user.id
    ],
  },
  {
    name: 'tbl_sso_login',
    columns: [
      'sso_provider',  // e.g. google, fb, etc.
      'external_id',  // user's unique identifier given by sso provider
      'user_id',  // foreign key to tbl_user.id
    ],
  },
  {
    name: 'tbl_user',
    columns: [
      'id',
      'first_name',
      'middle_name',
      'last_name',
      'email',
      'phone_number',
      'address_line1',
      'address_line2',
      'address_line3',
    ],
  },
  {
    name: 'tbl_conference',
    columns: [
      'id',
      'name',
      'start_date',
      'end_date',
      'venue_line1',
      'venue_line2',
      'venue_line3',
    ],
  },
  {
    name: 'tbl_conference_member',
    columns: [
      'user_id',
      'conference_id',
    ]
  },
];

module.exports = {
   tables
}
