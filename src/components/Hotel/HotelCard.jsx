// src/components/Hotel/HotelCard.jsx

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { addItem } from '../../store/slices/cartSlice'; // change the path of cart slice

const HotelCard = ({ hotel }) => {
    const navigate = useNavigate();
    const { role } = useSelector((state) => state.auth);
    const dispatch = useDispatch(); // Get the dispatch function

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'hotels', hotel.id));
            toast.success('Hotel deleted successfully!');
            // Optionally, refresh the hotel list after deleting
            // You might want to dispatch an action to update the Redux store if you're using it to manage hotel data
        } catch (err) {
            console.error('Error deleting hotel:', err);
            toast.error(`Error deleting hotel: ${err.message}`);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-hotel/${hotel.id}`);
    };

    // Handle the "Add to Cart" action
    const handleAddToCart = () => {
        dispatch(addItem(hotel));
        toast.success(`${hotel.name} added to cart!`);
    };

    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={hotel.imageUrl || "https://source.unsplash.com/random?hotel"}  // Use hotel.imageUrl if available
                    alt={hotel.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {hotel.description}
                    </Typography>
                    <Typography variant="h6">
                        Price: ${hotel.price}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {role === 'admin' && (
                    <>
                        <Button size="small" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                        <Button size="small" color="secondary" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
                {role === 'client' && (
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            Price: ${hotel.price}
                        </Typography>
                        <Button size="small" color="primary" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </Box>
                )}
            </CardActions>
        </Card>
    );
};

export default HotelCard;