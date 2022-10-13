if(process.env.NODE !== 'production'){
  require('dotenv').config()
}

const express = require('express')
const { Router } = express
const Contenedor = require("./contenedor");
const contenedor = new Contenedor('./productos.txt')
const contenedor2 = new Contenedor('./mensajes.txt')
const {Server: HTTPServer} = require('http')
const {Server: IOServer} = require('socket.io')
const bcrypt = require('bcrypt')
const passport = require('passport')
const app = express()
const routerProductos = Router()
const httpServer = new HTTPServer(app)
const io = new IOServer(httpServer)
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport.config')
const methodOverride = require('method-override')

initializePassport(passport,
         email => users.find(user => user.email === email),
         id => users.find(user => user.id === id)
)


app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
app.use(flash())
app.use(session({
  secret: 'secret session',
  resave: false,
  saveUninitialized: false 
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

httpServer.listen(8080, () =>{
    console.log(httpServer.address().port)
})
httpServer.on('error', err => console.log(err))

const users = []
///-Productos-///

routerProductos.get('/', checkAuthenticated, async (req, res) => {
    /*const productos = await contenedor.getProductos()*/
    res.render('index'/*, {formulario: productos}*/) 
})

routerProductos.get('/login', checkNotAuthenticated, async (req, res) => {
   res.render('login') 
})

routerProductos.post('/login', checkNotAuthenticated, passport.authenticate('local',{
successRedirect: '/',
failureRedirect: 'login',
failureFlash: true
}))

routerProductos.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('login')
  } catch (err) {
    res.redirect('register')
  }
  console.log(users)
})

routerProductos.get('/register', async (req, res) => {
   
res.render('register') 
})

/*
io.on('connection', async (socket) =>{
    const productos =  await contenedor.getProductos()
    socket.emit('mensaje-servidor', {productos} )
    socket.on('mensaje-nuevo', (productoNuevo) =>{
        productos.push(productoNuevo)
        contenedor.postProducto(productoNuevo)
      const listNueva = {
        mensaje: 'ok',   
        productos
      }
      io.sockets.emit('mensaje-servidor', listNueva)
    }) 
})

io.on('connection', async (socket) =>{
    const mensajes =  await contenedor.getMensajes()
    socket.emit('mensaje-servidor2', {mensajes})
    socket.on('mensaje-nuevo2', (mensajeNuevo) =>{
        mensajes.push(mensajeNuevo)
        contenedor.postMensaje(mensajeNuevo)
      const listMensaje = {
        mensaje: 'ok',   
        mensajes
      }
      io.sockets.emit('mensaje-servidor2', listMensaje)
    }) 
})*/

routerProductos.delete('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
} 

app.use('/', routerProductos)






