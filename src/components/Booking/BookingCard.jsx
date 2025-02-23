import React from 'react';
import { Typography, ListItem, ListItemText, Chip } from '@mui/material';

const BookingCard = ({ booking }) => {
    const statusColorMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'error',
    };

    return (
        <ListItem divider>
            <ListItemText
                primary={`Order ID: ${booking.id}`}
                secondary={`Items: ${booking.items.join(', ')}`}
            />
            <Chip label={booking.status} color={statusColorMap[booking.status] || 'default'} />
        </ListItem>
    );
};

export default BookingCard;