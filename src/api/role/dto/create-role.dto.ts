/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:32:41
 * @LastEditTime: 2022-06-14 11:04:34
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\role\dto\create-role.dto.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    name: 'name',
    description: '角色名称',
    minLength: 2,
    maxLength: 12,
    example: '最爱白菜吖',
  })
  @Length(2, 12, { message: '角色名称必须在2-12个字符之间' })
  name: string;
}
