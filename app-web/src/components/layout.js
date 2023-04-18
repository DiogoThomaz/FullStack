import styled from 'styled-components';
import { FaUser, FaSuitcase, FaClipboard } from "react-icons/fa";
import { RiDashboard3Line } from 'react-icons/ri';
import { BsPeople } from 'react-icons/bs';
import { HiUserAdd } from 'react-icons/hi';
import { MdFlightTakeoff, MdWork } from "react-icons/md";
import { IoMdNotificationsOutline} from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

const MainVerde = styled.main`
display: flex;
flex-direction: column;

justify-content: center;
background-color: #1E7443;
width: 100%;
height: 100vh;
text-family: 'Roboto', sans-serif;
color: #FFFFFF;
`;

const Main = styled.main`
display: flex;
flex-direction: column;
text-align: center;
`;

const Main2 = styled.main`
display: flex;
flex-direction: column;
text-align: center;
border-radius: 10px;
background-color: #F0F2F5;
height: 100vh;
font-family: 'Roboto', sans-serif;
`;

const Espaco = styled.div`
Display: flex;
padding: 1em;
justify-content: center;
`;

const Box = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 50%;
height: 50%;
`;

// TEXTO
const LetraDecorada = styled.span`
color: transparent;
-webkit-text-stroke-width: 1px;
-webkit-text-stroke-color: #FFFFFF;

`;

//   BOTÕES

const BotaoPreto = styled.button`
background-color: #282928;
color: #FFFFFF;
border: none;
border-radius: 5px;
padding: 1em;
margin: 1em;
width: 50%

&:hover {
    background-color: #282920;
    color: #FFFFFF;
    cursor: pointer;
}

`;

//   INPUTS

const InputPadrao = styled.input`
outline: none;
transition: 1s ease-in-out 0.5s;
background-color: rgba(217, 217, 217, 0.3);
padding: 1em;
border-top: 5px;
border-left: 5px;
border-right: 5px;
border-radius: 5px;
color: #FFFFFF;

&:focus {
  transition: 1s ease-in-out 0.5s;
  outilne: none;
    background-color: rgba(227, 233, 223, 0.2);
    border-radius: 5px 5px 0px 0px;
    border-width: 1px;
    border-bottom: 1px solid #FFFFFF;
    color: #282928;
    
}

&::placeholder {
  outilne: none;
    transition: 1s ease-in-out 0.5s;
    color: #282928;
    opacity: 0.9;
}`;

const InputPadrao2 = styled.input`
background-color: transparent;
border: 1px solid #282928;
border-top: none;
border-left: none;
border-right: none;
color: #282928;
border-radius: 0px;

&:focus {
    outline: none;
    border: 1px solid #282928;
    background-color: #E3E9DF;
    border-top: none;
    border-left: none;
    border-right: none;
    color: #282928;
    
}

&::placeholder {
    color: #282928;
    opacity: 0.8;
}

`;

// LISTAS

const ULVertical = styled.ul`
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: space-around;
`;

const ULHorizontal = styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 1em;
    width: 100%;
    align-items: center;
    justify-content: center;
    width: 500px;
`;

const ElementoLI = styled.li`

  margin: 0.1em;
  padding: 0.5em;
  list-style: none;
  align-items: center;
  width: 100%;

  &:hover {
    background-color: #E3E9DF;
    border-radius: 5px;
    cursor: pointer;
    }
`;



const IconLI = styled.a`
  
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1em;
`;

// DIVS

const DivSpaceAround = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
`;

//     SPAN

const SpanLI = styled.span`
    color: #282928 ;
    font-weight: bolder;
    font-size: 1em;
`;


//    ICONS

const PerfilIcon = styled(FaUser)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const FeriasIcon = styled(FaSuitcase)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const SolicitacoesIcon = styled(FaClipboard)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const DashboardIcon = styled(RiDashboard3Line)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const VerEquipeIcon = styled(BsPeople)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const AdicionarColaboradorIcon = styled(HiUserAdd)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const FeriasIcon2 = styled(MdFlightTakeoff)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const TrabalhoIcon = styled(MdWork)`
  color: #1E7443;
  width: 30px;
  height: 30px;
`;

const SettingsIcon = styled(IoSettingsOutline)`
  color: #FFFFFF;
  width: 30px;
  height: 30px;
  transition: 0.2s ease-in-out;
  &:hover {
    width: 35px;
    height: 35px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 0.3em;
  }

`;

const NotificacaoIcon = styled(IoMdNotificationsOutline)`
  color: #FFFFFF;
  width: 25px;
  height: 25px;
  transition: 0.2s ease-in-out;


`;

// efeitos



export {
    MainVerde,
    Main,
    Main2,
    Box,
    Espaco,
    LetraDecorada,
    BotaoPreto,
    InputPadrao,
    InputPadrao2,
    ULVertical,
    ULHorizontal,
    ElementoLI,
    IconLI,
    SpanLI,
    PerfilIcon,
    FeriasIcon,
    SolicitacoesIcon,
    DashboardIcon,
    VerEquipeIcon,
    AdicionarColaboradorIcon,
    SettingsIcon,
    FeriasIcon2,
    TrabalhoIcon,
    NotificacaoIcon,
    DivSpaceAround
}