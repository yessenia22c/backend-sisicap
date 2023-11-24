import{User} from "./../models"
import models from './../models'
import{usuario} from "./../models"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {JWT_EXPIRATION, JWT_SECRET} from "../config/config.js"

import path from "path";
import fs from "fs-extra";



class AuthController {
  async login(req, res) {
    console.log(req.body);

    let user = await usuario.findOne({
      where: { nombre_usuario: req.body.nombre_usuario, estado: true },
    });

    if (!user) {
      return res.json({ mensaje: "Usuario Incorrecto" });
    } else {
      //verificando que la contraseña sea correcta
      let correcto = await bcrypt.compare(
        req.body.contrasena_us,
        user.contrasena_us
      );

      if (correcto) {
        // Generamos el payload
        let payload = {
          //username: user.nombre_usuario,
          tus: user.id_tipo_usuario, //Cambio 12/03/2023 para agregar a angular el tipo usuario o su rol
          ius: user.id_usuario, //Para identificar que usuario se esta logueando
          time: new Date(),
        };

        // generamos el token

        let token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: JWT_EXPIRATION,
        });

        res.status(200).send({
          id_user: user.id_usuario,
          access_token: token,
          error: false,
        });

        /*res.status(200).send({
                    mensaje:"Auntentificado",
                    data:user,
                    error:false
                })*/
      } else {
        return res.status(200).json({
          mensaje: "Contrasena incorrecta",
          error: true,
        });
      }
    }
  }
  async getPerfil(req, res) {
    try {
      // Obtener el token de la solicitud
      const token = req.headers.authorization.split(" ")[1];

      // Verificar el token y extraer el ID del usuario
      const payload = jwt.verify(token, JWT_SECRET);
      const id_usuario = payload.ius;

      // Obtener el perfil del usuario
      let Usuario = await models.usuario.findOne({
        attributes: ["nombre_usuario", "foto_perfil"],
        where: { id_usuario: id_usuario, estado: true },
        include: [
          {
            model: models.tipo_usuario,
            attributes: ["id_tipo_usuario", "nombre_tipo_usuario"],
            include: [
              {
                model: models.acceso,
                attributes: ["id_acceso", "id_nivel"],
                as: "TipoUsuarioAcceso",
                include: [
                  {
                    model: models.nivel,
                    as: "NivelAcceso",
                    attributes: ["id_nivel","nombre_nivel"],
                  },
                ],
              },
            ],
          },
          {
            model: models.empleado,
            attributes: ["id_empleado"],
            include: [
              {
                model: models.persona,
                as: "PersonaEmpleado",
                attributes: ["nombres_per", "apellidos"],
              },
            ],
          },
        ],
      });

      if (Usuario) {
        // Enviar la respuesta al cliente
        res.status(200).json({
          status: 200,
          usuario: Usuario,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Usuario no registrado",
          error: false,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({ mensaje: "No autorizado" });
    }
  }
  async subir_archivo(req, res) {
    try {
      const id_usuario = req.params.id_usuario;
      //verificamos si el usuario esta registrado
      const existe = await usuario.findOne({
        where: {
          id_usuario: id_usuario,
        },
      });
      if (existe) {
        //console.log(req.file)
        const nombreImagen = existe.nombre_usuario;

        const imageTempPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase(); // la extension en minuscula
        const des = req.file.destination; //la capeta destino
        const targetPath = path.resolve(
          `${des}/uploadUser/${nombreImagen}${ext}`
        ); // destino del archivo

        const targetSimplificado = `${process.env.HOST || "http://localhost"}:${
          process.env.PORT || 4000
        }/upload/uploadUser/${nombreImagen}${ext}`; //direccion para guardar en la basede datos

        if (ext === ".jpg" || ext === ".png") {
          await fs.rename(imageTempPath, targetPath);

          const con_usuarios = await usuario.update(
            {
              foto_perfil: targetSimplificado,
            },
            {
              where: { id_usuario: id_usuario },
            }
          );

          res.status(200).json({
            status: 200,
            mensaje: "Imagen Guardada Exitosamente",
            error: false,
          });
        } else {
          await fs.unlink(imageTempPath); //elimina el archivo
          res.status(200).json({
            status: 500,
            mensaje: "Verifique: Sólo se puede subir imagen .png o pdf",
            error: false,
          });
        }
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar el Registro: no existe el Usuario seleccionado",
          error: true,
        });
      }
    } catch (error) {
      // if(error.type)
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
}
export const authController = new AuthController;
