import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Box,
} from '@mui/material';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customerCollection = collection(db, 'clients');
                const customerSnapshot = await getDocs(customerCollection);
                const customerList = customerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setCustomers(customerList);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) {
        return <div>Loading customers...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Customer List
            </Typography>
            {customers.length === 0 ? (
                <Typography variant="body1">No customers found.</Typography>
            ) : (
                <List>
                    {customers.map((customer) => (
                        <Paper elevation={3} key={customer.id} sx={{ mb: 2 }}>
                            <Box p={2}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" component="span">
                                                {customer.Name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    Email: {customer.email}
                                                </Typography>
                                                <Typography
                                                    sx={{ display: 'block' }}
                                                    component="span"
                                                    variant="body2"
                                                >
                                                    Role: {customer.role}
                                                </Typography>
                                                <Typography
                                                    sx={{ display: 'block' }}
                                                    component="span"
                                                    variant="body2"
                                                >
                                                    UserName: {customer.username}
                                                </Typography>
                                                {/* You can add more details here as needed */}
                                            </>
                                        }
                                    />
                                </ListItem>
                            </Box>
                        </Paper>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default CustomerList;