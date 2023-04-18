import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './usuario/entities/usuario.entity';
import { SquadModule } from './squad/squad.module';
import { Squad } from './squad/entities/squad.entity';
import { SolicitacoesModule } from './solicitacoes/solicitacoes.module';
import { Solicitacoes } from './solicitacoes/entities/solicitacoes.entity';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WorkerModule } from './worker/worker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Notificacao } from './notificacao/entities/notificacao.entity';


@Module({
  imports: [UsuarioModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      entities: [Usuarios, Squad, Solicitacoes, Notificacao]
    }),
    SquadModule,
    SolicitacoesModule,
    NotificacaoModule,
    AuthModule,
    WorkerModule,
  ],
})
export class AppModule {}
