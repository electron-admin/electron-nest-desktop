/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:21:10
 * @LastEditTime: 2022-06-14 13:27:03
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\admin\dto\create-admin.dto.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, Length, Min } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    name: 'username',
    description: '用户名',
    minLength: 2,
    maxLength: 12,
    example: '最爱白菜吖',
  })
  @Length(2, 12, { message: '用户名必须在2-12个字符之间' })
  username: string;

  @ApiProperty({
    name: 'password',
    description: '密码',
    minLength: 6,
    maxLength: 12,
    example: '123456',
  })
  @Length(6, 12, { message: '用户名必须在6-32个字符之间' })
  password: string;

  @ApiProperty({
    name: 'email',
    description: '邮箱',
    example: '1355081829@qq.com',
  })
  @IsEmail({}, { message: '邮箱格式不合法' })
  email: string;

  @ApiProperty({
    name: 'roleId',
    description: '角色id',
    example: 1,
  })
  @Min(1, { message: 'roleId必须为正整数' })
  @IsInt({ message: 'roleId必须为正整数' })
  roleId: number;

  salt: string;
}
