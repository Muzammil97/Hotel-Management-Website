import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Hotel Reservation
                        </Typography>
                        <Typography variant="body2">
                            &copy; {new Date().getFullYear()} Hotel Reservation. All rights reserved.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2">
                            Email: info@hotelreservation.com
                        </Typography>
                        <Typography variant="body2">
                            Phone: +1 234 567 890
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Follow Us
                        </Typography>
                        <Link href="#" color="inherit" sx={{ display: 'block' }}>
                            Facebook
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block' }}>
                            Twitter
                        </Link>
                        <Link href="#" color="inherit" sx={{ display: 'block' }}>
                            Instagram
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
