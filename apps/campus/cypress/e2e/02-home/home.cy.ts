/// <reference types="cypress" />

describe('#### 🏠 Probando Home ####', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  describe('Bloque inicial cargado', () => {
    it('Bloque es visible', () =>
      cy
        .get('[data-cy="home_curso-inicial"]')
        .scrollIntoView()
        .should('be.visible'));

    it('Carga correctamente la información de la lección', () => {
      cy.get('[data-cy="home_curso_activo_titulo"]').contains(
        'Introducción a la programación'
      );

      cy.get('[data-cy="home_curso_activo_descripcion"]').contains(
        'Programación. Variables y constantes'
      );

      cy.get('[data-cy="home_curso_activo_minutos"]').contains('52min');
    });

    it('Carga la lección correctamente', () => {
      cy.get('[data-cy="home_curso_activo_button"]').click();

      cy.url().should(
        'include',
        '/cursos/3/leccion/12' || '/cursos/3/leccion/1996'
      );
    });
  });

  describe('Bloque roadmap cargado', () => {
    before(() => {
      cy.visit('/');
    });

    it('Bloque es visible haciendo scroll', () => {
      cy.get('#roadmapWidget').scrollIntoView().should('be.visible');
    });

    it('Carga correctamente la ruta', () => {
      cy.get('[data-cy="roadmap_titulo_ruta"]').contains(
        'Fullstack Developer - .Net y Angular'
      );
    });

    it('El primer curso -> Introducción a la programación', () => {
      cy.get('[data-cy="roadmap_item_titulo_3"]').contains(
        'Introducción a la programación'
      );
    });
  });

  describe('Bloque cursos recomendados cargado', () => {
    it('Bloque es visible haciendo scroll', () =>
      cy
        .get('[data-cy="home_cursos_recomendados"]')
        .scrollIntoView()
        .should('be.visible'));

    it('Carga correctamente los cuatro cursos recomendados', () => {
      cy.get('[data-cy="curso_recomendado_1"]').should('be.visible');
      cy.get('[data-cy="curso_recomendado_3"]').should('be.visible');
      cy.get('[data-cy="curso_recomendado_4"]').should('be.visible');
      cy.get('[data-cy="curso_recomendado_5"]').should('be.visible');
    });
  });

  describe('Bloque fase OpenBootcamp cargado', () => {
    it('Bloque es visible haciendo scroll', () =>
      cy
        .get('[data-cy="home_como_funciona_ob"]')
        .scrollIntoView()
        .should('be.visible'));

    it('Carga correctamente la fase de incubación', () => {
      cy.get('[data-cy="como_funciona_card_Incubacion"]').should('be.visible');
    });
  });
});
