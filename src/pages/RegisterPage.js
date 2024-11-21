import React, { useState } from 'react';
import { TextField, Button, Box, Typography,Link } from '@mui/material';
import { registerUser } from '../user/registerApi'; 
import { Link as RouterLink } from 'react-router-dom';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



    const handleError = (error) => {
      setError(error.message || 'Une erreur est survenue');
      setSuccess('');
  };
  
  const handleSuccess = (session) => {
      setSuccess('Vous vous êtes enregistré avec succès.');
      setError('');
  };
  
  const handleSubmit = (event) => {
      event.preventDefault();
  
      if (!username || !email || !password) {
          setError('Tous les champs doivent être renseignés.');
          return;
      }
  
      const user = {
          username: username,
          email: email,
          password: password,
      };
  
      registerUser(user, handleSuccess, handleError);
  };
  
  

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align='center'>Inscription</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom d'utilisateur"
          name="username"
          fullWidth
          margin="normal"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
            S&apos;inscrire
        </Button>
      </form>

      {success && (
        <Typography variant="body1" color="primary" align="center" sx={{ marginTop: 2 }}>
          {success}
        </Typography>
      )}

      {error && (
        <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 2 }}>
        <Link component={RouterLink} to="/">
          Connectez-vous
        </Link>
      </Typography>
    </Box>
  );
}

export default RegisterPage;
