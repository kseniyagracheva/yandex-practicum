describe('Тесты на модальное окно', () => {
  beforeEach('перехват запроса на эндпоинт', () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });

    cy.visit('');
  });

  it('Открытие и закрытие модального окна', () => {
    cy.get('[data-cy=Modal]').should('not.exist');

    cy.contains('Краторная булка N-200i').click();

    cy.get('[data-cy=Modal]').should('be.visible');
    cy.get('[data-cy=CloseModal]').click();
    cy.get('[data-cy=Modal]').should('not.exist');
  });
});
