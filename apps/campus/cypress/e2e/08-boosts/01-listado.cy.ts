/// <reference types="cypress" />

describe('#### Boosts | Probando Listado ####', () => {
  before(() => {
    cy.login();
    cy.navigateTo('boosts');
  });

  describe('La página carga correctamente', () => {
    it('La ruta se carga correctamente', () => {
      cy.url().should('include', '/boosts');
    });

    it('Se renderiza bien el título de la página', () => {
      cy.get('[data-cy="Boosts_titulo_header"]').contains('Boosts');
    });

    it('Bloque de boosts visible', () => {
      cy.get('[data-cy="boosts_list"]').should('be.visible');
    });

    it('Aparece un boost, se puede clickar y lleva hacia el', () => {
      cy.get('[data-cy="Fullstack Developer_boost"]').first().should('be.visible').click();
      cy.url().should('include', '/boosts/1');
    });
  });
});
