"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = void 0;
var _express = require("express");
var _userControllers = require("../controllers/user.controllers.js");
var _auth = require("../controllers/auth.controller");
var _personaControllers = require("../controllers/persona.controllers.js");
var _empleadoControllers = require("../controllers/empleado.controllers.js");
var _usuarioControllers = require("../controllers/usuario.controllers.js");
var _participanteControllers = require("../controllers/participante.controllers.js");
var _capacitacionControllers = require("../controllers/capacitacion.controllers.js");
var _inscripcionCapacitacionControllers = require("../controllers/inscripcionCapacitacion.controllers.js");
var _facilitadorControllers = require("../controllers/facilitador.controllers.js");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _multer = _interopRequireDefault(require("multer"));
var reporte_Fa_CapController = _interopRequireWildcard(require("../controllers/reporteFacilitadoresCapacitaciones.controllers.js"));
var generaPdfInscripcionesControllers = _interopRequireWildcard(require("../controllers/reporteInscripciones.controllers.js"));
var _informe_facilitador_capacitacionControllers = require("../controllers/informe_facilitador_capacitacion.controllers.js");
var _grupoSeguimientoControllers = require("../controllers/grupoSeguimiento.controllers.js");
var _contactoControllers = require("../controllers/contacto.controllers.js");
var _historicoLlamadasControllers = require("../controllers/historicoLlamadas.controllers.js");
var _validacionControllers = require("../controllers/validacion.controllers.js");
var _tipo_usuarioControllers = require("../controllers/tipo_usuario.controllers.js");
var _dashboardControllers = require("../controllers/dashboard.controllers.js");
var _exportarExcelControllers = require("../controllers/exportarExcel.controllers.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//importamos controlador de reporte

//configurar multer para imagenes o archivos

const storage = _multer.default.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); //nombre original con toda su extensión
  }
});

const upload = (0, _multer.default)({
  storage: storage,
  limits: {
    fileSize: 11000000
  }
});
const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    //res.send(413)  
    res.status(413).json({
      status: 413,
      mensaje: "Archivo Demasiado grande, Límite máximo de 10 MB",
      error: false
    });
  } else {
    next();
  }
};
const Route = exports.Route = (0, _express.Router)();

//endpoint

Route.get('/', function (req, res) {
  res.json({
    mensaje: "La api está lista para usar...",
    error: false
  });
});

// auth
Route.post('/auth/login', _auth.authController.login);
Route.put('/auth/subirfotografia/:id_usuario', _authMiddleware.auth, upload.single("archivo"), fileSizeLimitErrorHandler, _auth.authController.subir_archivo);
//user
// VAlidaciones
Route.get('/validacion/usuario/:nombre_usuario', _authMiddleware.auth, _validacionControllers.validacionController.validarNombreUsuario);
Route.get('/validacion/carnet/:nro_ci', _authMiddleware.auth, _validacionControllers.validacionController.validarCarnetIdentidad);
Route.get('/validacion/correo/:correo', _authMiddleware.auth, _validacionControllers.validacionController.validarCorreo);
Route.get('/validacion/numeroContacto/:numero_contacto', _authMiddleware.auth, _validacionControllers.validacionController.validarNumeroContacto);
Route.post('/user/create', _authMiddleware.auth, _userControllers.userController.create_user);
Route.get('/user/read/:id', _authMiddleware.auth, _userControllers.userController.read_user);
Route.get('/user/readAll', _authMiddleware.auth, _userControllers.userController.readAll_user);
Route.put('/user/update', _authMiddleware.auth, _userControllers.userController.update_user);
Route.delete('/user/delete/:id', _authMiddleware.auth, _userControllers.userController.delete_user);
Route.post('/persona/create', _authMiddleware.auth, _personaControllers.personaController.create_persona);
Route.get('/persona/read/:id_persona', _personaControllers.personaController.read_persona);
Route.get('/persona/readAll', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(10), _personaControllers.personaController.readAll_persona);
Route.put('/persona/update', _personaControllers.personaController.update_persona);
Route.delete('/persona/delete/:id_persona', _personaControllers.personaController.delete_persona);
Route.get('/pais/readAll', _authMiddleware.auth, _personaControllers.personaController.readAll_Pais);
Route.get('/ciudad/readAll', _authMiddleware.auth, _personaControllers.personaController.readAll_Ciudad);
Route.get('/sexo/readAll', _authMiddleware.auth, _personaControllers.personaController.readAll_Sexo);
Route.post('/empleado/create', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(30), _empleadoControllers.empleadoController.create_empleado);
Route.post('/empleado/asignarNuevo', _authMiddleware.auth, _empleadoControllers.empleadoController.create_AsignarEmpleado);
Route.get('/empleado/read/:id_empleado', _empleadoControllers.empleadoController.read_empleado);
Route.get('/empleado/readAll', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(29), _empleadoControllers.empleadoController.readAll_empleado);
Route.put('/empleado/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(31), _empleadoControllers.empleadoController.update_empleado);
Route.delete('/empleado/delete/:id_empleado', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(32), _empleadoControllers.empleadoController.delete_empleado);
Route.get('/cargos/readAll', _authMiddleware.auth, _empleadoControllers.empleadoController.readAll_cargos);
Route.get('/empresas/readAll', _authMiddleware.auth, _empleadoControllers.empleadoController.readAll_empresas);
Route.get('/empleado/personasAll', _authMiddleware.auth, _empleadoControllers.empleadoController.personasNoEmpleados);
Route.get('/auth/perfil', _authMiddleware.auth, _auth.authController.getPerfil);
Route.post('/usuario/create', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(26), upload.single("archivo"), fileSizeLimitErrorHandler, _usuarioControllers.usuarioController.create_usuario);
Route.get('/usuario/read/:id_usuario', _authMiddleware.auth, _usuarioControllers.usuarioController.read_usuario);
Route.get('/usuario/readAll', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(5), _usuarioControllers.usuarioController.readAll_usuario);
Route.put('/usuario/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(27), upload.single("archivo"), fileSizeLimitErrorHandler, _usuarioControllers.usuarioController.update_usuario);
Route.delete('/usuario/delete/:id_usuario', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(28), _usuarioControllers.usuarioController.delete_usuario);
Route.get('/tipoUsuarios/readAll', _authMiddleware.auth, _usuarioControllers.usuarioController.readAll_tipo_usuario);

//NivelAcessoUsuarios
Route.get('/nivelAcceso/readAll', _authMiddleware.auth, _usuarioControllers.usuarioController.NivelRoles);
Route.post('/participante/create', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(3), _participanteControllers.participanteController.create_participante);
Route.post('/participante/nuevo', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(3), _participanteControllers.participanteController.create_participante_nuevo);
Route.get('/participante/read/:id_participante', _authMiddleware.auth, _participanteControllers.participanteController.read_participante);
Route.get('/participante/readAll', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(8), _participanteControllers.participanteController.readAll_participante);
Route.put('/participante/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(15), _participanteControllers.participanteController.update_participante);
Route.delete('/participante/delete/:id_participante', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(21), _participanteControllers.participanteController.delete_participante);
Route.get('/participante/participantesAll', _authMiddleware.auth, _participanteControllers.participanteController.personasNoParticipantes);
Route.get('/participante/codigo/:codigo_participante', _participanteControllers.participanteController.buscar_codigo);
Route.post('/facilitador/create', _authMiddleware.auth, _facilitadorControllers.facilitadorController.create_facilitador);
Route.get('/facilitador/read/:id_facilitador', _facilitadorControllers.facilitadorController.read_facilitador);
Route.get('/facilitador/readAll', _facilitadorControllers.facilitadorController.readAll_facilitador);
Route.put('/facilitador/update', _facilitadorControllers.facilitadorController.update_facilitador);
Route.delete('/facilitador/delete/:id_facilitador', _facilitadorControllers.facilitadorController.delete_facilitador);
Route.post('/capacitacion/create', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(4), _capacitacionControllers.capacitacionController.create_capacitacion);
Route.get('/capacitacion/read/:id_capacitacion', _authMiddleware.auth, _capacitacionControllers.capacitacionController.read_capacitacion);
Route.get('/capacitacion/readAll', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(9), _capacitacionControllers.capacitacionController.readAll_capacitacion);
Route.put('/capacitacion/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(12), _capacitacionControllers.capacitacionController.update_capacitacion);
Route.delete('/capacitacion/delete/:id_capacitacion', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(17), _capacitacionControllers.capacitacionController.delete_capacitacion);
Route.put('/capacitacion/finalizar/:id_capacitacion', _authMiddleware.auth, _capacitacionControllers.capacitacionController.terminar_capacitacion);
Route.get('/categoria/readAll', _authMiddleware.auth, _capacitacionControllers.capacitacionController.listarCategoria);
Route.put('/capacitacion/vigente/:id_capacitacion', _authMiddleware.auth, _capacitacionControllers.capacitacionController.noVigenteCapaciatcion);
Route.post('/capacitacion/inscripcion/:id_capacitacion', _authMiddleware.auth, _inscripcionCapacitacionControllers.inscripcionCapacitacionController.inscribir_capacitacion);
Route.post('/capacitacion/participantes/nuevos/', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(24), _inscripcionCapacitacionControllers.inscripcionCapacitacionController.inscribirListaParticipantes);
Route.get('/participantes/inscritos/:id_capacitacion', _authMiddleware.auth, _inscripcionCapacitacionControllers.inscripcionCapacitacionController.participantes_inscritos);
Route.get('/participantes/disponibles/:id_capacitacion', _authMiddleware.auth, _inscripcionCapacitacionControllers.inscripcionCapacitacionController.getParticipantesNoInscritos);
Route.delete('/capacitacion/eliminarInscripcion/:id_inscripcion', _authMiddleware.auth, _inscripcionCapacitacionControllers.inscripcionCapacitacionController.eliminarUnParticipanteInscrito);
Route.post('/capacitacion/facilitador/:id_capacitacion', _informe_facilitador_capacitacionControllers.facilitadorCapacitacionController.asignar_facilitador_capacitacion);
Route.get('/facilitador/asignado/:id_capacitacion', _informe_facilitador_capacitacionControllers.facilitadorCapacitacionController.facilitador_asigado);
Route.get('/facilitadores/capacitaciones/', _authMiddleware.auth, _informe_facilitador_capacitacionControllers.facilitadorCapacitacionController.facilitadorCapacitaciones_readAll);

//Generadores de pdf
Route.get('/reporte/facilitadores/pdf/', reporte_Fa_CapController.generaPdf_reporte_fa_cap);
Route.get('/reporte/inscritos/pdf/:id_capacitacion', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(25), generaPdfInscripcionesControllers.generaPdfInscripciones);

//Seguimiento de llamadas

Route.post('/grupoSeguimiento/create', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(1), _grupoSeguimientoControllers.grupoSeguimientoController.create_grupoSeguimiento);
Route.get('/grupoSeguimiento/read/:id_grupo_seguimiento', _authMiddleware.auth, _grupoSeguimientoControllers.grupoSeguimientoController.read_grupoSeguimiento);
Route.get('/grupoSeguimiento/readAll', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(6), _grupoSeguimientoControllers.grupoSeguimientoController.readAll_grupoSeguimiento);
Route.put('/grupoSeguimiento/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(13), _grupoSeguimientoControllers.grupoSeguimientoController.update_grupoSeguimiento);
Route.delete('/grupoSeguimiento/delete/:id_grupo_seguimiento', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(18), _grupoSeguimientoControllers.grupoSeguimientoController.delete_grupoSeguimiento);
Route.post('/contacto/create', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(2), _contactoControllers.contactoController.create_contacto);
Route.get('/contacto/read/:id_contacto', _authMiddleware.auth, _contactoControllers.contactoController.read_contacto);
Route.get('/contacto/readAll', (0, _authMiddleware.verificarNivelPermiso)(7), _authMiddleware.auth, _contactoControllers.contactoController.readAll_contacto);
Route.put('/contacto/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(16), _contactoControllers.contactoController.update_contacto);
Route.delete('/contacto/delete/:id_contacto', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(19), _contactoControllers.contactoController.delete_contacto);
Route.post('/contacto/subir', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(22), _contactoControllers.contactoController.subirContactos);
Route.get('/estados/readAll', _authMiddleware.auth, _contactoControllers.contactoController.readAll_estadoContacto);
Route.get('/tipoSeguimiento/readAll', _authMiddleware.auth, _contactoControllers.contactoController.readAll_tipoSeguimiento);
Route.post('/historicoLlamadas/subir', _authMiddleware.auth, _historicoLlamadasControllers.historicoController.registrar_contactos);
Route.post('/historicoLlamadas/asignar', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(23), _historicoLlamadasControllers.historicoController.asignarContactoEnSeguimiento);
Route.get('/historicoLlamadas/readAll/:id_grupo_seguimiento', _authMiddleware.auth, _historicoLlamadasControllers.historicoController.verSeguimientoContacto);
Route.put('/historicoLlamadas/update', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(14), _historicoLlamadasControllers.historicoController.actualizarSeguimientoContacto);
Route.delete('/historicoLlamadas/delete_contacto/:id_historico', _authMiddleware.auth, (0, _authMiddleware.verificarNivelPermiso)(20), _historicoLlamadasControllers.historicoController.eliminarContactoEnSeguimiento);
Route.post('/historicoLlamadas/registraCambios', _authMiddleware.auth, _historicoLlamadasControllers.historicoController.registrarCambiosLlamada);
Route.get('/historicoLlamadas/readAllCambios/:id_historico', _authMiddleware.auth, _historicoLlamadasControllers.historicoController.verCambiosLlamada);

//Tipos de usuarios tipoUsuario

Route.post('/tipoUsuario/create', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.create_tipo_usuario);
Route.get('/tipoUsuario/read/:id_tipo_usuario', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.read_tipo_usuario);
Route.put('/tipoUsuario/update', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.update_tipo_usuario);
Route.get('/tipoUsuario/readAll', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.readAll_tipo_usuario);
Route.get('/nivelAcceso/tipoUsuario/:id_tipo_usuario', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.nivelAccesoTipoUsuario);
Route.get('/niveles/readAll', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.niveles_readAll);
Route.post('/nivelAcceso/asignar', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.asignarNivelesATipoUsuario);
Route.delete('/tipoUsuario/delete/:id_tipo_usuario', _authMiddleware.auth, _tipo_usuarioControllers.tipoUsuarioController.delete_tipo_usuario);

//dashboard

Route.get('/dashboard/ciudades', _authMiddleware.auth, _dashboardControllers.dashboardController.cantidadParticipantesPorCiudadaes);
Route.get('/dashboard/sexo', _dashboardControllers.dashboardController.cantidadParticipantePorSexo);

//reporte de excel

Route.get('/reporte/excel/:id_grupo_seguimiento', _exportarExcelControllers.exportarExcelController.generarReporteSeguimiento);