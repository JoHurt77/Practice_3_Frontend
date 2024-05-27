// Importaciones necesarias de React, Axios, MUIDataTable, Sweetalert2, FontAwesome y componentes personalizados
import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddButton from './AddButton'; // Importa el componente de la barra de herramientas personalizada
import ActionButtons from "./ActionButtons";

const TableEmployees = () => {
  const [data, setData] = useState([]); // Estado para almacenar los datos de los empleados

  // useEffect para obtener los datos al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Función para obtener los datos de los empleados desde la API
  const fetchEmployees = () => {
    axios
      .get(process.env.REACT_APP_API_EMPLOYEES)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  // Función para manejar la adición de un nuevo empleado
  const handleAdd = () => {
    Swal.fire({
      title: "Add New Employee",
      html: `
        <input type="number" id="codigoEmpleado" class="swal2-input" placeholder="ID">
        <input type="text" id="nombreEmpleado" class="swal2-input" placeholder="Name">
        <input type="text" id="rolEmpleado" class="swal2-input" placeholder="Role">
        <input type="text" id="practice" class="swal2-input" placeholder="Practice">
      `,
      confirmButtonText: "Add",
      showCancelButton: true,
      preConfirm: () => {
        const codigoEmpleado = Swal.getPopup().querySelector("#codigoEmpleado").value;
        const nombreEmpleado = Swal.getPopup().querySelector("#nombreEmpleado").value;
        const rolEmpleado = Swal.getPopup().querySelector("#rolEmpleado").value;
        const practice = Swal.getPopup().querySelector("#practice").value;

        if (!codigoEmpleado || !nombreEmpleado || !rolEmpleado || !practice) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { codigoEmpleado, nombreEmpleado, rolEmpleado, practice };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newEmployee = {
          codigoEmpleado: result.value.codigoEmpleado,
          nombreEmpleado: result.value.nombreEmpleado,
          rolEmpleado: result.value.rolEmpleado,
          practice: result.value.practice,
        };

        axios
          .post(process.env.REACT_APP_API_EMPLOYEES, newEmployee)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The employee has been successfully added.",
            });
          })
          .catch((error) => {
            console.error("Error adding employee:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to add the employee.",
            });
          });
      }
    });
  };

  // Función para manejar la edición de un empleado existente
  const handleEdit = (employee) => {
    Swal.fire({
      title: "Update Employee",
      html: `
        <input type="text" id="nombreEmpleado" class="swal2-input" placeholder="Name" value="${employee.nombreEmpleado}">
        <input type="text" id="rolEmpleado" class="swal2-input" placeholder="Role" value="${employee.rolEmpleado}">
        <input type="text" id="practice" class="swal2-input" placeholder="Practice" value="${employee.practice}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const nombreEmpleado = Swal.getPopup().querySelector("#nombreEmpleado").value;
        const rolEmpleado = Swal.getPopup().querySelector("#rolEmpleado").value;
        const practice = Swal.getPopup().querySelector("#practice").value;

        if (!nombreEmpleado || !rolEmpleado || !practice) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { nombreEmpleado, rolEmpleado, practice };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEmployee = {
          codigoEmpleado: employee.codigoEmpleado,
          nombreEmpleado: result.value.nombreEmpleado,
          rolEmpleado: result.value.rolEmpleado,
          practice: result.value.practice,
        };

        axios
          .put(`${process.env.REACT_APP_API_EMPLOYEES}/${employee.codigoEmpleado}`, updatedEmployee)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              icon: "success",
              title: "Success!",
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

  // Función para manejar la eliminación de un empleado
  const handleDelete = (employee) => {
    Swal.fire({
      title: `Are you sure you want to delete ${employee.nombreEmpleado}?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_API_EMPLOYEES}/${employee.codigoEmpleado}`)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              title: "Success!",
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

  // Definición de las columnas de la tabla
  const columns = [
    { name: "codigoEmpleado", label: "ID" },
    { name: "nombreEmpleado", label: "Employee Name" },
    { name: "rolEmpleado", label: "Role" },
    { name: "practice", label: "Practice" },
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
            <ActionButtons 
              onEdit={() => handleEdit(employee)} 
              onDelete={() => handleDelete(employee)} 
            />
          );
        },
      },
    },
  ];

  // Definición de las opciones de la tabla
  const options = {
    download: true,
    customToolbar: () => {
      return (
        <AddButton onAdd={handleAdd} />
      );
    },
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
          if (columns[index].name !== "Actions") {
            rowData[columns[index].label] = value != null ? value.toString() : ""; // Manejar valores indefinidos/nulos
          }
        });
        return rowData;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Calcular el ancho máximo de cada columna
      const colWidths = columns
        .filter(col => col.name !== "Actions")
        .map(col => {
          const maxWidth = Math.max(
            col.label.length,
            ...data.map(row => {
              const value = row.data[columns.findIndex(c => c.label === col.label)];
              return value != null ? value.toString().length : 0; // Manejar valores indefinidos/nulos
            })
          );
          return { width: maxWidth + 2 }; // Añadir un poco de espacio extra
        });

      ws['!cols'] = colWidths;

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

export default TableEmployees;
