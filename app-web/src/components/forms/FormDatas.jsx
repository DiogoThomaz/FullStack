import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';


export default function FormDatas() {
    const [dataInicio, setDataInicio] = useState(new Date().toISOString().substr(0, 10));
    const [dias, setDias] = useState(5);
    const [dataFim, setDataFim] = useState('');
    const [decimoTerceiro, setDecimoTerceiro] = useState(false);

    const tipoUsuario = JSON.parse(localStorage.getItem('usuario')).tipo_contrato;

    useEffect(() => {
        const inicio = new Date(dataInicio);
        const fim = new Date(inicio.getTime() + (dias - 1) * 24 * 60 * 60 * 1000);
        const newFim = fim.toISOString().substr(0, 10);

        setDataFim(newFim);

        localStorage.setItem('data_inicio', dataInicio);
        localStorage.setItem('data_fim', newFim);
        localStorage.setItem('decimo_terceiro', decimoTerceiro);

    }, [dataInicio, dias, decimoTerceiro]);
    

    const handleDataInicioChange = (event) => {
        const date = event.target.value;
        setDataInicio(date);
    };

    const handleDiasChange = (event) => {
        const newDias = event.target.value;
        setDias(newDias);
    };

    const handleDecimoTerceiroChange = (event) => {
        const newDecimoTerceiro = event.target.value;
        setDecimoTerceiro(newDecimoTerceiro);
    };

    return (
        <Box mt={2}>
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body2" gutterBottom>
                            Informe as datas que deseja tirar férias
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} p={2}>
                        <FormControl sx={{ minWidth: "100%" }} size="small">
                            <InputLabel id="demo-select-small"></InputLabel>
                            <TextField
                                select
                                required
                                id="demo-select-small"
                                label="Duração das férias"
                                value={dias}
                                onChange={handleDiasChange}
                                fullWidth
                            >
                                <MenuItem value={5}>5 dias</MenuItem>
                                <MenuItem value={10}>10 dias</MenuItem>
                                <MenuItem value={15}>15 dias</MenuItem>
                                <MenuItem value={20}>20 dias</MenuItem>
                                <MenuItem value={30}>30 dias</MenuItem>
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            label="Início das férias"
                            name="data_inicio"
                            variant="standard"
                            type="date"
                            value={dataInicio}
                            onChange={handleDataInicioChange}
                            fullWidth
                           
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            label="Término das férias"
                            name="data_fim"
                            variant="standard"
                            type="date"
                            value={dataFim}
                            fullWidth    
                        />
                    </Grid>
                    {tipoUsuario === 'CLT' && (
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ minWidth: "100%" }} size="small">
                                <InputLabel id="demo-select-small">Décimo Terceiro</InputLabel>
                                <Select
                                    select
                                    id="demo-select-small"
                                    labelId='demo-select-small'
                                    label="Deseja receber o décimo terceiro?"
                                    value={decimoTerceiro}
                                    onChange={handleDecimoTerceiroChange}
                                    fullWidth
                                >
                                    <MenuItem value={true}>Sim</MenuItem>
                                    <MenuItem value={false}>Não</MenuItem>
                                </Select>
                            </FormControl>
                            </Grid>
                        )}
                </Grid>
            </Container>
        </Box>
    );
}
