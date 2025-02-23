import React from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

const AuthForm = ({
  isSignup,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  emailError,
  setEmailError,
  passwordError,
  setPasswordError,
  usernameError,
  setUsernameError,
  handleSubmit,
  isLoading,
}) => {
  return (
    <form noValidate onSubmit={handleSubmit}>
      {isSignup && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!usernameError}
          helperText={usernameError}
        />
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
      />
      {isSignup && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
      </Button>
    </form>
  );
};

export default AuthForm;