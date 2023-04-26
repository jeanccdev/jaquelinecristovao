const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '134679Jcc!',
  database: 'jaqueline'
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado!');
});

module.exports = connection;