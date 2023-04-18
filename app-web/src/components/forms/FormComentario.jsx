import React, {useState} from 'react'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button, Container, FormGroup, Grid, MenuItem, Paper, Select, Typography } from '@mui/material';
import { Assignment, AssignmentInd, CalendarMonth, Email } from '@mui/icons-material';

export default function FormComentario() {

    // pega o nome do colaborador do localStorage
    const firstName = JSON.parse(localStorage.getItem('usuario')).nome.split(' ')[0];
    
    // no envento onChange altera os valores do comment
    // salva os valores do comment no localStorage
    const [comment, setComment] = useState('')
    const handleCommentChange = (event) => {
        const newComment = event.target.value;
        setComment(newComment);
        localStorage.setItem('comentario_colaborador', newComment);
    };

    return (
        <Box mt={2}>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant="body2" gutterBottom>
                                {firstName}, você poderia nos dizer o motivo da sua solicitação?
                            </Typography>
                        </Grid>
                        <Grid item sm>
                            <TextField
                                label="Comente aqui. . . (opcional)"
                                name="comentario_colaborador"
                                autoComplete="family-name"
                                variant="filled"
                                type="text"
                                multiline
                                rows={5}
                                value={comment}
                                onChange={(e)=> handleCommentChange(e)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Container>
            
        </Box>
    );
}