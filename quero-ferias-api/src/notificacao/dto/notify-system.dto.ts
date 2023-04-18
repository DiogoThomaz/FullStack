import { IsNotEmpty, IsString } from "class-validator";

export class NotifySystemDto {
  
  @IsNotEmpty()
  @IsString()
  mensagem: string;
  
}