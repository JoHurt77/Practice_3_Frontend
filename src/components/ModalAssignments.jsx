import React, { useState, useEffect } from "react";
import { Modal, Box, Grid, TextField, Button, Typography } from "@mui/material";

// Formatea la fecha al formato yyyy-MM-dd
const formatDateForInput = (dateString) => {
  if (dateString) {
    const [day, month, year] = dateString.split('-');
    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
  }
  return '';
};

const ModalAssignments = ({ open, handleClose, handleSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    employeeCode: "",
    supervisorCode: "",
    project: { oldCode: "", newCode: "" },
    assignmentInfo: { remark: "", percentage: "", startDate: "", endDate: "" },
    practiceName: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        assignmentInfo: {
          ...initialData.assignmentInfo,
          startDate: formatDateForInput(initialData.assignmentInfo.startDate),
          endDate: formatDateForInput(initialData.assignmentInfo.endDate),
        }
      });
    } else {
      setFormData({
        employeeCode: "",
        supervisorCode: "",
        project: { oldCode: "", newCode: "" },
        assignmentInfo: {
          remark: "",
          percentage: "",
          startDate: "",
          endDate: "",
        },
        practiceName: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setFormData((prevState) => ({
        ...prevState,
        [keys[0]]: { ...prevState[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          maxWidth: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          mx: "auto",
          my: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {initialData ? "Edit Allocation" : "Add New Allocation"}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Supervisor Code"
                name="supervisorCode"
                value={formData.supervisorCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Practice Name"
                name="practiceName"
                value={formData.practiceName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Old Project Code"
                name="project.oldCode"
                value={formData.project.oldCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="New Project Code"
                name="project.newCode"
                value={formData.project.newCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Percentage"
                name="assignmentInfo.percentage"
                value={formData.assignmentInfo.percentage}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="assignmentInfo.startDate"
                value={formData.assignmentInfo.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="assignmentInfo.endDate"
                value={formData.assignmentInfo.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Remarks"
                name="assignmentInfo.remark"
                value={formData.assignmentInfo.remark}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
            >
              <Button variant="contained" color="primary" type="submit">
                {initialData ? "Save" : "Add"}
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAssignments;
