const mysql = require('mysql');

/*const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Wpn10080&@',
  database: 'OrderDatabase'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});


module.exports = connection;*/
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'OrderDatabase'
    }
  });
  
  // Attempt to perform a simple SQL query to test the connection
  knex.raw('SELECT 1 + 1 AS result').then(() => {
    console.log('Connected to the database successfully');
  }).catch((err) => {
    console.error('Error connecting to the database:', err);
  });
  
  module.exports = knex;
