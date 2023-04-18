import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, handleClose, openSubmit, openCancel, titulo, texto, label}) {

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {texto}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={label}
            type="text"
            fullWidth
            variant="standard"
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={openSubmit}>Cancelar</Button>
          <Button onClick={openCancel}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
