import { Catch, ArgumentsHost, BadRequestException, NotFoundException, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private logger = new Logger("RpcCustomExceptionFilter");
  catch(exception: RpcException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // throw new NotFoundException('exception');
    const rpcError = exception.getError();
    this.logger.error(rpcError.toString())
    if(rpcError.toString().includes("Empty response")){
      response.status(500).json({
        status: 500,
        message:rpcError.toString().substring(0, rpcError.toString().indexOf('(') -1)
      })
    }
    
    if(typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError){
      const status = isNaN(+rpcError.status) ? 400 : rpcError.status;
      response.status(status).json(rpcError)
    }else {
      response.status(400).json({
        status: 400,
        message:rpcError
      })
    }
    
    // return throwError(() => exception.getError());
  }
}