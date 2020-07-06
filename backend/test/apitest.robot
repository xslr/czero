*** Settings ***
Library  BuiltIn
Library  Process
Library  RequestsLibrary

Suite Setup  suite level setup
Suite Teardown  suite level teardown

Test Setup  test case setup
Test Teardown  test case teardown

*** Variables ***
${app_server}       http://localhost:3000
${app_suffix}       api/v0

${default_timeout}     1  # requests will timeout after 1 second. Increase this if testing against a remote server
${default_login_user}  Alline@example.com
${default_login_pass}  password1
${auth_hdr_field}      Authorization

${ep_login}         login
${ep_register}      user
${ep_modify_user}   user


*** Keywords ***
suite level setup
    # flush stray data from the database
    Run Process  npx knex migrate:rollback  shell=yes
    Run Process  npx knex migrate:latest  shell=yes
    Run Process  npx knex seed:run  shell=yes

suite level teardown
    no operation

test case setup
    create session  app_server  ${app_server}  timeout=${default_timeout}

test case teardown
    no operation

login user
    [Arguments]  ${email}  ${password}
    should not be empty  ${email}
    should not be empty  ${password}

    &{login_data}=  create dictionary  email=${email}  password=${password}
    ${resp}=  post request  app_server  ${app_suffix}/${ep_login}  json=${login_data}

    [return]  ${resp.json()['authToken']}

login should succeed
    [Arguments]  ${email}  ${password}

    ${token}=  login user  ${email}  ${password}

    # should be equal as strings  ${status_code}  200
    should not be empty  ${token}

    [return]  ${token}


*** Test Cases ***
Smoke test
    ${resp}=  get request  app_server  ${app_suffix}
    should be equal as integers  ${resp.status_code}  200
    should be equal as strings  ${resp.content}  nothing here


Login
    &{login_data}=  create dictionary  email=Jenkins@microsoft.com  password=password1
    ${resp}=  post request  app_server  ${app_suffix}/${ep_login}  json=${login_data}
    should be equal as integers  ${resp.status_code}  200


Register new user
    &{data}=  create dictionary  firstName=ANew  lastName=User  email=anew@user.com  password=superpass

    ${resp}=  post request  app_server  ${app_suffix}/${ep_register}  json=${data}
    should be equal as integers  ${resp.status_code}  201

    login should succeed  anew@user.com  superpass


Register existing user
    &{data}=  create dictionary  firstName=Already  lastName=Registered  email=Already@registered.com  password=password1

    ${resp}=  post request  app_server  ${app_suffix}/${ep_register}  json=${data}
    should be equal as integers  ${resp.status_code}  201

    ${resp_repeat}=  post request  app_server  ${app_suffix}/${ep_register}  json=${data}
    should be equal as integers  ${resp_repeat.status_code}  422
    login should succeed  email=Already@registered.com  password=password1


Modify user data WILLFAIL
    ${token}=  login should succeed  email=Alline@example.com  password=password1

    &{userUpdate}=  create dictionary  firstName=Alline  lastName=Terminator
    &{data}=  create dictionary  userUpdate=${userUpdate}
    &{headers}=  create dictionary  ${auth_hdr_field}=Bearer ${token}
    ${resp}  patch request  app_server  ${app_suffix}/${ep_modify_user}  json=${data}  headers=${headers}
    log  ${resp.status_code}
    log  ${resp.content}
    should be equal as integers  ${resp.status_code}  200

