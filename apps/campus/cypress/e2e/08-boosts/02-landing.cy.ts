/// <reference types="cypress" />

describe('#### Boosts | Probando Landing ####', () => {
  before(() => {
    it('La ruta se carga correctamente', () => {
      cy.url().should('include', '/boosts');
    });
  });

  describe('Cargan los 4 bloques de información del boost', () => {
    it('Descripción de la vacante', () => {
      cy.wait(3000)
        .get('[data-cy="titulo_boost"]')
        .contains('Fullstack Developer');
      cy.get('[data-cy="empresa_titulo_boost"]')
        .scrollIntoView()
        .contains('Servinform');
      cy.get('[data-cy="localidad_boost"]')
        .scrollIntoView()
        .contains('Andalucía' + ', ' + 'España');
      cy.get('[data-cy="presencialidad_boost"]')
        .scrollIntoView()
        .contains('Remoto');
      cy.get('[data-cy="horario_boost"]')
        .scrollIntoView()
        .contains('Jornada Completa');
      cy.get('[data-cy="rango_salarial_boost"]')
        .scrollIntoView()
        .contains('18000' + '€ - ' + '24000' + '€ / Año');
      cy.get('[data-cy="tecnologias_boost"]')
        .scrollIntoView()
        .should(($item) => {
          expect($item.length >= 1).to.equal(true);
        });
    });

    it('Hoja de ruta del boost', () => {
      cy.get('[data-cy="roadmap_boost"]')
        .scrollIntoView()
        .should(($item) => {
          expect($item.length >= 1).to.equal(true);
        });
    });

    it('Requisitos del boost', () => {
      cy.get('[data-cy="requisitos_boost"]')
        .first()
        .should(($item) => {
          expect($item.length >= 1).to.equal(true);
        });
    });

    it('Información de la empresa', () => {
      cy.get('[data-cy="titulo_info_empresa_boost"]')
        .scrollIntoView()
        .contains('Sobre ' + 'Servinform');
    });
  });
});
