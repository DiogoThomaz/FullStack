import { Injectable } from "@nestjs/common"

@Injectable()
export class NotifyEmail {

    public boasVindas(nome: string) { return { "assunto": "Bem vindo(a)!", "mensagem": `Olá ${nome}, seja bem vindo(a) ao Quero Férias!`, "anexo": "nao" }}
    public boasFerias(nome: string, data_inicio: string, data_fim: string) { return { "assunto": "Boas férias!", "mensagem": `Olá ${nome}, boas férias! Elas começam dia: ${(new Date(data_inicio)).toLocaleDateString('pt-BR')} e vão até ${(new Date(data_fim)).toLocaleDateString('pt-BR')}.`, "anexo": "nao" }}
    public bomRetorno(nome: string) { return { "assunto": "Bom retorno!", "mensagem": `Olá ${nome}, bom retorno!`, "anexo": "nao" }}
    public solicitacaoAprovadaColaborador(nome: string, data_inicio: string, data_fim: string) { return { "assunto": "Férias Aprovada", "mensagem": `${nome}, suas férias foram aprovadas! Elas começam dia: ${(new Date(data_inicio)).toLocaleDateString('pt-BR')} e vão até ${(new Date(data_fim)).toLocaleDateString('pt-BR')}.`, "anexo": "nao" }}
    public solicitacaoAprovadaGestor(nome: string, colaborador: string, data_inicio: string, data_fim: string) { return { "assunto": "Solicitação aprovada", "mensagem": `${nome}, você aprovou as férias do(a) ${colaborador}. Elas começam dia: ${(new Date(data_inicio)).toLocaleDateString('pt-BR')} e vão até ${(new Date(data_fim)).toLocaleDateString('pt-BR')}.`, "anexo": "nao" }}
    public solicitacaoReprovadaColaborador(nome: string, motivo: string) { return { "assunto": "Férias Reprovada", "mensagem": `${nome}, sua solicitação de férias foi reprovada. Motivo: ${motivo}`, "anexo": "nao" }}
    public solicitacaoReprovadaGestor(nome: string, colaborador: string, motivo: string) { return { "assunto": "Solicitação reprovada", "mensagem": `${nome}, você reprovou as férias do(a) ${colaborador}. Motivo: ${motivo}`, "anexo": "nao" }}
    public solicitacaoPendenteColaborador(nome: string) { return { "assunto": "Férias Pendente", "mensagem": `${nome}, sua solicitação de férias está pendente`, "anexo": "nao" }}
    public solicitacaoPendenteGestor(nome: string, colaborador: string) { return { "assunto": "Solicitação pendente", "mensagem": `${nome}, você tem uma solicitação de férias pendente do(a) ${colaborador}`, "anexo": "nao" }}
}