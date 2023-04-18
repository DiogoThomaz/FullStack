### SERVIÇO PARA ENVIAR RELATÓRIO POR CSV
## descrição: serviço para enviar relatório por csv
## 1. recebe o email do gestor
## 2. recebe os dados dos 4 dashboards
## 3. cria um arquivo csv
## 4. salva em memória (buffer)
## 5. envia o arquivo csv por email

import pandas as pd
import matplotlib.pyplot as plt
import smtplib
import os
import io
import email.message
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from email.mime.text import MIMEText
import string

load_dotenv()

def gerar_relatorio(data, send_to, nome):
    """Gera relatório com dados enviados

    Args:
        data (dictionary): dados dos dashboards.
            ## mock de dados
data = {
    "dashboard1": {
        "trabalhando": 5,
        "ferias": 1
    },
    "dashboard2": [
    {
        "name": "Março",
        "saindo": 0,
        "voltando": 1,
        "diff": -1
    },
    {
        "name": "Abril",
        "saindo": 1,
        "voltando": 0,
        "diff": 1
    },
    {
        "name": "Maio",
        "saindo": 0,
        "voltando": 0,
        "diff": 0
    },
    {
        "name": "Junho",
        "saindo": 0,
        "voltando": 0,
        "diff": 0
    },
    {
        "name": "Julho",
        "saindo": 0,
        "voltando": 0,
        "diff": 0
    },
    {
        "name": "Agosto",
        "saindo": 0,
        "voltando": 2,
        "diff": -2
    }
],
    "dashboard3": [
    {
        "name": "Março",
        "qtd": 0,
        "nomes": [],
        "dia": []
    },
    {
        "name": "Abril",
        "qtd": 1,
        "nomes": [
            "Maria Agusta"
        ],
        "dia": [
            "8/3/2023"
        ]
    },
    {
        "name": "Maio",
        "qtd": 1,
        "nomes": [
            "Jader Rodrigues"
        ],
        "dia": [
            "8/4/2023"
        ]
    },
    {
        "name": "Junho",
        "qtd": 1,
        "nomes": [
            "Rosana Souza "
        ],
        "dia": [
            "8/5/2023"
        ]
    },
    {
        "name": "Julho",
        "qtd": 0,
        "nomes": [],
        "dia": []
    },
    {
        "name": "Agosto",
        "qtd": 0,
        "nomes": [],
        "dia": []
    }
],
    "dashboard4": [
    {
        "comentario_colaborador": '',
        "comentario_gestor": "ok",
        "data": "8/3/2023",
        "status": "Saindo",
        "nome": "Maria Agusta",
        "feriasAprovadaEm": "30/3/2023",
        "verSolicitacao": "olho"
    },
    {
        "comentario_colaborador": '',
        "comentario_gestor": "ok",
        "data": "8/4/2023",
        "status": "Voltando",
        "nome": "Maria Agusta",
        "feriasAprovadaEm": "30/3/2023",
        "verSolicitacao": "olho"
    },
    {
        "comentario_colaborador": '',
        "comentario_gestor": "ook",
        "data": "8/4/2023",
        "status": "Saindo",
        "nome": "Jader Rodrigues",
        "feriasAprovadaEm": "30/3/2023",
        "verSolicitacao": "olho"
    },
    {
        "comentario_colaborador": '',
        "comentario_gestor": "não pode!",
        "data": "8/5/2023",
        "status": "Saindo",
        "nome": "Rosana Souza ",
        "feriasAprovadaEm": "30/3/2023",
        "verSolicitacao": "olho"
    },
    {
        "comentario_colaborador": '',
        "comentario_gestor": "ook",
        "data": "8/5/2023",
        "status": "Voltando",
        "nome": "Jader Rodrigues",
        "feriasAprovadaEm": "30/3/2023",
        "verSolicitacao": "olho"
    },
    {
        "comentario_colaborador": '',
        "comentario_gestor": "não pode!",
        "data": "8/6/2023",
        "status": "Voltando",
        "nome": "Rosana Souza ",
        "feriasAprovadaEm": "30/3/2023",
        "verSolicitacao": "olho"
    }
]
}

        send_to (string): o email do gestor que irá receber o relatório
        nome (string): o nome do gestor que irá receber o relatório
    """
    try:
        with open('email_relatorio.html', 'r', encoding='utf-8') as f:
            html = f.read()
        ## cria df para cada dashboard
        df1 = pd.DataFrame(data["dashboard1"], index=[0])
        df2 = pd.DataFrame(data["dashboard2"])
        df3 = pd.DataFrame(data["dashboard3"])
        df4 = pd.DataFrame(data["dashboard4"], columns=['comentario_colaborador','comentario_gestor','data', 'status' ,'nome' ,'feriasAprovadaEm'])

        ## cria os gráficos
        fig1, ax1 = plt.subplots()
        ax1.pie(df1.iloc[0], labels=df1.columns, autopct='%1.1f%%', shadow=True, startangle=90)
        ax1.axis('equal')
        fig1.suptitle("Squad em atividade (%)")

        fig2, ax2 = plt.subplots()
        ax2.plot(df2["name"], df2["saindo"], label="Saindo")
        ax2.plot(df2["name"], df2["voltando"], label="Voltando")
        fig2.suptitle('Fluxo mensal de colaboradores')
        ax2.set_ylabel("Quantidade")
        ax2.legend()

        fig3, ax3 = plt.subplots()
        ax3.bar(df3["name"], df3["qtd"])
        fig3.suptitle('Saídas por mês')
        ax3.set_ylabel('Saídas')

        ## salva os gráficos em memória
        buf1 = io.BytesIO()
        buf2 = io.BytesIO()
        buf3 = io.BytesIO()
        fig1.savefig(buf1, format='png')
        fig2.savefig(buf2, format='png')
        fig3.savefig(buf3, format='png')

        ## cria o email com os anexos de imagem
        msg = MIMEMultipart()
        msg['Subject'] = 'Relatório de férias'
        msg['From'] = os.environ['EMAIL']
        msg['To'] = send_to
        password = os.environ['SENHA']
        
        
        img1 = MIMEBase('application', 'octet-stream')
        img1.set_payload(buf1.getvalue())
        encoders.encode_base64(img1)
        img1.add_header('Content-Disposition', 'attachment', filename="image1.png")
        msg.attach(img1)
        
        img2 = MIMEBase('application', 'octet-stream')
        img2.set_payload(buf2.getvalue())
        encoders.encode_base64(img2)
        img2.add_header('Content-Disposition', 'attachment', filename="image2.png")
        msg.attach(img2)
        
        img3 = MIMEBase('application', 'octet-stream')
        img3.set_payload(buf3.getvalue())
        encoders.encode_base64(img3)
        img3.add_header('Content-Disposition', 'attachment', filename="image3.png")
        msg.attach(img3)

        ## cria o email com o html

        ## subtitui o {nome} pelo nome do gestor
        html = html.replace("{nome}", nome)
        htmlPart = MIMEText(html, 'html', 'utf-8')
        msg.attach(htmlPart)

        ## salva os 4 df em memória
        buf4 = io.BytesIO()
        buf5 = io.BytesIO()
        buf6 = io.BytesIO()

        df1.to_csv(buf4, index=False)
        df2.to_csv(buf5, index=False)
        df4.to_csv(buf6, index=False)

        ## cria o email com os anexos de csv
        csv1 = MIMEBase('application', 'octet-stream')
        csv1.set_payload(buf4.getvalue())
        encoders.encode_base64(csv1)
        csv1.add_header('Content-Disposition', 'attachment', filename="squad_em_atividade.csv")
        msg.attach(csv1)

        csv2 = MIMEBase('application', 'octet-stream')
        csv2.set_payload(buf5.getvalue())
        encoders.encode_base64(csv2)
        csv2.add_header('Content-Disposition', 'attachment', filename="fluxo_mensal.csv")
        msg.attach(csv2)

        csv4 = MIMEBase('application', 'octet-stream')
        csv4.set_payload(buf6.getvalue())
        encoders.encode_base64(csv4)
        csv4.add_header('Content-Disposition', 'attachment', filename="lista_de_ferias.csv")
        msg.attach(csv4)


        ## envia o email
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.starttls()
        server.login(msg['From'], password)
        server.sendmail(msg['From'], msg['To'], msg.as_string().encode('utf-8'))
        server.quit()
        print("Email enviado com sucesso!")
    except Exception as e:
        print("Erro ao enviar email: ", e)



   



