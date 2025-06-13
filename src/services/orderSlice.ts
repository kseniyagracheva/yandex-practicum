import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk(
  'order',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);

    return response;
  }
);

export const getFeeds = createAsyncThunk('feed', async () => {
  const response = await getFeedsApi();

  return response;
});

export const getOrders = createAsyncThunk('orders', async () => {
  const response = await getOrdersApi();

  return response;
});

export const getOrderByNumber = createAsyncThunk(
  'orderNumber',
  async (data: number) => {
    const response = await getOrderByNumberApi(data);

    return response;
  }
);

interface IOrderState {
  order: TOrder | null;
  name: string | null;
  error: string | null | undefined;
  loading: boolean;
  feedItems: TOrder[];
  orderModalData: TOrder[];
  profileOrders: TOrder[];
  total: number | null;
  totalToday: number | null;
}
const initialState: IOrderState = {
  order: null,
  name: null,
  error: null,
  loading: false,
  feedItems: [],
  orderModalData: [],
  profileOrders: [],
  total: null,
  totalToday: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.order = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.feedItems = action.payload.orders;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.feedItems = [];
        state.total = 0;
        state.totalToday = 0;
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getOrderSelector: (state) => state.order,
    getLoadingSelector: (state) => state.loading,
    getOrdersSelector: (state) => state.feedItems,
    getOrderModalDataSelector: (state) => state.orderModalData[0],
    getProfileOrdersSelector: (state) => state.profileOrders,
    getTotalSelector: (state) => state.total,
    getTotalTodaySelector: (state) => state.totalToday
  }
});

export const {
  getOrderSelector,
  getLoadingSelector,
  getOrdersSelector,
  getProfileOrdersSelector,
  getTotalSelector,
  getTotalTodaySelector,
  getOrderModalDataSelector
} = orderSlice.selectors;

export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
