const tables = [
  {
    name: 'tblOperator',
    columns: [
      'user_id',  // foreign key on tbl_user.id
    ],
  },
  {
    name: 'tblEmailLogin',
    columns: [
      'email',
      'password',
      'userId',  // foreign key to tbl_user.id
    ],
  },
  {
    name: 'tblSsoLogin',
    columns: [
      'ssoProvider',  // e.g. google, fb, etc.
      'externalId',  // user's unique identifier given by sso provider
      'userId',  // foreign key to tbl_user.id
    ],
  },
  {
    name: 'tblUser',
    columns: [
      'id',
      'firstName',
      'middleName',
      'lastName',
      'email',
      'phoneNumber',
      'addressLine1',
      'addressLine2',
      'addressLine3',
    ],
  },
  {
    name: 'tblConference',
    columns: [
      'id',
      'name',
      'startDate',
      'endDate',
      'venueLine1',
      'venueLine2',
      'venueLine3',
    ],
  },
  {
    name: 'tblConferenceMember',
    columns: [
      'userId',
      'conferenceId',
    ]
  },
];

module.exports = {
   tables
}
