import { json } from 'sequelize';
import models from '../models'
import * as XLSX from 'xlsx'
import fs from "fs-extra";


class ExportarExcelController {
    async generarReporteSeguimiento(req, res) {
        try {
            let listaSeguimiento = await models.historico_llamadas.findAll({
              attributes: [
                "id_historico",
                "id_grupo_seguimiento",
                "fecha_actualizacion",
                "prox_llamada",
                "observacion_llamada",
              ],
              where: {
                id_grupo_seguimiento: req.params.id_grupo_seguimiento,
                estado: true,
              },
              include: [
                {
                  model: models.contacto,
                  as: "Contactos",
                  attributes: [
                    "id_contacto",
                    "nombre_apellidos",
                    "numero_contacto",
                    "correo_contacto",
                    "nombre_empresa",
                    "profesion",
                    "intereses",
                    "observaciones",
                  ],
                  where: { estado: true },
                  include: [
                    {
                      model: models.sexo,
                      as: "Sexo_contacto",
                      attributes: ["id_sexo", "nombre_sexo"],
                    },
                    {
                      model: models.ciudad,
                      as: "Ciudad_contacto",
                      attributes: ["id_ciudad", "nombre_ciudad"],
                    },
                    {
                      model: models.pais,
                      as: "Pais_contacto",
                      attributes: ["id_pais", "nombre_pais"],
                    },
                    {
                      model: models.estado_contacto,
                      as: "Estado",
                      attributes: ["id_estado_contacto", "nombre_estado"],
                    },
                  ],
                },
                {
                  model: models.tipo_seguimiento,
                  as: "TipoSeguimiento",
                  attributes: ["id_tipo_seguimiento", "nombre_tipo_seguimiento"],
                },
              ],
            });
            //tranformar respuesta a json
            let contador = 0;
            const datoJson = JSON.stringify(listaSeguimiento);
            const listaSeguimientoArray = JSON.parse(datoJson);
            const tranformarDatos = listaSeguimientoArray.map(item =>{
                //console.log('ITEMS ',item)
                contador ++;
                 // Formatear la fecha y la hora
                const fechaProximaLlamada = item.prox_llamada
                ? new Date(item.prox_llamada).toLocaleString()
                : 'Sin próxima llamada';
                return {
                    "Nro contacto": contador,
                    "Fecha actualizacion": item.fecha_actualizacion ?? 'Sin fecha actualizacion',
                    "Proxima llamada": fechaProximaLlamada,
                    "Observacion llamada": item.observacion_llamada ?? 'Sin observacion de llamada',
                    "Nombre y apellidos": item.Contactos.nombre_apellidos,
                    "Numero de contacto": item.Contactos.numero_contacto ,
                    "Correo de contacto": item.Contactos.correo_contacto ?? 'Sin correo',
                    "Nombre de empresa": item.Contactos.nombre_empresa ?? 'Sin empresa',
                    "Profesion del contacto": item.Contactos.profesion ?? 'Sin profesion',
                    "Intereses del contacto": item.Contactos.intereses ?? 'Sin intereses' ,
                    "Observaciones del contacto": item.Contactos.observaciones ?? 'Sin observaciones',
                    "Nombre sexo": item.Contactos.Sexo_contacto?.nombre_sexo ?? 'Sin género',
                    "Nombre ciudad": item.Contactos.Ciudad_contacto?.nombre_ciudad ?? 'Sin ciudad',
                    "Nombre pais": item.Contactos.Pais_contacto?.nombre_pais ?? 'Sin pais',
                    "Nombre estado contacto": item.Contactos.Estado?.nombre_estado ?? 'Sin estado',
                    "Nombre tipo seguimiento": item.TipoSeguimiento?.nombre_tipo_seguimiento ?? 'Sin tipo seguimiento',

                }
            })
            //const datoJson = listaSeguimiento.map((dato) => Object.values(dato));
            //console.log(tranformarDatos)
            const ws = XLSX.utils.json_to_sheet(tranformarDatos);
            // const workbook = {
            //     Sheets: {'data': ws},
            //     SheetsNames: ['data']
            // }
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Seguimiento");

            const obtenerFechaActual = new Date();
            const dia = obtenerFechaActual.getDate();
            const mes = obtenerFechaActual.getMonth() + 1; // Nota: Los meses en JavaScript son indexados desde 0, por lo que sumamos 1.
            const anio = obtenerFechaActual.getFullYear();
            const fileName = `ReporteSeguimiento-${dia}-${mes}-${anio}.xlsx`;

            //XLSX.writeFile(wb, fileName);
            

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

            const excel = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

            const binaryContent = Buffer.from(excel);

            // // Guardar el contenido binario en un archivo
            // const descargable =  fs.writeFileSync(fileName, binaryContent, 'utf-8');
           
            res.end(binaryContent);
            //console.log('Llega hasta aqui')
            //console.log('Llega hasta aqui', excel)

            //  res.status(200).json({
            //     status: 200,
            //     archivoXlsx: binaryContent
            //   });
          } catch (error) {
            console.log(error);
            res.status(500).json({
              status: 500,
              mensaje: "Error al generar el reporte de seguimiento",
            });
          }
    }
}

export const exportarExcelController = new ExportarExcelController()