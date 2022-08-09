describe('#### Foros | Probando landing del tema ####', () => {
  describe('Título y descripción cargados correctamente', () => {
    it('Estamos en la página correspondiente', () => {
      cy.url().should('include', '/foro/365', { timeout: 10000 });
    });

    it('Titulo cargado correctamente', () =>
      cy.get('[data-cy="365_tema_titulo"]').contains('Errores'));

    it('Descripción cargada correctamente', () =>
      cy
        .get('[data-cy="365_tema_descripcion"]')
        .contains('Errores del curso de Introducción a la programación'));
  });

  describe('Landing de tema cargada', () => {
    describe('Comprobamos que cargan las preguntas', () => {
      it('X preguntas = Nº de preguntas en listado', () => {
        cy.get('[data-cy="numero_preguntas_header_tema"]').then(($title) => {
          let textLength = $title.text()?.replace(' preguntas', '');

          cy.get('[data-cy="pregunta_item"]').should(
            'have.length',
            +(textLength || -1)
          );
        });

        // console.log(
        //   cy
        //     .wait(1000)
        //     .get('[data-cy="pregunta_item"]')
        //     .each(($el, index, $list) => {
        //       return $list.length;
        //     })
        //  );
      });
    });
  });

  describe('Comprobamos los botones "Tendencia" "Más recientes"', () => {
    it.skip('Comprobamos las peticiones back', () => {
      // TODO: Implementarlo
    });
  });

  describe('El botón de añadir pregunta te lleva al formulario', () => {
    it('Click en botón', () => {
      cy.get('[data-cy="añadir_pregunta_button"]').click();

      cy.url().should('include', '/foro/365/new');
    });
  });
});
