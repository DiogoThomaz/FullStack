import { IsNotEmpty, IsString } from "class-validator";

export class NotifyWorkplaceDto {
  @IsNotEmpty()
  @IsString()
  mensagem: string;
}