import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// we are going to use this decorator inside user controller to retirive user from request
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx
      .switchToHttp() // since we are using http we switch to it, in case of microservices it can be Rpc
      .getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
