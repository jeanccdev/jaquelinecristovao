// Carregando módulos
    const express = require('express')
    const app = express()
    const mysql = require('./db')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')

    const publicRoutes = require('./routes/public')
    const adminRoutes = require('./routes/admin')

// Adicionando arquivos como CSS e imagens
    app.use(express.static('public'))

// Configurando layout padrão para as páginas
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

// Usando os grupos de rotas separados como middleware
    app.use('/', publicRoutes)
    app.use('/admin', adminRoutes)

// Rodando app
    app.listen(process.env.PORT || 8089, () => {
        console.log('Servidor iniciado na porta 3000');
    })