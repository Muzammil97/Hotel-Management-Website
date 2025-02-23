import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  loginUser, signupUser }from '../../store/slices/authActions';
import { clearError }from '../../store/slices/authSlice';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    styled
} from '@mui/material';
import AuthForm from './AuthForm';

// Styled Components
const SignupGrid = styled(Grid)(({ theme }) => ({
    height: '100vh',
}));

const ImageGridItem = styled(Grid)(({ theme }) => ({
    backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/014/003/259/non_2x/businessman-stands-at-the-door-of-many-opportunities-to-make-choices-the-idea-of-having-to-decide-the-path-of-a-company-to-grow-vector.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
}));

const FormGridItem = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',  // Translucent white background
    backdropFilter: 'blur(5px)',  // Add a blur effect
}));

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client'); // Default role
    const [username, setUsername] = useState(''); // username State
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6; // Minimum 6 characters
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!username) {
            setUsernameError('Username is required');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (isValid) {
            dispatch(signupUser({ email, password, role, username }))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        toast.success('Signed up successfully!');
                        navigate('/dashboard');
                    } else if (result.meta.requestStatus === 'rejected') {
                        toast.error(result.payload);
                    }
                });
        } else {
            toast.error('Please correct the errors in the form');
        }
    };

    return (
        <SignupGrid container component="main">
            <ImageGridItem
                item
                xs={false}
                sm={4}
                md={7}
            />
            <FormGridItem item xs={12} sm={8} md={5}>
                <StyledPaper elevation={6}>
                    <Typography component="h1" variant="h5" align="center">
                        Sign Up
                    </Typography>
                    <AuthForm
                        isSignup={true}
                        username={username}
                        setUsername={setUsername}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        role={role}
                        setRole={setRole}
                        loading={loading}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                        usernameError={usernameError}
                        setUsernameError={setUsernameError}
                        handleSubmit={handleSubmit}
                        isLoading={loading}
                    />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/login" variant="body2">
                            {'Already have an account? Login'}
                        </Link>
                    </Box>
                </StyledPaper>
            </FormGridItem>
        </SignupGrid>
    );
};

export default Signup;