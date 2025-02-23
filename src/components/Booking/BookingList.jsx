import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Paper,
    Box,
} from '@mui/material';
import { format } from 'date-fns';

const BookingList = () => {
    const { user } = useSelector((state) => state.auth);
    const [bookings, setBookings] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribeBookings;
        let unsubscribeHotels;

        const fetchBookings = async () => {
            try {
                const bookingsQuery = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid)
                );

                unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
                    const bookingList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setBookings(bookingList);
                    setLoading(false);
                }, (err) => {
                    setError(err.message);
                    setLoading(false);
                });
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchHotels = async () => {
            try {
                const hotelCollection = collection(db, 'hotels');
                unsubscribeHotels = onSnapshot(hotelCollection, (snapshot) => {
                    const hotelList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setHotels(hotelList);
                }, (err) => {
                    console.error("Error fetching hotels:", err);
                });
            } catch (err) {
                console.error("Error fetching hotels:", err);
            }
        };

        if (user) {
            fetchBookings();
            fetchHotels();
        }

        return () => {
            if (unsubscribeBookings) {
                unsubscribeBookings();
            }
            if (unsubscribeHotels) {
                unsubscribeHotels();
            }
        };
    }, [user]);

    const getHotelName = (hotelId) => {
        const hotel = hotels.find(h => h.id === hotelId);
        return hotel ? hotel.name : 'Unknown Hotel';
    };

    const getHotelPrice = (hotelId) => {
        const hotel = hotels.find(h => h.id === hotelId);
        return hotel ? hotel.price : 0;
    };

    if (loading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>
            {bookings.length === 0 ? (
                <Typography variant="body1">No bookings found.</Typography>
            ) : (
                <List>
                    {bookings.map((booking, index) => (
                        <Paper elevation={3} key={booking.id} sx={{ mb: 2 }}>
                            <Box p={2}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" component="span">
                                                Order #{index + 1} - Order ID: {booking.id}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                {booking.items.map((itemId, itemIndex) => (
                                                    <Typography key={itemIndex} component="div">
                                                        Item {itemIndex + 1}: {getHotelName(itemId)} (Price: ${getHotelPrice(itemId)})
                                                    </Typography>
                                                ))}
                                                <Typography component="div">
                                                    Total Price: ${booking.items.reduce((total, itemId) => total + getHotelPrice(itemId), 0)}
                                                </Typography>
                                                <Typography component="div">
                                                    Order Date: {booking.createdAt ? format(booking.createdAt.toDate(), 'MMMM dd, yyyy HH:mm') : 'N/A'}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <Chip label={booking.status} color={
                                        booking.status === 'pending' ? 'warning' :
                                            booking.status === 'approved' ? 'success' : 'error'
                                    } />
                                </ListItem>
                            </Box>
                        </Paper>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default BookingList;