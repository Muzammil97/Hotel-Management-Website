import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  clearError } from '../../store/slices/authSlice'; // changed path
import { loginUser} from '../../store/slices/authActions'; // changed path

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    styled
} from '@mui/material';
import AuthForm from './AuthForm';

// Styled Components
const LoginGrid = styled(Grid)(({ theme }) => ({
    height: '100vh',
}));

const ImageGridItem = styled(Grid)(({ theme }) => ({
    backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/028/241/446/large_2x/screen-technology-background-use-the-login-to-access-the-system-it-is-a-illustration-designed-to-look-modern-and-hi-tech-suitable-for-work-related-to-technology-vector.jpg)',
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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

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

        if (isValid) {
            dispatch(loginUser({ email, password }))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled') {
                        toast.success('Logged in successfully!');
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
        <LoginGrid container component="main">
            <ImageGridItem
                item
                xs={false}
                sm={4}
                md={7}
            />
            <FormGridItem item xs={12} sm={8} md={5}>
                <StyledPaper elevation={6}>
                    <Typography component="h1" variant="h5" align="center">
                        Login
                    </Typography>
                    <AuthForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                        handleSubmit={handleSubmit}
                        isLoading={loading}
                    />
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </StyledPaper>
            </FormGridItem>
        </LoginGrid>
    );
};

export default Login;