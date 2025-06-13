describe('Тесты на оформление заказа', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });

    window.localStorage.setItem('refreshToken', 'testRefreshToken');
    cy.setCookie('accessToken', 'testAccessToken');
    cy.visit('');
  });

  it('Оформление заказа', function () {
    const addBuns = cy.get('[data-cy=AddBuns]');
    addBuns.contains('Добавить');
    addBuns.click();

    const addMains = cy.get('[data-cy=AddMains]');
    addMains.contains('Добавить');
    addMains.click();

    const addSauces = cy.get('[data-cy=AddSauces]');
    addSauces.contains('Добавить');
    addSauces.click();

    cy.get('[data-cy=Order]').click();
    cy.get('[data-cy=OrderNumber]').should('be.visible');
    cy.get('[data-cy=OrderId]').should('be.visible');
    cy.get('[data-cy=CloseModal]').click();

    cy.get('[data-cy=ConstructorItemsBunTop]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy=ConstructorItemsIngredients]').should(
      'contain',
      'Выберите начинку'
    );
    cy.get('[data-cy=ConstructorItemsBunBottom]').should(
      'contain',
      'Выберите булки'
    );
  });
});
