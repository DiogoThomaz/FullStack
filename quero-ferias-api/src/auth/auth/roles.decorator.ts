import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from './role.enum';

export const ROLES_KEY = 'tipo_usuario';
export const Roles = (...roles: TipoUsuario[]) => SetMetadata(ROLES_KEY, roles);