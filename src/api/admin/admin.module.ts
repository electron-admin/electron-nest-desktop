/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:21:10
 * @LastEditTime: 2022-06-15 12:49:47
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\admin\admin.module.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { RoleModule } from '../role/role.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RoleModule,
    SequelizeModule.forFeature([Admin]),
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
