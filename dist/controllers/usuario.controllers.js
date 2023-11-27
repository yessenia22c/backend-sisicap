"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usuarioController = void 0;
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _models = _interopRequireDefault(require("./../models"));
var _path = _interopRequireDefault(require("path"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Importa y configura dotenv
require('dotenv').config();
class UsuarioController {
  async create_usuario(req, res) {
    try {
      //console.log(req.body)
      const nuevoUsuario = JSON.parse(req.body.nuevoUsuario);
      console.log("HAY ALGO AQUI", nuevoUsuario);
      const existe = await _models.default.usuario.findOne({
        where: {
          nombre_usuario: nuevoUsuario.nombre_usuario
        }
      });
      console.log(req.file);
      if (!existe) {
        if (req.file) {
          const nombreImagen = nuevoUsuario.nombre_usuario;
          const imageTempPath = req.file.path;
          const ext = _path.default.extname(req.file.originalname).toLowerCase(); // la extension en minuscula
          const des = req.file.destination; //la capeta destino
          const targetPath = _path.default.resolve(`${des}/uploadUser/${nombreImagen}${ext}`); // destino del archivo

          const targetSimplificado = `${process.env.HOST ?? `http://localhost:${process.env.PORT}`}/upload/uploadUser/${nombreImagen}${ext}`;
          if (ext === ".jpg" || ext === ".png" || ext === ".jpeg") {
            await _fsExtra.default.rename(imageTempPath, targetPath);
            nuevoUsuario.contrasena_us = await _bcrypt.default.hash(nuevoUsuario.contrasena_us, 12);
            const Usuario = await _models.default.usuario.create({
              id_empleado: nuevoUsuario.id_empleado,
              id_tipo_usuario: nuevoUsuario.id_tipo_usuario,
              nombre_usuario: nuevoUsuario.nombre_usuario,
              foto_perfil: targetSimplificado,
              contrasena_us: nuevoUsuario.contrasena_us,
              estado: true
            });
            res.status(200).json({
              status: 200,
              mensaje: "Datos Registrados Exitosamente",
              error: false
            });
          } else {
            await _fsExtra.default.unlink(imageTempPath); //elimina el archivo
            res.status(200).json({
              status: 500,
              mensaje: "Verifique: Sólo se puede subir imagen .png o .jpg",
              error: false
            });
          }
        } else {
          const imagenDefecto = `${process.env.HOST ?? `http://localhost:${process.env.PORT}`}/upload/uploadUser/defecto-usuario.png`;
          nuevoUsuario.contrasena_us = await _bcrypt.default.hash(nuevoUsuario.contrasena_us, 12);
          const Usuario = await _models.default.usuario.create({
            id_empleado: nuevoUsuario.id_empleado,
            id_tipo_usuario: nuevoUsuario.id_tipo_usuario,
            nombre_usuario: nuevoUsuario.nombre_usuario,
            foto_perfil: imagenDefecto,
            contrasena_us: nuevoUsuario.contrasena_us,
            estado: true
          });
          res.status(200).json({
            status: 200,
            mensaje: "Datos Registrados Exitosamente",
            error: false
          });
        }
        //direccion para guardar en la basede datos
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El nombre de usuario ya esta siendo utilizado",
          error: true
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async read_usuario(req, res) {
    try {
      //console.log(req.body)

      let Usuario = await _models.default.usuario.findOne({
        attributes: ["nombre_usuario", "foto_perfil"],
        where: {
          id_usuario: req.params.id_usuario,
          estado: true
        },
        include: [{
          model: _models.default.tipo_usuario,
          attributes: ["nombre_tipo_usuario"]
        }, {
          model: _models.default.empleado,
          attributes: ["id_empleado"],
          include: [{
            model: _models.default.persona,
            attributes: ["nombres_per", "apellidos"]
          }]
        }]
      });
      if (Usuario) {
        res.status(200).json({
          status: 200,
          usuario: Usuario
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Usuario no registrado",
          error: false
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async readAll_usuario(req, res) {
    try {
      //console.log(req.body)

      let Usuario = await _models.default.usuario.findAll({
        attributes: ["id_usuario", "nombre_usuario", "foto_perfil"],
        where: {
          estado: true
        },
        include: [{
          model: _models.default.tipo_usuario,
          attributes: ["id_tipo_usuario", "nombre_tipo_usuario"]
          // include:[{
          //     model: models.acceso,
          //     attributes:['id_acceso','id_nivel'],
          //     as: 'TipoUsuarioAcceso',
          //     include:[{
          //         model: models.nivel,
          //         as: 'NivelAcceso',
          //         attributes:['nombre_nivel']
          //     }]
          //  }],
        }, {
          model: _models.default.empleado,
          attributes: ["id_empleado"],
          include: [{
            model: _models.default.persona,
            as: "PersonaEmpleado",
            attributes: ["id_persona", "nombres_per", "apellidos", "nro_ci", "correo", "telefono"]
          }]
        }]
      });
      if (Usuario) {
        res.status(200).json({
          status: 200,
          usuario: Usuario
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen usuario registrados",
          error: false
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async update_usuario(req, res) {
    try {
      const nuevoUsuario = JSON.parse(req.body.nuevoUsuario);
      console.log("HAY ALGO AQUI", nuevoUsuario);
      //console.log(req.body)
      const existe = await _models.default.usuario.findOne({
        where: {
          id_usuario: nuevoUsuario.id_usuario,
          estado: true
        }
      });
      if (existe) {
        if (req.file) {
          const nombreImagen = nuevoUsuario.nombre_usuario;
          const imageTempPath = req.file.path;
          const ext = _path.default.extname(req.file.originalname).toLowerCase(); // la extension en minuscula
          const des = req.file.destination; //la capeta destino
          const targetPath = _path.default.resolve(`${des}/uploadUser/${nombreImagen}${ext}`); // destino del archivo
          console.log('ESTO ES EL TARGETPHATH', targetPath);
          const targetSimplificado = `${process.env.HOST ?? `http://localhost:${process.env.PORT}`}/upload/uploadUser/${nombreImagen}${ext}`;
          if (ext === ".jpg" || ext === ".png" || ext === ".jpeg") {
            await _fsExtra.default.rename(imageTempPath, targetPath);
            nuevoUsuario.contrasena_us = await _bcrypt.default.hash(nuevoUsuario.contrasena_us, 12);
            const Usuario = await _models.default.usuario.update({
              //id_empleado: nuevoUsuario.id_empleado,
              id_tipo_usuario: nuevoUsuario.id_tipo_usuario,
              nombre_usuario: nuevoUsuario.nombre_usuario,
              foto_perfil: targetSimplificado,
              contrasena_us: nuevoUsuario.contrasena_us
            }, {
              where: {
                id_usuario: nuevoUsuario.id_usuario
              }
            });
            res.status(200).json({
              status: 200,
              mensaje: "Datos actualizados exitosamente",
              error: false
            });
          } else {
            await _fsExtra.default.unlink(imageTempPath); //elimina el archivo
            res.status(200).json({
              status: 500,
              mensaje: "Verifique: Sólo se puede subir imagen .png o .jpg",
              error: false
            });
          }
        } else {
          const imagenDefecto = `${process.env.HOST ?? `http://localhost:${process.env.PORT}`}
          /upload/uploadUser/defecto-usuario.png`;
          nuevoUsuario.contrasena_us = await _bcrypt.default.hash(nuevoUsuario.contrasena_us, 12);
          const Usuario = await _models.default.usuario.update({
            //id_empleado: nuevoUsuario.id_empleado,
            id_tipo_usuario: nuevoUsuario.id_tipo_usuario,
            nombre_usuario: nuevoUsuario.nombre_usuario,
            foto_perfil: imagenDefecto,
            contrasena_us: nuevoUsuario.contrasena_us,
            estado: true
          }, {
            where: {
              id_usuario: nuevoUsuario.id_usuario
            }
          });
          res.status(200).json({
            status: 200,
            mensaje: "Datos actualizados exitosamente",
            error: false
          });
        }

        // req.body.contrasena_us = await bcrypt.hash(req.body.contrasena_us, 12);
        // const Usuario = await models.usuario.update(
        //   {
        //     //id_empleado:req.body.id_empleado,
        //     id_tipo_usuario: req.body.id_tipo_usuario,
        //     nombre_usuario: req.body.nombre_usuario,
        //     contrasena_us: req.body.contrasena_us,
        //   },
        //   {
        //     where: { id_usuario: req.body.id_usuario },
        //   }
        // );

        // res.status(200).json({
        //   status: 200,
        //   mensaje: "Datos Actualizados Exitosamente",
        //   error: false,
        // });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El usuario no puede ser encontrado",
          error: true
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async delete_usuario(req, res) {
    try {
      //console.log(req.body)
      const existe = await _models.default.usuario.findOne({
        where: {
          id_usuario: req.params.id_usuario
        }
      });
      if (existe) {
        const Usuario = await _models.default.usuario.update({
          estado: false
        }, {
          where: {
            id_usuario: req.params.id_usuario
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Usuario Eliminado",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El nombre de usuario no puede ser encontrado",
          error: true
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async NivelRoles(req, res) {
    try {
      const Nivel = await _models.default.nivel.findAll({
        attributes: ["id_nivel", "nombre_nivel"],
        where: {
          estado: true
        }
      });
      res.status(200).json({
        status: 200,
        nivelAcceso: Nivel
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async readAll_tipo_usuario(req, res) {
    try {
      const TipoUsuario = await _models.default.tipo_usuario.findAll({
        attributes: ["id_tipo_usuario", "nombre_tipo_usuario"],
        where: {
          estado: true
        }
      });
      res.status(200).json({
        status: 200,
        tipoUsuario: TipoUsuario
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }

  // async crearUsuarioPersonaEmpleado( req, res){
  //     try {
  //         const existe= await models.usuario.findOne(
  //             {  where: { nombre_usuario: req.body.nombre_usuario }     }
  //         );

  //         if(!existe)  {
  //             req.body.contrasena_us = await bcrypt.hash(req.body.contrasena_us, 12)
  //             const Usuario= await models.usuario.create({
  //                 id_empleado:req.body.id_empleado,
  //                 id_tipo_usuario:req.body.id_tipo_usuario,
  //                 nombre_usuario:req.body.nombre_usuario,
  //                 contrasena_us:req.body.contrasena_us,
  //                 estado:true
  //             })

  //             res.status(200).json({
  //                 status:200,
  //                 mensaje:"Datos Registrados Exitosamente",
  //                 error:false
  //             })
  //         }else{
  //             res.status(422).json({
  //                 status:422,
  //                 mensaje:"El sistema no puede completar el registro: El nombre de usuario ya esta siendo utilizado",
  //                 error:true
  //             })
  //         }

  //     } catch (error) {
  //         res.status(500).json({
  //             status:500,
  //             mensaje:error.message
  //         })
  //     }
  // }
}

const usuarioController = exports.usuarioController = new UsuarioController();