/// <reference types="cypress" />

describe('#### Foros | Probando landing pregunta ####', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
    cy.task('getForoData').then(
      (foroData: {
        id: number;
        titulo: string;
        descripcion: string;
        tipo: string;
      }) => {
        cy.wait(2000)
          .get('[data-cy="titulo_pregunta_page"]')
          .contains(foroData?.titulo);

        cy.wait(2000)
          .get('[data-cy="editor_content_father"]')
          .should(($p) => {
            expect(foroData?.descripcion).to.eq(`<p>${$p.text()}</p>`);
          });

        cy.url().should('include', `/foro/365/${foroData?.id}`, {
          timeout: 10000,
        });
      }
    );
  });

  after(() => {
    cy.logout();
  });

  describe('Landing de pregunta cargada', () => {
    describe.skip('El botón de votar funciona correctamente', () => {
      //TODO: Hacer test
    });

    describe('Podemos añadir una respuesta', () => {
      it('El text area aparece pulsado Responder', () => {
        cy.get('[data-cy="responder_pregunta_button"]').click();
        cy.get('[data-cy="nueva_respuesta_pregunta_container"]').should(
          'be.visible'
        );
      });

      it('Si pulsamos cancelar se cierra', () => {
        cy.get('[data-cy="cancelar_respuesta_nueva"]').click();
        cy.get('[data-cy="nueva_respuesta_pregunta_container"]').should(
          'not.exist'
        );
      });

      it('Si pulsamos en el textArea "Escribe una respuesta" se vuelve a abrir', () => {
        cy.get('[data-cy="text-area-escribe-una-respuesta"]').click();
        cy.get('[data-cy="nueva_respuesta_pregunta_container"]').should(
          'be.visible'
        );
      });

      it('El botón de subir respuesta está desactivado sin respuesta escrita', () =>
        cy.get('[data-cy="subir_respuesta_button"]').should('be.disabled'));

      describe('Comprobamos que la respuesta se sube correctamente', () => {
        const timeKey = new Date().getTime();

        it('Escribir la respuesta y pulsar subir respuesta', () => {
          cy.intercept('POST', '/openAPI/foro/respuestas').as('addRespuesta');

          cy.get('[data-cy="contenido_pregunta_open_editor"]').type(
            `Prueba Respuesta Cypress-${timeKey}`
          );
          cy.get('[data-cy="nueva_respuesta_pregunta_container"]').click();
          cy.get('[data-cy="subir_respuesta_button"]').click();

          cy.wait('@addRespuesta', { timeout: 10000 }).then(({ response }) => {
            expect(response?.statusCode).to.eq(201);
          });
        });
      });
    });
  });
});
