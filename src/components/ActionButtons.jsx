import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    // Botones personalizados para editar y eliminar
    <div>
      <button onClick={onEdit} style={{ border: "none", background: "none" }}>
        <FontAwesomeIcon icon={faEdit} style={{ color: "#007bff", cursor: "pointer" }} />
      </button>
      <button onClick={onDelete} style={{ border: "none", background: "none" }}>
        <FontAwesomeIcon icon={faTrash} style={{ color: "#dc3545", cursor: "pointer" }} />
      </button>
    </div>
  );
};

export default ActionButtons;
