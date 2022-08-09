describe('Formulario de registro - Usuario Iniciación', () => {
  /** Entramos al register antes de empezar con los tests */
  before(() => {
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

    // Guardamos el storage vacío
    cy.forceCleanLocalStorage();
  });

  it('Analíticas cargadas', () => {
    cy.checkAnalytics();

    cy.get('button#register_previous_button').should('exist');
    cy.get('button#register_next_button').should('exist');
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
        .type(`${getEmail_Ini(timeKey)}`)
        .should('have.value', getEmail_Ini(timeKey));

      cy.wait(1000);

      cy.get('[data-cy="nombre"]')
        .click()
        .type(`${userToTest_Ini.nombre}`)
        .should('have.value', userToTest_Ini.nombre);

      cy.get('[data-cy="apellidos"]')
        .click()
        .type(`${userToTest_Ini.apellidos}`)
        .should('have.value', userToTest_Ini.apellidos);

      cy.get(
        '[data-cy="terminos_condiciones"] > span.chakra-checkbox__control'
      ).click();

      cy.wait(500);

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#register_next_button')
        .scrollIntoView()
        .should('be.visible')
        .click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@registro', { requestTimeout: 10000 }).then(({ response }) => {
        expect(response.statusCode).to.eq(200);

        expect(response.body.user.activo).to.eq(true);
        expect(response.body.user.email).to.eq(getEmail_Ini(timeKey));
        expect(response.body.user.nombre).to.eq(userToTest_Ini.nombre);
        expect(response.body.user.apellidos).to.eq(userToTest_Ini.apellidos);
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

      cy.get('[data-cy="username"]').click().type(getUsername_Ini(timeKey));
      cy.get('[data-cy="username"]').should(
        'have.value',
        getUsername_Ini(timeKey)
      );

      cy.get('[data-cy="password"]').click().type(userToTest_Ini.password);
      cy.get('[data-cy="password_confirmation"]')
        .click()
        .type(userToTest_Ini.password_confirmation);

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

          expect(response.body.data.username).to.eq(getUsername_Ini(timeKey));
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
      cy.intercept('PUT', '/openAPI/progresosGlobales/*').as(
        'actualizacion_pglobal'
      );

      cy.get('[data-cy="conocimientos_principiante"]')
        .scrollIntoView()
        .dblclick();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@actualizacion_step3', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);
          expect(response.body.data.preferencias.conocimientos).to.eq(
            'principiante'
          );
        }
      );

      // Comprobamos que además la ruta se ha actualizado correctamente
      cy.wait('@actualizacion_pglobal', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);
          expect(response.body.data.ruta.nombre).to.eq('De 0 a Dev');
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

      // Pulsamos en el botón para continuar con el formulario
      cy.get('button#acces_to_campus_button').scrollIntoView().click();

      // Comprobamos que la información del usuario se ha registrado correctamente
      cy.wait('@actualizacion_step5', { timeout: 10000 }).then(
        ({ response }) => {
          expect(response.statusCode).to.eq(200);
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

const getEmail_Ini = (id: number) => `cy_${id}@gmail.com`;
const getUsername_Ini = (id: number) => `cy_${id}`;

const userToTest_Ini = {
  nombre: 'Démó',
  apellidos: 'Cypress Súper',
  password: 'DemoCypress2022!!',
  password_confirmation: 'DemoCypress2022!!',
};
