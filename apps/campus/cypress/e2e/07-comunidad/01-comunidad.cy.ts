/// <reference types="cypress" />

describe('#### Comunidad | Probando Crear un proyecto ####', () => {
  before(() => {
    cy.login();
    cy.navigateTo('comunidad');
  });

  describe('La página carga correctamente', () => {
    it('La ruta se carga correctamente', () => {
      cy.url().should('include', '/comunidad', { timeout: 10000 });
    });
    it('Se renderiza bien el título de la página', () => {
      cy.get('[data-cy="Comunidad_titulo_header"]').contains('Comunidad');
    });

    it('La ruta crear un proyecto carga correctamente', () => {
      cy.get('[data-cy="crear_proyecto_button"]').click();
      cy.url().should('include', '/comunidad/new', { timeout: 10000 });
      cy.reload();
    });

    it('Rellenando formulario', () => {
      cy.get('[data-cy="titulo_input_crear_proyecto"]').type(
        'Demo prueba cypress'
      );
      cy.get('[data-cy="enlace_github_crear_proyecto"]').type(
        'https://github.com/gotrijgoitrjgro/foerijfoierje'
      );
      cy.get('[data-cy="enlace_github_crear_proyecto"]').type(
        'https://github.com/gotrijgoitrjgro/foerijfoierje'
      );
      cy.get('[data-cy="enlace_demo_crear_proyecto"]').type(
        'https://agorigjrgtijorigr.com'
      );
      cy.get('[data-cy="contenido_pregunta_open_editor"]').type(
        'Prueba proyecto cypress'
      );
    });

    it('El proyecto se crea correctamente', () => {
      cy.intercept('POST', '/openAPI/proyectos').as('addProyecto');

      cy.get('[data-cy="button_crear_proyecto"]').scrollIntoView().click();

      cy.wait('@addProyecto', { timeout: 10000 }).then(({ response }) => {
        expect(response?.statusCode).to.eq(201);
        expect(response?.body?.data?.titulo).to.eq('Demo prueba cypress');
      });
    });

    describe('Probando renderizado del proyecto', () => {
      it('Vuelve a home', () =>
        cy.url().should('include', '/comunidad', { timeout: 10000 }));

      it('Aparece el proyecto', () => {
        cy.get('[data-cy="Demo prueba cypress_titulo_proyecto"]').contains(
          'Demo prueba cypress'
        );
      });
    });
  });
});
