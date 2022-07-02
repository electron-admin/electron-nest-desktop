import { ApiProperty } from '@nestjs/swagger';

/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-15 12:52:01
 * @LastEditTime: 2022-06-15 12:52:03
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\admin\dto\login-response.dto.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
export class LoginResponseDto {
  @ApiProperty({
    name: 'token',
    description: '用户token',
  })
  token: string;
}
