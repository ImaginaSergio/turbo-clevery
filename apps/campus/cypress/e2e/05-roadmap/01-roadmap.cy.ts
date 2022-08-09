/// <reference types="cypress" />

describe('#### Probando el Roadmap ####', () => {
  before(() => {
    cy.login();

    cy.navigateTo('roadmap');
  });

  after(() => {
    cy.logout();
  });

  describe('Bloque inicialmente visible', () => {
    it('Bloque inicialmente visible', () =>
      cy.get('[data-cy="rutaInfo"]').should('be.visible'));
    it('Se lee Fullstack', () =>
      cy
        .get('[data-cy="rutaTitulo"]')
        .contains('Fullstack Developer - .Net y Angular'));
  });

  describe('Listado cursos cargado', () => {
    it('Bloque inicialmente visible', () =>
      cy.get('[data-cy="rutaLista"]').should('be.visible'));

    it('Cargados todos los cursos', () => {
      cy.get('[data-cy="Introducción a la programación_curso_item"]').should(
        'be.visible'
      );
      cy.get('[data-cy="Git_curso_item"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="C#_curso_item"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="SQL_curso_item"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="Angular Básico_curso_item"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="Angular Avanzado_curso_item"]')
        .scrollIntoView()
        .should('be.visible');
    });
  });
});
