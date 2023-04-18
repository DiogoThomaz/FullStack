import requests
import os
from dotenv import load_dotenv
load_dotenv()

class Chat:
    def __init__(self, mensagem):
        self.mensagem = mensagem
        self.token = os.environ['TOKEN']
        self.url = "https://graph.facebook.com/v4.0/me/messages"
        self.headers = { 'Authorization': f'Bearer {self.token}','Content-Type': 'application/json'}
        self.data = { 
            "messaging_type": "UPDATE",
            "recipient": {"id": 100088997511309 },
            "message": { "text": f"{self.mensagem}" }
        }

    def enviar_mensagem(self):
        try:
            r = requests.post(self.url, headers=self.headers, json=self.data)
            print(r.status_code)
            print(r.text)
        except:
            print("Erro ao enviar mensagem para o usuário")


