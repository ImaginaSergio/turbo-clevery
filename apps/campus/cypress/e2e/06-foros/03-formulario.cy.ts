/// <reference types="cypress" />

describe('#### Foros | Probando nueva pregunta ####', () => {
  it('Estamos en la página correspondiente', () => {
    cy.url().should('include', '/foro/365/new', { timeout: 10000 });
  });

  it('Botón subir pregunta desactivado', () =>
    cy.get('[data-cy="subir_pregunta_button"]').should('be.disabled'));

  describe('Bloqueo input tema', () => {
    it('Bloqueo correcto', () =>
      cy.get('[data-cy="select_tema"]').should('be.disabled'));
  });

  describe('La pregunta se crea correctamente al terminar el formulario', () => {
    const timeKey = new Date().getTime();

    it('La pregunta se crea correctamente', () => {
      cy.intercept('POST', '/openAPI/foro/preguntas').as('addPregunta');

      cy.get('[data-cy="titulo_pregunta_input"]').type(`Titulo-${timeKey}`);

      cy.get('[data-cy="contenido_pregunta_open_editor"]').type(
        `Descripción-${timeKey}`
      );

      cy.get('[data-cy="categoria_pregunta_select"]').select('anuncio');

      cy.get('[data-cy="subir_pregunta_button"]').click();

      cy.wait('@addPregunta', { timeout: 10000 }).then(({ response }) => {
        expect(response?.statusCode).to.eq(201);

        expect(response?.body?.data?.titulo).to.eq(`Titulo-${timeKey}`);
        expect(response?.body?.data?.contenido).to.eq(
          `<p>Descripción-${timeKey}</p>`
        );
        expect(response?.body?.data?.tipo).to.eq('anuncio');

        cy.task('setForoData', {
          id: response?.body?.data?.id,
          titulo: response?.body?.data?.titulo,
          descripcion: response?.body?.data?.contenido,
          tipo: response?.body?.data?.tipo,
        });
      });
    });

    it('La página carga el título de la pregunta correctamente', () =>
      cy
        .wait(2000)
        .get('[data-cy="titulo_pregunta_page"]')
        .contains(`Titulo-${timeKey}`));
  });
});
