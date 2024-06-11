/* eslint-disable no-undef */

describe('Assignments Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/assignments')
  });

  it('Should check the NavBar', () => {
    cy.get('ul').should('be.visible');
    
    cy.get(':nth-child(1) > a').should('have.text', 'Assignments');
    cy.get(':nth-child(1) > a').should('have.attr', 'href', '/assignments');
    cy.get(':nth-child(2) > a').should('have.text', 'Employees');
    cy.get(':nth-child(2) > a').should('have.attr', 'href', '/employees');
    cy.get(':nth-child(3) > a').should('have.text', 'Practices');
    cy.get(':nth-child(3) > a').should('have.attr', 'href', '/practices');
    cy.get(':nth-child(4) > a').should('have.text', 'Projects');
    cy.get(':nth-child(4) > a').should('have.attr', 'href', '/projects');
    cy.get('.tss-1t6h0i4-MUIDataTableToolbar-titleRoot > .MuiTypography-root').should('have.text', 'Assignments Data');
    
  })

  it('Should Verify the Toolbar', () => {
    
    cy.get('.tss-qbo1l6-MUIDataTableToolbar-actions').should('have.class', 'tss-qbo1l6-MUIDataTableToolbar-actions');
    cy.get('[data-testid="SearchIcon"]').should('have.attr', 'data-testid', 'SearchIcon');
    cy.get('[data-testid="CloudDownloadIcon"]').should('have.attr', 'data-testid', 'CloudDownloadIcon');
    cy.get('[data-testid="ViewColumnIcon"]').should('have.attr', 'data-testid', 'ViewColumnIcon');
    cy.get('[data-testid="FilterListIcon"]').should('have.attr', 'data-testid', 'FilterListIcon');
    cy.get('.svg-inline--fa').should('have.attr', 'data-icon', 'plus');
    
  })


  it('Should check all the columns headers', function() {
    
    cy.get('[data-testid="headcol-0"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Emp Id');
    cy.get('[data-testid="headcol-1"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Emp Name');
    cy.get('[data-testid="headcol-2"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Emp Practice');
    cy.get('[data-testid="headcol-3"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Old/Current Project Code');
    cy.get('[data-testid="headcol-4"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'New Project Code');
    cy.get('[data-testid="headcol-5"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'WBS PRACTICE');
    cy.get('[data-testid="headcol-6"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Allocation %');
    cy.get('[data-testid="headcol-7"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Role');
    cy.get('[data-testid="headcol-8"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Supervisor Name');
    cy.get('[data-testid="headcol-9"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Supervisor Code');
    cy.get('[data-testid="headcol-10"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Allocation Start Date/Joining Date');
    cy.get('[data-testid="headcol-11"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Allocation End Date');
    cy.get('[data-testid="headcol-12"] > :nth-child(1) > .tss-1akey0g-MUIDataTableHeadCell-data').should('have.text', 'Remark');
    cy.get('[data-colindex="13"] > div').should('have.text', 'Actions');
    
  });


  it('Should check the modal to add a new field', function() {
    
    cy.get('.svg-inline--fa').click();
    cy.get('.MuiBox-root > .MuiTypography-root').should('have.text', 'Add New Allocation');
    cy.get('.MuiBox-root').should('be.visible');
    cy.get('#\\:r19\\:').click();
    cy.get('#\\:r19\\:').should('have.attr', 'name', 'employeeCode');
    cy.get('#\\:r1b\\:').should('have.attr', 'name', 'supervisorCode');
    cy.get('#\\:r1d\\:').should('have.attr', 'name', 'practiceName');
    cy.get('#\\:r1f\\:').should('have.attr', 'name', 'project.oldCode');
    cy.get('#\\:r1h\\:').should('have.attr', 'name', 'project.newCode');
    cy.get('#\\:r1j\\:').should('have.attr', 'name', 'assignmentInfo.percentage');
    cy.get('#\\:r1l\\:').should('have.attr', 'name', 'assignmentInfo.startDate');
    cy.get('#\\:r1n\\:').should('have.attr', 'name', 'assignmentInfo.endDate');
    cy.get('#\\:r1p\\:').should('have.attr', 'name', 'assignmentInfo.remark');
    cy.get('.MuiButton-contained').should('have.attr', 'tabindex', '0');
    cy.get('.MuiButton-contained').should('have.text', 'Add');
    cy.get('.MuiButton-outlined').should('have.text', 'Cancel');
    
  });


  it('Should add a new field', function() {

    cy.get('.tss-1qtl85h-MUIDataTableBodyCell-root > .MuiTypography-root').should('have.text', 'Sorry, no matching records found');
    cy.get(':nth-child(4) > a').click();
    cy.get('.svg-inline--fa').click();
    cy.get('#code').clear('P');
    cy.get('#code').type('Prueba');
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
    cy.get(':nth-child(3) > a').click();
    cy.get('.svg-inline--fa').click();
    cy.get('#code').clear('P');
    cy.get('#code').type('Prueba');
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
    cy.get(':nth-child(2) > a').click();
    cy.get('[title="Add New Field"]').click();
    cy.get('#code').clear('1');
    cy.get('#code').type('1');
    cy.get('#name').clear('P');
    cy.get('#name').type('Juan');
    cy.get('#role').clear('D');
    cy.get('#role').type('Dev');
    cy.get('#practice').clear('P');
    cy.get('#practice').type('Prueba');
    cy.get('#swal2-html-container').click();
    cy.get('#role').clear();
    cy.get('#role').type('Dev');
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
    cy.get(':nth-child(1) > a').click();
    cy.get('.svg-inline--fa').click();
    cy.get('#\\:r61\\:').clear('1');
    cy.get('#\\:r61\\:').type('1');
    cy.get('#\\:r63\\:').clear('1');
    cy.get('#\\:r63\\:').type('1');
    cy.get('#\\:r65\\:').clear('P');
    cy.get('#\\:r65\\:').type('Prueba');
    cy.get('#\\:r67\\:').clear();
    cy.get('#\\:r67\\:').type('Prueba');
    cy.get('#\\:r69\\:').clear();
    cy.get('#\\:r69\\:').type('Prueba');
    cy.get('#\\:r6b\\:').clear();
    cy.get('#\\:r6b\\:').type('100%');
    cy.get('#\\:r6d\\:').click();
    cy.get('#\\:r6f\\:').click();
    cy.get('#\\:r6h\\:').clear('P');
    // cy.get('#\\:r6h\\:').type('Prueba');
    // cy.get('.MuiButton-contained').click();
    // cy.get('#swal2-html-container').should('have.text', 'The assignment has been successfully added.');
    // cy.get('#swal2-title').should('have.text', 'Success!');
    // cy.get('.swal2-popup').should('have.class', 'swal2-icon-success');
    // cy.get('.swal2-confirm').click();
    // cy.get('[data-testid="MuiDataTableBodyCell-1-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Juan');
    // cy.get('[data-testid="MuiDataTableBodyCell-2-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Prueba');
    // cy.get('[data-testid="MuiDataTableBodyCell-4-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Prueba');
    // cy.get('[data-testid="MuiDataTableBodyCell-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', '1');
    // cy.get('[data-testid="MuiDataTableBodyCell-9-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', '1');


    cy.get('#\\:r6d\\:').clear('0002-03-11');
    cy.get('#\\:r6d\\:').type('2204-03-11');
    cy.get('#\\:r6f\\:').clear('0002-01-01');
    cy.get('#\\:r6f\\:').type('2024-01-01');
    cy.get('#\\:r6h\\:').clear('P');
    cy.get('#\\:r6h\\:').type('Prueba');
    cy.get('.MuiButton-contained').click();
    cy.get('#swal2-html-container').should('have.text', 'The assignment has been successfully added.');
    cy.get('#swal2-title').should('have.text', 'Success!');
    cy.get('.swal2-popup').should('have.class', 'swal2-icon-success');
    cy.get('.swal2-confirm').click();
    cy.get('[data-testid="MuiDataTableBodyCell-1-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Juan');
    cy.get('[data-testid="MuiDataTableBodyCell-2-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Prueba');
    cy.get('[data-testid="MuiDataTableBodyCell-4-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Prueba');
    cy.get('[data-testid="MuiDataTableBodyCell-0-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', '1');
    cy.get('[data-testid="MuiDataTableBodyCell-9-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', '1');
  });


  // it('Should DELETE a field', function() {

  //   cy.get('[data-testid="MuiDataTableBodyCell-1-0"] > .tss-1qtl85h-MUIDataTableBodyCell-root').should('have.text', 'Juan');
  //   cy.get(':nth-child(2) > .svg-inline--fa > path').click();
  //   cy.get('#swal2-title').should('have.text', 'Are you sure you want to delete the assignment for Juan?');
  //   cy.get('.swal2-popup').should('have.class', 'swal2-popup');
  //   cy.get('.swal2-confirm').should('have.text', 'Yes, delete');
  //   cy.get('.swal2-cancel').should('have.text', 'Cancel');
  //   cy.get('.swal2-confirm').click();
  //   cy.get('.swal2-confirm').click();
  //   cy.get(':nth-child(2) > a').click();
  //   cy.get(':nth-child(1) > a').click();
  //   cy.get(':nth-child(2) > a').click();
  //   cy.get(':nth-child(2) > .svg-inline--fa > path').click();
  //   cy.get('.swal2-confirm').click();
  //   cy.get('.swal2-confirm').click();

  // });



  // it('Should FAIL to DELETE a field', function() {
  //   cy.get(':nth-child(2) > .svg-inline--fa > path').click();
  //   cy.get('#swal2-title').should('have.text', 'Are you sure you want to delete the assignment for Juan?');
  //   cy.get('.swal2-confirm').click();
  //   cy.get('#swal2-html-container').should('have.text', 'Error when trying to delete the assignment.');
  //   cy.get('#swal2-title').should('have.text', 'Error');
  //   cy.get('.swal2-confirm').click();
  //   cy.get(':nth-child(2) > a').click();
  //   cy.get(':nth-child(2) > .svg-inline--fa > path').click();
  //   cy.get('#swal2-title').should('have.text', 'Are you sure you want to delete Juan?');
  //   cy.get('.swal2-confirm').click();
  //   cy.get('#swal2-html-container').should('have.text', 'Cannot delete employee due to a conflict.');
  //   cy.get('.swal2-confirm').click();
  //   cy.get(':nth-child(3) > a').click();
  //   cy.get(':nth-child(2) > .svg-inline--fa > path').click();
  //   cy.get('#swal2-title').should('have.text', 'Are you sure you want to delete Prueba?');
  //   cy.get('.swal2-confirm').click();
  //   cy.get('#swal2-html-container').should('have.text', 'Cannot delete practice due to a conflict.');
  //   cy.get('.swal2-confirm').click();
  //   cy.get(':nth-child(4) > a').click();
  //   cy.get(':nth-child(2) > .svg-inline--fa > path').click();
  //   cy.get('#swal2-title').should('have.text', 'Are you sure you want to delete Prueba?');
  //   cy.get('.swal2-confirm').click();
  //   cy.get('#swal2-html-container').should('have.text', 'Cannot delete project due to a conflict.');
  //   cy.get('.swal2-confirm').click();
  // });
})