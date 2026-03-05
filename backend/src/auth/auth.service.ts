import {
  Injectable,
  UnauthorizedException,
  OnApplicationBootstrap,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser() {
    const exists = await this.prisma.user.findUnique({
      where: { email: 'admin@recicla.com' },
    });

    if (!exists) {
      const hash = await bcrypt.hash('recicla123', 10);
      await this.prisma.user.create({
        data: {
          email: 'admin@recicla.com',
          name: 'Administrador',
          passwordHash: hash,
        },
      });
      this.logger.log('Usuário padrão criado: admin@recicla.com / recicla123');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
