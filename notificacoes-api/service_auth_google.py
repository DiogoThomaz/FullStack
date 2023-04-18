import requests
import urllib.parse
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

class Compromisso:
    def __init__(self, titulo_inicio, titulo_fim, data_inicio, data_fim, email):
        self.titulo_inicio = titulo_inicio
        self.titulo_fim = titulo_fim
        self.data_inicio = data_inicio
        self.data_fim = data_fim
        self.email = email

class Oauth2Google:
    def __init__(self):
        self.client_id = os.environ['CLIENT_ID']
        self.client_secret = os.environ['CLIENT_SECRET']
        self.redirect_uri = 'http://127.0.0.1:8000/google/redirect'
        self.scope = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email'
        self.token_uri = 'https://oauth2.googleapis.com/token'
        self.auth_uri = 'https://accounts.google.com/o/oauth2/v2/auth'
        self.api_key = os.environ['API_KEY']
    
    def get_authorization_url(self):
        assert self.client_id, "CLIENT_ID não foi definido"
        assert self.client_secret, "CLIENT_SECRET não foi definido"
        assert self.api_key, "API_KEY não foi definido"
        assert self.redirect_uri, "REDIRECT_URI não foi definido"
        assert urllib.parse.urlparse(self.redirect_uri).scheme in ['http', 'https'], "REDIRECT_URI deve ser uma URL válida"
        assert self.scope, "SCOPE não foi definido"

        response_type = 'code'
        url = self.auth_uri
        params = {
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'response_type': response_type,
            'scope': self.scope,
            'access_type': 'offline'
        }
        authorization_url = urllib.parse.urlencode(params, quote_via=urllib.parse.quote)
        authorization_url = f"{url}?{authorization_url}"
        return authorization_url

    def get_token(self, code: str):
        url = 'https://oauth2.googleapis.com/token'
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'redirect_uri': self.redirect_uri,
            'grant_type': 'authorization_code'
        }
        r = requests.post(url, data=data)
        return r.json()

    def refresh_token(self, refresh_token):
        url = 'https://oauth2.googleapis.com/token'
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token',
            'scope': 'https://www.googleapis.com/auth/calendar'
        }
        r = requests.post(url, data=data)
        return r.json()

    def revoke_token(self, token):
        url = 'https://oauth2.googleapis.com/revoke'
        params = {
            'token': token
        }
        r = requests.get(url, params=params)
        return r.status_code

    def get_user_info(self, access_token):
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        url = 'https://www.googleapis.com/oauth2/v2/userinfo?fields=email'
        r = requests.get(url, headers=headers)
        return r.json()
