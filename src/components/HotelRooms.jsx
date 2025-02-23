import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { addItem } from '../store/slices/cartSlice';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const HotelRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsCollection = collection(db, 'hotels');
                const roomsSnapshot = await getDocs(roomsCollection);
                const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setRooms(roomsList);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleAddToCart = (room) => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(addItem(room));
            navigate('/cart');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Available Hotel Rooms
            </Typography>
            <Grid container spacing={4}>
                {rooms.map((room) => (
                    <Grid item key={room.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={room.imageUrl}
                                alt={room.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {room.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {room.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price:{room.price}
                                </Typography>
                            </CardContent>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddToCart(room)}
                            >
                                Add to Cart
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HotelRooms;