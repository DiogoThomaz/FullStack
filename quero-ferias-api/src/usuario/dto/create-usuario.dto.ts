//* Esse DTO foi definido como apenas leitura por segurança
//* ?: Significa que os parâmetros são opcionais.
//! Validações feitas com o class-validator

import {
    IsNumber,
    IsString,
    IsEmail,
    IsIn,
    IsOptional,
    IsNotEmpty,
    MinLength,
    IsBoolean,
    IsDate,
    IsDateString
} from 'class-validator'
import { BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateUsuarioDto {

    @IsNotEmpty()
    @IsString()
    matricula: number;

    @IsNotEmpty()
    @IsString()
     nome: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
     email: string;

    @IsNotEmpty()
    @MinLength(4)
    @IsString()
     senha: string;

    @IsNotEmpty()
    @IsIn(['CLT', 'PJ'])
     tipo_contrato: string;

    @IsNotEmpty()
    @IsIn(['COLABORADOR', 'GESTOR'])
     tipo_usuario: string;

    @IsString()
    gmail: string;

    @IsBoolean()
    ativo: boolean;

    @IsString()
    cargo: string;

    @IsDateString()
    data_contratacao: string;

    //! Validação completa feita em usuario.service.ts
    // pois gestores podem não ter uma squad
    @IsString()
    @IsOptional()
    id_squad: string;

   
}
