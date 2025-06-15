import { configureStore } from '@reduxjs/toolkit';

import constructorItemsReducer, {
  addIngredient,
  initialState as constructorInitialState,
  clearIngredients,
  moveIngredient,
  removeIngredients,
  IConstructorState
} from '../constructorItemsSlice';

import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import orderReducer, { getOrders, orderBurger } from '../orderSlice';
import reducer, {
  registerUser,
  loginUser,
  getUser,
  logout
} from '../userSlice';
import { rootReducer } from '../store';
import { TConstructorIngredient } from '@utils-types';

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

    const expected = constructorItemsReducer(state, removeIngredients('1'));

    expect(expected.ingredients).toEqual([]);
  });

  test('Изменение порядка ингредиентов', () => {
    const ingredient1: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 200,
      image: 'image1.png',
      image_mobile: 'image1_mobile.png',
      image_large: 'image1_large.png'
    };

    const ingredient2: TConstructorIngredient = {
      id: '2',
      _id: '2',
      name: 'Ингредиент 2',
      type: 'main',
      proteins: 15,
      fat: 7,
      carbohydrates: 25,
      calories: 150,
      price: 250,
      image: 'image2.png',
      image_mobile: 'image2_mobile.png',
      image_large: 'image2_large.png'
    };

    const state: IConstructorState = {
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

  test('moveIngredient не меняет порядок, если выход за границы', () => {
    const ingredient1: TConstructorIngredient = {
      id: '1',
      _id: '1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 200,
      image: 'image1.png',
      image_mobile: 'image1_mobile.png',
      image_large: 'image1_large.png'
    };

    const ingredient2: TConstructorIngredient = {
      id: '2',
      _id: '2',
      name: 'Ингредиент 2',
      type: 'main',
      proteins: 15,
      fat: 7,
      carbohydrates: 25,
      calories: 150,
      price: 250,
      image: 'image2.png',
      image_mobile: 'image2_mobile.png',
      image_large: 'image2_large.png'
    };

    const state: IConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    let result = constructorItemsReducer(
      state,
      moveIngredient({ index: 0, step: -1 })
    );
    expect(result.ingredients).toEqual(state.ingredients);

    result = constructorItemsReducer(
      state,
      moveIngredient({ index: 1, step: 1 })
    );
    expect(result.ingredients).toEqual(state.ingredients);
  });

  test('Очистка ингредиентов сбрасывает состояние к initialState', () => {
    const populatedState = {
      bun: {
        id: 'bun1',
        _id: 'bun1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 100,
        price: 200,
        image: 'bun.png',
        image_mobile: 'bun_mobile.png',
        image_large: 'bun_large.png'
      },
      ingredients: [
        {
          id: '1',
          _id: '1',
          name: 'Ингредиент',
          type: 'main',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 100,
          price: 200,
          image: 'ing.png',
          image_mobile: 'ing_mobile.png',
          image_large: 'ing_large.png'
        }
      ]
    };

    const state = constructorItemsReducer(populatedState, clearIngredients());

    expect(state).toEqual(constructorInitialState);
  });

  test('Добавление булки заменяет bun', () => {
    const bunIngredient = {
      _id: 'bun1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 200,
      image: 'bun.png',
      image_mobile: 'bun_mobile.png',
      image_large: 'bun_large.png'
    };

    const state = constructorItemsReducer(
      constructorInitialState,
      addIngredient(bunIngredient)
    );

    expect(state.bun).toMatchObject(bunIngredient);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.ingredients).toHaveLength(0);
  });
});

// --------------------------------------------------------
// 🔹 Тесты ingredientsSlice
describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  test('should return initial state', () => {
    const state = ingredientsReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  test('getIngredients pending sets loading true and error null', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('getIngredients fulfilled sets ingredients and loading false', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];

    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientsReducer(initialState, action);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('getIngredients rejected sets error and loading false', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
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

  test('getOrders fulfilled', () => {
    const orders = [{ _id: '1', status: 'status', name: 'name', number: '1' }];
    const action = {
      type: getOrders.fulfilled.type,
      payload: orders
    };

    const state = orderReducer(initialState, action);

    expect(state.profileOrders).toEqual(orders);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('getOrders pending', () => {
    const action = { type: getOrders.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('getOrders rejected', () => {
    const action = {
      type: getOrders.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  test('orderBurger fulfilled', () => {
    const orderTest = { name: 'TestName', order: 'OrderTest' };
    const action = {
      type: orderBurger.fulfilled.type,
      payload: orderTest
    };

    const state = orderReducer(initialState, action);

    expect({ name: state.name, order: state.order }).toStrictEqual(orderTest);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('orderBurger pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('orderBurger rejected', () => {
    const action = {
      type: orderBurger.rejected.type,
      error: { message: 'Ошибка оформления' }
    };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка оформления');
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
  const initialState = {
    user: null,
    isAuthChecked: false,
    isAuthenticated: false,
    error: null
  };

  const userPayload = {
    user: { name: 'Test User', email: 'test@example.com' }
  };

  test('registerUser pending clears error', () => {
    const state = reducer(initialState, { type: registerUser.pending.type });
    expect(state.error).toBeNull();
  });

  test('registerUser rejected sets error', () => {
    const error = 'Ошибка регистрации';
    const state = reducer(initialState, {
      type: registerUser.rejected.type,
      error: { message: error }
    });
    expect(state.error).toBe(error);
  });

  test('loginUser pending clears error', () => {
    const state = reducer(initialState, { type: loginUser.pending.type });
    expect(state.error).toBeNull();
  });

  test('loginUser rejected sets error', () => {
    const error = 'Ошибка входа';
    const state = reducer(initialState, {
      type: loginUser.rejected.type,
      error: { message: error }
    });
    expect(state.error).toBe(error);
  });

  test('getUser rejected sets error and sets isAuthChecked true', () => {
    const error = 'Ошибка получения пользователя';
    const state = reducer(initialState, {
      type: getUser.rejected.type,
      error: { message: error }
    });
    expect(state.error).toBe(error);
    expect(state.isAuthChecked).toBe(true);
  });

  test('registerUser fulfilled sets user and auth flags', () => {
    const state = reducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: userPayload
    });
    expect(state.user).toEqual(userPayload.user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('logout fulfilled resets user and auth flags', () => {
    const loggedInState = {
      user: userPayload.user,
      isAuthChecked: true,
      isAuthenticated: true,
      error: null
    };
    const state = reducer(loggedInState, { type: logout.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });
});
