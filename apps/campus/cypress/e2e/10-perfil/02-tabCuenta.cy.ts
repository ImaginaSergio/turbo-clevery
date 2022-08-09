/// <reference types="cypress" />

describe('#### Perfil | Probando Tab Cuenta ####', () => {
  before(() => {
    cy.get('[data-cy="tab_Cuenta"]').click();
    cy.url().should('include', '/perfil#cuenta');
  });

  it('Cambiamos LinkedIn, recargamos página', () => {
    cy.intercept('PUT', '/openAPI/users/').as('guardar_cambios');
    cy.get('[data-cy="LinkedIn_input"]').type(
      'https://www.linkedin.com/in/cypress-prueba'
    );
    cy.get('[data-cy="tab_Cuenta"]').click();
    cy.get('[data-cy="guardar_cambios_cuenta"]').scrollIntoView().click();
    cy.wait('@guardar_cambios', { timeout: 10000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.reload();
  });

  it('Comprobamos que se ha cambiado', () => {
    cy.wait(4000)
      .get('[data-cy="LinkedIn_input"]')
      .should(($input) => {
        const val = $input.val();
        expect(val).to.include('https://www.linkedin.com/in/cypress-prueba');
      });
  });
});
