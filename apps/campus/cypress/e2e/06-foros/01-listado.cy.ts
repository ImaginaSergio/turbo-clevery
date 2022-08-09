/// <reference types="cypress" />

describe('#### Foros | Probando Listado de temas ####', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
    cy.login();
    cy.navigateTo('foro');
  });

  describe('Puedes cambiar de temas por:', () => {
    it('Tu hoja de ruta', () => {
      cy.wait(4000)
        .get('[data-cy="tu_hoja_de_ruta_desplegable"]')
        .contains('Tu hoja de ruta');
      cy.get('[data-cy="button_tu_hoja_de_ruta"]').click();
      cy.get('[data-cy="curso-10_desplegable"]').first().click();
      cy.get('[data-cy="header_titulo_foro"]').contains('Git');
    });

    it('Otros cursos', () => {
      cy.get('[data-cy="otros_cursos_desplegable"]').contains('Otros cursos');
      cy.get('[data-cy="button_otros_cursos"]').click();
      cy.get('[data-cy="curso-1_desplegable"]').click();
      cy.get('[data-cy="header_titulo_foro"]').contains('ReactJS');
    });

    it('Probando que los temas cambien en consecuencia', () => {
      cy.get('[data-cy="titulo_modulo_foro_111"]').contains('Modulo 1');
    });
  });

  describe('Puedes buscar tema por título', () => {
    it('Buscando "General" solo aparece un tema', () => {
      cy.get('[data-cy="search_input_header"]').type('General');
      cy.get('[data-cy="modulos_container"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-cy="titulo_modulo_foro_1"]').contains('General');
    });

    it('Buscando cadena aleatoria de caracteres no aparece nada', () => {
      cy.get('[data-cy="search_input_header"]').type('feorijfeoirfjoerf');
      cy.get('[data-cy="modulos_container"]')
        .children()
        .should('have.length', 1);

      cy.get('[data-cy="search_input_header"]').clear();
    });
  });

  describe('Pulsando en un tema se te abre la landing del tema', () => {
    it('Buscamos un tema que tenga más de 0 preguntas', () => {
      cy.get('[data-cy="button_tu_hoja_de_ruta"]').click();
      cy.get('[data-cy="curso-3_desplegable"]').first().click();
      cy.get('[data-cy="titulo_modulo_foro_365"]').click();
    });

    it('La ruta cambia correctamente', () =>
      cy.url().should('include', '/foro/365'));
  });
});
