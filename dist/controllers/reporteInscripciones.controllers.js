"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generaPdfInscripciones = void 0;
var _models = _interopRequireDefault(require("../models"));
var _pdfkitConstruct = _interopRequireDefault(require("pdfkit-construct"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//import PDFDocument from "pdfkit";

const generaPdfInscripciones = async function (req, res) {
  //crear un documento
  const Capacitacion = await _models.default.capacitacion.findOne({
    where: {
      id_capacitacion: req.params.id_capacitacion,
      estado: true
    },
    include: [{
      model: _models.default.categoria,
      as: "Categoria",
      attributes: ["nombre_categoria"]
    }]
  });
  const doc = new _pdfkitConstruct.default({
    bufferPages: true,
    layout: "portrait",
    size: "A4"
  });
  let buffers = [];

  // Configuramos el documento

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      "Content-Length": Buffer.byteLength(pdfData),
      "Content-Type": "application/pdf"
    }).end(pdfData);
  });
  let inscripcion = await _models.default.informe_inscripciones.findAll({
    attributes: [],
    where: {
      id_capacitacion: req.params.id_capacitacion,
      estado: true
    },
    include: [{
      model: _models.default.participante,
      as: "Participantes",
      attributes: ["codigo_participante", "ocupacion"],
      include: [{
        model: _models.default.persona,
        as: "Personas",
        attributes: ["nombres_per", "apellidos", "nro_ci"]
      }]
    }, {
      model: _models.default.capacitacion,
      as: "Capacitaciones",
      attributes: ["nombre_capacitacion", "fecha_inicio_cap", "fecha_fin_cap"],
      include: [{
        model: _models.default.categoria,
        as: "Categoria",
        attributes: ["nombre_categoria"]
      }]
    }]
  });
  const primeraLetraMayuscula = cadena => {
    const primerCaracter = cadena.charAt(0).toUpperCase();
    const restoDeLaCadena = cadena.substring(1, cadena.length);
    return primerCaracter.concat(restoDeLaCadena.toLowerCase());
  };
  const nombre_cap = inscripcion[0];
  //Generar encabexado
  doc.setDocumentHeader({}, () => {
    doc.lineJoin('miter').rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#ededed");
    const fecha = new Date();
    doc.fillColor("#000").fontSize(14).text("ELITEISO SRL", 80, 30);
    doc.fontSize(8).text("Enseñar y Aprender desde la Experiencia", 80, 45, {
      width: 100
    }, {
      align: "right"
    });
    doc.fillColor("#000").fontSize(11).text("Reporte Inscritos ", 300, 12, {
      aling: "center"
    });
    doc.image('public/images/EliteisoLogo2.1.png', 28, 24, {
      fit: [40, 40]
    })
    //.rect(320, 15, 100, 100)
    .stroke();
    doc.fillColor("#000").fontSize(9).text("Nombre de capacitación:", 300, 25, {
      align: "left"
    }).text(primeraLetraMayuscula(nombre_cap.Capacitaciones.nombre_capacitacion), 300, 35, {
      align: "left"
    }, {
      width: 255
    }).text("Categoría:", 300, 45).text(primeraLetraMayuscula(nombre_cap.Capacitaciones.Categoria.nombre_categoria), 380, 45, {
      align: "left"
    }).text("Fecha inicio:", 300, 55).text(primeraLetraMayuscula(nombre_cap.Capacitaciones.fecha_inicio_cap), 380, 55, {
      align: "left"
    }).text("Fecha fin:", 300, 65).text(primeraLetraMayuscula(nombre_cap.Capacitaciones.fecha_fin_cap), 380, 65, {
      align: "left"
    });
    doc.moveDown();
  });
  const contar_ins = await _models.default.informe_inscripciones.count({
    attributes: [],
    where: {
      id_capacitacion: req.params.id_capacitacion,
      estado: true
    }
  });
  if (contar_ins >= 1) {
    for (let i = 0; i < inscripcion.length; i++) {
      const lista_par = inscripcion[i];
      if (lista_par.Participantes.Personas.segundo_apellido === null) {
        lista_par.Participantes.Personas.segundo_apellido = "";
      }
      inscripcion[i].nro = i + 1;
      inscripcion[i].codigo = lista_par.Participantes.codigo_participante;
      inscripcion[i].nombres = lista_par.Participantes.Personas.nombres_per;
      inscripcion[i].apellidos = lista_par.Participantes.Personas.apellidos;
      inscripcion[i].ci = lista_par.Participantes.Personas.nro_ci;
    }
    doc.addTable([{
      key: "nro",
      label: "Nro",
      align: "left"
    }, {
      key: "codigo",
      label: "Código",
      align: "left"
    }, {
      key: "nombres",
      label: "Nombre(s)",
      align: "left"
    }, {
      key: "apellidos",
      label: "Apellido(s)",
      align: "left"
    }, {
      key: "ci",
      label: "C.I",
      align: "left"
    }], inscripcion, {
      border: null,
      width: "fill_body",
      striped: true,
      stripedColors: ["#ffffff", "#E8E8E8"],
      cellsPadding: 7,
      marginLeft: 20,
      marginRight: 20,
      headAlign: "left",
      cellsMaxWidth: 255,
      headerColor: "#000"
    });

    // render tables
    doc.render();
  } else {
    const fecha = new Date();
    doc.lineJoin('miter').rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#ededed");
    doc.fillColor("#000").fontSize(14).text("ELITEISO SRL", 80, 30);
    doc.fontSize(8).text("Enseñar y Aprender desde la Experiencia", 80, 45, {
      width: 100
    }, {
      align: "right"
    });
    doc.fillColor("#000").fontSize(11).text("Reporte Inscritos ", 300, 12, {
      aling: "center"
    });
    doc.image("public/images/EliteisoLogo2.1.png", 28, 24, {
      fit: [40, 40]
    })
    //.rect(320, 15, 100, 100)
    .stroke();
    doc.fillColor("#000").fontSize(9).text("Nombre de capacitación:", 300, 25, {
      align: "left"
    }).text(primeraLetraMayuscula(Capacitacion.nombre_capacitacion), 300, 35, {
      align: "left"
    }, {
      width: 255
    }).text("Categoría:", 300, 45).text(primeraLetraMayuscula(Capacitacion.Categoria.nombre_categoria), 380, 45, {
      align: "left"
    }).text("Fecha inicio:", 300, 55).text(primeraLetraMayuscula(Capacitacion.fecha_inicio_cap), 380, 55, {
      align: "left"
    }).text("Fecha fin:", 300, 65).text(primeraLetraMayuscula(Capacitacion.fecha_fin_cap), 380, 65, {
      align: "left"
    });
    doc.moveDown();
    doc.text("NO HAY ESTUDIANTES INSCRITOS", 220, 250, {
      align: "left"
    });
  }
  doc.end();
};
exports.generaPdfInscripciones = generaPdfInscripciones;