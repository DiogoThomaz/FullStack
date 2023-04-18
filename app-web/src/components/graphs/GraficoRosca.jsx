import React from "react";
import Chart from "react-apexcharts";
import { Box, Paper, Container, Typography } from "@mui/material";
import axios from "axios";

const GraficoRosca = () => {
  // requisição para pegar os dados do gráfico
  const [trabalhando, setTrabalhando] = React.useState(0);
  const [ferias, setFerias] = React.useState(0);

  React.useEffect(() => {
    const idGestor = JSON.parse(localStorage.getItem('usuario')).id;
    axios.get(`http://localhost:3001/solicitacoes/relatorio-ferias-d1/${idGestor}`)
      .then(response => {
        setTrabalhando(response.data.trabalhando);
        setFerias(response.data.ferias)
      })
      .catch(err => {
        console.log(err)
        alert("Não foi possível carregar o dashboard, tente novamente mais tarde!")
      })
  }, []);


  const chartData = {
    options: {
      dataLabels: {
        formatter: function (val) {
          return `${ val.toFixed(2) }%`;
        },
      },
      colors: ['#64AF58', '#96D866'],
      labels: ["Em trabalho", "De férias"],
      legend: {
        position: "bottom",
        show: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    series: [trabalhando, ferias],
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Paper sx={{ height: "100%", marginTop: "auto", marginBottom: "auto" }}>
        <Container sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom align="center">
            Squad em atividade
          </Typography>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={350}
          />
        </Container>
      </Paper>
    </Box >
  );
};

export default GraficoRosca;
