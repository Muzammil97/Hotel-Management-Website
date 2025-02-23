import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from '../../store/slices/authActions';

const ProfileManagement = () => {
    const { user, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [newRole, setNewRole] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'clients', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData.username || ''); // Or any other name field
                    setEmail(userData.email || '');
                    setContactInfo(userData.contactInfo || '');
                    setNewRole(userData.role || '');
                } else {
                    setError('User data not found');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userDocRef = doc(db, 'clients', user.uid);
            await updateDoc(userDocRef, {
                username: name,
                email: email,
                contactInfo: contactInfo,
                role: newRole,
            });

            // Dispatch the updateProfile action with only the serializable data
            dispatch(updateProfile({
                uid: user.uid,
                name: name,
                email: email,
                contactInfo: contactInfo,
                role: newRole,
            }));

            toast.success('Profile updated successfully!');
            setEditMode(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(`Error updating profile: ${err.message}`);
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Profile Management
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {/* <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!editMode}
                    /> */}
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={editMode}
                    />
                    {/* <TextField
                        margin="normal"
                        fullWidth
                        id="contactInfo"
                        label="Contact Info"
                        name="contactInfo"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        disabled={!editMode}
                    /> */}
                    {role === 'admin' && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                value={newRole}
                                label="Role"
                                onChange={(e) => setNewRole(e.target.value)}
                                disabled={!editMode}
                            >
                                <MenuItem value="client">Client</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    <Box sx={{ mt: 2 }}>
                        {editMode ? (
                            <>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 2 }}
                                >
                                    Save Changes
                                </Button>
                                <Button variant="outlined" onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={() => setEditMode(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfileManagement;