import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { Request } from 'express';
import { JwtPayload } from '../models/jwt-payload.model';


/*
! Serviço de autenticação
! Em refatoração
*/
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,

    private readonly jwtService: JwtService
    ) { }

    
  // ! ---------------- código antigo ---------------------------
  // Verifica as credenciais do usuário
  // servico para verificar se tipo do usuario é gestor ou colaborador
  // Gera um token JWT para o usuário autenticado
  // Retorna o token JWT e o tipo do usuário
  // TODO: separar respostas
  // async login(credentials: any) {
  //   const user = await this.validateUser(credentials.email, credentials.password);

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   const user_data = await this.getUserData(credentials.email);

  //   const payload = { email: user.email, sub: user.id };
  //   return {
  //     user: user_data,
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  // Verifica as credenciais do usuário no banco de dados ou em outro serviço
  // Retorna o usuário se as credenciais estiverem corretas, caso contrário, retorna null
  // async validateUser(email: string, password: string) {
  //   const user = await this.usuariosRepository.findOne({ where: { email: email, senha: password } });
  //   return user;
  // }

  // servico para verificar se tipo do usuario é gestor ou colaborador
  // async getUserData(email: string) {
  //   const user = await this.usuariosRepository.findOne({ where: { email: email } });
  //   return user;
  // }

  // !! -------------- código refatorado ----------------------------
  

  public async createAccessToken(userId: string): Promise<string> {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

  }

  public async validateUser(jwtPayload: JwtPayload): Promise<Usuarios> {
    const userId = jwtPayload.userId;
    const user = await this.usuariosRepository.findOne({ where: { id: userId} });
    if(!user) {
      throw new UnauthorizedException('Usuário não encontrado!')
    }

    return user;
  }



  private static jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('Bad request.');
    }

    const [, token] = authHeader.split(' ');

    return token;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return AuthService.jwtExtractor;
  }


}
