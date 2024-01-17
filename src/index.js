/// 1 importar modulos terceros
require('dotenv').config()
// import dotenv from 'dotenv'
// dotenv.config()
//const express = require ("express");
import express from "express";

// 5 nueva alternativa para rutas
import { Route  } from "./router";


import cors from "cors";



// 2. declarar variables auxiliares
const puerto = process.env.PORT ?? 4000;

// 3. inicializando express

let app = express();

//8. habilitar cors
const listaBlanca = ['http://localhost:4200','https://ff80ca5a.cliente-angular-9k9.pages.dev','https://cliente-angular-9k9.pages.dev']
app.use(cors({origin: listaBlanca}))

//9. carga de archivos estaticos
app.use(express.static('public'))

//7. habilitar json en body
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// 6 habilitar rutas
app.use('/api/v1',Route)

// 4. levantar el servidor express
app.listen(puerto,()=>{

   console.log(`servidor levantado en el puerto ${puerto}`);

})

