import { ConflictException } from '@nestjs/common';

export class ClientConflictException extends ConflictException {
  constructor() {
    super('Já existe um cliente com este e-mail.');
  }
}