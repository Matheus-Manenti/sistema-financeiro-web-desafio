import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClientRequestDTO {
  
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsOptional()
  phone?: string;
}