// imports
import React from 'react';
import { TextField } from '@mui/material';
import { Container } from '@mui/material';
import { Button } from '@mui/material';

// componente de login
const Login = () => {
  return (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField variant="outlined"  label="Username" margin='normal'/>
        <TextField variant="outlined"  label="Password" />
        <Button color='primary' variant="contained" margin='normal' >
          ENTRAR
        </Button>
      </Container>
  );
};

export default Login;
