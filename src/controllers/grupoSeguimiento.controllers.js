import{grupo_seguimiento} from './../models'
import  models from './../models'
import jwt from "jsonwebtoken"
import {JWT_EXPIRATION, JWT_SECRET} from "../config/config.js"

class GrupoSeguimientoController {
  async create_grupoSeguimiento(req, res) {
    try {
      //console.log(req.body)

      const existe = await models.grupo_seguimiento.findOne({
        where: { nombre_seguimiento: req.body.nombre_seguimiento },
      });
      if (!existe) {
        const Grupo_seguimiento = await grupo_seguimiento.create({
        
          nombre_seguimiento: req.body.nombre_seguimiento,
          fecha_creado: req.body.fecha_creado,
          id_capacitacion: req.body.id_capacitacion,
          id_empleado: req.body.id_empleado,
          estado: true,
        });

        res.status(200).json({
            status: 200,
            mensaje: "Grupo de seguimiento creado exitosamente",
            error: false,
        });
      } else {
        res.status(422).json({
            status: 422,
            mensaje: "El sistema no puede completar el registro: El grupo de seguimiento ya existe",
            error: true,
        });
      }
    } catch (error) {
        res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async read_grupoSeguimiento(req, res) {
    try {
      //console.log(req.body)

      let Grupo_seguimiento = await models.grupo_seguimiento.findOne({
        attributes: [
            "id_grupo_seguimiento",
            "nombre_seguimiento",
            "fecha_creado",
        ],
        where: {
            id_grupo_seguimiento: req.params.id_grupo_seguimiento,
            estado: true,
        },
        include: [
            {
                model: models.capacitacion,
                as: "Capacitacion",
                attributes: ["id_capacitacion", "nombre_capacitacion"],
            },
            {
                model: models.empleado,
                as: "Empleado",
                attributes: ["id_empleado"],
                include: [
                {
                    model: models.persona,
                    as: "PersonaEmpleado",	
                    attributes: ["id_persona","nombres_per", "apellidos"],
                },
                ],
            },
        ],
      });
      if (Grupo_seguimiento) {
        res.status(200).json({
            status: 200,
            UnGrupoSeguimiento: Grupo_seguimiento,
        });
      } else {
        res.status(200).json({
            status: 200,
            mensaje: "No existe el grupo de seguimiento",
            error: false,
        });
      }
    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: error.message,
        });
    }
  }
  async readAll_grupoSeguimiento(req, res) {
    try {
      //console.log(req.body)
      const token = req.headers.authorization.split(" ")[1];

      // Verificar el token y extraer el ID del usuario
      const payload = jwt.verify(token, JWT_SECRET);
      const id_usuario = payload.ius;
      const tipo_usuario = payload.tus;
    
      const Usuario = await models.usuario.findOne({
        attributes: ["id_usuario", "id_empleado"],
        where: { id_usuario: id_usuario, estado: true },
      });
      if(tipo_usuario == 1 || tipo_usuario == 2){
        let Grupo_seguimiento = await models.grupo_seguimiento.findAll({
            attributes: [
                "id_grupo_seguimiento",
                "nombre_seguimiento",
                "fecha_creado",
            ],
            where: { estado: true },
            include: [
                {
                    model: models.capacitacion,
                    as: "Capacitacion",
                    attributes: ["id_capacitacion", "nombre_capacitacion"],
                },
                {
                    model: models.empleado,
                    as: "Empleado",
                    attributes: ["id_empleado"],
                    include: [
                        {
                            model: models.persona,
                            as: "PersonaEmpleado",
                            attributes: ["id_persona","nombres_per", "apellidos"],
                        },
                    ],
                },
            ],
          });
          if (Grupo_seguimiento) {
                res.status(200).json({
                    status: 200,
                    UnGrupoSeguimiento: Grupo_seguimiento,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    mensaje: "No existen grupos de seguimiento",
                    error: false,
                });
            }
      }
      if(tipo_usuario == 3){
        let Grupo_seguimiento = await models.grupo_seguimiento.findAll({
            attributes: [
                "id_grupo_seguimiento",
                "nombre_seguimiento",
                "fecha_creado",
            ],
            where: { id_empleado: Usuario.id_empleado,  estado: true },
            include: [
                {
                    model: models.capacitacion,
                    as: "Capacitacion",
                    attributes: ["id_capacitacion", "nombre_capacitacion"],
                },
                {
                    model: models.empleado,
                    as: "Empleado",
                    attributes: ["id_empleado"],
                    include: [
                        {
                            model: models.persona,
                            as: "PersonaEmpleado",
                            attributes: ["id_persona","nombres_per", "apellidos"],
                        },
                    ],
                },
            ],
          });
          if (Grupo_seguimiento) {
                res.status(200).json({
                    status: 200,
                    UnGrupoSeguimiento: Grupo_seguimiento,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    mensaje: "No existen grupos de seguimiento",
                    error: false,
                });
            }
      }
      
      
    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: error.message,
        });
    }
  }
  async update_grupoSeguimiento(req, res) {
    try {
        const existe = await models.grupo_seguimiento.findOne({
        where: {
            id_grupo_seguimiento: req.body.id_grupo_seguimiento,
            estado: true,
        },
      });
      if (existe) {
        const Grupo_seguimiento = await models.grupo_seguimiento.update(
            {
                id_grupo_seguimiento: req.body.id_grupo_seguimiento,
                nombre_seguimiento: req.body.nombre_seguimiento,
                fecha_creado: req.body.fecha_creado,
                id_capacitacion: req.body.id_capacitacion,
                id_empleado: req.body.id_empleado,
                estado: true,
            },
            {
                where: { id_grupo_seguimiento: req.body.id_grupo_seguimiento },
            }
        );

        res.status(200).json({
            status: 200,
            mensaje: "Datos Actualizados Exitosamente",
            error: false,
        });
        } else {
            res.status(422).json({
                status: 422,
                mensaje:
                    "El sistema no puede completar el registro: El grupo de seguimiento no existe",
                error: true,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: error.message,
        });
    }
  }

  async delete_grupoSeguimiento(req, res) {
    try {
      const existe = await models.grupo_seguimiento.findOne({
        where: { id_grupo_seguimiento: req.params.id_grupo_seguimiento },
    });
      if (existe) {
        const Grupo_seguimiento = await models.grupo_seguimiento.update(
            {
                estado: false,
            },
            {
                where: { id_grupo_seguimiento: req.params.id_grupo_seguimiento },
            }
        );

        res.status(200).json({
            status: 200,
            mensaje: "Grupo de seguimiento eliminado exitosamente",
            error: false,
        });
    } else {
        res.status(422).json({
            status: 422,
            mensaje:
                "El sistema no puede completar el registro. grupo de seguimiento no encontrado",
            error: true,
        });
      }
    } catch (error) {
        res.status(500).json({
            status: 500,
            mensaje: error.message,
        });
    }
  }
} 

export const grupoSeguimientoController = new GrupoSeguimientoController
