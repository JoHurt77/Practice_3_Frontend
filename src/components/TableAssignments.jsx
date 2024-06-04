import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Swal from "sweetalert2";
import ActionButtons from "./ActionButtons";
import ModalAssignments from "./ModalAssignments"; // Importa el modal
import createOptions from "./CustomDataTable";

const TableAssignments = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
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
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAdd = () => {
    setModalInitialData(null);
    setModalOpen(true);
  };

  const formatDateForInput = (dateString) => {
    // Si la cadena de fecha no está vacía
    if (dateString) {
      // Separa el día, mes y año de la cadena de fecha
      const [day, month, year] = dateString.split('/');
      // Formatea la fecha al formato yyyy-MM-dd
      return `${year}-${month}-${day}`;
    }
    // Si la cadena de fecha está vacía, devuelve una cadena vacía
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
        .then(() => {
          fetchAssignments();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "The assignment has been successfully updated.",
          });
        })
        .catch((error) => {
          console.error("Error editing assignment:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error when trying to update the assignment.",
          });
        });
    } else {
      // Agregar nueva asignación
      axios
        .post(process.env.REACT_APP_API_ASSIGNMENTS, formData)
        .then(() => {
          fetchAssignments();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "The assignment has been successfully added.",
          });
        })
        .catch((error) => {
          console.error("Error adding assignment:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error when trying to add the assignment.",
          });
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
    { name: "employeeCode", label: "Emp Id" },
    { name: "employeeName", label: "Emp Name" },
    { name: "employeePractice", label: "Emp Practice" },
    { name: "projectOldCode", label: "Old/Current Project Code" },
    { name: "projectNewCode", label: "New Project Code" },
    { name: "practiceName", label: "WBS PRACTICE" },
    { name: "percentage", label: "Allocation %" },
    { name: "employeeRole", label: "Role" },
    { name: "supervisorName", label: "Supervisor Name" },
    { name: "supervisorCode", label: "Supervisor Code" },
    { name: "startDate", label: "Start Date/Joining Date" },
    { name: "endDate", label: "End Date" },
    { name: "remark", label: "Remark" },
    {
      name: "Actions",
      label: "Actions",
      options: {
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
