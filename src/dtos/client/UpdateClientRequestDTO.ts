import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClientRequestDTO {
  
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  phone?: string;
}