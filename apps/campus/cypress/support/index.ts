/// <reference types="cypress" />

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(): void;
      logout(): void;
  
      navigateTo(route: RouteEnum): void;
  
      checkAnalytics(): void;
  
      saveLocalStorage(): void;
  
      restoreLocalStorage(): void;
  
      forceCleanLocalStorage(): void;
    }
  }
  
  Cypress.Commands.add('checkAnalytics', () => {
    cy.window().then((window: any) => {
      assert.isDefined(window.dataLayer, 'window.dataLayer is defined');
  
      assert.isDefined(
        window.dataLayer.find((x) => x.event === 'gtm.js'),
        'GTM is loaded'
      );
    });
  });
  
  Cypress.Commands.add('login', () => {
    /**
     * Datos de sesión:
     * "email": "demo-cypress@gmail.com",
     * "password": "DemoCypress123456!",
     */
  
    cy.visit('/login');
  
    cy.wait(1000);
  
    cy.url().then((url) => {
      if (url.endsWith('/login'))
        // !Todo: Arreglar tipo 'any' de userData
        cy.task('getUserData').then((userData: any) => {
          cy.get('[data-cy="login_email"]').type(userData?.email || 'demo-cypress@gmail.com');
  
          cy.get('[data-cy="login_password"]').type(userData?.password || 'DemoCypress123456!');
  
          cy.get('[data-cy="login_submit"]').click();
        });
    });
  });
  
  Cypress.Commands.add('logout', () => {
    cy.url().then((url) => {
      if (!url.endsWith('/login')) {
        cy.get('[data-cy="header_menu"]').scrollIntoView().click();
        cy.get('[data-cy="header_logout"]').scrollIntoView().click();
      }
    });
  });
  
  type RouteEnum =
    | 'home'
    | 'cursos'
    | 'roadmap'
    | 'certificaciones'
    | 'foro'
    | 'boosts'
    | 'noticias'
    | 'vacantes'
    | 'comunidad'
    | 'favoritos';
  
  Cypress.Commands.add('navigateTo', (route: RouteEnum) => {
    cy.get(`[data-cy="sidebar_${route}"]`, { timeout: 10000 }).should('be.visible').click();
  
    if (route !== 'home') cy.url().should('include', '/' + route);
  });
  
  let LOCAL_STORAGE_MEMORY = {};
  
  Cypress.Commands.add('saveLocalStorage', () => {
    Object.keys(localStorage).forEach((key) => {
      LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
  });
  
  Cypress.Commands.add('restoreLocalStorage', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
      localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
  });
  
  Cypress.Commands.add('forceCleanLocalStorage', () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
      localStorage.removeItem(key);
  
      LOCAL_STORAGE_MEMORY[key] = undefined;
    });
  
    LOCAL_STORAGE_MEMORY = {};
  });
  