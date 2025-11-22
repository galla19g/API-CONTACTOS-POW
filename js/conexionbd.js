const mysql=require("mysql")
const express=require("express")
const path=require("path")
const app=express()
app.set('view engine','ejs')
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

let conexion=mysql.createConnection({
    host:"localhost",
    database:"contactos",
    user:"root",
    password:"",
    multipleStatements:true
})

conexion.connect(function(err){
    if(err){
        throw err   
    }else{
        console.log("conexion exitosa")
    }
})

app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.render('index', {mensaje: ''})  // ← CAMBIO AQUÍ
})

app.get("/crearcontacto",(req,res)=>{
    const consultagenero="SELECT * FROM GENERO"
    const consultabarrios="SELECT * FROM DIRECCION"
    const consulta_tipo_telefono="SELECT * FROM TIPO_TELEFONO"
    conexion.query(consultagenero,(err,respuestagenero)=>{
    if(err){
        throw err
    }else {
            conexion.query(consultabarrios,(err,respuestabarrios)=>{
                if(err){
                        throw err
                }else {
                    conexion.query(consulta_tipo_telefono,(err,respuestatipotelefono)=>{
                        if(err){
                            throw err
                        }else {
                            res.render('crearcontacto',{respuestagenero,respuestabarrios,respuestatipotelefono})
                        }
                    })
                }
            })
    }
    })
})

app.get("/contactos",(req,res)=>{
    const consulta="SELECT * FROM  contacto INNER JOIN genero  ON ( contacto.id_genero = genero.id_genero )INNER JOIN direccion ON (contacto.id_direccion=direccion.id_direccion)INNER JOIN tipo_telefono ON (contacto.id_tipo_telefono=tipo_telefono.id_tipo_telefono)"
    conexion.query(consulta,(err,respuesta)=>{
        if(err){
            throw err
        }else{
            res.json(respuesta)
        }
    })
})

app.post("/crearcontacto/crear",(req,res)=>{
    const {primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,genero,direccion,tipo_telefono,email,telefono,imagen}=req.body
    const consulta="INSERT INTO contacto(primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,id_genero,id_direccion,id_tipo_telefono,email,telefono,imagen) VALUES (?,?,?,?,?,?,?,?,?,?)"
    conexion.query(consulta,[primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,genero,direccion,tipo_telefono,email,telefono,imagen],(err,resultado)=>{
    if(err){
        throw err;
    }else{
        res.render('index',{mensaje:'Guardado Exitosamente'})
    }
    })
})

app.listen(3000,()=>{
    console.log("servidor activo en http://localhost:3000")
})