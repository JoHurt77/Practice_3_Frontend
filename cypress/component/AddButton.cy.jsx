/* eslint-disable no-undef */
import React from 'react';
import AddButton from '../../src/components/AddButton'; 

describe('AddButton test', () => {
  it('renders', () => {
    cy.mount(<AddButton />);
    cy.get('button').should('exist'); // Verifica que el botón se renderiza
  });

  it('has the correct title attribute', () => {
    cy.mount(<AddButton />);
    cy.get('button').should('have.attr', 'title', 'Add New Field'); 
  });

  it('renders the FontAwesomeIcon with correct icon', () => {
    cy.mount(<AddButton />);
    cy.get('svg').should('exist'); // Verifica que el icono se renderiza
    cy.get('svg').should('have.attr', 'data-icon', 'plus'); // Verifica el icono específico
  });
});
