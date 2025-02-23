import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Grid, Container } from '@mui/material';
import HotelCard from './HotelCard';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const hotelCollection = collection(db, 'hotels');
                const hotelSnapshot = await getDocs(hotelCollection);
                const hotelList = hotelSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setHotels(hotelList);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return <div>Loading hotels...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="md">
            <h2>Available Hotels</h2>
            <Grid container spacing={4}>
                {hotels.map((hotel) => (
                    <Grid item xs={12} sm={3} md={4} key={hotel.id}>
                        <HotelCard hotel={hotel} />
                        
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HotelList;