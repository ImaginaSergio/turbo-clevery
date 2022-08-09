/// <reference types="cypress" />

describe('#### Perfil | Probando Tab Datos Empleo ####', () => {
  before(() => {
    cy.get('[data-cy="tab_Datos Empleo"]').click({ force: true });
    cy.url().should('include', '/perfil#empleo');
  });

  it('Cambiamos los datos, recargamos página', () => {
    cy.intercept('PUT', '/openAPI/users/').as('guardar_cambios');
    cy.get(
      '[data-cy="¿Estás trabajando como desarrollador actualmente?_No"]'
    ).click();
    cy.get('[data-cy="¿Tienes experiencia en alguna tecnología?_Sí"]').click();
    cy.get('[data-cy="¿Qué tipo de trabajo prefieres?_select"]').click();
    cy.get('[data-cy="Remoto_option"]').scrollIntoView().click();
    cy.get('[data-cy="¿Qué tipo de trabajo prefieres?_select"]').click();
    cy.get('[data-cy="Presencial_option"]').scrollIntoView().click();
    cy.get('[data-cy="¿Qué tipo de trabajo prefieres?_select"]').click();
    cy.get('[data-cy="Híbrido_option"]').scrollIntoView().click();
    cy.get('[data-cy="¿Qué tipo de trabajo prefieres?_select"]').click();
    cy.get('[data-cy="Indiferente_option"]').scrollIntoView().click();
    cy.get('[data-cy="open_habilidades"]').click();
    cy.get('[data-cy="ReactJS_option_habilidad"]').scrollIntoView().click();
    cy.get('[data-cy="open_habilidades"]').click();
    cy.get('[data-cy="Docker_option_habilidad"]').scrollIntoView().click();
    cy.get('[data-cy="salario_min"]').scrollIntoView().type('18000');
    cy.get('[data-cy="salario_max"]').scrollIntoView().type('24000');
    cy.get('[data-cy="guardar_cambios"]').click();
    cy.wait('@guardar_cambios', { timeout: 10000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.reload();
  });
});
