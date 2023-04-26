const express = require('express')
const app = express()
const admin = express()
const mysql = require('./db')
const handlebars = require('express-handlebars')
const port = 3000

// Adicionando arquivos como CSS e imagens
app.use(express.static('public'))

// Configurando layout padrão para as páginas
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Rotas Públicas
    app.get('/', (req, res) => {
        const sql = 'SELECT * FROM posts ORDER BY id DESC LIMIT 2'

        mysql.query(sql, (error, results, fields) => {
            if (error) throw error
            res.render('inicio', { dados: results })
        })
    })

    app.get('/sobre', (req, res) => {
        res.render('sobre')
    })

    app.get('/blog', (req, res) => {
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

    app.get('/:caminho', (req, res) => {
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

app.listen(port, () => {
  console.log('Servidor iniciado na porta ' + port);
})