const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado!');
});

module.exports = connection;