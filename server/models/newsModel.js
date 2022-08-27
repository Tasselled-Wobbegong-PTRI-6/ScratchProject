const { Pool } = require('pg');

const PG_URI = 'postgres://pydxjssx:5rJMuVa1CjjQ1cQA8v0nArw8Sa_p3GZM@ziggy.db.elephantsql.com/pydxjssx'

const pool = new Pool({
    connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
  queryAsync: async (text, params) => {
    console.log('executed query', text);
    return await pool.query(text, params);
  }
};