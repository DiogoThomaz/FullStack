import React from "react";
import { styled } from '@mui/material/styles';
import { Container, Grid, Paper, Stack } from '@mui/material';
import { Dashboard, Group, Person, BeachAccess, PersonAdd, Assignment, StackedBarChart, SquareRounded } from '@mui/icons-material';
import MeuCard from "../../components/conteudo/MeuCard";
import { Typography } from "@mui/material";
import MyLayout from "../../components/conteudo/MyLayout";
import { Link } from 'react-router-dom';
import squad from '../../assets/squad.png';
import addcolaborador from '../../assets/addcolaborador.png';
import dashboard from '../../assets/dashboard.png';
import ferias from '../../assets/ferias.png';
import perfil from '../../assets/perfil.png';


const WelcomeSection = ({ squadName, numRequests, numMembers }) => {
  return (
      <>
          <Grid item xs={12}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" component="h4" gutterBottom>Bem-vindo(a), {JSON.parse(localStorage.getItem("usuario")).nome}!</Typography>
{/*                     
                  <Grid container spacing={1}>
                      <Grid item xs={12}  md={6} lg={4}>
                          <DashboardCard title="Total de colaboradores" value="4"/>
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                          <DashboardCard title="Solicitações não respondidas" value="1" />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                          <DashboardCard title="Squad" value="Automação" />
                      </Grid>
                  </Grid> */}
              </Paper>
          </Grid>
      </>
  );
};


const ItensMenu = () => {
    return (
      //   <ULVertical>
      //   <ElementoLI>
      //     <Link to="/colaborador/editar-perfil" style={{ textDecoration: "none" }}>
      //     <SpanLI>
      //       <IconLI>
      //         <PerfilIcon />
      //       </IconLI>
      //       Perfil
      //     </SpanLI>
      //     </Link>
      //   </ElementoLI>
      //   <ElementoLI>
      //     <Link to="/colaborador/solicitar-ferias" style={{ textDecoration: "none" }}>
      //     <SpanLI>
      //       <IconLI>
      //         <FeriasIcon />
      //       </IconLI>
      //       Minhas Férias
      //     </SpanLI>
      //     </Link>
      //   </ElementoLI>
      //   <ElementoLI>
      //     <Link to="/colaborador/solicitacoes" style={{ textDecoration: "none" }}>
      //     <SpanLI>
      //       <IconLI>
      //         <SolicitacoesIcon />
      //       </IconLI>
      //       Solicitações
      //     </SpanLI>
      //     </Link>
      //   </ElementoLI>
      // </ULVertical>
      <Container>
  <Grid container spacing={4} item xs={12}>
    <WelcomeSection name="Gestor" />

    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Grid item xs={12}>
            <MeuCard
              imagem={perfil}
              titulo="Perfil"
              descricao="Altere os dados do seu perfil, como nome, email e senha"
              link="/colaborador/editar-perfil"
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Grid item xs={12}>
            <MeuCard
              imagem={ferias}
              titulo="Pedir férias"
              descricao="Clique em ver mais para acessar o formulário de solicitação"
              link="/colaborador/solicitar-ferias"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Container>

    );
};

export default function ColaboradorHome() {
    return (
      <MyLayout 
      children={
        <ItensMenu />
      }
      hasRightBar={true}
      hasSideBar={true}
      />
    );
}