import { Module } from '@nestjs/common';
import { NotificacaoModule } from 'src/notificacao/notificacao.module';
import { SolicitacoesModule } from 'src/solicitacoes/solicitacoes.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import CronRotina from './cron.rotina';
import { CronVerificador } from './cron.verificador';

@Module({
    imports: [
        SolicitacoesModule,
        UsuarioModule,
        NotificacaoModule
    ],
    providers: [CronVerificador, CronRotina],
    exports: [CronVerificador, CronRotina]
})
export class WorkerModule {}
