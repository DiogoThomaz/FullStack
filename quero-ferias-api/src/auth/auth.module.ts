import { Usuarios } from '../usuario/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Coloque aqui a chave secreta para geração de tokens JWT
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    PassportModule
  ]
  ,
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
//
export class AuthModule {}