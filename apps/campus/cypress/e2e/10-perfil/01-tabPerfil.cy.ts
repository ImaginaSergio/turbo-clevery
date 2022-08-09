/// <reference types="cypress" />

describe('#### Perfil | Probando Tab Perfil ####', () => {
  const newDate = new Date();
  before(() => {
    cy.login();
    cy.wait(2000).get('[data-cy="header_menu"]').click();
    cy.get('[data-cy="modal_header_perfil"]').click();
    cy.url().should('include', '/perfil#perfil');
  });

  it('Cambiamos todos los inputs, recargamos página', () => {
    cy.intercept('PUT', '/openAPI/users/').as('guardar_cambios');
    cy.get('[data-cy="Nombre de usuario_input"]')
      .clear()
      .type(`CypressUserName${newDate}`);
    cy.get('[data-cy="Nombre_input"]')
      .scrollIntoView()
      .clear()
      .type(`CypressName${newDate}`);
    cy.get('[data-cy="Apellidos_input"]')
      .clear()
      .type(`CypressSurname${newDate}`);
    cy.get('[data-cy="phone_number_input"]')
      .scrollIntoView()
      .clear()
      .type('444444444');
    cy.get('[data-cy="País_select"]').scrollIntoView().click();
    cy.get('[data-cy="Argentina_option"]').scrollIntoView().click();
    cy.get('[data-cy="Localidad_select"]').scrollIntoView().click();
    cy.get('[data-cy="Buenos Aires_option"]').scrollIntoView().click();
    cy.get('[data-cy="guardar_cambios_perfil"]').click();
    cy.wait('@guardar_cambios', { timeout: 10000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.reload();
  });

  it('Comprobamos que se ha cambiado', () => {
    cy.wait(4000)
      .get('[data-cy="Nombre de usuario_input"]')
      .should(($input) => {
        const val = $input.val();
        expect(val).to.include(`CypressUserName${newDate}`);
      });
    cy.get('[data-cy="Nombre_input"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.val();
        expect(val).to.include(`CypressName${newDate}`);
      });
    cy.get('[data-cy="Apellidos_input"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.val();
        expect(val).to.include(`CypressSurname${newDate}`);
      });
    cy.get('[data-cy="phone_number_input"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.val();
        expect(val).to.include('444444444');
      });
    cy.get('[data-cy="País_select"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.text();
        expect(val).to.include('Argentina');
      });
    cy.get('[data-cy="Localidad_select"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.text();
        expect(val).to.include('Buenos Aires');
      });
  });

  it('Volvemos a cambiar pais y localidad a otro y recargamos', () => {
    cy.intercept('PUT', '/openAPI/users/').as('guardar_cambios');
    cy.get('[data-cy="País_select"]').scrollIntoView().click();
    cy.get('[data-cy="Otro_option"]').scrollIntoView().click();
    cy.get('[data-cy="Localidad_select"]').scrollIntoView().click();
    cy.get('[data-cy="Otro_option"]').scrollIntoView().click();
    cy.get('[data-cy="guardar_cambios_perfil"]').click();
    cy.wait('@guardar_cambios', { timeout: 10000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.reload();
  });

  it('Comprobamos que se ha cambiado', () => {
    cy.wait(4000)
      .get('[data-cy="País_select"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.text();
        expect(val).to.include('Otro');
      });
    cy.get('[data-cy="Localidad_select"]')
      .scrollIntoView()
      .should(($input) => {
        const val = $input.text();
        expect(val).to.include('Otro');
      });
  });
});
