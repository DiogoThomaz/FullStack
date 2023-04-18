import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NotificacaoService } from "src/notificacao/notificacao.service";

@Injectable()
export default class CronRotina {
    // exclui notifações lidas

    constructor(
        @Inject(NotificacaoService)
        private notificacoesService: NotificacaoService
    ) { }
    
    @Cron(CronExpression.EVERY_30_SECONDS)
    public async deleteNotificacoesLidas() {
        try {
            const notificacoes = await this.notificacoesService.findAll();
            notificacoes.forEach(async notificacao => {
                if (notificacao.lida == true) {
                    console.log(`apagando notificação lida ${notificacao.id}`)
                    await this.notificacoesService.remove(notificacao.id);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
}