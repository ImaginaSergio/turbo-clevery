/// <reference types="cypress" />

describe('#### Ajustes | Probando Tab Datos Empleo ####', () => {
  before(() => {
    cy.get('[data-cy="tab_Ajustes"]').click({ force: true });
    cy.url().should('include', '/perfil#ajustes');
  });

  it('Cambiamos los datos, recargamos página', () => {
    cy.intercept('PUT', '/openAPI/users/').as('guardar_cambios');
    cy.get('[data-cy="roadmap_button"]').click();
    cy.get('[data-cy="Back-End Node_ruta_item"]').click();
    cy.get('[data-cy="seguir_hoja_ruta"]').click();
  });
});
