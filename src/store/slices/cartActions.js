import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { doc, setDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

export const addItemToCart = createAsyncThunk(
    'cart/addItem',
    async (item, { getState, rejectWithValue }) => {
        const { auth } = getState();
        if (!auth.user) {
            return rejectWithValue('User not logged in');
        }

        try {
            const cartItemRef = doc(db, 'carts', auth.user.uid, 'items', item.id);
            await setDoc(cartItemRef, item);
            return item;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeItem = createAsyncThunk(
    'cart/removeItem',
    async (itemId, { getState, rejectWithValue }) => {
        const { auth } = getState();
        if (!auth.user) {
            return rejectWithValue('User not logged in');
        }

        try {
            const cartItemRef = doc(db, 'carts', auth.user.uid, 'items', itemId);
            await deleteDoc(cartItemRef);
            return itemId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, { getState, rejectWithValue }) => {
        const { auth } = getState();
        if (!auth.user) {
            return rejectWithValue('User not logged in');
        }

        try {
            const cartItemsRef = collection(db, 'carts', auth.user.uid, 'items');
            const cartItemsSnapshot = await getDocs(cartItemsRef);
            const batch = writeBatch(db);
            cartItemsSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);