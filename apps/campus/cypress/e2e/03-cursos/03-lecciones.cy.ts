/// <reference types="cypress" />

describe('#### Cursos | Lecciones ####', () => {
  it('Estamos en la página correspondiente', () => {
    cy.url().should('include', '/cursos/3/leccion/1532', { timeout: 10000 });
  });

  it('Probando título, tipo y tiempo', () => {
    cy.get('[data-cy="cursos_leccion_titulo"]').contains(
      'Instalación Java e Intellij'
    );
  });

  describe('Probando notas', () => {
    it('El botón aparece y cambia cuando se pulsa', () => {
      cy.get('[id="menu-button-7"]').click();
      cy.get('[id="menu-list-7-menuitem-2"]').click();
      cy.get('[data-cy="button_close_modaldnd"]').first().click();
    });

    it('Se puede añadir una nota', () => {
      cy.get('[id="menu-button-7"]').click();
      cy.get('[id="menu-list-7-menuitem-2"]').click();
      cy.get('[data-cy="crear_nota_button"]').click();
      cy.get('[data-cy="contenido_pregunta_open_editor"]').type(
        'Nota Prueba Cypress'
      );
      cy.get('[data-cy="guardar_nota_button"]').click();
    });

    it('La nota aparece y se edita', () => {
      cy.get('[data-cy="nota_titulo_0"]').contains('Nueva nota');
      cy.get('[data-cy="nota_contenido_0"]').contains('Nota Prueba Cypress');
      cy.get('[data-cy="nota_container"]').click();
      cy.get('[data-cy="contenido_pregunta_open_editor"]').type(
        'Nota Prueba Cypress Modificada'
      );
      cy.get('[data-cy="guardar_nota_button"]').click();
      cy.get('[data-cy="nota_contenido_0"]').contains(
        'Nota Prueba Cypress Modificada'
      );
      cy.get('[data-cy="button_close_modaldnd"]').first().click();
    });

    it('Probando Lección Vista', () => {
      cy.intercept('POST', '/openAPI/progresos').as('addVisto');

      cy.get('[data-cy="play_video"]').click();

      cy.wait('@addVisto', { timeout: 10000 }).then(({ response }) => {
        expect(response?.statusCode).to.eq(201);
      });
    });

    it('Probando que el video avanza', () => {
      cy.get('[data-cy="time_rest"]').should(($timeStart) => {
        let timeStart = $timeStart?.text();
        cy.wait(2000)
          .get('[data-cy="time_rest"]')
          .should(($timeEnd) => {
            let timeEnd = $timeEnd?.text();
            expect(timeStart === timeEnd).to.eq(false);
          });
      });
    });

    it('Probando Lección completada', () => {
      cy.intercept('POST', '/openAPI/progresos').as('addCompletado');

      cy.get('[data-cy="on_next_leccion_responsive"]').click();
      cy.wait(1000).get('[data-cy="on_next_leccion_responsive"]').click();

      cy.wait('@addCompletado', { timeout: 10000 }).then(({ response }) => {
        expect(response?.statusCode).to.eq(201);
      });
    });

    it('Probando que avanza a la siguiente lección', () => {
      cy.url().should('include', '/cursos/3/leccion/1996');
    });
  });
});
