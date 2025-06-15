const SELECTORS = {
  modal: '[data-cy=Modal]',
  closeModalButton: '[data-cy=CloseModal]',
  modalOverlay: '[data-cy=ModalOverlay]'
};

describe('Тесты на модальное окно', () => {
  beforeEach(() => {
    cy.fixture('ingredients').as('ingredients');

    cy.fixture('ingredients').then((data) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: {
          success: true,
          data: data.ingredient
        }
      }).as('loadIngredients');
    });

    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });

    cy.visit('/');
    cy.wait('@loadIngredients');
  });

  it('Открывает и отображает модалку с деталями ингредиента', function () {
    const ingredient = this.ingredients.ingredient[0];

    cy.contains(ingredient.name).click();

    cy.get(SELECTORS.modal).as('modalWindow').should('be.visible');
    cy.get(`${SELECTORS.modal} img`).should(
      'have.attr',
      'src',
      ingredient.image_large
    );
  });

  it('Закрывается по клику на крестик', function () {
    const ingredient = this.ingredients.ingredient[0];

    cy.contains(ingredient.name).click();
    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.closeModalButton).click();

    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('Закрывается по клику на оверлей', function () {
    const ingredient = this.ingredients.ingredient[0];

    cy.contains(ingredient.name).click();
    cy.get(SELECTORS.modal).should('be.visible');

    cy.get(SELECTORS.modalOverlay).click({ force: true });

    cy.get(SELECTORS.modal).should('not.exist');
  });
});
