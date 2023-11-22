const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const bcrypt = require('bcrypt')
const Usuario = require('./modules/Cliente')
const Potes = require('./modules/Potes')
const Sementes = require('./modules/Sementes')


const PORT = 3000
const hostname = 'localhost'

let log = false
let usuario = ``
let tipoUsuario = ``

// ==================== express ====================
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
// ==================== handlebars =================
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// ================================================= Acesso Cliente
app.post('/cadastro', async(req,res)=>{
    const usuario = req.body.usuario
    const email = req.body.email
    const telefone = req.body.telefone
    const senha = req.body.senha
    const tipo = 'cliente'

    console.log(usuario,email,senha,telefone)

    bcrypt.hash(senha, 10, async (err,hash)=>{
        if(err){
            console.error('Erro ao criar o hash da senha'+err)
            res.render('home', {log, usuario, tipoUsuario})
            return
        }
        try{
            await Usuario.create({usuario: usuario, email: email,telefone: telefone,senha: hash, tipo:tipo})
            console.log('\n')
            console.log('Senha criptografada')
            console.log('\n')

            log = true

            const pesq = await Usuario.findOne({ raw: true, where:{ usuario:usuario, senha: hash}})
            console.log(pesq)

            res.render('home', {log, usuario, tipoUsuario})
        }catch(error){
            console.error('Erro ao criar a senha',error)
            res.render('home', {log, usuario, tipoUsuario})
        }
    })
})

app.get('/cadastrar', (req,res)=>{
    res.render('cadastrar', {log, usuario, tipoUsuario})
})

app.get('/carrinho', (req,res)=>{
    res.render('carrinho', {log, usuario, tipoUsuario})
})

app.get('/potes', (req,res)=>{
    res.render('potes', {log, usuario, tipoUsuario})
})
app.get('/sementes', (req,res)=>{
    res.render('sementes', {log, usuario, tipoUsuario})
})

// ================================================= Acesso Gerente
// ================================================= Potes
app.post('/editarProdutoPotes', async (req,res)=>{
    const nome = req.body.nome
    const quantidadeEstoque = Number(req.body.quantidadeEstoque)
    const precoUnitario = Number(req.body.precoUnitario)
    console.log(nome, quantidadeEstoque, precoUnitario)
    const dados = await Potes.findOne({raw:true, where: {nome:nome}})
    console.log(dados)
    res.redirect('/editarProdutoPotes')

})

app.get('/editarProdutoPotes', (req,res)=>{
    res.render('editarProdutoPotes', {log, usuario, tipoUsuario})
})

app.post('/consultaProdutoPotes', async (req, res)=>{
    const nome_produto = req.body.nome
    console.log(nome_produto)
    const dados = await Potes.findOne({raw:true, where: {nome:nome_produto}})
    console.log(dados)
    res.render('consultaProdutoPotes',{log, usuario, tipoUsuario, valor:dados} )
})

app.get('/listarProdutoPotes', async (req,res)=>{
    const dados = await Potes.findAll({raw:true})
    console.log(dados)
    res.render('listarProdutoPotes', {log, usuario, tipoUsuario, valores:dados})
})

app.post('/cadastrarProdutoPotes', async (req,res)=>{
    const nome = req.body.nome
    const quantidadeEstoque = req.body.quantidadeEstoque
    const precoUnitario = req.body.precoUnitario
    console.log(nome,tamanho, quantidadeEstoque, precoUnitario)
    await Potes.create({nome:nome, tamanho:tamanho, quantidadeEstoque: quantidadeEstoque, precoUnitario: precoUnitario})
    let msg = 'Dados Cadastrados'
    res.render('cadastrarProdutoPotes', {log, usuario, tipoUsuario})
})

app.get('/cadastrarProdutoPotes', (req,res)=>{
    res.render(' ', {log, usuario, tipoUsuario})
})
// ================================================= Sementes
app.post('/editarProdutoSementes', async (req,res)=>{
    const nome = req.body.nome
    const quantidadeEstoque = Number(req.body.quantidadeEstoque)
    const precoUnitario = Number(req.body.precoUnitario)
    console.log(nome, quantidadeEstoque, precoUnitario)
    const dados = await Sementes.findOne({raw:true, where: {nome:nome}})
    console.log(dados)
    res.redirect('/editarProdutoSementes')

})

app.get('/editarProdutoSementes', (req,res)=>{
    res.render('editarProdutoSementes', {log, usuario, tipoUsuario})
})

app.post('/listarProdutoSementes', async (req, res)=>{
    const nome_produto = req.body.nome
    console.log(nome_produto)
    const dados = await Sementes.findOne({raw:true, where: {nome:nome_produto}})
    console.log(dados)
    res.render('listarProdutoSementes',{log, usuario, tipoUsuario, valor:dados} )
})

app.get('/listarProdutoSementes', async (req,res)=>{
    const dados = await Sementes.findAll({raw:true})
    console.log(dados)
    res.render('listarProdutoSementes', {log, usuario, tipoUsuario, valores:dados})
})

app.post('/cadastrarProdutoSementes', async (req,res)=>{
    const nome = req.body.nome
    const quantidadeEstoque = req.body.quantidadeEstoque
    const precoUnitario = req.body.precoUnitario
    console.log(nome,tamanho, quantidadeEstoque, precoUnitario)
    await Sementes.create({nome:nome, tamanho:tamanho, quantidadeEstoque: quantidadeEstoque, precoUnitario: precoUnitario})
    let msg = 'Dados Cadastrados'
    res.render('cadastrarProdutoSementes', {log, usuario, tipoUsuario})
})

app.get('/cadastrarProdutoSementes', (req,res)=>{
    res.render('cadastrarProdutoSementes', {log, usuario, tipoUsuario})
})
// ================================================= Login
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    console.log(email,senha)
    const pesq = await Usuario.findOne({raw:true, where:{email:email}})
    console.log(pesq)
    let msg = 'Usuário não Cadastrado'
    if(pesq == null){
        res.render('login', {msg})
        
    }else{
        // comparando a senha com o uso de hash
        bcrypt.compare(senha, pesq.senha, (err,resultado)=>{
           if(err){
                console.error('Erro ao comparar a senha',err)
                res.render('home', {log, usuario, tipoUsuario})
           }else if(resultado){
            console.log('Cliente existente')
            if(pesq.tipo === 'admin'){
                log = true
                usuario = pesq.usuario
                tipoUsuario = pesq.tipo
                console.log(tipoUsuario)
                res.render('gerenciador', {log, usuario, tipoUsuario})        
            }else if(pesq.tipo === 'cliente'){
                log = true
                usuario = pesq.usuario
                tipoUsuario = pesq.tipo
                console.log(usuario)
                res.render('home', {log, usuario, tipoUsuario})
           }
           }else{
            console.log('senha incorreta')
            res.render('home', {log, usuario, tipoUsuario})
           }
        })
    }
})

app.get('/login', (req,res)=>{
    log = false
    usuario = ''
    res.render('login', {log, usuario, tipoUsuario})
})

app.get('/logout', (req,res)=>{
    log = false
    usuario = ''
    res.render('home', {log, usuario, tipoUsuario})
})
// ============= renderizando ======================

// ==================== Rota Padrão ========================
app.get('/', (req,res)=>{
    res.render('home', {log, usuario, tipoUsuario})
})
/* ------------------------------------------------- */
conn.sync().then(()=>{
    app.listen(PORT,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o banco de dados!'+error)
})