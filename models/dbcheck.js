const schema = require('./schema')
const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  user: 'capn_noodles',
  password: 'capn_noodles',
  database: 'noodles',
  port: 5432,
})


async function verifyConnection() {
  try {
    const res = await pool.query('SELECT NOW()')
    // console.log(res.rows[0])
  } catch (err) {
    console.error(err)
    return false
  }

  return true
}


function tableHasColumn(client, tableName, columnName) {
  const queryString = 'SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name=$1 AND column_name=$2'
  const queryVals = [tableName, columnName]

  return client.query(queryString, queryVals)
    .then((result) => {
      return 0 !== result.rowCount;
    })
    .catch(err => {
      console.log(err)
      return false
    })
}


async function hasTable(client, table) {
  const queryString = 'SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_name=$1'
  const queryValues = [table.name]

  try {
    const result = await client.query(queryString, queryValues)
    if (0 === result.rowCount) {
      console.error(`  Table '${table.name}' is not present.\n    Q=${queryString}\n    V=${queryValues}`)
      return false
    } else {
      // table is present. now ensure that the columns are also present
      const columnsOk = await Promise.all(table.columns.map((col_name) => {
        return tableHasColumn(client, table.name, col_name)
      }))
      return columnsOk.reduce((acc, columnOk) => acc && columnsOk, true)
    }
  }
  catch(err) {
    console.error(err);
    return false;
  }
}


async function verifyTables() {
  const expectedTables = schema.tables

  const client = await pool.connect();
  
  console.log('Checking tables')
  const tablesOk = await Promise.all(expectedTables.map(async (table) => {
    const tableOk = await hasTable(client, table)
    process.stdout.write(`  ${table.name}:`)
    process.stdout.write(tableOk ? ' ok\n'
                                 : ` NOK table\n`)
    return tableOk
  }))
  // console.log(tablesOk)
  const allTablesOk = tablesOk.reduce((acc, isTableOk) => acc && isTableOk, true)

  client.release()
  return allTablesOk
}


async function verifyDb() {
  console.log('Checking database')

  process.stdout.write('  connection: ', )
    const connectionOk = await verifyConnection()
    process.stdout.write(connectionOk ? 'ok\n'
                                      : `NOK Connection\n`)

  const tablesOk = await verifyTables()

  return connectionOk && tablesOk
}


module.exports = {
  verifyDb
}
