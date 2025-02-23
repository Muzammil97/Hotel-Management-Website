import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
    Paper,
    Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribeBookings;
        let unsubscribeHotels;

        const fetchBookings = async () => {
            try {
                const bookingsCollection = collection(db, 'orders');
                unsubscribeBookings = onSnapshot(bookingsCollection, (snapshot) => {
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

        fetchBookings();
        fetchHotels();

        return () => {
            if (unsubscribeBookings) {
                unsubscribeBookings();
            }
            if (unsubscribeHotels) {
                unsubscribeHotels();
            }
        };
    }, []);

    const handleApproveOrder = async (orderId) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), {
                status: 'approved',
            });
            toast.success('Order approved!');
        } catch (err) {
            console.error('Error approving order:', err);
            toast.error(`Error approving order: ${err.message}`);
        }
    };

    const handleRejectOrder = async (orderId) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), {
                status: 'rejected',
            });
            toast.success('Order rejected!');
        } catch (err) {
            console.error('Error rejecting order:', err);
            toast.error(`Error rejecting order: ${err.message}`);
        }
    };

    const getHotelName = (hotelId) => {
        const hotel = hotels.find(h => h.id === hotelId);
        return hotel ? hotel.name : 'Unknown Hotel';
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
                Booking Management
            </Typography>
            {bookings.length === 0 ? (
                <Typography variant="body1">No bookings found.</Typography>
            ) : (
                <List>
                    {bookings.map((booking, index) => (
                        <Paper elevation={3} key={booking.id} sx={{ mb: 2 }}>
                            <Box p={2}>
                                <ListItem
                                    divider
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="approve" onClick={() => handleApproveOrder(booking.id)}>
                                                <CheckIcon color="success" />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="reject" onClick={() => handleRejectOrder(booking.id)}>
                                                <CloseIcon color="error" />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" component="span">
                                                Order #{index + 1} - Order ID: {booking.id}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="div">
                                                    User ID: {booking.userId}
                                                </Typography>
                                                {booking.items.map((itemId, itemIndex) => (
                                                    <Typography key={itemIndex} component="div">
                                                        Item {itemIndex + 1}: {getHotelName(itemId)}
                                                    </Typography>
                                                ))}
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

export default BookingManagement;