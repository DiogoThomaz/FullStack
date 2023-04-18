import { Box, Container, Paper, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import Chart from "react-apexcharts";
import theme from "../theme/theme";
import axios from "axios";

// const data = [
//     {
//         name: "Março",
//         saindo: 2,
//         voltando: 1,
//         diff: 1,
//     },
//     {
//         name: "Abril",
//         saindo: 1,
//         voltando: 1,
//         diff: 0,
//     },
//     {
//         name: "Maio",
//         saindo: 3,
//         voltando: 1,
//         diff: 2,
//     },
//     {
//         name: "Junho",
//         saindo: 2,
//         voltando: 1,
//         diff: 1,
//     },
//     {
//         name: "Julho",
//         saindo: 1,
//         voltando: 1,
//         diff: 0,
//     },
//     {
//         name: "Agosto",
//         saindo: 1,
//         voltando: 1,
//         diff: 0,
//     },
// ];

// requsição para pegar os dados do banco de dados


const GraficoDeArea = () => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const idGestor = JSON.parse(localStorage.getItem("usuario")).id;
        axios
            .get(`http://localhost:3001/solicitacoes/relatorio-ferias-d2/${idGestor}`)
            .then((response) => {
                console.log(response.data);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const options = {
        chart: {
            type: "area",
        },
        series: [
            {
                name: "Saindo",
                data: data.map((item) => item.saindo),
            },
            {
                name: "Voltando",
                data: data.map((item) => item.voltando),
            },
            {
                name: "Diff",
                data: data.map((item) => item.diff),
            },
        ],
        xaxis: {
            categories: data.map((item) => item.name),
        },
    };
    

    return (
        <ThemeProvider theme={theme}>
        <Box>
            <Paper>
                <Container>
                    <Typography variant="h6" gutterBottom align='center'>
                        Fluxo de colaboradores
                    </Typography>
                    <Chart options={options} series={options.series} type="area" height={350} />
                </Container>
            </Paper>
        </Box>
        </ThemeProvider>
    );
};

export default GraficoDeArea;
