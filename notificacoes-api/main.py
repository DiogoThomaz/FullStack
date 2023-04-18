from pydantic import BaseModel
from googleapiclient.discovery import build
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build

from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()

## import arquivo main.py, e chama a função enviar_email
from index import enviar_email_colaborador, enviar_email_gestor
from workplace import enviar_mensagem_workplace_colaborador, enviar_mensagem_workplace_gestor
from relatorioService import gerar_relatorio
import service_gmail
import service_workplace
from service_auth_google import Oauth2Google
from service_cache import CacheMananger
from service_agenda import GoogleCalendar, Usuario


## Modelo de dados para o body da requisição
class Email(BaseModel):
    address: str
    subject: str
    message: str

## data.solicitacao, data.email, data.nome, data.inicio, data.fim, data.comentario, data.status
class EmailColaborador(BaseModel):
    solicitacao: str
    email: str
    nome: str
    inicio: str
    fim: str
    comentario: str
    status: str
## data.solicitacao, data.email, data.nome, data.fim, data.comentario, data.status, data.colaborador
class EmailGestor(BaseModel):
    solicitacao: str
    email: str
    nome: str
    inicio: str
    fim: str
    comentario: str
    status: str
    colaborador: str

class Relatorio(BaseModel):
    data: dict
    nome: str
    email: str

class EmailSenderDto(BaseModel):
    mensagem: str
    destinatario: str
    assunto: str
    anexo: str

class WorkplaceSenderDto(BaseModel):
    mensagem: str

class EmailDto(BaseModel):
    email: dict

class Evento(BaseModel):
    email: str 
    summary: str
    description: str
    start_time: str
    end_time: str

app = FastAPI()
cache_mananger = CacheMananger()
auth = Oauth2Google()

# Define as origens permitidas (permitirá qualquer origem por padrão)
origins = ["http://localhost", "http://localhost:8080", "http://localhost:3000"]

# Adiciona o middleware CORS à aplicação
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/email/notificar-colaborador")
async def send_email(email: EmailColaborador):
    print(email)
    try:
        enviar_email_colaborador(dict(email))                            ## Serviço de email
        print('Email enviado')
        enviar_mensagem_workplace_colaborador(dict(email))               ## Serviço de notificação do Workplace
        print('Mensagem enviada')
        return {"message": "Usuário notificado com sucesso"}
    except:
        return {"message": "Erro ao enviar email"}


## controlador para a rota /email/responder-solicitacao
@app.post("/email/notificar-gestor")
async def send_email(email: EmailGestor):
    print(email)
    try:
        enviar_email_gestor(dict(email))                       ## Serviço de email
        enviar_mensagem_workplace_gestor(dict(email))          ## Serviço de notificação do Workplace
        return {"message": "Usuário notificado com sucesso"}
    except:
        return {"message": "Erro ao enviar email"}


@app.post("/email/relatorio")
async def send_relatorio(relatorio: Relatorio):
    try:
        gerar_relatorio(relatorio.data, relatorio.email, relatorio.nome)
        return {"message": "Usuário notificado com sucesso" }
    except:
        return {"message": "Não foi possível enviar o relatório"}


@app.post("/email/enviar")
async def send_default_email(email: EmailSenderDto):
    try:
        service_gmail.Email(email.mensagem, email.destinatario, email.assunto, email.anexo).enviar_email()
        return {"message": "Email enviado com sucesso"}
    except:
        return {"message": "Não foi possível enviar o email"}


@app.post("/workplace/enviar")
async def send_default_workplace(workplace: WorkplaceSenderDto):
    try:
        service_workplace.Chat(workplace.mensagem).enviar_mensagem()
        return {"message": "Mensagem enviada com sucesso"}
    except:
        return {"message": "Não foi possível enviar a mensagem"}


@app.get('/login/{email}')
async def get_email(email: str, request: Request, response: Response):
    cache_mananger.add_to_cache(email, '')
    redirect_url = 'http://localhost:8000/google/auth'
    return RedirectResponse(redirect_url)

@app.get('/google/auth')
async def login(request: Request):
    try:    
        auth_url = auth.get_authorization_url()
        return RedirectResponse(auth_url)
    except:
        return {"message": "Erro ao autenticar"}

@app.get('/google/redirect')
async def google_redirect(request: Request, code: str):
    try:    
        token = auth.get_token(code)
        access_token = token['access_token']
        info = dict(auth.get_user_info(access_token))['email']
        cache_mananger.add_to_cache(info, access_token)
        return {"access_token": access_token, "email": f"{info}"}
    except HttpError as e:
        return {"message": f"{e}"}

@app.post('/google/calendar/event')
async def create_event(event: Evento):
    try:
        token = cache_mananger.get_token(f"{event.email}")
        if token is None:
            return {"message": "Access token not found. Please authenticate with Google.", "token": f"{token}"}, 401
        credentials = Credentials.from_authorized_user_info({
            'access_token': token, 
            'refresh_token': auth.refresh_token(event.email),
            'client_secret': auth.client_secret,
            'client_id': auth.client_id,
            'scopes': ['https://www.googleapis.com/auth/calendar']
        })
        if credentials.expired:
            try:
                credentials.refresh(Request())
                cache_mananger.add_to_cache(event.email, credentials.token)
            except Exception as e:
                return {"message": "Failed to refresh access token. Please authenticate with Google again.", "error": f"{e}"}, 401
        calendar = GoogleCalendar(credentials)
        event_id = calendar.create_event(event.summary, event.description, event.start_time, event.end_time)
        return {"message": f"Event created with ID: {event_id}"}
    except HttpError as e:
        return {"message": f"{e}"}

@app.post('/google/calendar/notificar/')
def notificar_pessoa(evento: Evento):
    try:  
        access_token = cache_mananger.get_token(f"{evento.email}")
        calendario = GoogleCalendar(access_token, evento.email)
        evento = calendario.notificar_pessoa(evento.summary, evento.description, evento.start_time, evento.end_time)
        return {"message": f"{evento}", "token": f"{access_token}"}
    except HttpError as e:
        return {"message": f"{e}"}


@app.get('/cache')
async def get_cache():
    try:
        my_token = cache_mananger.get_token('diogommtdes@gmail.com')
        return { 'token': f"{my_token}"}
    except:
        return {'message': 'não foi possível acessar o token'}

