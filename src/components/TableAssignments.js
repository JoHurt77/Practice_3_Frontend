import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import AddButton from './AddButton';
import ActionButtons from "./ActionButtons";

const TableAssignments = () => {
  const [data, setData] = useState([]);

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
    Swal.fire({
      title: "Add New Assignment",
      html: `
        <input type="number" id="employeeCode" class="swal2-input" placeholder="Employee Code">
        <input type="text" id="practiceName" class="swal2-input" placeholder="Practice Name">
        <input type="text" id="oldProjectCode" class="swal2-input" placeholder="Old Project Code">
        <input type="text" id="newProjectCode" class="swal2-input" placeholder="New Project Code">
        <input type="text" id="percentage" class="swal2-input" placeholder="Percentage">
        <input type="number" id="supervisorCode" class="swal2-input" placeholder="Supervisor Code">
        <input type="date" id="startDate" class="swal2-input" placeholder="Start Date">
        <input type="date" id="endDate" class="swal2-input" placeholder="End Date">
        <input type="text" id="remark" class="swal2-input" placeholder="Remark">
      `,
      confirmButtonText: "Add",
      showCancelButton: true,
      preConfirm: () => {
        const employeeCode = Number(Swal.getPopup().querySelector("#employeeCode").value);
        const supervisorCode = Number(Swal.getPopup().querySelector("#supervisorCode").value);
        const remark = Swal.getPopup().querySelector("#remark").value;
        const percentage = Swal.getPopup().querySelector("#percentage").value;
        const startDate = Swal.getPopup().querySelector("#startDate").value;
        const endDate = Swal.getPopup().querySelector("#endDate").value;
        const oldProjectCode = Swal.getPopup().querySelector("#oldProjectCode").value;
        const newProjectCode = Swal.getPopup().querySelector("#newProjectCode").value;
        const practiceName = Swal.getPopup().querySelector("#practiceName").value;
  
        if (!employeeCode || !supervisorCode || !remark || !percentage || !startDate || !endDate || !oldProjectCode || !newProjectCode || !practiceName) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
  
        return {
          employeeCode,
          supervisorCode,
          assignmentInfo: { remark, percentage, startDate, endDate },
          project: { oldCode: oldProjectCode, newCode: newProjectCode },
          practiceName
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newAssignment = result.value;
  
        axios
          .post(process.env.REACT_APP_API_ASSIGNMENTS, newAssignment)
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
    });
  };

  const handleEdit = (assignment) => {
    Swal.fire({
      title: "Update Assignment",
      html: `
        <input type="number" id="employeeCode" class="swal2-input" placeholder="Employee Code" value="${assignment.employeeCode}">
        <input type="text" id="practiceName" class="swal2-input" placeholder="Practice Name" value="${assignment.practiceName}">
        <input type="text" id="oldProjectCode" class="swal2-input" placeholder="Old Project Code" value="${assignment.projectOldCode}">
        <input type="text" id="newProjectCode" class="swal2-input" placeholder="New Project Code" value="${assignment.projectNewCode}">
        <input type="text" id="percentage" class="swal2-input" placeholder="Percentage" value="${assignment.percentage}">
        <input type="number" id="supervisorCode" class="swal2-input" placeholder="Supervisor Code" value="${assignment.supervisorCode}">
        <input type="date" id="startDate" class="swal2-input" value="${assignment.startDate}">
        <input type="date" id="endDate" class="swal2-input" value="${assignment.endDate}">
        <input type="text" id="remark" class="swal2-input" placeholder="Remark" value="${assignment.remark}">
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: () => {
        const employeeCode = Number(Swal.getPopup().querySelector("#employeeCode").value);
        const supervisorCode = Number(Swal.getPopup().querySelector("#supervisorCode").value);
        const remark = Swal.getPopup().querySelector("#remark").value;
        const percentage = Swal.getPopup().querySelector("#percentage").value;
        const startDate = Swal.getPopup().querySelector("#startDate").value;
        const endDate = Swal.getPopup().querySelector("#endDate").value;
        const oldProjectCode = Swal.getPopup().querySelector("#oldProjectCode").value;
        const newProjectCode = Swal.getPopup().querySelector("#newProjectCode").value;
        const practiceName = Swal.getPopup().querySelector("#practiceName").value;
  
        if (!employeeCode || !supervisorCode || !remark || !percentage || !startDate || !endDate || !oldProjectCode || !newProjectCode || !practiceName) {
          Swal.showValidationMessage(`Please enter all fields`);
          return null;
        }
  
        return {
          employeeCode,
          supervisorCode,
          assignmentInfo: { remark, percentage, startDate, endDate },
          project: { oldCode: oldProjectCode, newCode: newProjectCode },
          practiceName
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAssignment = result.value;
  
        axios
          .put(`${process.env.REACT_APP_API_ASSIGNMENTS}/${assignment.assignmentCode}`, updatedAssignment)
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
      }
    });
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
            if (response.status === 204) {
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
            rowData[columns[index].label] = value != null ? value.toString() : "";
          }
        });
        return rowData;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      const colWidths = columns
        .filter(col => col.name !== "Actions")
        .map(col => {
          const maxWidth = Math.max(
            col.label.length,
            ...data.map(row => {
              const value = row.data[columns.findIndex(c => c.label === col.label)];
              return value != null ? value.toString().length : 0;
            })
          );
          return { width: maxWidth + 2 };
        });

      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "AssignmentData");
      XLSX.writeFile(wb, "assignment_data.xlsx");
      return false;
    },
  };

  return (
    <MUIDataTable
      title={"Assignments Data"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default TableAssignments;
