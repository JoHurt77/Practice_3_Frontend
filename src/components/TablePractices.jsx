import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Swal from "sweetalert2";
import ActionButtons from "./ActionButtons";
import createOptions from "./CustomDataTable";

const TablePractices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores

  // useEffect para obtener los datos al montar el componente
  useEffect(() => {
    fetchPractices();
  }, []);

  // Función para obtener los datos de las prácticas desde la API
  const fetchPractices = () => {
    setLoading(true); // Comienza la carga de datos
    axios
      .get(process.env.REACT_APP_API_PRACTICES)
      .then((response) => {
        setData(response.data);
        setLoading(false); // Finaliza la carga de datos
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false); // Finaliza la carga de datos
      });
  };

  // Función para manejar la adición de un nuevo registro
  const handleAdd = () => {
    Swal.fire({
      title: "Add New Practice",
      html: `
        <input type="text" id="code" class="swal2-input" placeholder="Practice">
      `,
      confirmButtonText: "Add",
      showCancelButton: true,
      preConfirm: () => {
        const code = Swal.getPopup().querySelector("#code").value;

        if (!code) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
        return { code };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newPractice = {
          code: result.value.code,
        };

        axios
          .post(process.env.REACT_APP_API_PRACTICES, newPractice)
          .then(() => {
            fetchPractices();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The practice has been successfully added.",
            });
          })
          .catch((error) => {
            console.error("Error adding practice:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to add the practice.",
            });
          });
      }
    });
  };

  // Función para manejar la edición de una práctica existente
  const handleEdit = (practice) => {
    Swal.fire({
      title: "Update Practice",
      html: `
        <input type="text" id="newCode" class="swal2-input" placeholder="Practice" value="${practice.code}">
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
          .put(
            `${process.env.REACT_APP_API_PRACTICES}/${practice.code}`,
            updatePractice
          )
          .then(() => {
            fetchPractices();
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

  // Función para manejar la eliminación de una práctica
  const handleDelete = (practice) => {
    Swal.fire({
      title: `Are you sure you want to delete ${practice.code}?`,
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
          .delete(`${process.env.REACT_APP_API_PRACTICES}/${practice.code}`)
          .then((response) => {
            if (response.status === 200) {
              fetchPractices();
              Swal.fire({
                title: "Success!",
                text: "The practice has been successfully deleted.",
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
                    text: "Practice not found.",
                    icon: "error",
                  });
                  break;
                case 409:
                  Swal.fire({
                    title: "Error",
                    text: "Cannot delete practice due to a conflict.",
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
              console.error("Error deleting practice:", error);
              Swal.fire({
                title: "Error",
                text: "Error when trying to delete the practice.",
                icon: "error",
              });
            }
          });
      }
    });
  };

  // Definición de las columnas de la tabla
  const columns = [
    { name: "code", label: "Practice" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const practice = data[dataIndex];
          return (
            <ActionButtons
              onEdit={() => handleEdit(practice)}
              onDelete={() => handleDelete(practice)}
            />
          );
        },
      },
    },
  ];

  // Personalización de la tabla
  const options = createOptions(handleAdd, columns);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    ); // Muestra un mensaje de carga mientras se obtienen los datos
  }

  if (error) {
    return <div className="error-container">{error}</div>; // Muestra un mensaje de error si ocurre un error durante la obtención de datos
  }

  return (
    <MUIDataTable
      title={"Practices Data"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TablePractices;
