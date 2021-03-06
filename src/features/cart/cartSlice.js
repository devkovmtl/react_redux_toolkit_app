import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import cartItems from '../../cartItems';

const url = 'https://course-api.com/react-useReducer-cart-project';

// export const getCartItems = createAsyncThunk('cart/getCartItems', async () => {
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// });
export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (name, thunkApi) => {
    try {
      // console.log(thunkApi); // disptatc, getState from entire app, rejectWithValue...
      // console.log(thunkApi.getState());
      // we can dispatch
      // thunkApi.dispatch(openModal())
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkApi.rejectWithValue('something went wrong');
    }
  }
);

const initialState = {
  cartItems: [],
  amount: 4, // how many each items we have
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      // we can return a new state but be carrefull will become new state!!
      // return {}; // state become empty object
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
