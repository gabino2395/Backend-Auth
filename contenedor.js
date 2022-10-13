const {options} = require('./mariadb/conexiondb')
const knex = require('knex') (options)

class Contenedor{
    constructor(productos){
        
        this.tabla = productos
    }
    
    async getMensajes(){
        try{
            let dataArchivo = await fs.promises.readFile((__dirname, 'mensajes.txt'), 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            let mensaje = dataArchivoParse
            if(mensaje){
                return mensaje               
            }else{
                console.log('No se encontro')
            }

        }catch(error){
            console.log(error)
        }
    }


    async postMensaje(mensajeNuevo){
        try{
            let dataArchivo  = await fs.promises.readFile((__dirname, 'mensajes.txt'), 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            if(dataArchivoParse.length){
            const obj = dataArchivoParse.push(mensajeNuevo)    
            await fs.promises.writeFile((__dirname, 'mensajes.txt'), JSON.stringify(dataArchivoParse, null, 1))
            return mensajeNuevo   
            }else{
            await fs.promises.writeFile((__dirname, 'mensajes.txt'), JSON.stringify(dataArchivoParse, null, 1))
            }
        }catch(error){
            console.log(error)
        }
      
    } 
  
    async postProducto(productoNuevo){
        try{
            let dataArchivo  = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            productoNuevo.id = dataArchivoParse.length+1
            if(dataArchivoParse.length){
            const obj = dataArchivoParse.push(productoNuevo)    
            await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParse, null, 1))
            return productoNuevo   
            }else{
            await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchivoParse, null, 1))
            }
        }catch(error){
            console.log(error)
        }
      
    } 

    async updateById(obj, id){
        try{
            console.log(obj)
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            const objindex = dataArchivoParse.findIndex(prod => prod.id == obj.id)
            console.log(objindex)
            if(objindex !== -1){
                dataArchivoParse[objindex] = obj
                await fs.promises.writeFile(this.ruta,JSON.stringify(dataArchivoParse, null, 1))
            }else{
                return {error: 'No hay productos con ese Id'}
            }    
           }catch(error){
            console.log(error)
        }
    }
    
    async getId(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            let dataArchivoParse = JSON.parse(dataArchivo)
            console.log(id)
            const objIndex = dataArchivoParse.find(prod => prod.id == id)
            console.log(objIndex)
            if(objIndex){
                return objIndex
            }else{
                return {error: 'No hay productos con ese Id'}
            }    
           }catch(error){
            console.log(error)
        }
    }
    
    async deleteById(id){
        try{
            let dataArchivo = await fs.promises.readFile(this.ruta, 'utf-8')
            console.log(id)
            let dataArchivoParse = JSON.parse(dataArchivo)
            const objindex = dataArchivoParse.findIndex(prod => prod.id == id)
            console.log(objindex)
            if(objindex != -1){
                const borradoFinal = dataArchivoParse.splice(objindex,1)
                await fs.promises.writeFile(this.ruta,JSON.stringify(dataArchivoParse))
                return {'id':id}
            }else{
                return {error: 'No hay productos con ese ID'}
            }    
           }catch(error){
            console.log(error)
        }
    }
}

module.exports = Contenedor

