// Carregando módulos
  const express = require('express')
  const router = express()
  const mysql = require('../db')

// Rotas
  router.get('/', (req, res) => {
    const sql = 'SELECT * FROM posts ORDER BY id DESC LIMIT 2'

    mysql.query(sql, (error, results, fields) => {
      if (error) throw error
      res.render('inicio', { dados: results })
    })
  })

  router.get('/sobre', (req, res) => {
    res.render('sobre')
  })

  router.get('/blog', (req, res) => {
    const sql = 'SELECT * FROM posts ORDER BY id DESC'

    mysql.query(sql, (error, results, fields) => {
      if (error) throw error
      const registros = results;
      registros.forEach(function (registro) {
        registro.texto = registro.texto.replace(/\n/g, '<br>');
        registro.texto = registro.texto.substr(0, 1000)
      });
      res.render('blog', { dados: registros })
    })
  })

  router.get('/:caminho', (req, res) => {
    const sql = "SELECT * FROM posts WHERE caminho = '" + req.params.caminho + "'"

    mysql.query(sql, (error, results, fields) => {
        if (error) throw error
        const registros = results;
        registros.forEach(function (registro) {
            registro.texto = registro.texto.replace(/\n/g, '<br>');
        });
        res.render('post', { dados: registros })
    })
  })

module.exports = router