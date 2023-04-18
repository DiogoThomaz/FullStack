import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
load_dotenv()


def enviar_mensagem_workplace_colaborador(data):     
    url = "https://graph.facebook.com/v4.0/me/messages"
    token= os.environ['TOKEN']
    headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
    }
    data = {
    "messaging_type": "UPDATE",
    "recipient": {
    "id": 100088997511309
    },
    "message": {
    "text": f"Olá {data['nome']}, sua solicitação de férias foi {data['status']} feita com sucesso!"
    }
    }
    
    ## Envia mensagem para o usuário
    try:
        r = requests.post(url, headers=headers, json=data)
        print(r.status_code)
        print(r.text)
    except:
        print("Erro ao enviar mensagem para o usuário")


def enviar_mensagem_workplace_gestor(data):     
    url = "https://graph.facebook.com/v4.0/me/messages"
    token=os.environ['TOKEN']
    headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
    }
    data = {
    "messaging_type": "UPDATE",
    "recipient": {
    "id": 100088997511309
    },
    "message": {
    "text": f"Olá {data['nome']}, o colaborador(a) {data['colaborador']} solicitou férias de {data['inicio']} até {data['fim']}. Acesse o sistema QUERO FERIAS para aprovar ou recusar a solicitação."
    }
    }
    
    ## Envia mensagem para o usuário
    try:
        r = requests.post(url, headers=headers, json=data)
        print(r.status_code)
        print(r.text)
    except:
        print("Erro ao enviar mensagem para o usuário")
