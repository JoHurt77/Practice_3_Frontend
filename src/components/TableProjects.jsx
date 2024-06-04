import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Swal from "sweetalert2";
import ActionButtons from "./ActionButtons";
import createOptions from "./CustomDataTable";

const TableProjects = () => {
  const [data, setData] = useState([]); // Estado para almacenar los datos

  // useEffect para obtener los datos al montar el componente
  useEffect(() => {
    fetchProyects();
  }, []);

  // Función para obtener los datos de los Proyectos desde la API
  const fetchProyects = () => {
    axios
      .get(process.env.REACT_APP_API_PROJECTS)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Función para manejar la adición de un nuevo registro
  const handleAdd = () => {
    Swal.fire({
      title: "Add New Project",
      html: `
        <input type="text" id="code" class="swal2-input" placeholder="Project">
      `,
      confirmButtonText: "Add",
      showCancelButton: true,
      preConfirm: () => {
        const code = Swal.getPopup().querySelector("#code").value;

        if (!code) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return {code};
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newProyect = {
          code: result.value.code,
        };

        axios
          .post(process.env.REACT_APP_API_PROJECTS, newProyect)
          .then(() => {
            fetchProyects();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The project has been successfully added.",
            });
          })
          .catch((error) => {
            console.error("Error adding project:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to add the project.",
            });
          });
      }
    });
  };

  // Función para manejar la edición de un Proyecto existente
  const handleEdit = (practice) => {
    Swal.fire({
      title: "Update Practice",
      html: `
        <input type="text" id="newCode" class="swal2-input" placeholder="Practices" value="${practice.code}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const newCode = Swal.getPopup().querySelector("#newCode").value;

        if (!newCode) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { newCode: newCode };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatePractice = {
          newCode: result.value.newCode,
        };

        axios
          .put(`${process.env.REACT_APP_API_PROJECTS}/${practice.code}`, updatePractice)
          .then(() => {
            fetchProyects();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The practice has been successfully updated.",
            });
          })
          .catch((error) => {
            console.error("Error editing practice:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to update the practice.",
            });
          });
      }
    });
  };

  // Función para manejar la eliminación de un Proyecto
const handleDelete = (project) => {
  Swal.fire({
    title: `Are you sure you want to delete ${project.code}?`,
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
        .delete(`${process.env.REACT_APP_API_PROJECTS}/${project.code}`)
        .then((response) => {
          if (response.status === 200) {
            fetchProyects();
            Swal.fire({
              title: "Success!",
              text: "The project has been successfully deleted.",
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
                  text: "Project not found.",
                  icon: "error",
                });
                break;
              case 409:
                Swal.fire({
                  title: "Error",
                  text: "Cannot delete project due to a conflict.",
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
            console.error("Error deleting project:", error);
            Swal.fire({
              title: "Error",
              text: "Error when trying to delete the project.",
              icon: "error",
            });
          }
        });
    }
  });
};

  // Definición de las columnas de la tabla
  const columns = [
    { name: "code", label: "Project" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const project = data[dataIndex];
          return (
            <ActionButtons 
              onEdit={() => handleEdit(project)} 
              onDelete={() => handleDelete(project)} 
            />
          );
        },
      },
    },
  ];

  // Personalización de la tabla
  const options = createOptions(handleAdd, columns);

  return (
    <MUIDataTable
      title={"Projects Data"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TableProjects;
