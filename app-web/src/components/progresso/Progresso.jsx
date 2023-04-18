import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

export default function Progresso() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleSubmitRelatorio = () => {
    setSuccess(false);
    setLoading(true);
    const idGestor = JSON.parse(localStorage.getItem("usuario")).id
    axios.get(`http://localhost:3001/solicitacoes/relatorio/${idGestor}`)
      .then(res => {
        setSuccess(true);
        setLoading(false);
        alert("Relatório enviado para o seu email")
      })
      .catch(err => {
        setSuccess(false);
        setLoading(false);
        alert(err)
      })
  }

  return (
      <Box sx={{position: 'relative' }}>
        <Button
          variant="contained"
          sx={buttonSx}
          disabled={loading}
          startIcon={<SaveIcon/>}
          fullWidth
          onClick={handleSubmitRelatorio}
        >
          salvar
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
  );
}
