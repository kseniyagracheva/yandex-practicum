describe('Тесты на конструктор', () => {
  beforeEach('перехват запроса на эндпоинт', () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });

    cy.visit('');
  });

  it('Добавление булки в конструктор', () => {
    const addBuns = cy.get('[data-cy=AddBuns]');
    addBuns.contains('Добавить');
    addBuns.click();

    cy.get('[data-cy=ConstructorItemsBunTop]').should(
      'contain',
      'Краторная булка N-200i'
    );

    cy.get('[data-cy=ConstructorItemsBunBottom]').should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('Добавление начинки в конструктор', () => {
    const addMains = cy.get('[data-cy=AddMains]');
    addMains.contains('Добавить');
    addMains.click();

    cy.get('[data-cy=ConstructorItemsIngredients]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Добавление соуса в конструктор', () => {
    const addSauces = cy.get('[data-cy=AddSauces]');
    addSauces.contains('Добавить');
    addSauces.click();

    cy.get('[data-cy=ConstructorItemsIngredients]').should(
      'contain',
      'Соус Spicy-X'
    );
  });
});
