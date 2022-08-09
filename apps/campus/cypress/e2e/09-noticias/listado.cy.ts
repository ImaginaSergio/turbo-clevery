/// <reference types="cypress" />

describe('#### Noticias | Probando Listado ####', () => {
  before(() => {
    cy.login();
    cy.navigateTo('noticias');
  });

  describe('La página carga correctamente', () => {
    it('La ruta se carga correctamente', () => {
      cy.url().should('include', '/noticias');
    });
    it('Hay 1 o más noticias destacadas', () => {
      cy.get('[data-cy="novedades_destacadas"]')
        .scrollIntoView()
        .should(($item) => {
          expect($item.length >= 1).to.equal(true);
        });
    });

    it('Hay 1 o más noticias anteriores', () => {
      cy.get('[data-cy="novedades_anteriores"]')
        .scrollIntoView()
        .should(($item) => {
          expect($item.length >= 1).to.equal(true);
        });
    });

    it('El bloque preview de la derecha ha cargado la primera noticia destacada', () => {
      cy.get('[data-cy="titulo_noticia_destacada"]')
        .first()
        .then(($item) => {
          let titleCard = $item.text();
          cy.get('[data-cy="preview_titulo"]').contains(titleCard);
        });
    });

    it('Hacemos click en la primera noticia anterior y la preview cambia', () => {
      cy.get('[data-cy="titulo_noticia_anterior"]').first().click();
      cy.get('[data-cy="titulo_noticia_anterior"]')
        .first()
        .then(($item) => {
          let titleCard = $item.text();
          cy.get('[data-cy="preview_titulo"]').contains(titleCard);
        });
    });

    it('El botón de todos los cursos lleva a la landing', () => {
      cy.get('[data-cy="cursos_button_modal"]').click();
      cy.url().should('include', '/cursos');
    });
  });
});
