import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Swal from "sweetalert2";
import ActionButtons from "./ActionButtons"; //botones de editar y eliminar
import ModalAssignments from "./ModalAssignments"; // Importa el modal personalizado
import createOptions from "./CustomDataTable"; // Importa las opciones para la tabla y el formato para descargar el xlsx

const TableAssignments = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    setLoading(true); // Inicia el estado de carga
    axios
      .get(process.env.REACT_APP_API_ASSIGNMENTS)
      .then((response) => {
        const assignments = response.data.map(item => ({
          employeeCode: item.employee.code,
          employeeName: item.employee.name,
          employeeRole: item.employee.role,
          employeePractice: item.employee.practice,
          practiceName: item.practiceName,
          supervisorCode: item.supervisor.code,
          supervisorName: item.supervisor.name,
          projectOldCode: item.project.oldCode,
          projectNewCode: item.project.newCode,
          assignmentCode: item.assignmentInfo.code,
          remark: item.assignmentInfo.remark,
          percentage: item.assignmentInfo.percentage,
          startDate: item.assignmentInfo.startDate,
          endDate: item.assignmentInfo.endDate
        }));
        setData(assignments);
        setLoading(false); // Finaliza el estado de carga
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false); // Finaliza el estado de carga, independientemente de si la solicitud fue exitosa o no
      });
  };

  const handleAdd = () => {
    setModalInitialData(null);
    setModalOpen(true);
  };

// Formatea la fecha al formato dd-MM-yyyy
const formatDateForInput = (dateString) => {
  if (dateString) {
    const [day, month, year] = dateString.split('-');
    if (day && month && year) {
      return `${day}-${month}-${year}`;
    }
  }
  return '';
};
  

  const handleEdit = (assignment) => {
    setModalInitialData({
      employeeCode: assignment.employeeCode,
      
      supervisorCode: assignment.supervisorCode,
      project: {
        oldCode: assignment.projectOldCode,
        newCode: assignment.projectNewCode,
      },
      assignmentInfo: {
        remark: assignment.remark,
        percentage: assignment.percentage,
        startDate: formatDateForInput(assignment.startDate),
        endDate: formatDateForInput(assignment.endDate),
      },
      practiceName: assignment.practiceName,
    });
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (modalInitialData) {
      // Editar asignación existente
      axios
        .put(`${process.env.REACT_APP_API_ASSIGNMENTS}/${formData.employeeCode}`, formData)
        .then((response) => {
          if (response.status === 204) {
            fetchAssignments();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The assignment has been successfully updated.",
            });
          } else {
            throw new Error("Unexpected status code");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Bad request. Please check your input data.",
              });
            } 
            else if (error.response.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Employee Code Not Found. Please try again",
              });
            } 
            else if (error.response.status === 409) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Cannot Update assignment due to a conflict.",
              });
            } 
            else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unexpected error occurred.",
              });
            }
          } else {
            console.error("Error editing assignment:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to update the assignment.",
            });
          }
        });
    } else {
      // Agregar nueva asignación
      axios
        .post(process.env.REACT_APP_API_ASSIGNMENTS, formData)
        .then((response) => {
          if (response.status === 204) {
            fetchAssignments();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "The assignment has been successfully added.",
            });
          } else {
            throw new Error("Unexpected status code");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Bad request. Please check your input data.",
              });
            } else if (error.response.status === 409) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Cannot Add assignment due to a conflict.",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unexpected error occurred.",
              });
            }
          } else {
            console.error("Error adding assignment:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error when trying to add the assignment.",
            });
          }
        });
    }
    setModalOpen(false);
  };
  

  const handleDelete = (assignment) => {
    Swal.fire({
      title: `Are you sure you want to delete the assignment for ${assignment.employeeName}?`,
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
          .delete(`${process.env.REACT_APP_API_ASSIGNMENTS}/${assignment.employeeCode}`)
          .then((response) => {
            if (response.status === 200) {
              fetchAssignments();
              Swal.fire({
                title: "Success!",
                text: "The assignment has been successfully deleted.",
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
                    text: "Assignment not found.",
                    icon: "error",
                  });
                  break;
                case 409:
                  Swal.fire({
                    title: "Error",
                    text: "Conflict error: Cannot delete assignment due to a conflict.",
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
              console.error("Error deleting assignment:", error);
              Swal.fire({
                title: "Error",
                text: "Error when trying to delete the assignment.",
                icon: "error",
              });
            }
          });
      }
    });
  };

  const columns = [
    { 
      name: "employeeCode", 
      label: "Emp Id",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "employeeName", 
      label: "Emp Name",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "employeePractice", 
      label: "Emp Practice",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "projectOldCode", 
      label: "Old/Current Project Code",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "projectNewCode", 
      label: "New Project Code",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "practiceName", 
      label: "WBS PRACTICE",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "percentage", 
      label: "Allocation %",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "employeeRole", 
      label: "Role",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "supervisorName", 
      label: "Supervisor Name",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "supervisorCode", 
      label: "Supervisor Code",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "startDate", 
      label: "Allocation Start Date/Joining Date",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "endDate", 
      label: "Allocation End Date",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    { 
      name: "remark", 
      label: "Remark",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } })
      }
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        setCellProps: () => ({ style: { textAlign: 'center' } }),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } }),
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const assignment = data[dataIndex];
          return (
            <ActionButtons 
              onEdit={() => handleEdit(assignment)} 
              onDelete={() => handleDelete(assignment)} 
            />
          );
        },
      },
    },
  ];
  
  const options = createOptions(handleAdd, columns);

  if (loading) {
    return <div className="loading-container">
    <div className="spinner"></div>
  </div> // Muestra un mensaje de carga mientras se obtienen los datos
  }

  if (error) {
    return <div className="error-container">{error}</div>; // Muestra un mensaje de error si ocurre un error durante la obtención de datos
  }

  return (
    <>
      <MUIDataTable
        title={"Assignments Data"}
        data={data}
        columns={columns}
        options={options}
      />
      <ModalAssignments
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSubmit={handleSubmit}
        initialData={modalInitialData}
      />
    </>
  );
};

export default TableAssignments;
