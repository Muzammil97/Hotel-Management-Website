


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Provider } from 'react-redux';
import store from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from "./components/Cart/Cart";
import HotelList from "./components/Hotel/HotelList";
import AddHotel from "./components/Hotel/AddHotel";
import EditHotel from "./components/Hotel/EditHotel";
import BookingList from "./components/Booking/BookingList";
import Navigation from "./components/Navigation";
import CustomerList from "./components/Customer/CustomerList";
// import RoomList from "./components/Room/RoomList";
import BookingManagement from "./components/Booking/BookingManagement";
// import PaymentList from "./components/Payment/PaymentList";
// import ServiceList from "./components/Service/ServiceList";
// import InventoryList from "./components/Inventory/InventoryList";
import ProfileManagement from "./components/Profile/ProfileManagement";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Navigation />
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<HotelList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    {/* <Route path="/orders" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/hotel" element={<ProtectedRoute><HotelList /></ProtectedRoute>} />
                    <Route path="/add-hotel" element={<ProtectedRoute><AddHotel /></ProtectedRoute>} />
                    <Route path="/edit-hotel/:id" element={<ProtectedRoute><EditHotel /></ProtectedRoute>} />
                    <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
                    {/* Admin-Only Routes */}
                    <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
                    {/* <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} /> */}
                    <Route path="/booking-management" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
                    {/* <Route path="/payments" element={<ProtectedRoute><PaymentList /></ProtectedRoute>} /> */}
                    {/* <Route path="/services" element={<ProtectedRoute><ServiceList /></ProtectedRoute>} /> */}
                    {/* <Route path="/inventory" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} /> */}
                    {/* Profile Route */}
                    <Route path="/profile" element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;