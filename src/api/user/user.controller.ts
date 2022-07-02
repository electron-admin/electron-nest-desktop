import { randomStr } from './../../utils/randomStr';
import { ApiPaginatedResponse } from './../../decorator/api.paginated.response';
import { error, pagination } from './../../utils/response';
/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:32:31
 * @LastEditTime: 2022-06-14 00:19:06
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\user\user.controller.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as crypto from 'crypto';
import { ApiMapResponse } from 'src/decorator/api.map.response';
import { success } from 'src/utils/response';
import { User } from './entities/user.entity';
@ApiTags('用户')
@ApiExtraModels(User)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '添加用户',
  })
  @ApiMapResponse()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findByName(createUserDto.username);
    if (user !== null) {
      return error('用户已经存在');
    }
    const user1 = await this.userService.findByEmail(createUserDto.email);
    if (user1 !== null) {
      return error('邮箱已经存在');
    }
    createUserDto.salt = randomStr(6);
    createUserDto.password = crypto
      .createHash('md5')
      .update(createUserDto.password + createUserDto.salt)
      .digest('hex');
    const res = await this.userService.create(createUserDto);
    if (res.id > 0) {
      return success();
    }
    return error('创建失败');
  }

  @ApiOperation({
    summary: '用户列表',
  })
  @ApiPaginatedResponse(User)
  @ApiQuery({
    name: 'current',
    description: '当前页码',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页数量',
    example: 15,
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    example: '最爱白菜吖',
    required: false,
  })
  @Get()
  async findAll(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('username') username: string,
  ) {
    const { rows, count } = await this.userService.findAll(
      current,
      pageSize,
      username,
    );
    return success(pagination(rows, count, current, pageSize));
  }

  @ApiOperation({
    summary: '用户详情',
  })
  @ApiMapResponse(User)
  @ApiParam({
    name: 'id',
    description: '用户id',
    example: 1,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(+id);
    if (user === null) {
      return error('用户不存在');
    }
    return success(user);
  }

  @ApiOperation({
    summary: '编辑用户',
  })
  @ApiParam({
    name: 'id',
    description: '用户id',
    example: 1,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.findOne(id);
    if (user === null) {
      return error('用户不存在');
    }
    const res = await this.userService.update(+id, updateUserDto);
    if (res.every((v) => v > 0)) {
      return success();
    }
    return error('更新失败');
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @ApiMapResponse()
  @ApiParam({
    name: 'id',
    description: '用户id',
    example: 1,
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const user = await this.userService.findOne(id);
    if (user === null) {
      return error('用户不存在');
    }
    const row = await this.userService.remove(+id);
    if (row > 0) {
      return success();
    }
    return error('删除失败');
  }
}
