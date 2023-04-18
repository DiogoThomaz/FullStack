from google.oauth2.credentials import Credentials
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build
from datetime import datetime, time, timedelta
import requests as request
import os
from dotenv import load_dotenv
load_dotenv()


class Usuario:
    def __init__(self, email: str, token: str):
        self.email = email
        self.token = token

    async def get_credentials(self):
        self.token = await Credentials.from_authorized_user_info(self.token)

class GoogleCalendar:
    def __init__(self, token: str, email: str):
        self.api_key = os.environ['API_KEY']
        self.token = token
        self.email = email

    def notificar_pessoa(self, summary: str, description: str, start_time: str, end_time: str):
        #         'https://www.googleapis.com/calendar/v3/calendars/diogommtdes%40gmail.com/events?sendNotifications=true&key=[YOUR_API_KEY]' \
        #   --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
        #   --header 'Content-Type: application/json' \
        #   --data '{"end":{"dateTime":"2023-04-07T10:00:00z"},"start":{"dateTime":"2023-04-07T06:00:00z"}}' \
        #   --compressed
        ## transforme email para url
        url = f"https://www.googleapis.com/calendar/v3/calendars/{self.email}/events?sendNotifications=true&key={self.api_key}"
        headers = {
            'Authorization': f"Bearer {self.token}",
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        data = {
            "summary": f"{summary}",
            "description": f"{description}",
            "end": {
                "dateTime": f"{end_time}",
                "timeZone": "America/Sao_Paulo"
            },
            "start": {
                "dateTime": f"{start_time}",
                "timeZone": "America/Sao_Paulo"
            },
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {
                        "method": "email",
                        "minutes": 24 * 60
                    },
                    {
                        "method": "popup",
                        "minutes": 10
                    }
                ]
            }
        }
        response = request.post(url, headers=headers, json=data)

        if response.status_code == 200:
            print(f"Evento criado com sucesso: {response.json()}")
        else:
            print(f"Erro {response.status_code}: {response.text}")
        
        return response
