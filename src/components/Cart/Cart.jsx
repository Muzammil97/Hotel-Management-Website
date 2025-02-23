import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '../../store/slices/cartSlice';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { db, auth } from '../../firebase';  // Import auth
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const { user, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleRemoveItem = (itemId) => {
        dispatch(removeItem(itemId));
        toast.info('Item removed from cart');
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        toast.success('Cart cleared!');
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.warn('Cart is empty. Add hotels to place an order.');
            return;
        }

        try {
            const ordersCollection = collection(db, 'orders'); // 'orders' collection in Firestore
            await addDoc(ordersCollection, {
                userId: user.uid,  // Store the user's ID
                items: cartItems.map(item => item.id),  // Store hotel IDs
                createdAt: serverTimestamp(),  // Use server timestamp
                status: 'pending',  // Initial order status
            });

            toast.success('Order placed successfully!');
            dispatch(clearCart()); // Clear the cart
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(`Error placing order: ${error.message}`);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Shopping Cart
            </Typography>
            {cartItems.length === 0 ? (
                <Typography variant="body1">Your cart is empty.</Typography>
            ) : (
                <>
                    <List>
                        {cartItems.map((item) => (
                            <ListItem key={item.id} divider>
                                <ListItemText primary={item.name} secondary={item.description} />
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="secondary" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                        {role === 'client' && (
                            <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
                                Place Order
                            </Button>
                        )}
                    </Box>
                </>
            )}
        </Container>
    );
};

export default Cart;