describe('Formulario de registro - Usuario Avanzado', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
    cy.clearLocalStorage();
    cy.visit('/register');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  after(() => {
    cy.clearLocalStorage();
    cy.forceCleanLocalStorage();
  });

  it('Analíticas cargadas', () => {
    cy.checkAnalytics();

    cy.get('button#register_next_button').should('exist');
    cy.get('button#register_previous_button').should('exist');
  });

  describe('Registro Paso 1: Nombre', () => {
    it('Formulario renderizado', () => {
      cy.get('[data-cy="first_step__title"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="first_step__description"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="first_step__form"]')
        .scrollIntoView()
        .should('be.visible');
    });

    it('Primer paso del registro funcionando', () => {
      const timeKey = new Date().getTime();

      cy.intercept('POST', '/authAPI/publicRegister').as('registro');

      // Escribimos el email
      cy.get('[data-cy="email"]')
        .click()
        .type(`${getEmail_Av(timeKey)}`)
        .should('have.value', getEmail_Av(timeKey));

      cy.wait(1000);

      cy.get('[data-cy="nombre"]')
        .click()
        .type(`${userToTest_Av.nombre}`)
        .should('have.value', userToTest_Av.nombre);

      cy.get('[data-cy="apellidos"]')
        .click()
        .type(`${userToTest_Av.apellidos}`)
        .should('have.value', userToTest_Av.apellidos);

      cy.get(
        '[data-cy="terminos_condiciones"] > span.chakra-checkbox__control'
      ).click();

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#register_next_button')
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@registro', { requestTimeout: 10000 }).then(({ response }) => {
        expect(response.statusCode).to.eq(200);

        expect(response.body.user.activo).to.eq(true);
        expect(response.body.user.email).to.eq(getEmail_Av(timeKey));
        expect(response.body.user.nombre).to.eq(userToTest_Av.nombre);
        expect(response.body.user.apellidos).to.eq(userToTest_Av.apellidos);

        // Guardamos el email en el env para posteriores Logins
        cy.task('setUserData', {
          email: getEmail_Av(timeKey),
          password: userToTest_Av.password,
        });
      });
    });
  });

  describe('Registro Paso 2: Credenciales', () => {
    it('Formulario renderizado', () => {
      cy.get('[data-cy="second_step__title"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="second_step__description"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="second_step__form"]')
        .scrollIntoView()
        .should('be.visible');
    });

    it('Segundo paso del registro funcionando', () => {
      const timeKey = new Date().getTime();

      cy.intercept('PUT', '/openAPI/users/').as('actualizacion_step2');

      cy.get('[data-cy="username"]').click().type(getUsername_Av(timeKey));
      cy.get('[data-cy="username"]').should(
        'have.value',
        getUsername_Av(timeKey)
      );

      cy.get('[data-cy="password"]').click().type(userToTest_Av.password);
      cy.get('[data-cy="password_confirmation"]')
        .click()
        .type(userToTest_Av.password_confirmation);

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#register_next_button')
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@actualizacion_step2', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);

          expect(response.body.data.username).to.eq(getUsername_Av(timeKey));
        }
      );
    });
  });

  describe('Registro Paso 3: Conocimientos', () => {
    it('Formulario renderizado', () => {
      cy.get('[data-cy="third_step__title"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="third_step__description"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="third_step__form"]')
        .scrollIntoView()
        .should('be.visible');
    });

    it('Tercer paso del registro funcionando', () => {
      cy.intercept('PUT', '/openAPI/users/').as('actualizacion_step3');

      cy.get('[data-cy="conocimientos_avanzado"]').scrollIntoView().click();

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#register_next_button')
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@actualizacion_step3', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);

          expect(response.body.data.preferencias.conocimientos).to.eq(
            'avanzado'
          );
        }
      );
    });
  });

  describe('Registro Paso 4: Ruta', () => {
    it('Formulario renderizado', () => {
      cy.get('[data-cy="fourth_step__title"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="fourth_step__description"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="fourth_step__form"]')
        .scrollIntoView()
        .should('be.visible');

      cy.get('[data-cy="ruta_frontend"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="ruta_backend"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="ruta_fullstack"]')
        .scrollIntoView()
        .should('be.visible');
    });

    it('Cuarto paso del registro funcionando', () => {
      cy.intercept('PUT', '/openAPI/users/').as('actualizacion_step4');
      cy.intercept('PUT', '/openAPI/progresosGlobales/*').as(
        'actualizacion_pglobal'
      );

      cy.get('[data-cy="ruta_fullstack"]').click();

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#register_next_button')
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@actualizacion_step4', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);

          expect(response.body.data.preferencias.ruta).to.eq('fullstack');
        }
      );

      // Comprobamos que además la ruta se ha actualizado correctamente
      cy.wait('@actualizacion_pglobal', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);

          expect(response.body.data.ruta.nombre).to.eq(
            'Fullstack Developer - .Net y Angular'
          );
        }
      );
    });
  });

  describe('Registro Paso 5: Final', () => {
    it('Botones analítica renderizados', () => {
      cy.get('button#acces_to_campus_button')
        .scrollIntoView()
        .should('be.visible');
    });

    it('Formulario renderizado', () => {
      cy.get('[data-cy="last_step__title"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="last_step__description"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[data-cy="last_step__form"]')
        .scrollIntoView()
        .should('be.visible');

      cy.get('[data-cy="pais"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="estado"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="trabajoRemoto"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="origen"]').scrollIntoView().should('be.visible');
      cy.get('[data-cy="posibilidadTraslado"]')
        .scrollIntoView()
        .should('be.visible');
    });

    it('Último paso del registro funcionando', () => {
      cy.intercept('PUT', '/openAPI/users/').as('actualizacion_step5');

      cy.get('[data-cy="pais"]').scrollIntoView().click();
      cy.get('[data-cy="option_españa"]').scrollIntoView().click();

      cy.get('[data-cy="estado"]').scrollIntoView().click();
      cy.get('[data-cy="option_asturias"]').scrollIntoView().click();

      cy.get('[data-cy="posibilidadTraslado"]').scrollIntoView().click();
      cy.get(
        '[data-cy="posibilidadTraslado"] .chakra-radio__control[data-cy="option_si"]'
      )
        .scrollIntoView()
        .click();

      cy.get('[data-cy="origen"]').scrollIntoView().click();
      cy.get('[data-cy="option_google"]').scrollIntoView().click();

      cy.get('[data-cy="trabajoRemoto"]').scrollIntoView().click();
      cy.get('[data-cy="option_remoto"]').scrollIntoView().click();

      cy.get('[data-cy="posibilidadTraslado"]').scrollIntoView().click();
      cy.get(
        '[data-cy="posibilidadTraslado"] .chakra-radio__control[data-cy="option_si"]'
      )
        .scrollIntoView()
        .click();

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#acces_to_campus_button').scrollIntoView().click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@actualizacion_step5', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);

          expect(response.body.data.pais.nombre).to.equal('España');
          expect(response.body.data.estado.nombre).to.eq('Asturias');

          expect(response.body.data.origen).to.eq('google');
          expect(response.body.data.trabajoRemoto).to.eq('remoto');
          expect(response.body.data.posibilidadTraslado).to.eq(true);
        }
      );
    });
  });

  describe('Pantalla de bienvenida', () => {
    it('Pantalla de bienvenida cargando', () => {
      cy.get('[data-cy="logo_ob"]', { timeout: 5000 }).should('be.visible');
    });
  });
});

const getEmail_Av = (id: number) => `cy_${id}@gmail.com`;
const getUsername_Av = (id: number) => `cy_${id}`;

const userToTest_Av = {
  nombre: 'Démó',
  apellidos: 'Cypress Súper',
  password: 'DemoCypress2022!!',
  password_confirmation: 'DemoCypress2022!!',
};
