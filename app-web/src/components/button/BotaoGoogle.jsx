import { Box, Button, Paper, Typography } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

function GoogleCalendarButton() {

  const handleClick = () => {
    window.open("http://localhost:8000/login/diogommtdes@gmail.com", "_blank")
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" component="h4" gutterBottom>
          Autorizar acesso ao Google Calendário
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Para que possamos sincronizar as férias com o seu calendário do Google, é necessário que você autorize o acesso.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaGoogle />}
          onClick={handleClick}
          size="small"
          
        >
          Calendário Google
        </Button>
      </Box>
    </Paper>
  );
}

export default GoogleCalendarButton;
