import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ENDPOINTS from "../config/configLocal";

const TableAllocations = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get(ENDPOINTS.GET_ALL_EMPLOYEES)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  const handleEdit = (employee) => {
    Swal.fire({
      title: "Update Employee",
      html: `
        <input type="text" id="nombreEmpleado" class="swal2-input" placeholder="Nombre" value="${employee.nombreEmpleado}">
        <input type="text" id="rolEmpleado" class="swal2-input" placeholder="Rol" value="${employee.rolEmpleado}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const nombreEmpleado = Swal.getPopup().querySelector("#nombreEmpleado").value;
        const rolEmpleado = Swal.getPopup().querySelector("#rolEmpleado").value;

        if (!nombreEmpleado || !rolEmpleado) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { nombreEmpleado, rolEmpleado };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEmployee = {
          codigoEmpleado: employee.codigoEmpleado,
          nombreEmpleado: result.value.nombreEmpleado,
          rolEmpleado: result.value.rolEmpleado,
        };

        axios
          .put(`${ENDPOINTS.UPDATE_EMPLOYEE}/${employee.codigoEmpleado}`, updatedEmployee)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              icon: "success",
              title: "!Success!",
              text: "The employee has been successfully updated.",
            });
          })
          .catch((error) => {
            console.error("Error editing employee:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to update the employee.",
            });
          });
      }
    });
  };

  const handleDelete = (employee) => {
    Swal.fire({
      title: `Are you sure you want to delete ${employee.nombreEmpleado}?`,
      text: "This action can not be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ENDPOINTS.DELETE_EMPLOYEE}/${employee.codigoEmpleado}`)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              title: "!Success!",
              text: "The employee has been successfully deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error("Error deleting employee:", error);
            Swal.fire({
              title: "Error",
              text: "Error when trying to delete the employee.",
              icon: "error",
            });
          });
      }
    });
  };

  const columns = [
    { name: "codigoEmpleado", label: "ID" },
    { name: "nombreEmpleado", label: "Employee Name" },
    { name: "rolEmpleado", label: "Practice" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const employee = data[dataIndex];
          return (
            <div>
              <button onClick={() => handleEdit(employee)} style={{ marginRight: "10px", border: "none", background: "none" }}>
                <FontAwesomeIcon icon={faEdit} style={{ color: "#007bff", cursor: "pointer" }} />
              </button>
              <button onClick={() => handleDelete(employee)} style={{ border: "none", background: "none" }}>
                <FontAwesomeIcon icon={faTrash} style={{ color: "#dc3545", cursor: "pointer" }} />
              </button>
            </div>
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
    onDownload: (buildHead, buildBody, columns, data) => {
      const dataToExport = data.map((row) => {
        let rowData = {};
        row.data.forEach((value, index) => {
          rowData[columns[index].label] = value != null ? value.toString() : ""; // Manejar casos undefined/null
        });
        return rowData;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Calcular el ancho máximo de cada columna
      const colWidths = columns.map(col => {
        const maxWidth = Math.max(
          col.label.length,
          ...data.map(row => {
            const value = row.data[columns.findIndex(c => c.label === col.label)];
            return value != null ? value.toString().length : 0; // Manejar casos undefined/null
          })
        );
        return { width: maxWidth + 2 }; // Añadir un poco de espacio extra
      });

      ws['!cols'] = colWidths;

      // Aplicar estilos a los encabezados
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ c: C, r: range.s.r });
        if (!ws[cell_address]) ws[cell_address] = { t: "s", v: columns[C].label };
        ws[cell_address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } }, // Texto blanco
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "000000" } }, // Fondo negro
        };
      }

      XLSX.utils.book_append_sheet(wb, ws, "EmployeeData");
      XLSX.writeFile(wb, "employee_data.xlsx");
      return false;
    },
  };

  return (
    <MUIDataTable
      title={"Employees Data"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TableAllocations;
