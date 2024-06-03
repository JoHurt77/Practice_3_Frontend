import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import AddButton from './AddButton'; // Botón de agregar registro
import ActionButtons from "./ActionButtons";

const TableProyects = () => {
  const [data, setData] = useState([]); // Estado para almacenar los datos

  // useEffect para obtener los datos al montar el componente
  useEffect(() => {
    fetchProyects();
  }, []);

  // Función para obtener los datos de los Proyectos desde la API
  const fetchProyects = () => {
    axios
      .get(process.env.REACT_APP_API_PROYECTS)
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
      title: "Add New Proyect",
      html: `
        <input type="text" id="code" class="swal2-input" placeholder="Proyect">
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
          .post(process.env.REACT_APP_API_PROYECTS, newProyect)
          .then(() => {
            fetchProyects();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The proyect has been successfully added.",
            });
          })
          .catch((error) => {
            console.error("Error adding proyect:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to add the proyect.",
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
          .put(`${process.env.REACT_APP_API_PROYECTS}/${practice.code}`, updatePractice)
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
const handleDelete = (proyect) => {
  Swal.fire({
    title: `Are you sure you want to delete ${proyect.code}?`,
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
        .delete(`${process.env.REACT_APP_API_PROYECTS}/${proyect.code}`)
        .then((response) => {
          if (response.status === 204) {
            fetchProyects();
            Swal.fire({
              title: "Success!",
              text: "The proyect has been successfully deleted.",
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
                  text: "Proyect not found.",
                  icon: "error",
                });
                break;
              case 409:
                Swal.fire({
                  title: "Error",
                  text: "Cannot delete proyect due to a conflict.",
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
            console.error("Error deleting proyect:", error);
            Swal.fire({
              title: "Error",
              text: "Error when trying to delete the proyect.",
              icon: "error",
            });
          }
        });
    }
  });
};

  // Definición de las columnas de la tabla
  const columns = [
    { name: "code", label: "Proyect" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const proyect = data[dataIndex];
          return (
            <ActionButtons 
              onEdit={() => handleEdit(proyect)} 
              onDelete={() => handleDelete(proyect)} 
            />
          );
        },
      },
    },
  ];

  // Personalización de la tabla
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

      XLSX.utils.book_append_sheet(wb, ws, "ProyectData");
      XLSX.writeFile(wb, "proyect_data.xlsx");
      return false;
    },
  };

  return (
    <MUIDataTable
      title={"Proyects Data"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TableProyects;
