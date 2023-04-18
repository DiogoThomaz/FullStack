import { Inject, Injectable } from "@nestjs/common"
import { UsuarioService } from "src/usuario/usuario.service"
import { NotificacaoService } from "../notificacao.service"
import { NotifyWorkplace } from "./notify-workplace.service";
import { NotifyEmail } from "./notify-email.service";
import { NotifySystem } from "./notifiy-system.service";
import NotifyCalendarGoogle from "./notify-calendar.service";


@Injectable()
export class Notify {
    constructor(
        @Inject(UsuarioService)
        private usuarioService: UsuarioService,

        @Inject(NotificacaoService)
        private notificacaoService: NotificacaoService,

        @Inject(NotifySystem)
        private notifyMessageSystem: NotifySystem,

        @Inject(NotifyEmail)
        private notifyMessageEmail: NotifyEmail,

        @Inject(NotifyWorkplace)
        private notifyWorkplace: NotifyWorkplace,

        @Inject(NotifyCalendarGoogle)
        private notifyCalendarGoogle: NotifyCalendarGoogle,

    ){}

    public async getIdGestorColaborador(id: string) {
        const solicitacao = await this.notificacaoService.findGestorColaborador(id);
        const idGestor = solicitacao.id_gestor;
        const idColaborador = solicitacao.id_colaborador;
        
        return {
            idGestor,
            idColaborador
        }
    }

    public async boasVindas(id: string) {
        const usuario = await this.usuarioService.findMyProfile(id);
        await this.notificacaoService.sendEmail(
            id,
            `${this.notifyMessageEmail.boasVindas(usuario.nome).mensagem}`,
            `${this.notifyMessageEmail.boasVindas(usuario.nome).anexo}`,
            `${this.notifyMessageEmail.boasVindas(usuario.nome).assunto}`,
        )
        await this.notificacaoService.createNotificacaoUsuario(
            id,
            this.notifyMessageSystem.boasVindas(usuario.nome),
        )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.boasVindas(usuario.nome)
        )
    }

    public async boasFerias(id: string, data_inicio: string, data_fim: string) {
        const usuario = await this.usuarioService.findMyProfile(id);
        await this.notificacaoService.sendEmail(
            id,
            `${this.notifyMessageEmail.boasFerias(usuario.nome, data_inicio, data_fim).mensagem}`,
            `${this.notifyMessageEmail.boasFerias(usuario.nome, data_inicio, data_fim).anexo}`,
            `${this.notifyMessageEmail.boasFerias(usuario.nome, data_inicio, data_fim).assunto}`,
        )
        await this.notificacaoService.createNotificacaoUsuario(
            id,
            this.notifyMessageSystem.boasFerias(usuario.nome, data_inicio, data_fim),
        )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.boasFerias(usuario.nome, data_inicio, data_fim)
        )
    }

    public async bomRetorno(id: string, data_inicio: string, data_fim: string) {
        const usuario = await this.usuarioService.findMyProfile(id);
        await this.notificacaoService.sendEmail(
            id,
            `${this.notifyMessageEmail.bomRetorno(usuario.nome).mensagem}`,
            `${this.notifyMessageEmail.bomRetorno(usuario.nome).anexo}`,
            `${this.notifyMessageEmail.bomRetorno(usuario.nome).assunto}`,
        )
        await this.notificacaoService.createNotificacaoUsuario(
            id,
            this.notifyMessageSystem.bomRetorno(usuario.nome),
        )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.bomRetorno(usuario.nome)
        )
    }

    public async solicitacaoAprovada(id_colaborador: string, id_gestor:string, data_inicio: string, data_fim: string) {
        const gestor = await this.usuarioService.findMyProfile(id_gestor);
        const colaborador = await this.usuarioService.findMyProfile(id_colaborador);
        // COLABORADOR
        await this.notificacaoService.sendEmail(
            id_colaborador, 
            `${this.notifyMessageEmail.solicitacaoAprovadaColaborador(colaborador.nome, data_inicio, data_fim).mensagem}`,
            `${this.notifyMessageEmail.solicitacaoAprovadaColaborador(colaborador.nome, data_inicio, data_fim).anexo}`,
            `${this.notifyMessageEmail.solicitacaoAprovadaColaborador(colaborador.nome, data_inicio, data_fim).assunto}`,
            )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.solicitacaoAprovadaColaborador(colaborador.nome, data_inicio, data_fim)
            )
        await this.notificacaoService.createNotificacaoUsuario(
            id_colaborador,
            this.notifyMessageSystem.solicitacaoAprovadaColaborador(colaborador.nome, data_inicio, data_fim))
        await this.notifyCalendarGoogle.criarEvento("diogommtdes@gmail.com", "Férias", "Período de férias!", data_inicio, data_fim)

        
        // GESTOR
        await this.notificacaoService.sendEmail(
            id_gestor, 
            `${this.notifyMessageEmail.solicitacaoAprovadaGestor(gestor.nome, colaborador.nome, data_inicio, data_fim).mensagem}`,
            `${this.notifyMessageEmail.solicitacaoAprovadaGestor(gestor.nome, colaborador.nome, data_inicio, data_fim).anexo}`,
            `${this.notifyMessageEmail.solicitacaoAprovadaGestor(gestor.nome, colaborador.nome, data_inicio, data_fim).assunto}`,
            )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.solicitacaoAprovadaGestor(gestor.nome, colaborador.nome, data_inicio, data_fim)
            )
        await this.notificacaoService.createNotificacaoUsuario(
            id_gestor,
            this.notifyMessageSystem.solicitacaoAprovadaGestor(gestor.nome, colaborador.nome, data_inicio, data_fim))
    }

    public async solicitacaoReprovada(id_colaborador: string, id_gestor:string, data_inicio: string, data_fim: string, motivo:string) {
        const gestor = await this.usuarioService.findMyProfile(id_gestor);
        const colaborador = await this.usuarioService.findMyProfile(id_colaborador);
        // COLABORADOR
        await this.notificacaoService.sendEmail(
            id_colaborador, 
            `${this.notifyMessageEmail.solicitacaoReprovadaColaborador(colaborador.nome, motivo).mensagem}`,
            `${this.notifyMessageEmail.solicitacaoReprovadaColaborador(colaborador.nome,  motivo).anexo}`,
            `${this.notifyMessageEmail.solicitacaoReprovadaColaborador(colaborador.nome,  motivo).assunto}`,
            )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.solicitacaoReprovadaColaborador(colaborador.nome, motivo)
            )
        await this.notificacaoService.createNotificacaoUsuario(
            id_colaborador,
            this.notifyMessageSystem.solicitacaoReprovadaColaborador(colaborador.nome, motivo)) 

        
        // GESTOR
        await this.notificacaoService.sendEmail(
            id_gestor, 
            `${this.notifyMessageEmail.solicitacaoReprovadaGestor(gestor.nome, colaborador.nome, motivo).mensagem}`,
            `${this.notifyMessageEmail.solicitacaoReprovadaGestor(gestor.nome, colaborador.nome, motivo).anexo}`,
            `${this.notifyMessageEmail.solicitacaoReprovadaGestor(gestor.nome, colaborador.nome, motivo).assunto}`,
            )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.solicitacaoReprovadaGestor(gestor.nome, colaborador.nome, motivo)
            )
        await this.notificacaoService.createNotificacaoUsuario(
            id_gestor,
            this.notifyMessageSystem.solicitacaoReprovadaGestor(gestor.nome, colaborador.nome, motivo))
    }

    public async solicitacaoPendente(id_colaborador: string, id_gestor:string) {
        const gestor = await this.usuarioService.findMyProfile(id_gestor);
        const colaborador = await this.usuarioService.findMyProfile(id_colaborador);
        // COLABORADOR
        await this.notificacaoService.sendEmail(
            id_colaborador, 
            `${this.notifyMessageEmail.solicitacaoPendenteColaborador(colaborador.nome).mensagem}`,
            `${this.notifyMessageEmail.solicitacaoPendenteColaborador(colaborador.nome).anexo}`,
            `${this.notifyMessageEmail.solicitacaoPendenteColaborador(colaborador.nome).assunto}`,
            )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.solicitacaoPendenteColaborador(colaborador.nome)
            )
        await this.notificacaoService.createNotificacaoUsuario(
            id_colaborador,
            this.notifyMessageSystem.solicitacaoPendenteColaborador(colaborador.nome)) 

        
        // GESTOR
        await this.notificacaoService.sendEmail(
            id_gestor, 
            `${this.notifyMessageEmail.solicitacaoPendenteGestor(gestor.nome, colaborador.nome).mensagem}`,
            `${this.notifyMessageEmail.solicitacaoPendenteGestor(gestor.nome, colaborador.nome).anexo}`,
            `${this.notifyMessageEmail.solicitacaoPendenteGestor(gestor.nome, colaborador.nome).assunto}`,
            )
        await this.notificacaoService.sendWorkplaceMessage(
            this.notifyWorkplace.solicitacaoPendenteGestor(gestor.nome, colaborador.nome)
            )
        await this.notificacaoService.createNotificacaoUsuario(
            id_gestor,
            this.notifyMessageSystem.solicitacaoPendenteGestor(gestor.nome, colaborador.nome))
    }

}