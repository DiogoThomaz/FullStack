import React from "react";
import { Box, Container, Grid, Paper, ThemeProvider, Typography } from "@mui/material";
import DashboardTable from "../../components/graphs/DashboardTable";
import GraficoRosca from "../../components/graphs/GraficoRosca";
import MyLayout from "../../components/conteudo/MyLayout";
import GraficoBarras from "../../components/graphs/GraficoBarras";

import GraficoDeArea from "../../components/graphs/GraficoDeLinhas";
import theme  from "../../components/theme/theme";
import Progresso from "../../components/progresso/Progresso";

const Graficos = () => {

  return (
    <ThemeProvider theme={theme}>
            <Container>
              <Grid container sm={12} spacing={1} mb={1}>
                <Grid item sm={10}>
                  <Box sx={{ height: "100%" }}>
                    <Paper sx={{ height: "100%" }}>
                      <Container sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" align="center" p={1}>
                          Dashboard da squad Automação
                        </Typography>
                      </Container>
                    </Paper>
                  </Box>
                </Grid>
                <Grid item sm>
                  <Progresso/>
                </Grid>
                <Grid item sm={3}>
                  <GraficoRosca />
                </Grid>
                <Grid item sm>
                  <GraficoDeArea />
                </Grid>
              </Grid>
              <Grid container sm={12} spacing={1}>
                <Grid item sm={3} >
                  <GraficoBarras />
                </Grid>
                <Grid item sm>
                  <DashboardTable/>
                </Grid>
              </Grid>
            </Container>
          </ThemeProvider>
  )
}

const Dashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <MyLayout
        hasSideBar={true}
        hasRightBar={false}
        children={
          <Graficos />
        }
    />
    </ThemeProvider>
  );
};

export default Dashboard;
