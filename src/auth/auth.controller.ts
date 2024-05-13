import { Controller, Post, Inject, Get } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('login-user')
  loginUser() {
    return this.client.send('auth-login-user', {}).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }

  @Post('register-user')
  async registerUser() {
    //** Nota: send: envia petición y espera respuesta
    //** emit : solo envia y sigue con su vida
    try {
      return  await firstValueFrom(this.client.send('auth-register-user', {}));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('verify-user')
  async verifyUser() {
    //** Nota: send: envia petición y espera respuesta
    //** emit : solo envia y sigue con su vida
    try {
      return  await firstValueFrom(this.client.send('auth-verify-user', {}));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
