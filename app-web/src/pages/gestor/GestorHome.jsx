import React from "react";
import { styled } from '@mui/material/styles';
import { Container, Grid, Paper, Stack } from '@mui/material';
import { Dashboard, Group, Person, BeachAccess, PersonAdd, Assignment, StackedBarChart, SquareRounded } from '@mui/icons-material';
import MeuCard from "../../components/conteudo/MeuCard";
import { Typography } from "@mui/material";
import MyLayout from "../../components/conteudo/MyLayout";

import squad from '../../assets/squad.png';
import addcolaborador from '../../assets/addcolaborador.png';
import dashboard from '../../assets/dashboard.png';
import ferias from '../../assets/ferias.png';
import perfil from '../../assets/perfil.png';
import solicitacoes from '../../assets/solicitacoes.png';

const Main = styled('main')({
    flexGrow: 1,
});

const WelcomeSection = ({ squadName, numRequests, numMembers }) => {
    return (
        <>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">Bem-vindo(a), { (JSON.parse(localStorage.usuario).nome)  }!</Typography>
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

export default function GestorHome() {
    return (
        <MyLayout 
            children={
                <Container>
                <Grid container spacing={4} item xs={12}>
                    <WelcomeSection name="Gestor" />
                    
                    <Grid item xs={12}>
                   
                        <Grid container spacing={1}>
                            
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <MeuCard imagem={perfil} titulo="Perfil" descricao="Altere os dados do seu perfil, como nome, email e senha" link="/gestor/editar-perfil"/>

                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <MeuCard imagem={ferias} titulo="Pedir férias" descricao="Clique em ver mais para acessar o formulário de solicitação"  link="/gestor/solicitar-ferias" />

                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <MeuCard imagem={solicitacoes} titulo="Solicitações da Squad" descricao="Veja as solicitações que os colaboradores da sua squad fizeram." link="/gestor/solicitacoes-squad" />

                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <MeuCard imagem={dashboard} titulo="Dashboard" descricao="Tenha insights sobre as férias da sua squad" link="/gestor/dashboard" />

                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <MeuCard imagem={addcolaborador} titulo="Adicionar colaborador" descricao="Cadastre um colaborador a sua squad, para que ele possa acessar o sistema" link="/gestor/novo-colaborador" />

                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <MeuCard imagem={squad} titulo="Squad" descricao="Veja todos os colaboradores da sua squad, edite ou altere os dados," link="/gestor/ver-equipe" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            }
            hasRightBar={true}
            hasSideBar={true}
        />
    );
}
