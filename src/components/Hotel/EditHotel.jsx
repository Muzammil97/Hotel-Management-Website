import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const EditHotel = () => {
    const { id } = useParams(); // Get the hotel ID from the URL
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
        const [price, setPrice] = useState(''); // Also add new the useState
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotelDocRef = doc(db, 'hotels', id);
                const hotelDoc = await getDoc(hotelDocRef);
                if (hotelDoc.exists()) {
                    const hotelData = hotelDoc.data();
                    setName(hotelData.name);
                    setDescription(hotelData.description);
                    setImageUrl(hotelData.imageUrl);
                        setPrice(hotelData.price); // get data for price
                } else {
                    setError('Hotel not found');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hotelDocRef = doc(db, 'hotels', id);
            await updateDoc(hotelDocRef, {
                name,
                description,
                imageUrl,
                    price // also added for update
            });
            toast.success('Hotel updated successfully!');
            navigate('/hotel'); // Redirect back to hotel list
        } catch (err) {
            console.error('Error updating hotel:', err);
            toast.error(`Error updating hotel: ${err.message}`);
        }
    };

    if (loading) {
        return <div>Loading hotel details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Edit Hotel
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Hotel Name"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="description"
                        label="Description"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="imageUrl"
                        label="Image URL"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                     <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="price"
                                            label="Price"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Update Hotel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditHotel;