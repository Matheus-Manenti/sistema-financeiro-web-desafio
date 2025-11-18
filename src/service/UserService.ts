import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UsuarioRequestDTO } from '../dtos/user/UserRequestDTO';
import { UserResponseDTO } from '../dtos/user/UserResponseDTO';
import { PrismaService } from 'prisma/PrismaService';
import { UpdateUserRequestDTO } from 'src/dtos/user/UpdateUserRequestDTO';
import { UserNotFoundException } from 'src/exceptions/user-not-found.exception';
import { UserConflictException } from 'src/exceptions/user-conflict.exception';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async createUser(data: UsuarioRequestDTO): Promise<UserResponseDTO> {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new UserConflictException();
    }

    const saltRounds = 10;
    const passwordHash = await hash(data.password, saltRounds);

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    const response = new UserResponseDTO({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    return response;
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.prisma.user.findMany({
      select: this.userSelect,
    });
    return users.map(user => new UserResponseDTO(user));
  }

  async findById(id: string): Promise<UserResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return new UserResponseDTO(user);
  }

  async findByEmail(email: string): Promise<UserResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return new UserResponseDTO(user);
  }

  async update(id: string, data: UpdateUserRequestDTO): Promise<UserResponseDTO> {

    await this.findById(id); 

    if (data.email) {
      const ownerOfEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (ownerOfEmail && ownerOfEmail.id !== id) {
        throw new UserConflictException();
      }
    }

    const updateData: any = { ...data };

    if (data.password) {
      updateData.passwordHash = await hash(data.password, 10);
      delete updateData.password;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.userSelect,
    });

    return new UserResponseDTO(updatedUser);
  }

  async toggleStatus(id: string): Promise<UserResponseDTO> {

    const user = await this.findById(id);
    
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: this.userSelect,
    });

    return new UserResponseDTO(updatedUser);
  }
}
