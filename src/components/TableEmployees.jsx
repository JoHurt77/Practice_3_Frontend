import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
// import * as XLSX from "xlsx";
import Swal from "sweetalert2";
// import AddButton from './AddButton'; // Botón de agregar registro
import ActionButtons from "./ActionButtons";
import createOptions from "./CustomDataTable";

const TableEmployees = () => {
  const [data, setData] = useState([]);

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
        console.error("Error fetching data:", error);
      });
  };

  // Función para manejar la adición de un nuevo empleado
  const handleAdd = () => {
    Swal.fire({
      title: "Add New Employee",
      html: `
        <input type="number" id="code" class="swal2-input" placeholder="ID">
        <input type="text" id="name" class="swal2-input" placeholder="Name">
        <input type="text" id="role" class="swal2-input" placeholder="Role">
        <input type="text" id="practice" class="swal2-input" placeholder="Practice">
      `,
      confirmButtonText: "Add",
      showCancelButton: true,
      preConfirm: () => {
        const code = Swal.getPopup().querySelector("#code").value;
        const name = Swal.getPopup().querySelector("#name").value;
        const role = Swal.getPopup().querySelector("#role").value;
        const practice = Swal.getPopup().querySelector("#practice").value;

        if (!code || !name || !role || !practice) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { code, name, role, practice };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newEmployee = {
          code: result.value.code,
          name: result.value.name,
          role: result.value.role,
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
        <input type="text" id="name" class="swal2-input" placeholder="Name" value="${employee.name}">
        <input type="text" id="role" class="swal2-input" placeholder="Role" value="${employee.role}">
        <input type="text" id="practice" class="swal2-input" placeholder="Practice" value="${employee.practice}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const role = Swal.getPopup().querySelector("#role").value;
        const practice = Swal.getPopup().querySelector("#practice").value;

        if (!name || !role || !practice) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { name, role, practice };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEmployee = {
          name: result.value.name,
          role: result.value.role,
          practice: result.value.practice,
        };

        axios
          .put(`${process.env.REACT_APP_API_EMPLOYEES}/${employee.code}`, updatedEmployee)
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
    title: `Are you sure you want to delete ${employee.name}?`,
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
        .delete(`${process.env.REACT_APP_API_EMPLOYEES}/${employee.code}`)
        .then((response) => {
          if (response.status === 200) {
            fetchEmployees();
            Swal.fire({
              title: "Success!",
              text: "Employee deleted successfully.",
              icon: "success",
            });
          } else {
            throw new Error("Unexpected status code");
          }
        })
        .catch((error) => {
          if (error.response) {
            switch (error.response.status) {
              case 404:
                Swal.fire({
                  title: "Error",
                  text: "Employee not found.",
                  icon: "error",
                });
                break;
              case 409:
                Swal.fire({
                  title: "Error",
                  text: "Cannot delete employee due to a conflict.",
                  icon: "error",
                });
                break;
              default:
                Swal.fire({
                  title: "Error",
                  text: "Unexpected error occurred.",
                  icon: "error",
                });
                break;
            }
          } else {
            console.error("Error deleting employee:", error);
            Swal.fire({
              title: "Error",
              text: "Error when trying to delete the employee.",
              icon: "error",
            });
          }
        });
    }
  });
};


  // Definición de las columnas de la tabla
  const columns = [
    { name: "code", label: "ID" },
    { name: "name", label: "Employee Name" },
    { name: "role", label: "Role" },
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
  const options = createOptions(handleAdd, columns);

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
