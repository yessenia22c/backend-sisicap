import models from './../models'


class ValidacionController {
    async validarNombreUsuario(req, res) {
        // const { nombreUsuario } = req.params
        const usuario = await models.usuario.findOne({ where: { nombre_usuario: req.params.nombre_usuario } })
        if (usuario) {
            res.json({ dispobible: false })
        } else {
            res.json({ disponible: true })
        }
    
    }

    async validarCarnetIdentidad(req, res) {
        const unaPersona = await models.persona.findOne({ where: { nro_ci: req.params.nro_ci } })
        if (unaPersona) {
            res.json({ dispobible: false })
        } else {
            res.json({ disponible: true })
        }
    }
    async validarCorreo(req, res) {
        const unaPersona = await models.persona.findOne({ where: { correo: req.params.correo } })
        if (unaPersona) {
            res.json({ dispobible: false })
        } else {
            res.json({ disponible: true })
        }
    }
    async validarNumeroContacto (req, res) {
        const unContacto = await models.contacto.findOne({ where: { numero_contacto: req.params.numero_contacto } })
        if (unContacto) {
            res.json({ dispobible: false })
        } else {
            res.json({ disponible: true })
        }
    
    }
}

export const validacionController =  new ValidacionController()