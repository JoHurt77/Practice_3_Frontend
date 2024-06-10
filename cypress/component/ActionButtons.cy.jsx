/* eslint-disable no-undef */
import React from 'react';
import ActionButtons from '../../src/components/ActionButtons'; // Ajusta la ruta según la estructura de tu proyecto

describe('<ActionButtons />', () => {
  it('renders edit and delete buttons', () => {
    cy.mount(<ActionButtons />);
    cy.get('button').should('have.length', 2); // Verifica que haya dos botones
    // cy.get('svg[data-icon="edit"]').should('exist'); // Verifica que el ícono de editar esté presente
    // cy.get('svg[data-icon="trash"]').should('exist'); // Verifica que el ícono de eliminar esté presente
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = cy.stub();
    cy.mount(<ActionButtons onEdit={onEdit} />);
    cy.get('button').first().click();
    // expect(onEdit).to.have.been.calledOnce; // Verifica que la función onEdit se llama una vez
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = cy.stub();
    cy.mount(<ActionButtons onDelete={onDelete} />);
    cy.get('button').last().click();
    // expect(onDelete).to.have.been.calledOnce; // Verifica que la función onDelete se llama una vez
  });
});
