import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';

export interface IIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: IIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk('ingredients', async () => {
  const response = await getIngredientsApi();

  return response;
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.ingredients = [];
        state.error = action.error.message;
      });
  },
  selectors: {
    getIngredientsSelector: (state) => state.ingredients,
    getLoadingSelector: (state) => state.loading
  }
});

export const { getIngredientsSelector, getLoadingSelector } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
