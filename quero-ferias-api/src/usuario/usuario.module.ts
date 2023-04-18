import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuarios } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Squad } from 'src/squad/entities/squad.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Solicitacoes } from 'src/solicitacoes/entities/solicitacoes.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios, Squad, Solicitacoes]),
    AuthModule
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
