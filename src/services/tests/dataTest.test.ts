import { configureStore } from '@reduxjs/toolkit';

import constructorItemsReducer, {
  addIngredient,
  initialState as constructorInitialState,
  moveIngredient,
  removeIngredients
} from '../constructorItemsSlice';

import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import orderReducer, { getOrders, orderBurger } from '../orderSlice';
import { getUser, loginUser } from '../userSlice';
import { rootReducer } from '../store';

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn()
}));

global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(() => null),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

jest.mock('@api', () => ({
  getUserApi: jest.fn(() =>
    Promise.resolve({
      user: {
        email: 'mail@fortest.com',
        name: 'testUser'
      }
    })
  ),
  loginUserApi: jest.fn(() =>
    Promise.resolve({
      user: {
        email: 'mail@fortest.com',
        name: 'testUser'
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    })
  )
}));

// --------------------------------------------------------
// 🔹 Тесты constructorItemsSlice
describe('constructorItemsSlice', () => {
  test('Добавление ингредиента', () => {
    const addTestIngredient = {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'main',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };

    const addState = constructorItemsReducer(
      constructorInitialState,
      addIngredient(addTestIngredient)
    );

    const { id, ...expected } = addState.ingredients[0];
    expect(expected).toEqual(addTestIngredient);
  });

  test('Удаление ингредиента', () => {
    const removeTestIngredient = {
      id: '1',
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'main',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };

    const state = {
      bun: null,
      ingredients: [removeTestIngredient]
    };

    const expected = constructorItemsReducer(
        state,
        removeIngredients('1')
    );

    expect(expected.ingredients).toEqual([]);
  });

  test('Изменение порядка ингредиентов', () => {
    const ingredient1 = { ...constructorInitialState, id: '1', _id: '1' };
    const ingredient2 = { ...constructorInitialState, id: '2', _id: '2' };

    const state = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const result = constructorItemsReducer(
        state,
        moveIngredient({ index: 1, step: -1 })
    );

    expect(result.ingredients[0]).toEqual(ingredient2);
    expect(result.ingredients[1]).toEqual(ingredient1);
  });
});

// --------------------------------------------------------
// 🔹 Тесты ingredientsSlice
describe('ingredientsSlice', () => {
  test('getIngredients', () => {
    const initialState = {
      ingredients: [],
      loading: false,
      error: undefined
    };

    const ingredient = {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'main',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };

    const action = {
      type: getIngredients.fulfilled.type,
      payload: ingredient
    };

    const state = ingredientsReducer(initialState, action);

    expect(state.ingredients).toEqual(ingredient);
    expect(state.loading).toBeFalsy();
  });
});

// --------------------------------------------------------
// 🔹 Тесты orderSlice
describe('orderSlice', () => {
  const initialState = {
    profileOrders: [],
    order: null,
    name: null,
    error: null,
    loading: false,
    feedItems: [],
    orderModalData: [],
    total: null,
    totalToday: null
  };

  test('getOrders', () => {
    const orders = [{ _id: '1', status: 'status', name: 'name', number: '1' }];
    const action = {
      type: getOrders.fulfilled.type,
      payload: orders
    };

    const state = orderReducer(initialState, action);

    expect(state.profileOrders).toEqual(orders);
  });

  test('orderBurger', () => {
    const orderTest = { name: 'TestName', order: 'OrderTest' };
    const action = {
      type: orderBurger.fulfilled.type,
      payload: orderTest
    };

    const state = orderReducer(initialState, action);

    expect({ name: state.name, order: state.order }).toStrictEqual(orderTest);
  });
});

// --------------------------------------------------------
// 🔹 Тесты store/rootReducer
describe('rootReducer', () => {
  test('инициализация', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toEqual(store.getState());
  });
});

// --------------------------------------------------------
// 🔹 Тесты userSlice
describe('userSlice', () => {
  const MAIL = 'mail@fortest.com';
  const USER = 'testUser';
  const PASSWORD = 'test';

  test('getUser', async () => {
    const store = configureStore({
      reducer: { user: rootReducer }
    });

    await store.dispatch(getUser());
    const state = store.getState().user;

    expect(state.user.user).toEqual({ email: MAIL, name: USER });
    expect(state.user.isAuthChecked).toBeTruthy();
    expect(state.user.isAuthenticated).toBeTruthy();
  });

  test('loginUser', async () => {
    const store = configureStore({
      reducer: { user: rootReducer }
    });

    await store.dispatch(loginUser({ email: MAIL, password: PASSWORD }));
    const state = store.getState().user;

    expect(state.user.user).toEqual({ email: MAIL, name: USER });
    expect(state.user.isAuthChecked).toBeTruthy();
    expect(state.user.isAuthenticated).toBeTruthy();
  });
});
