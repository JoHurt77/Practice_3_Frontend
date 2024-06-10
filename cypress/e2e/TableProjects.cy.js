/* eslint-disable no-undef */
describe('Projects Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/projects')
  });

  it('Should visit the web', () => {
    cy.get('ul').should('be.visible');
    // cy.get('.tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Project');
    cy.get('[data-testid="headcol-0"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Project');
    // cy.get('.MuiTableHead-root > .MuiTableRow-root > [data-colindex="1"] > div').should('have.text', 'Actions');
    cy.get('.tss-qbo1l6-MUIDataTableToolbar-actions').should('have.class', 'tss-qbo1l6-MUIDataTableToolbar-actions');
    cy.get('[data-testid="SearchIcon"]').should('have.class', 'MuiSvgIcon-root');
    cy.get('[data-testid="CloudDownloadIcon"] > path').should('have.attr', 'd', 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M17 13l-5 5-5-5h3V9h4v4z');
    cy.get('[data-testid="FilterListIcon"]').should('be.visible');
    cy.get('[title="Add New Field"]').should('have.attr', 'title', 'Add New Field');
    cy.get('.tss-djbknv-MUIDataTablePagination-navContainer').should('have.class', 'tss-djbknv-MUIDataTablePagination-navContainer');
  })


  it('Should CLOSE the add new field modal', function() {
    cy.get('.tss-1qtl85h-MUIDataTableBodyCell-root > .MuiTypography-root').should('have.text', 'Sorry, no matching records found');
    cy.get('.svg-inline--fa').click();
    cy.get('#swal2-html-container').should('be.visible');
    cy.get('#code').clear('P');
    cy.get('#code').type('Prueba');
    cy.get('.swal2-cancel').should('be.visible');
    cy.get('.swal2-cancel').click();
    cy.get('.tss-1qtl85h-MUIDataTableBodyCell-root > .MuiTypography-root').should('have.text', 'Sorry, no matching records found');
  });


  it('Should Show the warnign "Please enter all fields" when trying to add a blank space in the add new field modal', function() {
    cy.get('.tss-1qtl85h-MUIDataTableBodyCell-root > .MuiTypography-root').should('have.text', 'Sorry, no matching records found');
    cy.get('[title="Add New Field"]').click();
    cy.get('#code').click();
    cy.get('#code').should('have.attr', 'placeholder', 'Project');
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-validation-message').should('have.text', 'Please enter all fields');
  });

  /* ==== Passed ==== */
  it('Should add a new field - Happy_Path', function() {
 
   cy.get('.tss-1qtl85h-MUIDataTableBodyCell-root > .MuiTypography-root').should('have.text', 'Sorry, no matching records found');
    cy.get('.svg-inline--fa > path').should('be.visible');
    cy.get('.svg-inline--fa').click();
    cy.get('#swal2-html-container').should('be.visible');
    cy.get('#swal2-title').should('have.text', 'Add New Project');
    cy.get('#swal2-html-container').click();
    cy.get('#code').clear();
    cy.get('#code').type('Prueba');
    cy.get('.swal2-confirm').should('have.text', 'Add');
    cy.get('.swal2-cancel').should('have.text', 'Cancel');
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-title').should('have.text', 'Success!');
    cy.get('.swal2-confirm').click();
    cy.get('[data-testid="MuiDataTableBodyCell-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Prueba');
  });


  it('Should Update the field "Prueba" to "PruebaUpdate"', function() {
    cy.get('[data-testid="MuiDataTableBodyCell-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Prueba');
    cy.get(':nth-child(1) > .svg-inline--fa > path').click();
    cy.get('#swal2-html-container').should('be.visible');
    cy.get('#swal2-title').should('have.text', 'Update Practice');
    cy.get('#newCode').should('have.value', 'Prueba');
    cy.get('#newCode').clear('P');
    cy.get('#newCode').type('PruebaUpdate');
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-title').should('have.text', 'Success!');
    cy.get('.swal2-confirm').click();
    cy.get('[data-testid="MuiDataTableBodyCell-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'PruebaUpdate');
    
  });


  it('Should Delete the field "PruebaUpdate"', function() {
    cy.get('[data-testid="MuiDataTableBodyCell-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'PruebaUpdate');
    cy.get(':nth-child(2) > .svg-inline--fa > path').click();
    cy.get('.swal2-popup').should('be.visible');
    cy.get('#swal2-title').should('have.text', 'Are you sure you want to delete PruebaUpdate?');
    cy.get('.swal2-confirm').should('have.text', 'Yes, delete');
    cy.get('.swal2-cancel').should('have.text', 'Cancel');
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-html-container').should('have.text', 'The project has been successfully deleted.');
    cy.get('.swal2-confirm').click();
    cy.get('.MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-root').should('have.text', 'Sorry, no matching records found');
    
  });


  // it('Should change the page', function() {
  //   cy.get('.tss-djbknv-MUIDataTablePagination-navContainer').should('have.text', 'Rows per page:101-10 of 11');
  //   cy.get('[data-testid="MuiDataTableBodyCell-0-9"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', '8');
  //   cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
  //-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', '9');
  // });

  
})