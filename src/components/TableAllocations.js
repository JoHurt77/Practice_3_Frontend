import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import * as XLSX from "xlsx";
import ENDPOINTS from "../config/configLocal";

const TableAllocations = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Llamada a la API para obtener los datos
    axios
      .get(ENDPOINTS.GET_ALL_ALLOCATIONS)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  const columns = [
    { name: "codigoEmpleado", label: "ID" },
    { name: "nombreEmpleado", label: "Employee Name" },
    { name: "nombrePractica", label: "Practice" },
    { name: "oldCodigoProyecto", label: "Old/Current Project Code" },
    { name: "newCodigoProyecto", label: "New Project Code" },
    { name: "nombrePractica", label: "WBS Practice" },
    { name: "rdgRemarks", label: "RDG Remarks" },
    { name: "allocation", label: "Allocation" },
    { name: "role", label: "Role" },
    { name: "supervisorName", label: "Supervisor Name" },
    { name: "supervisorCode", label: "Supervisor Code" },
    {
      name: "allocationStartDateJoiningDate",
      label: "Allocation Start/Joining Date",
    },
    { name: "allocationEndDate", label: "Allocation End Date" },
    { name: "travelDate", label: "Travel Date" },
    { name: "remarks", label: "Remarks" },
  ];

  const options = {
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    responsive: "standard",
    textLabels: {
      toolbar: {
        downloadCsv: "Download",
      },
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const dataToExport = data.map((row) => {
        let rowData = {};
        row.data.forEach((value, index) => {
          rowData[columns[index].label] = value;
        });
        return rowData;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Calcular el ancho máximo de cada columna
      const colWidths = columns.map(col => {
        const maxWidth = Math.max(
          col.label.length,
          ...data.map(row => row.data[columns.findIndex(c => c.label === col.label)].toString().length)
        );
        return { width: maxWidth + 2 }; // Añadir un poco de espacio extra
      });

      ws['!cols'] = colWidths;

      // Aplicar estilos a los encabezados y alinear todos los campos a la izquierda
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ c: C, r: range.s.r });
        if (!ws[cell_address]) ws[cell_address] = { t: "s", v: "" };
        if (C === range.s.c) {
          // Aplicar estilo a la primera fila (encabezados)
          ws[cell_address].s = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "ADD8E6" } }, // Celeste
            border: { bottom: { style: "thin", color: { rgb: "000000" } } }, // Añadir borde inferior
          };
        } else {
          // Aplicar estilo al resto de las celdas
          ws[cell_address].s = {
            alignment: { horizontal: "left" },
          };
        }
      }
      
      XLSX.utils.book_append_sheet(wb, ws, "Allocation");
      XLSX.writeFile(wb, "Allocation.xlsx");
      return false;
    },
  };

  return (
    <MUIDataTable
      title={"Allocations Data"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TableAllocations;
