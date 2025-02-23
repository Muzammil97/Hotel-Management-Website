// src/features/auth/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const signupUser = createAsyncThunk(
    'auth/signup',
    async ({ email, password, role, username }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore, based on role
            const collectionName = role === 'admin' ? 'admins' : 'clients';
            await setDoc(doc(db, collectionName, user.uid), {
                email: user.email,
                role: role,
                username: username
            });

            // Serialize data from User Object
            const serializedUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              username: username
              // Add other serializable properties you need
            };

            return serializedUser;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Determine the collection to search in based on userId (example logic)
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            const clientDoc = await getDoc(doc(db, 'clients', user.uid));

            if (adminDoc.exists()) {
              const adminData = adminDoc.data();
              const serializedUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                username: adminData.username // Get username from adminData
                // Add other serializable properties you need
              };
              return { user: serializedUser, role: adminData.role };
            } else if (clientDoc.exists()) {
              const clientData = clientDoc.data();
              const serializedUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                username: clientData.username // Get username from clientData
                // Add other serializable properties you need
              };
              return { user: serializedUser, role: clientData.role };
            } else {
                return rejectWithValue('User not found or invalid credentials.');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            return;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
      try {
        const { uid, name, email, contactInfo, password, role } = profileData;
  
        // Get a reference to the user document in Firestore based on their UID
        const userDocRef = doc(db, 'users', uid);
  
        // Update the fields in the Firestore document
        const updateData = {
          name,
          email,
          contactInfo,
        };
  
        if(role) {
          updateData.role = role
        }
        // Conditionally add the password field if it's provided.
        if (password) {
          updateData.password = password
        }
  
        await updateDoc(userDocRef, updateData);
  
        // Return updated profile data (exclude password for security reasons)
        return {
          uid,
          name,
          email,
          contactInfo,
          role,
        };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );