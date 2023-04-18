import react, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@material-ui/core";
import MyLayout from "../../components/conteudo/MyLayout";
import axios from "axios";
import { Box, Container, Grid, Paper, Skeleton, Stack } from "@mui/material";
import FormDatas from "../../components/forms/FormDatas";
import FormComentario from "../../components/forms/FormComentario";
import { Send } from "@mui/icons-material";
import GoogleCalendarButton from "../../components/button/BotaoGoogle";

// Passo a passo do formulario de solicitação de férias
function HorizontalLinearStepper() {
  // pega dados do localstorage
  const nome = JSON.parse(localStorage.getItem("usuario")).nome;
  const dataInicio = localStorage.getItem("data_inicio");
  const dataFim = localStorage.getItem("data_fim");
  const comentarioColaborador = localStorage.getItem("comentario_colaborador");
  const email = localStorage.getItem("email");
  // formato de data: 2021-08-01T03:00:00.000Z
  const data_contratacao = JSON.parse(localStorage.getItem("usuario")).data_contratacao;
  // calcula tempo de trabalho
  const tempoDeTrabalho = new Date().getFullYear() - new Date(data_contratacao).getFullYear();

  // controle do passo a passo da solicitção
  const [activeStep, setActiveStep] = useState(0);
  const [contentFinalStep, setContenteFinalStep] = useState(0);
  const nextStep = () => {
    activeStep >= 3
      ? setActiveStep(2)
      : setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const previousStep = () => {
    activeStep <= 0
      ? setActiveStep(0)
      : setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Envia a solicitação de férias
  const handleSubmit = (e) => {
    e.preventDefault();
    // se data de contratacao for menos que 1 ano, nao pode solicitar ferias
    console.log(tempoDeTrabalho);
    if (tempoDeTrabalho < 1) {
      return alert("Você não pode solicitar férias, pois ainda não completou 1 ano de trabalho.");
    }
    if(localStorage.getItem("tipo_usuario") == "GESTOR" && JSON.parse(localStorage.getItem("usuario")).id_squad == null){
      var data = {
        id_colaborador: JSON.parse(localStorage.getItem("usuario")).id,
        comentario_colaborador: comentarioColaborador,
        comentario_gestor: "Solicitação de férias aprovada pelo gestor",
        ferias_inicio: dataInicio,
        ferias_fim: dataFim,
        decimo_terceiro: localStorage.getItem("decimo_terceiro") == true ? true : false,
        estado: "APROVADO",
      };
    }
    if(localStorage.getItem("tipo_usuario") == "COLABORADOR"){
      var data = {
        id_colaborador: JSON.parse(localStorage.getItem("usuario")).id,
        comentario_colaborador: comentarioColaborador,
        ferias_inicio: dataInicio,
        ferias_fim: dataFim,
        decimo_terceiro: localStorage.getItem("decimo_terceiro") == true ? true : false,
        estado: "PENDENTE",
    };}
    axios
      .post("http://localhost:3001/solicitacoes", data)
      .then((res) => {
        alert("Solicitação enviada com sucesso!");
        console.log(res.data);
        setActiveStep(3);
        setContenteFinalStep(1);
      })
      .catch((err) => {
        console.log(err);
        alert("Erro ao enviar solicitação");
        setActiveStep(3);
        setContenteFinalStep(2);
      });
  };

  // manipula renderização dos botões
  // se valores verdadeiros => hidden = true
  // se valores falsos => hidden = false
  const [visibilityNextButton, setVisibilityNextButton] = useState(false);
  const [visibilityPreviousButton, setVisibilityPreviousButton] =
    useState(true);

  useEffect(() => {
    if (activeStep === 0) {
      setVisibilityNextButton(false);
      setVisibilityPreviousButton(true);
    } else if (activeStep === 1) {
      setVisibilityNextButton(false);
      setVisibilityPreviousButton(false);
    } else if (activeStep === 2) {
      setVisibilityNextButton(true);
      setVisibilityPreviousButton(false);
    } else if (activeStep === 3) {
      setVisibilityNextButton(false);
      setVisibilityPreviousButton(false);
    }
  }, [activeStep]);

  return (
    <Box>
      <Container>
        <Paper>
          <Grid item>
            <Grid item sm={12} mt={2}>
              <Typography variant="h6" gutterBottom align="center">
                Solicitar férias
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <Stepper activeStep={activeStep}>
                <Step>
                  <StepLabel>Informar datas</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Comentarios</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Finalizar</StepLabel>
                </Step>
              </Stepper>
            </Grid>
            <Grid item sm={12}>
              {(activeStep === 0 && <FormDatas />) ||
                (activeStep === 1 && <FormComentario />) ||
                (activeStep === 2 && (
                  <Container>
                    <Typography variant="body2" gutterBottom align="center">
                      {nome}, você quer começar suas férias no dia {(new Date(dataInicio)).toLocaleDateString('pt-BR')},
                      e termina no dia {(new Date(dataFim)).toLocaleDateString('pt-BR')}.
                    </Typography>
                    <Typography variant="body2" gutterBottom align="center">
                      Você falou para seu gestor que os motivos da sua
                      solicitação é/são {comentarioColaborador}.
                    </Typography>
                    <Typography variant="body2" gutterBottom align="center">
                      Deseja enviar a sua solicitação?
                    </Typography>
                  </Container>
                )) ||
                (activeStep === 3 && (
                  <>
                    {(contentFinalStep === 0 && (
                      <Skeleton
                        variant="rectangular"
                        width={210}
                        height={118}
                      />
                    )) ||
                      (contentFinalStep === 1 && (
                        <Box>
                          <Typography variant="body2" gutterBottom align="center">
                            Solicitação enviada com sucesso!
                          </Typography>
                          <Typography variant="body2" gutterBottom align="center">
                            Em alguns dias seu gestor irá responder a sua
                            solicitação.
                          </Typography>
                          <Typography variant="body2" gutterBottom align="center">
                            Os detalhes da solicitação chegaram embreve no seu
                            email {email}.
                          </Typography>
                        </Box>
                      )) ||
                      (contentFinalStep === 2 && (
                        <Box>
                          <Typography variant="body2" gutterBottom align="center">
                            Erro ao enviar solicitação!
                          </Typography>
                          <Typography variant="body2" gutterBottom align="center">
                            Tente novamente mais tarde.
                          </Typography>
                        </Box>
                      ))}
                  </>
                ))}
            </Grid>
            <Stack spacing={2} direction="row" mt={3} mb={3} justifyContent="space-evenly" paddingBottom={2}>
              <Button hidden={visibilityPreviousButton} mt={3} mb={3} align="left" variant="contained" onClick={() => previousStep()}>
                  Voltar
              </Button>
              
                {activeStep === 2 ? (
                  <Button
                    mt={3} mb={3} align="right"
                    variant="contained"
                    onClick={(e) => handleSubmit(e)}
                    startIcon={<Send />}
                  >
                    Enviar
                  </Button>
                ) : (
                  <Button mt={3} mb={3} align="right" variant="contained" onClick={() => nextStep()}>
                    {activeStep === 2 ? "Finalizar" : "Próximo"}
                  </Button>
                )}
              </Stack>
          </Grid>
        </Paper>
        <GoogleCalendarButton />
      </Container>
    </Box>
  );
}

// pagina que contem o formulario
const SolicitarFerias = (props) => {
  return (
    <MyLayout
      hasSideBar={true}
      hasRightBar={true}
      children={<Container><HorizontalLinearStepper /></Container>}
    />
  );
};

export default SolicitarFerias;
