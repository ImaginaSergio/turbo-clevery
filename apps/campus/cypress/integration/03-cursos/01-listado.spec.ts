describe('#### Cursos | Listado ####', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
    cy.login();

    cy.navigateTo('cursos');
  });

  describe('Listado de cursos cargado', () => {
    it('Bloque es visible', () =>
      cy.get('[data-cy="cursos_listado_bloque-inicial"]').should('be.visible'));

    it('Hoja de ruta cargada', () =>
      cy
        .get('[data-cy="curso_Introducción a la programación"]')
        .should('be.visible'));

    it('Navegación a Landing correcta', () => {
      cy.get('[data-cy="curso_Introducción a la programación"]').click();
      cy.get('[data-cy="landing_titulo"]').should(
        'contain.text',
        'Introducción a la programación'
      );
    });
  });
});
