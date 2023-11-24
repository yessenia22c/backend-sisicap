"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userController = void 0;
var _models = require("./../models");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class UserController {
  async create_user(req, res) {
    try {
      console.log(req.body);
      const existe = await _models.User.findOne({
        where: {
          username: req.body.username
        }
      });
      if (!existe) {
        req.body.password = await _bcrypt.default.hash(req.body.password, 12);
        const usuario = await _models.User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          status: true
        });
        res.status(200).json({
          status: 200,
          mensaje: "Datos Registrados Exitosamente",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El nombre de usuario ya esta siendo utilizado",
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
  async read_user(req, res) {
    try {
      console.log(req.body);
      let user = await _models.User.findOne({
        where: {
          'id': req.params.id
        }
      });
      if (user) {
        res.status(200).json({
          status: 200,
          usuario: user
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
  async readAll_user(req, res) {
    try {
      console.log(req.body);
      let user = await _models.User.findAll();

      /*  let user= await User.findAll(
            {
             attributes: { exclude: ['createdAt','updatedAt'] },
                      order: ['email' ]
                 
             }
         )*/
      if (user) {
        res.status(200).json({
          status: 200,
          usuario: user
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
  async update_user(req, res) {
    try {
      console.log(req.body);
      const existe = await _models.User.findOne({
        where: {
          id: req.body.id
        }
      });
      if (existe) {
        const usuario = await _models.User.update({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        }, {
          where: {
            id: req.body.id
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Datos Actualizados Exitosamente",
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
  async delete_user(req, res) {
    try {
      console.log(req.body);
      const existe = await _models.User.findOne({
        where: {
          id: req.params.id
        }
      });
      if (existe) {
        const usuario = await _models.User.update({
          status: false
        }, {
          where: {
            id: req.params.id
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
}
const userController = exports.userController = new UserController();