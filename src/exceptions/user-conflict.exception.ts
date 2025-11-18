import { ConflictException } from '@nestjs/common';

export class UserConflictException extends ConflictException {
  constructor() {
    super('Usuário com este e-mail já existe.');
  }
}
