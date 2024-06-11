/* eslint-disable no-undef */
import React from 'react';
import Projects from '../../src/pages/Projects'; 

describe('TableProjects component test', () => {
    beforeEach(() => {
        cy.mount(<Projects />);
    });
  
    it('should show display loading spinner initially', () => {
      cy.contains('Error fetching data').should('exist')
    });
  
  
  });
  