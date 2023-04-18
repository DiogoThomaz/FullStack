//* Esse DTO foi definido como apenas leitura por segurança
//* PartialType torna possível o DTO update ter apenas um campo
//! Validações feitas com o class-validator no arquivo

import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
