// Carregando módulos
    const express = require('express')
    const router = express()
    const mysql = require('../db')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const session = require('express-session')
    const cookieParser = require('cookie-parser')
    const multer = require('multer')
    const path = require('path')
    const data = new Date()
    const dataFormatada = ((data.getDate() )) + "-" + ((data.getMonth() + 1)) + "-" + data.getFullYear(); 

    router.use(bodyParser.urlencoded({ extended: true }))
    router.use(cookieParser());

// Configura a session
    router.use(session({
        secret: 'PainelJake',
        resave: true,
        saveUninitialized: true
    }));

// configura o multer para armazenar os arquivos enviados na pasta ../public/posts/
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/posts/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
// configura o multer para permitir apenas o upload de arquivos de imagem com as extensões jpg, jpeg, png ou gif
    const upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('São permitidas apenas imagens'))
            }
            cb(null, true)
        }
    })

// Adicionando arquivos como CSS e imagens
    router.use(express.static('public'))

// Configurando layout padrão para as páginas
    router.engine('handlebars', handlebars.engine({defaultLayout: 'admin'}))
    router.set('view engine', 'handlebars')

// Rotas
    // Rota de login ao painel de controle
    router.get('/login', (req, res) => {
        res.render('admin/login')
    })

    router.post('/login', (req, res) => {
        const dados = req.body
        const sql = "SELECT * FROM usuarios WHERE usuario = '" + dados.usuario + "' AND senha = '" + dados.senha + "'"

        mysql.query(sql, (error, results, fields) => {
            if (error) throw error
            if(results.length > 0) {
                console.log("Logado com o usuario: " + dados.usuario + " e senha: " + dados.senha)
                req.session.authenticated = true
                res.redirect('/admin/painel')
            }
            else {
                res.redirect('/admin/login')
                console.log("Usuário e/ou senha incorreto!")
            }
        })
    })

    // Rota de painel
    router.get('/painel', async (req, res) => {
        if (req.session.authenticated) {
            const queryPostsBlog = 'SELECT * FROM posts ORDER BY id DESC'
            mysql.query(queryPostsBlog, (error, results, fields) => {
                if (error) throw error
                const postsBlog = results;
                postsBlog.forEach(function (postsBlog) {
                    postsBlog.texto = postsBlog.texto.replace(/\n/g, '<br>');
                    postsBlog.texto = postsBlog.texto.substr(0, 500)
                });
                res.render('admin/painel', { posts: postsBlog })
            })
        } 
        else {
            res.redirect('/admin/login')
        }
    })  

    // Rota de adicionar post
    router.get('/insert', (req, res) => {
        if (req.session.authenticated) {
            res.render('admin/insert')
        } 
        else {
            res.redirect('/admin/login');
        }
    })

    router.post('/insert', upload.single('image'), (req, res) => {
        const dados = req.body
        const file = req.file
        const sql = "INSERT INTO posts (titulo, texto, dia, caminho, imagem) VALUES ('" + dados.titulo + "', '" + dados.texto + "', '" + dataFormatada + "', '" + path.parse(file.originalname).name + "', '" + file.originalname + "');"

        mysql.query(sql, (error, results, fields) => {
            if (error) throw error
            res.redirect('/admin/painel')
        })
    })
    router.use(bodyParser.json())

    // Rota de atualizar post
    router.get('/:post', (req, res) => {
        const sql = "SELECT * FROM posts WHERE caminho = '" + req.params.post + "'"
    
        mysql.query(sql, (error, results, fields) => {
            if (error) throw error
            const registros = results;
            res.render('admin/update', { post: registros })
        })
    })
    router.post('/:post', (req, res) => {
        const titulo = req.body.titulo
        const texto = req.body.texto
        console.log(req.body)
        const sql = "UPDATE posts SET titulo = '" + titulo + "', texto = '" + texto + "', dia = '" + dataFormatada + "' WHERE caminho = '" + req.params.post + "';"
        mysql.query(sql, (error, results, fields) => {
            if (error) throw error
            res.redirect('/admin/painel')
        })
    })

    // Função para confirmar delete do post
    router.get('/delete/:post', (req, res) => {
        const sql = "DELETE FROM posts WHERE caminho = '" + req.params.post + "';"
        mysql.query(sql, (error, results, fields) => {
            if (error) throw error
            res.redirect('/admin/painel')
        })
    })

// Exportando módulo
module.exports = router