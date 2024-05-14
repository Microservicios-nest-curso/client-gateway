import { Controller, Post, Inject, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('login-user')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth-login-user', loginUserDto).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }


  @Post('register-user')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    //** Nota: send: envia petición y espera respuesta
    //** emit : solo envia y sigue con su vida
    try {
      return  await firstValueFrom(this.client.send('auth-register-user', registerUserDto));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify-user')
  async verifyUser(@User() user:CurrentUser, @Token() token:string) {
    //** Nota: send: envia petición y espera respuesta
    //** emit : solo envia y sigue con su vida
    try {

      return {
        user,token
      }
      // return  await firstValueFrom(this.client.send('auth-verify-user', {token}));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
