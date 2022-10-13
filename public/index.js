
const server = io().connect()

const renderProduct = (productos) =>{
    console.log(productos)
    let listado = document.querySelector('#listado')
    let html = productos.map(prod => {
        return `<li>${prod.title} ${prod.price} <img class="image" src=${prod.thumbnail}</li>`
    })
    listado.innerHTML = html.join(' ')
}

const addProduct = (evnt) =>{
    const title = document.querySelector('#title').value
    const price = document.querySelector('#price').value
    const thumbnail = document.querySelector('#thumbnail').value
    const productoNuevo = {title, price, thumbnail}
    server.emit('mensaje-nuevo', productoNuevo)
}

server.on('mensaje-servidor', listNueva => {
   console.log(listNueva.productos)
    renderProduct(listNueva.productos)
   
})

const renderMensaje = (mensajes) =>{
    console.log(mensajes)
    let listado = document.querySelector('#listado2')
    let html = mensajes.map(prod => {
        return `<li class="mensajelist"><p class="email">${prod.email}</p> <p class="time">${prod.time}</p> : <p class="mensaje">${prod.message}</p> </li>`
    })
    listado.innerHTML = html.join(' ')
}
const addMessage = (evnt) =>{
    const email = document.querySelector('#email').value
    const message = document.querySelector('#message').value
    const time = new Date()
    const mensajeNuevo = {email, message, time}
    server.emit('mensaje-nuevo2', mensajeNuevo)
    return false
}

server.on('mensaje-servidor2', listMensaje =>{
    console.log(listMensaje)
    renderMensaje(listMensaje.mensajes)
})

