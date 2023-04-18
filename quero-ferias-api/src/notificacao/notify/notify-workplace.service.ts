import { Injectable } from "@nestjs/common"

@Injectable()
export class NotifyWorkplace {

    public boasVindas(nome: string): string { 
        return `Seja bem vindo ao Quero Férias, ${nome}!`;
    }
    
    public boasFerias(nome: string, data_inicio: string, data_fim: string): string { 
        return `Boas férias, ${nome}! Elas começam dia: ${(new Date(data_inicio)).toLocaleDateString('pt-BR')} e vão até ${(new Date(data_fim)).toLocaleDateString('pt-BR')}.`;
    }
    
    public bomRetorno(nome: string): string { 
        return `Bom retorno, ${nome}!`;
    }
    
    public solicitacaoAprovadaColaborador(nome: string, data_inicio: string, data_fim: string): string { 
        return `${nome}, suas férias foram aprovadas! Elas começam dia: ${(new Date(data_inicio)).toLocaleDateString('pt-BR')} e vão até ${(new Date(data_fim)).toLocaleDateString('pt-BR')}.`;
    }
    
    public solicitacaoAprovadaGestor(nome: string, colaborador: string, data_inicio: string, data_fim: string): string { 
        return `${nome}, você aprovou as férias do(a) ${colaborador}. Elas começam dia: ${(new Date(data_inicio)).toLocaleDateString('pt-BR')} e vão até ${(new Date(data_fim)).toLocaleDateString('pt-BR')}.`;
    }
    
    public solicitacaoReprovadaColaborador(nome: string, motivo: string): string { 
        return `${nome}, sua solicitação de férias foi reprovada. Motivo: ${motivo}`;
    }
    
    public solicitacaoReprovadaGestor(nome: string, colaborador: string, motivo: string): string { 
        return `${nome}, você reprovou as férias do(a) ${colaborador}. Motivo: ${motivo}`;
    }
    
    public solicitacaoPendenteColaborador(nome: string): string { 
        return `${nome}, sua solicitação de férias está pendente`;
    }
    
    public solicitacaoPendenteGestor(nome: string, colaborador: string): string { 
        return `${nome}, você tem uma solicitação de férias pendente do(a) ${colaborador}`;
    }
    
}