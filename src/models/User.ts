import { Role } from "src/dtos/role/role.enum";

export class Usuario {
  readonly id: string;
  name: string;
  readonly email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: Omit<Usuario, 'deactivate' | 'activate'>) {
    Object.assign(this, props);
  }
}
