/// <reference types="cypress" />

describe('#### Certificaciones | Listado ####', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
    cy.login();

    cy.navigateTo('certificaciones');
  });

  describe('Listado de certificaciones cargado', () => {
    it('Bloque es visible', () =>
      cy
        .get('[data-cy="certificaciones_listado_bloque-inicial"]')
        .scrollIntoView()
        .should('be.visible'));

    it('Navegación a Landing correcta', () => {
      cy.get('[data-cy="certificacion_Introducción a la programación"]')
        .scrollIntoView()
        .click();
      cy.url().should('include', '/certificaciones/16');
    });
  });
});
