import {Router} from "express"
import {userController} from "../controllers/user.controllers.js";
import { authController } from "../controllers/auth.controller";
import {personaController} from "../controllers/persona.controllers.js";
import {empleadoController} from "../controllers/empleado.controllers.js";
import {usuarioController} from "../controllers/usuario.controllers.js";
import {participanteController} from "../controllers/participante.controllers.js";
import {capacitacionController} from "../controllers/capacitacion.controllers.js";
import {inscripcionCapacitacionController} from "../controllers/inscripcionCapacitacion.controllers.js";


import {auth, verificarNivelPermiso} from "../middlewares/auth.middleware.js"

import multer from "multer"


//importamos controlador de reporte
import * as reporte_Fa_CapController from "../controllers/reporteFacilitadoresCapacitaciones.controllers.js"
import * as generaPdfInscripcionesControllers from "../controllers/reporteInscripciones.controllers.js"
import { grupoSeguimientoController } from "../controllers/grupoSeguimiento.controllers.js";
import { contactoController } from "../controllers/contacto.controllers.js";
import { historicoController } from "../controllers/historicoLlamadas.controllers.js";
import { validacionController } from "../controllers/validacion.controllers.js";
import { tipoUsuarioController } from "../controllers/tipo_usuario.controllers.js";
import { dashboardController } from "../controllers/dashboard.controllers.js";
import { exportarExcelController } from "../controllers/exportarExcel.controllers.js";

//configurar multer para imagenes o archivos



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload');
    },  
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  
      cb(null, uniqueSuffix + "-" + file.originalname); //nombre original con toda su extensión
    },
  });
  
const upload = multer({
    storage: storage,  
    limits: { fileSize: 11000000 },
  });
  
const fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err) {
      //res.send(413)  
      res.status(413).json({
        status: 413,
  
        mensaje: "Archivo Demasiado grande, Límite máximo de 10 MB",
  
        error: false,
      });
    } else {
      next();
    }
};





export const Route = Router();




//endpoint


Route.get('/',function(req, res){
    res.json({
        mensaje:"La api está lista para usar...",
        error:false
    })

})

// auth
Route.post('/auth/login',authController.login)
Route.put('/auth/subirfotografia/:id_usuario',auth,upload.single("archivo"),fileSizeLimitErrorHandler,authController.subir_archivo)
//user
// VAlidaciones
Route.get('/validacion/usuario/:nombre_usuario',auth,validacionController.validarNombreUsuario)
Route.get('/validacion/carnet/:nro_ci',auth,validacionController.validarCarnetIdentidad)
Route.get('/validacion/correo/:correo',auth,validacionController.validarCorreo)
Route.get('/validacion/numeroContacto/:numero_contacto',auth,validacionController.validarNumeroContacto)

Route.post('/user/create',auth,userController.create_user)
Route.get('/user/read/:id',auth,userController.read_user)
Route.get('/user/readAll',auth,userController.readAll_user)
Route.put('/user/update',auth,userController.update_user)
Route.delete('/user/delete/:id',auth,userController.delete_user)





Route.post('/persona/create',auth,personaController.create_persona)
Route.get('/persona/read/:id_persona',personaController.read_persona)
Route.get('/persona/readAll',auth,verificarNivelPermiso(10),personaController.readAll_persona)
Route.put('/persona/update',personaController.update_persona)
Route.delete('/persona/delete/:id_persona',personaController.delete_persona)


Route.get('/pais/readAll',auth,personaController.readAll_Pais)
Route.get('/ciudad/readAll',auth,personaController.readAll_Ciudad)
Route.get('/sexo/readAll',auth,personaController.readAll_Sexo)




Route.post('/empleado/create',auth,verificarNivelPermiso(30),empleadoController.create_empleado)
Route.post('/empleado/asignarNuevo',auth,empleadoController.create_AsignarEmpleado)

Route.get('/empleado/read/:id_empleado',empleadoController.read_empleado)
Route.get('/empleado/readAll',auth,verificarNivelPermiso(29),empleadoController.readAll_empleado)
Route.put('/empleado/update',auth,verificarNivelPermiso(31),empleadoController.update_empleado)
Route.delete('/empleado/delete/:id_empleado',auth,verificarNivelPermiso(32),empleadoController.delete_empleado)
Route.get('/cargos/readAll',auth,empleadoController.readAll_cargos)
Route.get('/empresas/readAll',auth,empleadoController.readAll_empresas)
Route.get('/empleado/personasAll',auth,empleadoController.personasNoEmpleados)

Route.get('/auth/perfil',auth,authController.getPerfil)

Route.post('/usuario/create',auth,verificarNivelPermiso(26),upload.single("archivo"),fileSizeLimitErrorHandler,usuarioController.create_usuario)
Route.get('/usuario/read/:id_usuario',auth,usuarioController.read_usuario)
Route.get('/usuario/readAll',auth,verificarNivelPermiso(5),usuarioController.readAll_usuario)
Route.put('/usuario/update',auth,verificarNivelPermiso(27),upload.single("archivo"),fileSizeLimitErrorHandler,usuarioController.update_usuario)
Route.delete('/usuario/delete/:id_usuario',auth,verificarNivelPermiso(28),usuarioController.delete_usuario)
Route.get('/tipoUsuarios/readAll',auth,usuarioController.readAll_tipo_usuario)

//NivelAcessoUsuarios
Route.get('/nivelAcceso/readAll',auth,usuarioController.NivelRoles)


Route.post('/participante/create',auth,verificarNivelPermiso(3),participanteController.create_participante)
Route.post('/participante/nuevo',auth,verificarNivelPermiso(3),participanteController.create_participante_nuevo)

Route.get('/participante/read/:id_participante',auth,participanteController.read_participante)
Route.get('/participante/readAll',auth,verificarNivelPermiso(8),participanteController.readAll_participante)
Route.put('/participante/update',auth,verificarNivelPermiso(15),participanteController.update_participante)
Route.delete('/participante/delete/:id_participante',auth,verificarNivelPermiso(21),participanteController.delete_participante)
Route.get('/participante/participantesAll',auth,participanteController.personasNoParticipantes)

Route.get('/participante/codigo/:codigo_participante',participanteController.buscar_codigo)




Route.post('/capacitacion/create',auth,verificarNivelPermiso(4),capacitacionController.create_capacitacion)
Route.get('/capacitacion/read/:id_capacitacion',auth,capacitacionController.read_capacitacion)
Route.get('/capacitacion/readAll',auth,verificarNivelPermiso(9),capacitacionController.readAll_capacitacion)
Route.put('/capacitacion/update',auth,verificarNivelPermiso(12),capacitacionController.update_capacitacion)
Route.delete('/capacitacion/delete/:id_capacitacion',auth,verificarNivelPermiso(17),capacitacionController.delete_capacitacion)
Route.put('/capacitacion/finalizar/:id_capacitacion',auth,capacitacionController.terminar_capacitacion)
Route.get('/categoria/readAll',auth,capacitacionController.listarCategoria)
Route.put('/capacitacion/vigente/:id_capacitacion',auth,capacitacionController.noVigenteCapaciatcion)


Route.post('/capacitacion/inscripcion/:id_capacitacion',auth,inscripcionCapacitacionController.inscribir_capacitacion)
Route.post('/capacitacion/participantes/nuevos/',auth,verificarNivelPermiso(24),inscripcionCapacitacionController.inscribirListaParticipantes)
Route.get('/participantes/inscritos/:id_capacitacion',auth,inscripcionCapacitacionController.participantes_inscritos)
Route.get('/participantes/disponibles/:id_capacitacion',auth,inscripcionCapacitacionController.getParticipantesNoInscritos)
Route.delete('/capacitacion/eliminarInscripcion/:id_inscripcion',auth,inscripcionCapacitacionController.eliminarUnParticipanteInscrito)


//Generadores de pdf
Route.get('/reporte/facilitadores/pdf/',reporte_Fa_CapController.generaPdf_reporte_fa_cap)
Route.get('/reporte/inscritos/pdf/:id_capacitacion',auth,verificarNivelPermiso(25),generaPdfInscripcionesControllers.generaPdfInscripciones)


//Seguimiento de llamadas

Route.post('/grupoSeguimiento/create',auth,verificarNivelPermiso(1),grupoSeguimientoController.create_grupoSeguimiento)
Route.get('/grupoSeguimiento/read/:id_grupo_seguimiento',auth,grupoSeguimientoController.read_grupoSeguimiento)
Route.get('/grupoSeguimiento/readAll',auth,verificarNivelPermiso(6),grupoSeguimientoController.readAll_grupoSeguimiento)
Route.put('/grupoSeguimiento/update',auth,verificarNivelPermiso(13),grupoSeguimientoController.update_grupoSeguimiento)
Route.delete('/grupoSeguimiento/delete/:id_grupo_seguimiento',auth,verificarNivelPermiso(18),grupoSeguimientoController.delete_grupoSeguimiento)


Route.post('/contacto/create',auth,verificarNivelPermiso(2),contactoController.create_contacto)
Route.get('/contacto/read/:id_contacto',auth,contactoController.read_contacto)
Route.get('/contacto/readAll',verificarNivelPermiso(7),auth,contactoController.readAll_contacto)
Route.put('/contacto/update',auth,verificarNivelPermiso(16),contactoController.update_contacto)
Route.delete('/contacto/delete/:id_contacto',auth,verificarNivelPermiso(19),contactoController.delete_contacto);
Route.post('/contacto/subir', auth,verificarNivelPermiso(22), contactoController.subirContactos);

Route.get('/estados/readAll',auth,contactoController.readAll_estadoContacto)
Route.get('/tipoSeguimiento/readAll',auth,contactoController.readAll_tipoSeguimiento)

Route.post('/historicoLlamadas/subir',auth,historicoController.registrar_contactos)
Route.post('/historicoLlamadas/asignar',auth,verificarNivelPermiso(23),historicoController.asignarContactoEnSeguimiento)

Route.get('/historicoLlamadas/readAll/:id_grupo_seguimiento',auth,historicoController.verSeguimientoContacto)
Route.put('/historicoLlamadas/update',auth,verificarNivelPermiso(14),historicoController.actualizarSeguimientoContacto)
Route.delete('/historicoLlamadas/delete_contacto/:id_historico',auth,verificarNivelPermiso(20),historicoController.eliminarContactoEnSeguimiento)

Route.post('/historicoLlamadas/registraCambios',auth,historicoController.registrarCambiosLlamada)
Route.get('/historicoLlamadas/readAllCambios/:id_historico',auth,historicoController.verCambiosLlamada)


//Tipos de usuarios tipoUsuario

Route.post('/tipoUsuario/create',auth,tipoUsuarioController.create_tipo_usuario)
Route.get('/tipoUsuario/read/:id_tipo_usuario',auth,tipoUsuarioController.read_tipo_usuario)
Route.put('/tipoUsuario/update',auth,tipoUsuarioController.update_tipo_usuario)
Route.get('/tipoUsuario/readAll',auth,tipoUsuarioController.readAll_tipo_usuario)
Route.get('/nivelAcceso/tipoUsuario/:id_tipo_usuario',auth,tipoUsuarioController.nivelAccesoTipoUsuario)
Route.get('/niveles/readAll',auth,tipoUsuarioController.niveles_readAll)
Route.post('/nivelAcceso/asignar',auth,tipoUsuarioController.asignarNivelesATipoUsuario)
Route.delete('/tipoUsuario/delete/:id_tipo_usuario',auth,tipoUsuarioController.delete_tipo_usuario)


//dashboard

Route.get('/dashboard/ciudades',auth,dashboardController.cantidadParticipantesPorCiudadaes)
Route.get('/dashboard/sexo',dashboardController.cantidadParticipantePorSexo)

//reporte de excel

Route.get('/reporte/excel/:id_grupo_seguimiento',exportarExcelController.generarReporteSeguimiento)