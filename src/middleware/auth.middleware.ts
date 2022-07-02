/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-03-01 20:38:44
 * @LastEditTime: 2022-06-16 12:10:25
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\middleware\auth.middleware.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const auth = req.header('Authorization');
    if (auth) {
      try {
        const result = await this.jwtService.verify(auth.substring(7));
        req.user = {
          name: result.username,
          id: result.id,
        };
        next();
      } catch (e) {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
