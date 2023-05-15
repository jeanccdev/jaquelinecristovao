const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "185.239.210.154",
  user: "u139594422_jaqueline",
  password: "Np270e5g!Np270e5g!",
  database: "u139594422_jaqueline"
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado!');
});

module.exports = connection;