const tables = [
  {
    name: 'operators',
    columns: [
      'user_id',  // foreign key on tbl_user.id
    ],
  },
  {
    name: 'email_logins',
    columns: [
      'email',
      'password',
      'user_id',  // foreign key to tbl_user.id
    ],
  },
  /* disable check until sso login is implemented
  {
    name: 'tblSsoLogin',
    columns: [
      'ssoProvider',  // e.g. google, fb, etc.
      'externalId',  // user's unique identifier given by sso provider
      'user_id',  // foreign key to tbl_user.id
    ],
  },
  */
  {
    name: 'users',
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
    name: 'conferences',
    columns: [
      'id',
      'name',
      'startDate',
      'endDate',
      'venue_line_1',
      'venue_line_2',
      'venue_line_3',
    ],
  },
  {
    name: 'conference_member',
    columns: [
      'user_id',
      'conference_id',
    ]
  },
];

module.exports = {
   tables
}
