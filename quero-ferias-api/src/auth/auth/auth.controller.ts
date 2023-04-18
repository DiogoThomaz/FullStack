import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
    ) {}

  // @Post('login')
  // async login(@Body() credentials: any) {
  //   return this.authService.login(credentials);
  // }
}
