import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'O email de login do usuário.',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @ApiProperty({
    description: 'A senha de login do usuário.',
    example: 'senhaForte123',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  pas_word: string;
}
