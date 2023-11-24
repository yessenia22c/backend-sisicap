"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generaPdf_reporte_fa_cap = void 0;
var _pdfkit = require("pdfkit");
var _pdfkitConstruct = _interopRequireDefault(require("pdfkit-construct"));
var _models = _interopRequireDefault(require("../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//Reportes de facilitadores que imparten cursos y capacitaciones
const generaPdf_reporte_fa_cap = async function (req, res) {
  //crear un documento
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
  const fecha = new Date();
  //Generar encabexado
  doc.setDocumentHeader({}, () => {
    doc.lineJoin('miter').rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#ededed");
    doc.fillColor("#000").fontSize(10).text("Reporte facilitadores y capacitacitaciones ", 350, 30, {
      width: 255
    }, {
      aling: "left"
    });
    doc.fillColor("#000").fontSize(10).text("Fecha de reporte:", 350, 45).text(fecha.toDateString(), 380, 45, {
      align: "right"
    });
    doc.image('public/images/EliteisoLogo2.1.png', 28, 24, {
      fit: [40, 40]
    })
    //.rect(320, 15, 100, 100)
    .stroke();
    doc.fillColor("#000").fontSize(14).text("ELITEISO SRL", 80, 30);
    doc.fontSize(8).text("Enseñar y Aprender desde la Experiencia", 80, 45, {
      width: 100
    }, {
      align: "right"
    });
  });
  doc.moveDown();

  //insertamos la consulta
  const lista = await await _models.default.informe_facilitador_capacitacion.findAll({
    attributes: [],
    where: {
      //'id_capacitacion': req.params.id_capacitacion, 
      estado: true
    },
    include: [{
      model: _models.default.facilitador,
      as: 'Facilitadores',
      attributes: ['id_facilitador'],
      include: [{
        model: _models.default.persona,
        as: 'PersonaFacilitador',
        attributes: ['nombres_per', 'apellidos', 'nro_ci']
      }]
    }, {
      model: _models.default.capacitacion,
      as: 'Capacitacion_dada',
      attributes: ['nombre_capacitacion', 'fecha_inicio_cap', 'fecha_fin_cap']
    }]
  });
  for (let i = 0; i < lista.length; i++) {
    //doc.moveDown();

    const lista_fa_cap = lista[i];

    // if (lista_fa_cap.Facilitadores.PersonaFacilitador.segundo_apellido === null){
    //   lista_fa_cap.Facilitadores.PersonaFacilitador.segundo_apellido = ""
    // }
    lista[i].nombres = lista_fa_cap.Facilitadores.PersonaFacilitador.nombres_per;
    lista[i].apellidos = lista_fa_cap.Facilitadores.PersonaFacilitador.apellidos;
    lista[i].ci = lista_fa_cap.Facilitadores.PersonaFacilitador.nro_ci;
    lista[i].cap = lista_fa_cap.Capacitacion_dada.nombre_capacitacion;
    lista[i].fIni = lista_fa_cap.Capacitacion_dada.fecha_inicio_cap;
    lista[i].fFin = lista_fa_cap.Capacitacion_dada.fecha_fin_cap;
  }
  doc.addTable([{
    key: 'nombres',
    label: 'Nombre(s)',
    align: 'left'
  }, {
    key: 'apellidos',
    label: 'Apellido(s)',
    align: 'left'
  }, {
    key: 'ci',
    label: 'C.I',
    align: 'left'
  }, {
    key: 'cap',
    label: 'Capacitación',
    align: 'left'
  }, {
    key: 'fIni',
    label: 'Fecha inicio',
    align: 'left'
  }, {
    key: 'fFin',
    label: 'Fecha fin',
    align: 'left'
  }], lista, {
    border: null,
    width: "fill_body",
    striped: true,
    stripedColors: ["#F7F7FA", "#8AC1E6"],
    cellsPadding: 7,
    marginLeft: 20,
    marginRight: 20,
    headAlign: 'left',
    cellsMaxWidth: 255
  });

  // render tables
  doc.render();
  doc.end();
};
exports.generaPdf_reporte_fa_cap = generaPdf_reporte_fa_cap;