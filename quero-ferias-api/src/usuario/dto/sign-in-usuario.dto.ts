import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/*
Dados que serão recebidos no Login
*/
export class SignInDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    senha: string;
}