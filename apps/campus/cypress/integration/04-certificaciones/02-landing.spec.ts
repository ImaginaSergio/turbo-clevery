describe('#### Certificaciones | Landing ####', () => {
  after(() => {
    cy.logout();
  });

  it('Estamos en la página correspondiente', () => {
    cy.url().should('include', '/certificaciones/16', { timeout: 10000 });
  });

  it('La página carga el título correctamente', () =>
    cy.get('[data-cy="titulo_certi_portada_base"]').should(($p) => {
      expect('Certificación - Introducción a la programación').to.eq($p.text());
    }));

  it.skip('El botón favorito funciona', () => {
    cy.get('[data-cy="fav_button_portada_base"]').click();
    cy.get('[data-cy="fav_button_portada_base"]').contains('Favorito');
    cy.get('[data-cy="fav_button_portada_base"]').click();
    cy.get('[data-cy="fav_button_portada_base"]').contains('Añadir favorito');
  });

  describe('El Widget de Número de preguntas carga correctamente', () => {
    it('El bloque es visible inicialmente', () => {
      cy.get('[data-cy="num_preguntas_container"]').should('be.visible');
    });
    it('El número de preguntas es > que 0', () => {
      cy.get('[data-cy="num_preguntas_portada_base"]').should(($number) => {
        let number = +$number.text();
        expect(number > 0).to.eq(true);
      });
    });
  });

  describe('El Widget de Tiempo Total carga correctamente', () => {
    it('El bloque es visible incialmente', () => {
      cy.get('[data-cy="tiempo_total_container"]').should('be.visible');
    });

    it('El tiempo total es diferente que "-"', () => {
      cy.get('[data-cy="tiempo_total_portada_base"]').should(($time) => {
        let time = $time.text();
        expect(time === '-').to.eq(false);
      });
    });

    describe('El Widget de Intentos Restantes carga correctamente', () => {
      it('El bloque es visible incialmente', () => {
        cy.get('[data-cy="intentos_restantes_container"]').should('be.visible');
      });

      it('El número de intentos totales es > que 0', () => {
        cy.get('[data-cy="intentos_restantes_portada_base"]').should(
          ($totales) => {
            let number = +$totales.text().replace('3 / ', '');
            expect(number > 0).to.eq(true);
          }
        );
      });

      it('El número de intentos restantes es mayor o igual que 0 y menor o igual que intentos totales', () => {
        cy.get('[data-cy="intentos_restantes_portada_base"]').should(
          ($intentos) => {
            let numberRestantes = +$intentos.text().replace(' / 3', '');
            let numberTotales = +$intentos.text().replace('3 / ', '');
            expect(
              numberRestantes >= 0 && numberTotales >= numberRestantes
            ).to.eq(true);
          }
        );
      });
    });
  });
});
