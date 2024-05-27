import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// Asegúrate de importar el componente AddButton correctamente
import AddButton from './AddButton';
import ActionButtons from "./ActionButtons";

const TableAllocations = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = () => {
    axios
      .get(process.env.REACT_APP_API_ALLOCATIONS)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  const handleAdd = () => {
    Swal.fire({
      title: "Add New Allocation",
      html: `
        <input type="number" id="codigoEmpleado" class="swal2-input" placeholder="Employee ID">
        <input type="text" id="nombreEmpleado" class="swal2-input" placeholder="Employee Name">
        <input type="text" id="nombrePractica" class="swal2-input" placeholder="Practice">
        <input type="text" id="oldCodigoProyecto" class="swal2-input" placeholder="Old/Current Project Code">
        <input type="text" id="newCodigoProyecto" class="swal2-input" placeholder="New Project Code">
        <input type="text" id="wbsPractice" class="swal2-input" placeholder="WBS Practice">
        <input type="text" id="rdgRemarks" class="swal2-input" placeholder="RDG Remarks">
        <input type="text" id="allocation" class="swal2-input" placeholder="Allocation">
        <input type="text" id="role" class="swal2-input" placeholder="Role">
        <input type="text" id="supervisorName" class="swal2-input" placeholder="Supervisor Name">
        <input type="text" id="supervisorCode" class="swal2-input" placeholder="Supervisor Code">
        <input type="date" id="allocationStartDateJoiningDate" class="swal2-input" placeholder="Allocation Start/Joining Date">
        <input type="date" id="allocationEndDate" class="swal2-input" placeholder="Allocation End Date">
        <input type="date" id="travelDate" class="swal2-input" placeholder="Travel Date">
        <input type="text" id="remarks" class="swal2-input" placeholder="Remarks">
      `,
      confirmButtonText: "Add",
      showCancelButton: true,
      preConfirm: () => {
        const codigoEmpleado = Swal.getPopup().querySelector("#codigoEmpleado").value;
        const nombreEmpleado = Swal.getPopup().querySelector("#nombreEmpleado").value;
        const nombrePractica = Swal.getPopup().querySelector("#nombrePractica").value;
        const oldCodigoProyecto = Swal.getPopup().querySelector("#oldCodigoProyecto").value;
        const newCodigoProyecto = Swal.getPopup().querySelector("#newCodigoProyecto").value;
        const wbsPractice = Swal.getPopup().querySelector("#wbsPractice").value;
        const rdgRemarks = Swal.getPopup().querySelector("#rdgRemarks").value;
        const allocation = Swal.getPopup().querySelector("#allocation").value;
        const role = Swal.getPopup().querySelector("#role").value;
        const supervisorName = Swal.getPopup().querySelector("#supervisorName").value;
        const supervisorCode = Swal.getPopup().querySelector("#supervisorCode").value;
        const allocationStartDateJoiningDate = Swal.getPopup().querySelector("#allocationStartDateJoiningDate").value;
        const allocationEndDate = Swal.getPopup().querySelector("#allocationEndDate").value;
        const travelDate = Swal.getPopup().querySelector("#travelDate").value;
        const remarks = Swal.getPopup().querySelector("#remarks").value;

        if (!codigoEmpleado || !nombreEmpleado || !nombrePractica || !oldCodigoProyecto || !newCodigoProyecto || !wbsPractice || !rdgRemarks || !allocation || !role || !supervisorName || !supervisorCode || !allocationStartDateJoiningDate || !allocationEndDate || !travelDate || !remarks) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { codigoEmpleado, nombreEmpleado, nombrePractica, oldCodigoProyecto, newCodigoProyecto, wbsPractice, rdgRemarks, allocation, role, supervisorName, supervisorCode, allocationStartDateJoiningDate, allocationEndDate, travelDate, remarks };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newAllocation = {
          codigoEmpleado: result.value.codigoEmpleado,
          nombreEmpleado: result.value.nombreEmpleado,
          nombrePractica: result.value.nombrePractica,
          oldCodigoProyecto: result.value.oldCodigoProyecto,
          newCodigoProyecto: result.value.newCodigoProyecto,
          wbsPractice: result.value.wbsPractice,
          rdgRemarks: result.value.rdgRemarks,
          allocation: result.value.allocation,
          role: result.value.role,
          supervisorName: result.value.supervisorName,
          supervisorCode: result.value.supervisorCode,
          allocationStartDateJoiningDate: result.value.allocationStartDateJoiningDate,
          allocationEndDate: result.value.allocationEndDate,
          travelDate: result.value.travelDate,
          remarks: result.value.remarks,
        };

        axios
          .post(process.env.REACT_APP_API_ALLOCATIONS, newAllocation)
          .then(() => {
            fetchAllocations();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The allocation has been successfully added.",
            });
          })
          .catch((error) => {
            console.error("Error adding allocation:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to add the allocation.",
            });
          });
      }
    });
  };

  const handleEdit = (allocation) => {
    Swal.fire({
      title: "Update Allocation",
      html: `
        <input type="text" id="nombreEmpleado" class="swal2-input" placeholder="Employee Name" value="${allocation.nombreEmpleado}">
        <input type="text" id="nombrePractica" class="swal2-input" placeholder="Practice" value="${allocation.nombrePractica}">
        <input type="text" id="oldCodigoProyecto" class="swal2-input" placeholder="Old/Current Project Code" value="${allocation.oldCodigoProyecto}">
        <input type="text" id="newCodigoProyecto" class="swal2-input" placeholder="New Project Code" value="${allocation.newCodigoProyecto}">
        <input type="text" id="wbsPractice" class="swal2-input" placeholder="WBS Practice" value="${allocation.wbsPractice}">
        <input type="text" id="rdgRemarks" class="swal2-input" placeholder="RDG Remarks" value="${allocation.rdgRemarks}">
        <input type="text" id="allocation" class="swal2-input" placeholder="Allocation" value="${allocation.allocation}">
        <input type="text" id="role" class="swal2-input" placeholder="Role" value="${allocation.role}">
        <input type="text" id="supervisorName" class="swal2-input" placeholder="Supervisor Name" value="${allocation.supervisorName}">
        <input type="text" id="supervisorCode" class="swal2-input" placeholder="Supervisor Code" value="${allocation.supervisorCode}">
        <input type="date" id="allocationStartDateJoiningDate" class="swal2-input" placeholder="Allocation Start/Joining Date" value="${allocation.allocationStartDateJoiningDate}">
        <input type="date" id="allocationEndDate" class="swal2-input" placeholder="Allocation End Date" value="${allocation.allocationEndDate}">
        <input type="date" id="travelDate" class="swal2-input" placeholder="Travel Date" value="${allocation.travelDate}">
        <input type="text" id="remarks" class="swal2-input" placeholder="Remarks" value="${allocation.remarks}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const nombreEmpleado = Swal.getPopup().querySelector("#nombreEmpleado").value;
        const nombrePractica = Swal.getPopup().querySelector("#nombrePractica").value;
        const oldCodigoProyecto = Swal.getPopup().querySelector("#oldCodigoProyecto").value;
        const newCodigoProyecto = Swal.getPopup().querySelector("#newCodigoProyecto").value;
        const wbsPractice = Swal.getPopup().querySelector("#wbsPractice").value;
        const rdgRemarks = Swal.getPopup().querySelector("#rdgRemarks").value;
        const allocation = Swal.getPopup().querySelector("#allocation").value;
        const role = Swal.getPopup().querySelector("#role").value;
        const supervisorName = Swal.getPopup().querySelector("#supervisorName").value;
        const supervisorCode = Swal.getPopup().querySelector("#supervisorCode").value;
        const allocationStartDateJoiningDate = Swal.getPopup().querySelector("#allocationStartDateJoiningDate").value;
        const allocationEndDate = Swal.getPopup().querySelector("#allocationEndDate").value;
        const travelDate = Swal.getPopup().querySelector("#travelDate").value;
        const remarks = Swal.getPopup().querySelector("#remarks").value;

        if (!nombreEmpleado || !nombrePractica || !oldCodigoProyecto || !newCodigoProyecto || !wbsPractice || !rdgRemarks || !allocation || !role || !supervisorName || !supervisorCode || !allocationStartDateJoiningDate || !allocationEndDate || !travelDate || !remarks) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { ...allocation, nombreEmpleado, nombrePractica, oldCodigoProyecto, newCodigoProyecto, wbsPractice, rdgRemarks, allocation, role, supervisorName, supervisorCode, allocationStartDateJoiningDate, allocationEndDate, travelDate, remarks };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${process.env.REACT_APP_API_ALLOCATIONS}/${allocation.codigoEmpleado}`, result.value)
          .then(() => {
            fetchAllocations();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The allocation has been successfully updated.",
            });
          })
          .catch((error) => {
            console.error("Error updating allocation:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to update the allocation.",
            });
          });
      }
    });
  };

  const handleDelete = (codigoEmpleado) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_API_ALLOCATIONS}/${codigoEmpleado}`)
          .then(() => {
            fetchAllocations();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The allocation has been deleted.",
            });
          })
          .catch((error) => {
            console.error("Error deleting allocation:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to delete the allocation.",
            });
          });
      }
    });
  };

  const columns = [
    { name: "codigoEmpleado", label: "ID" },
    { name: "nombreEmpleado", label: "Employee Name" },
    { name: "nombrePractica", label: "Practice" },
    { name: "oldCodigoProyecto", label: "Old/Current Project Code" },
    { name: "newCodigoProyecto", label: "New Project Code" },
    { name: "wbsPractice", label: "WBS Practice" },
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
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const allocation = data[rowIndex];
          return (
            <ActionButtons 
              onEdit={() => handleEdit(allocation)} 
              onDelete={() => handleDelete(allocation.codigoEmpleado)} 
            />
          );
        },
      },
    },
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
    customToolbar: () => {
      return <AddButton onClick={handleAdd} />;
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
