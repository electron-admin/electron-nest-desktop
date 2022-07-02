import { error } from './utils/response';
/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-04-28 13:56:28
 * @LastEditTime: 2022-06-14 01:47:52
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\http-exception.filter.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const msg = exception.getResponse();
    const message =
      typeof msg['message'] === 'string' ? msg['message'] : msg['message'][0];
    response.status(status).json(
      error(message, {
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      }),
    );
  }
}
