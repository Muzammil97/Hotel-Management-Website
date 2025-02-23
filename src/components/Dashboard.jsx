// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { logoutUser } from '../store/slices/authActions';
// import { Button, Typography, Container, Box } from '@mui/material';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Dashboard = () => {
//     const { user, role } = useSelector((state) => state.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         dispatch(logoutUser())
//             .then((result) => {
//                 if (result.meta.requestStatus === 'fulfilled') {
//                     toast.success('Logged out successfully!');
//                     navigate('/login');
//                 }
//             });
//     };

//     return (
//         <Container maxWidth="md">
//             <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Welcome to the Dashboard!
//                 </Typography>
//                 <Typography variant="subtitle1">
//                     You are logged in as: {user?.email}
//                 </Typography>
//                 <Typography variant="subtitle2">
//                     Your role: {role}
//                 </Typography>
//                 <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 3 }}>
//                     Logout
//                 </Button>
//             </Box>
//         </Container>
//     );
// };

// export default Dashboard;




// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { logoutUser } from '../store/slices/authActions';
// import { Button, Typography, Container, Box, List, ListItem, ListItemText, Chip, IconButton } from '@mui/material';
// import { toast } from 'react-toastify';
// import { db } from '../firebase';
// import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';

// const Dashboard = () => {
//     const { user, role } = useSelector((state) => state.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         let unsubscribe;

//         const fetchOrders = async () => {
//             try {
//                 const ordersCollection = collection(db, 'orders');
//                 unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
//                     const orderList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//                     setOrders(orderList);
//                     setLoading(false);
//                 }, (err) => {
//                     setError(err.message);
//                     setLoading(false);
//                 });
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         fetchOrders();

//         return () => {
//             if (unsubscribe) {
//                 unsubscribe();
//             }
//         };
//     }, []);

//     const handleLogout = () => {
//         dispatch(logoutUser())
//             .then((result) => {
//                 if (result.meta.requestStatus === 'fulfilled') {
//                     toast.success('Logged out successfully!');
//                     navigate('/login');
//                 }
//             });
//     };

//     const handleApproveOrder = async (orderId) => {
//         try {
//             await updateDoc(doc(db, 'orders', orderId), {
//                 status: 'approved',
//             });
//             toast.success('Order approved!');
//         } catch (err) {
//             console.error('Error approving order:', err);
//             toast.error(`Error approving order: ${err.message}`);
//         }
//     };

//     const handleRejectOrder = async (orderId) => {
//         try {
//             await updateDoc(doc(db, 'orders', orderId), {
//                 status: 'rejected',
//             });
//             toast.success('Order rejected!');
//         } catch (err) {
//             console.error('Error rejecting order:', err);
//             toast.error(`Error rejecting order: ${err.message}`);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <Container maxWidth="md">
//             <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Welcome to the Dashboard!
//                 </Typography>
//                 <Typography variant="subtitle1">
//                     You are logged in as: {user?.email}
//                 </Typography>
//                 <Typography variant="subtitle2">
//                     Your role: {role}
//                 </Typography>
//                 <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 3 }}>
//                     Logout
//                 </Button>

//                 {role === 'admin' && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h5" gutterBottom>
//                             Order Management
//                         </Typography>
//                         <List>
//                             {orders.map((order) => (
//                                 <ListItem
//                                     key={order.id}
//                                     divider
//                                     secondaryAction={
//                                         <>
//                                             <IconButton edge="end" aria-label="approve" onClick={() => handleApproveOrder(order.id)}>
//                                                 <CheckIcon color="success" />
//                                             </IconButton>
//                                             <IconButton edge="end" aria-label="reject" onClick={() => handleRejectOrder(order.id)}>
//                                                 <CloseIcon color="error" />
//                                             </IconButton>
//                                         </>
//                                     }
//                                 >
//                                     <ListItemText primary={`Order ID: ${order.id}`} secondary={`User ID: ${order.userId}, Items: ${order.items.join(', ')}`} />
//                                     <Chip label={order.status} color={
//                                         order.status === 'pending' ? 'warning' :
//                                             order.status === 'approved' ? 'success' : 'error'
//                                     } />
//                                 </ListItem>
//                             ))}
//                         </List>
//                     </Box>
//                 )}

//                 {role === 'client' && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h5" gutterBottom>
//                             My Bookings
//                         </Typography>
//                         <Link to="/bookings">View Your Bookings</Link>
//                     </Box>
//                 )}
//             </Box>
//         </Container>
//     );
// };

// export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { logoutUser } from '../store/slices/authActions';
// import { Button, Typography, Container, Box, List, ListItem, ListItemText, Chip, IconButton, Card, CardContent, CardActions } from '@mui/material';
// import { toast } from 'react-toastify';
// import { db } from '../firebase';
// import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
// import HotelList from '../components/Hotel/HotelList';

// const Dashboard = () => {
//     const { user, role } = useSelector((state) => state.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         let unsubscribe;

//         const fetchOrders = async () => {
//             try {
//                 const ordersCollection = collection(db, 'orders');
//                 unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
//                     const orderList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//                     setOrders(orderList);
//                     setLoading(false);
//                 }, (err) => {
//                     setError(err.message);
//                     setLoading(false);
//                 });
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         fetchOrders();

//         return () => {
//             if (unsubscribe) {
//                 unsubscribe();
//             }
//         };
//     }, []);

//     const handleLogout = () => {
//         dispatch(logoutUser())
//             .then((result) => {
//                 if (result.meta.requestStatus === 'fulfilled') {
//                     toast.success('Logged out successfully!');
//                     navigate('/login');
//                 }
//             });
//     };

//     const handleApproveOrder = async (orderId) => {
//         try {
//             await updateDoc(doc(db, 'orders', orderId), {
//                 status: 'approved',
//             });
//             toast.success('Order approved!');
//         } catch (err) {
//             console.error('Error approving order:', err);
//             toast.error(`Error approving order: ${err.message}`);
//         }
//     };

//     const handleRejectOrder = async (orderId) => {
//         try {
//             await updateDoc(doc(db, 'orders', orderId), {
//                 status: 'rejected',
//             });
//             toast.success('Order rejected!');
//         } catch (err) {
//             console.error('Error rejecting order:', err);
//             toast.error(`Error rejecting order: ${err.message}`);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <Container maxWidth="md">
//             <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Welcome to the Dashboard!
//                 </Typography>
//                 <Typography variant="subtitle1">
//                     You are logged in as: {user?.email}
//                 </Typography>
//                 <Typography variant="subtitle2">
//                     Your role: {role}
//                 </Typography>
//                 <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 3 }}>
//                     Logout
//                 </Button>

//                 {role === 'admin' && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h5" gutterBottom>
//                             Order Management
//                         </Typography>
//                         <List>
//                             {orders.map((order) => (
//                                 <ListItem
//                                     key={order.id}
//                                     divider
//                                     secondaryAction={
//                                         <>
//                                             <IconButton edge="end" aria-label="approve" onClick={() => handleApproveOrder(order.id)}>
//                                                 <CheckIcon color="success" />
//                                             </IconButton>
//                                             <IconButton edge="end" aria-label="reject" onClick={() => handleRejectOrder(order.id)}>
//                                                 <CloseIcon color="error" />
//                                             </IconButton>
//                                         </>
//                                     }
//                                 >
//                                     <ListItemText primary={`Order ID: ${order.id}`} secondary={`User ID: ${order.userId}, Items: ${order.items.join(', ')}`} />
//                                     <Chip label={order.status} color={
//                                         order.status === 'pending' ? 'warning' :
//                                             order.status === 'approved' ? 'success' : 'error'
//                                     } />
//                                 </ListItem>
//                             ))}
//                         </List>
//                     </Box>
//                 )}

//                 {role === 'client' && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h5" gutterBottom>
//                             My Bookings
//                         </Typography>
//                         <Link to="/bookings">View Your Bookings</Link>
//                     </Box>
//                 )}
//             </Box>
//         </Container>
//     );
// };

// export default Dashboard;







import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../store/slices/authActions';
import { Button, Typography, Container, Box, List, ListItem, ListItemText, Chip, IconButton, Card, CardContent, CardActions, Menu, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HotelList from './Hotel/HotelList';

const Dashboard = () => {
    const { user, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        let unsubscribe;

        const fetchOrders = async () => {
            try {
                const ordersCollection = collection(db, 'orders');
                unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
                    const orderList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setOrders(orderList);
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

        fetchOrders();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser())
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    toast.success('Logged out successfully!');
                    navigate('/login');
                }
            });
    };

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

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to the Dashboard!
                </Typography>
                <Typography variant="subtitle1">
                    You are logged in as: {user?.email}
                </Typography>
                <Typography variant="subtitle2">
                    Your role: {role}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 3 }}>
                    Logout
                </Button> */}

                {role === 'admin' && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Order Management
                        </Typography>
                        <List>
                            {orders.map((order) => (
                                <ListItem
                                    key={order.id}
                                    divider
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="approve" onClick={() => handleApproveOrder(order.id)}>
                                                <CheckIcon color="success" />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="reject" onClick={() => handleRejectOrder(order.id)}>
                                                <CloseIcon color="error" />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText primary={`Order ID: ${order.id}`} secondary={`User ID: ${order.userId}, Items: ${order.items.join(', ')}`} />
                                    <Chip label={order.status} color={
                                        order.status === 'pending' ? 'warning' :
                                            order.status === 'approved' ? 'success' : 'error'
                                    } />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {role === 'client' && (
                    <>
                        <Box sx={{ mt: 4 }}>
                            {/* <Typography variant="h5" gutterBottom>
                                Available Hotels
                            </Typography> */}
                            <HotelList />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                My Bookings
                            </Typography>
                            <Link to="/bookings">View Your Bookings</Link>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;