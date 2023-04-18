import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendExternalDto {

    /*
solicitacao: str
    email: str
    nome: str
    inicio: str
    fim: str
    comentario: str
    status: str

  {
    "solicitacao": "#3234",
    "email": "diogommtdes@gmail.com",
    "nome": "Carlos",
    "inicio": "26/03/2023",
    "fim": "26/04/2023",
    "comentario": "Minhas férias estão vencidas há 4 messes",
    "status": "Pendente",
    "colaborador": "Diogo"
}
    */
  @IsNotEmpty()
  @IsString()
  solicitacao: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  inicio: string;

  @IsNotEmpty()
  @IsString()
  fim: string;

  @IsNotEmpty()
  @IsString()
  comentario: string;
 
  @IsNotEmpty()
  @IsIn(['APROVADO', 'REPROVADA', 'PENDENTE'])
  status: string;

  @IsOptional()
  @IsString()
  colaborador?: string;

}