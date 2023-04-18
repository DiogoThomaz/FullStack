import {
IsString
} from 'class-validator'

export class CreateSquadDto {

    @IsString()
    readonly nome: string;

    @IsString()
    readonly id_gestor: string;
}
