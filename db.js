const mysql = require('mysql');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado!');
});

module.exports = connection;