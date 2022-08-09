describe('#### Cursos | Landing ####', () => {
  it('Estamos en la página correspondiente', () => {
    cy.url().should('include', '/cursos/3', { timeout: 10000 });
  });

  it('Título cargado correctamente', () => {
    cy.get('[data-cy="landing_titulo"]').scrollIntoView().should('be.visible');
  });

  it('Botón de favoritos funcionando', () => {
    cy.intercept('POST', '/openAPI/favoritos').as('addFav');
    cy.intercept('DELETE', '/openAPI/favoritos/*').as('delFav');

    cy.get('[data-cy="sidebar_cursos"]').click();
    cy.get('[data-cy="curso_Introducción a la programación"]').click();

    cy.get('[data-cy="cursos_landing_favorito"]')
      .scrollIntoView()
      .click()
      .then(() => {
        cy.wait('@addFav', { requestTimeout: 10000 }).then(({ response }) => {
          expect(response.statusCode).to.eq(201);
        });
        cy.get('[data-cy="cursos_landing_favorito"]')
          .click()
          .then(() => {
            cy.wait('@delFav', { requestTimeout: 10000 }).then(
              ({ response }) => {
                expect(response.statusCode).to.eq(200);
              }
            );
          });
      });
  });

  it('Botones de Continuar lección funcionando', () => {
    cy.get('[data-cy="cursos_landing_continuar-portada"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="cursos_leccion_titulo"]').should(
      'have.text',
      'Vídeo sesión 1' || 'Historia de la programación'
    );

    cy.get('[data-cy="exit_leccion_button"]').scrollIntoView().click();

    cy.get('[data-cy="cursos_landing_continuar-portada"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.get('[data-cy="cursos_leccion_titulo"]').should(
      'have.text',
      'Vídeo sesión 1' || 'Historia de la programación'
    );

    cy.get('[data-cy="exit_leccion_button"]').scrollIntoView().click();
  });

  it('No se puede navegar a lecciones bloqueadas', () => {
    cy.get('[data-cy="cursos_landing_modulo-Funciones"]')
      .scrollIntoView()
      .click();

    cy.get('[data-cy="cursos_landing_modulo-leccion-16"]').click();

    cy.wait(500);

    cy.url().should('not.include', '/cursos/3/leccion/13');
  });

  it('Se puede navegar a lecciones disponibles', () => {
    cy.get(
      '[data-cy="cursos_landing_modulo-Programación. Variables y constantes"]'
    )
      .scrollIntoView()
      .click();

    cy.get('[data-cy="cursos_landing_modulo-leccion-1532"]').click();
    cy.url().should('include', '/cursos/3/leccion/1532');
  });
});
