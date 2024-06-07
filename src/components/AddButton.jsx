import React from 'react';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

//Boton para agregar un nuevo registro "+""
const AddButton = ({ onAdd }) => {
  return (
    <React.Fragment>
      <IconButton onClick={onAdd} title="Add New Field">
        <FontAwesomeIcon icon={faPlus} style={{ color: "#28a745" }} />
      </IconButton>
    </React.Fragment>
  );
};

export default AddButton;
