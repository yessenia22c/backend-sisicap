"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tipoUsuarioController = void 0;
var _sequelize = require("sequelize");
var _models = _interopRequireDefault(require("../models"));
var _acceso = _interopRequireDefault(require("../models/acceso"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class TipoUsuarioController {
  async create_tipo_usuario(req, res) {
    try {
      const existe = await _models.default.tipo_usuario.findOne({
        where: {
          nombre_tipo_usuario: req.body.nombre_tipo_usuario
        }
      });
      if (!existe) {
        let newTipoUsuario = await _models.default.tipo_usuario.create({
          nombre_tipo_usuario: req.body.nombre_tipo_usuario,
          descripcion: req.body.descripcion
        });
        res.status(200).json({
          status: 200,
          mensaje: "Tipo de seguimiento creado correctamente"
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "El nombre del tipo de seguimiento ya existe en el sistema",
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
  async readAll_tipo_usuario(req, res) {
    try {
      let tipo_usuarios = await _models.default.tipo_usuario.findAll({
        attributes: ["id_tipo_usuario", "nombre_tipo_usuario", "descripcion"],
        where: {
          estado: true
        }
      });
      if (tipo_usuarios) {
        res.status(200).json({
          status: 200,
          allTipos_usuario: tipo_usuarios
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay tipos de seguimiento registrados en el sistema",
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
  async read_tipo_usuario(req, res) {
    try {
      let tipoUsuario = await _models.default.tipo_usuario.findOne({
        attributes: ["id_tipo_usuario", "nombre_tipo_usuario", "descripcion"],
        where: {
          id_tipo_usuario: req.params.id_tipo_usuario
        }
      });
      if (tipoUsuario) {
        res.status(200).json({
          status: 200,
          tipo_usuario: tipoUsuario
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay tipos de seguimiento registrados en el sistema",
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
  async nivelAccesoTipoUsuario(req, res) {
    try {
      const nivelAcceso = await _models.default.acceso.findAll({
        attributes: ["id_acceso"],
        where: {
          id_tipo_usuario: req.params.id_tipo_usuario
        },
        include: [{
          model: _models.default.nivel,
          as: "NivelAcceso",
          attributes: ["id_nivel", "nombre_nivel"]
        }],
        order: [[{
          model: _models.default.nivel,
          as: "NivelAcceso"
        }, "nombre_nivel", "ASC"]]
      });
      if (nivelAcceso) {
        res.status(200).json({
          status: 200,
          AllAccesos: nivelAcceso
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay accesos registrados en el sistema",
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
  async niveles_readAll(req, res) {
    try {
      const Nivel = await _models.default.nivel.findAll({
        attributes: ["id_nivel", "nombre_nivel"],
        where: {
          estado: true
        },
        order: [["nombre_nivel", "ASC"]]
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
  async asignarNivelesATipoUsuario(req, res) {
    const listaNiveles = req.body.niveles;
    //console.log('NIVELES QUE LLEGAN', req.body);
    try {
      // Obtener los accesos actuales del tipo de usuario
      const accesosActuales = await _models.default.acceso.findAll({
        attributes: [],
        include: [{
          model: _models.default.nivel,
          as: "NivelAcceso",
          attributes: ["id_nivel", "nombre_nivel"]
        }],
        order: [[{
          model: _models.default.nivel,
          as: "NivelAcceso"
        }, "nombre_nivel", "ASC"]],
        where: {
          id_tipo_usuario: req.body.id_tipo_usuario
        }
      });
      const nivelAccesoList = accesosActuales.map(item => ({
        id_nivel: item.NivelAcceso.id_nivel,
        nombre_nivel: item.NivelAcceso.nombre_nivel
      }));
      // Crear nuevos accesos para los niveles en listaNiveles que no existen
      const nuevosAccesos = listaNiveles.filter(nivel => {
        return !nivelAccesoList.some(acceso => {
          //console.log('NIVEL',nivel.id_nivel,'ACCESO',acceso.id_nivel)
          return nivel.id_nivel === acceso.id_nivel;
        });
      });
      await Promise.all(nuevosAccesos.map(async nivel => {
        await _models.default.acceso.create({
          id_tipo_usuario: req.body.id_tipo_usuario,
          id_nivel: nivel.id_nivel
        });
      }));

      // Eliminar accesos para los niveles que están en la base de datos pero no en listaNiveles
      const accesosAEliminar = nivelAccesoList.filter(acceso => {
        return !listaNiveles.some(nivel => {
          //console.log('NIVEL ELIMINAR',nivel.id_nivel,'ACCESO ELIMINAR',acceso.id_nivel)
          return nivel.id_nivel === acceso.id_nivel;
        });
      });
      await Promise.all(accesosAEliminar.map(async acceso => {
        await _models.default.acceso.destroy({
          where: {
            id_tipo_usuario: req.body.id_tipo_usuario,
            id_nivel: acceso.id_nivel
          }
        });
      }));
      res.status(200).json({
        status: 200,
        mensaje: "Niveles asignados correctamente"
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }

  // async asignarNivelesATipoUsuario(req, res) {
  //     const listaNiveles = req.body.niveles;
  //     //let listaAcessosNiveles = []
  //     console.log('NIVELES QUE LLEGAN',req.body)
  //     try {

  //         // mostrar los accesos actuales que tiene el tipo de usuario

  //         const  nivelAcceso = await models.acceso.findAll({
  //             attributes: [],
  //             where: {id_tipo_usuario: req.body.id_tipo_usuario},
  //             include: [
  //                 {
  //                     model: models.nivel,
  //                     as: "NivelAcceso",
  //                     attributes: ["id_nivel","nombre_nivel"],
  //                 }],
  //                 order: [
  //                     [{ model: models.nivel, as: "NivelAcceso" }, "nombre_nivel", "ASC"],
  //                 ],
  //         })
  //         // const accesos = Object.values(nivelAcceso)
  //         // console.log('ACCESOS QUE TINW',accesos)
  //         //

  //         const nivelAccesoList = nivelAcceso.map(item => ({
  //             id_nivel: item.NivelAcceso.id_nivel,
  //             nombre_nivel: item.NivelAcceso.nombre_nivel
  //           }));
  //         console.log('NIVELES QUE TIENE',nivelAccesoList)

  //         //Quita los los niveles que no vienen en la listaNiveles

  //         for(let i = 0; i < nivelAccesoList.length; i++){
  //             for(let j = 0; j < listaNiveles.length; j++){
  //                 console.log(nivelAccesoList[i].id_nivel == listaNiveles[j].id_nivel)
  //                 // if(nivelAccesoList[i].id_nivel == listaNiveles[j].id_nivel){
  //                 //     nivelAccesoList.splice(i,1)
  //                 // }
  //             }

  //         }

  //         //Asiganar los nuevos niveles
  //         listaNiveles.forEach(async (element) => {

  //             const existe = await models.acceso.findOne({
  //                 where: { id_tipo_usuario: req.body.id_tipo_usuario, id_nivel: element.id_nivel }
  //             })
  //             if(!existe){
  //                 const crearAcesso = await models.acceso.create({
  //                     id_tipo_usuario: req.body.id_tipo_usuario,
  //                     id_nivel: element.id_nivel
  //                 })
  //             }
  //             //console.log( 'ELEMENT', element,'Lo incluye?');

  //             //si existe el acceso pero no esta en la listaNiveles entonces lo elimino
  //             // if(existe && !listaNiveles.includes(element.id_nivel)){
  //             //     const eliminarAcceso = await models.acceso.destroy({
  //             //         where: { id_tipo_usuario: req.body.id_tipo_usuario, id_nivel: element.id_nivel }
  //             //     })
  //             // }
  //         });

  //         res.status(200).json({
  //             status: 200,
  //             mensaje: "Niveles asignados correctamente"
  //         })
  //     } catch (error) {
  //         console.log('ERROR',error)
  //         res.status(500).json({
  //             status: 500,
  //             mensaje: error.message
  //         })
  //     }
  // }
  async update_tipo_usuario(req, res) {
    try {
      const existe = await _models.default.tipo_usuario.findOne({
        where: {
          nombre_tipo_usuario: req.body.nombre_tipo_usuario
        }
      });
      if (existe) {
        await _models.default.tipo_usuario.update({
          nombre_tipo_usuario: req.body.nombre_tipo_usuario,
          descripcion: req.body.descripcion
        }, {
          where: {
            id_tipo_usuario: req.body.id_tipo_usuario
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Tipo de seguimiento actualizado correctamente"
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "El nombre del tipo de seguimiento no existe en el sistema",
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
  async delete_tipo_usuario(req, res) {
    try {
      const existe = await _models.default.tipo_usuario.findOne({
        where: {
          id_tipo_usuario: req.params.id_tipo_usuario
        }
      });
      if (existe) {
        const tipoUsuario = await _models.default.tipo_usuario.update({
          estado: false
        }, {
          where: {
            id_tipo_usuario: req.params.id_tipo_usuario
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Tipo de seguimiento eliminado correctamente"
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "El tipo de seguimiento no existe en el sistema",
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
}
const tipoUsuarioController = exports.tipoUsuarioController = new TipoUsuarioController();