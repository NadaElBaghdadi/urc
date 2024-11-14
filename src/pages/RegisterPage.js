import React, { useState } from 'react';
import { TextField, Button, Box, Typography,Link } from '@mui/material';
import { registerUser } from '../registerApi'; // Importation du service pour l'inscription
import { Link as RouterLink } from 'react-router-dom';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!username || !email || !password) {
      setError('Tous les champs doivent etre renseignés.');
      return;
    }

    registerUser({ username, email, password })
      .then(() => {
        setSuccess('Utilisateur enregistré avec succès.');
        setError('');
      })
      .catch((err) => {
        setError(err.message);
        setSuccess('');
      });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Inscription</Typography>
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
