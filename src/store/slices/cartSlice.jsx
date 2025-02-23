import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);

            if (existingItemIndex !== -1) {
                // Item exists, increment the quantity
                state.items[existingItemIndex].quantity += 1;
            } else {
                // Item doesn't exist, add it to the cart with quantity 1
                state.items.push({ ...newItem, quantity: 1 });
            }
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            const existingItemIndex = state.items.findIndex((item) => item.id === itemId);

            if (existingItemIndex !== -1) {
                if (state.items[existingItemIndex].quantity > 1) {
                    // Decrease the quantity if greater than 1
                    state.items[existingItemIndex].quantity -= 1;
                } else {
                    // Remove the item if the quantity is 1
                    state.items.splice(existingItemIndex, 1);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;