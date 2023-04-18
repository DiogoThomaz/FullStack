import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button, Container, FormGroup, Grid, MenuItem, Paper, Select, Typography } from '@mui/material';
import { Assignment, AssignmentInd, Email } from '@mui/icons-material';


// TODO: Corrigir envio dos dados, useStates e eventos
export default function InputWithIcon() {

    const [nome, setNome] = useState('')
    const [matricula, setMatricula] = useState('')
    const [email, setEmail] = useState('')
    const [squad, setSquad] = useState('')
    
    // tipo contrato é um select com os valores CLT, PJ e Estagiário
    const [tipoContrato, setTipoContrato] = useState('')


    const [tipoUsuario, setTipoUsuario] = useState('')
    const [senha, setSenha] = useState('quero@2023#')

    const submit = () => {
        console.log(nome)
        console.log(matricula)
        console.log(email)
    }

    const handleContrato = (e) => {
        setTipoContrato(e.target.value)
        console.log(tipoContrato)
    }

    return (
        <Container>
        <Box mt={2}>
            <Paper>
                <Container>
                    <Grid container sm={12} spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant="h4" gutterBottom align='center' >Cadastro de Colaborador</Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Typography variant="subtitle1" gutterBottom>Dados Pessoais</Typography>
                        </Grid>
                        <Grid item sm>
                            <TextField
                                required
                                label="Nome Completo"
                                name="Nome"
                                autoComplete="family-name"
                                variant="standard"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                required
                                label="Matricula"
                                name="Matricula"
                                autoComplete="family-name"
                                variant="standard"
                                type="text"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AssignmentInd />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item sm>
                            <TextField
                                required
                                label="Email"
                                name="Email"
                                autoComplete="family-name"
                                variant="standard"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sm={12} spacing={1} mt={2}>
                        <Grid item sm={12}>
                            <Typography variant="subtitle1" >Dados de Acesso</Typography>
                        </Grid>
                        <Grid item sm>
                            <FormControl variant="standard" sx={{ width: "100%" }} value={tipoContrato} onChange={(e) => handleContrato(e.target.value)}>
                                <InputLabel id="demo-simple-select-standard-label" >tipo do contrato</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Tipo do Contrato"

                                >
                                    <MenuItem value="PJ">PJ</MenuItem>
                                    <MenuItem selected value="CLT">CLT</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm>
                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-standard-label" >tipo do usuário</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Tipo do Usuário"

                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="GESTOR">GESTOR</MenuItem>
                                    <MenuItem value="COLABORADOR">COLABORADOR</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm>
                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-standard-label" >nome da squad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Nome da squad"

                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="2">Automação</MenuItem>
                                    <MenuItem value="3">Mercantil</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sm={12} spacing={2} mt={2}>
                        <Grid item sm={12} mb={2}>
                            <Button variant="contained" color="primary" fullWidth onClick={(e) => submit(e)}>Cadastrar</Button>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </Box>
        </Container>
    );
}