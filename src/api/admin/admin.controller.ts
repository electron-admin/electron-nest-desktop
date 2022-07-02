import { LoginResponseDto } from './dto/login-response.dto';
import { error, pagination } from './../../utils/response';
import { success } from 'src/utils/response';
/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:21:10
 * @LastEditTime: 2022-06-15 13:00:22
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\admin\admin.controller.ts
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
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { ApiMapResponse } from 'src/decorator/api.map.response';
import { randomStr } from 'src/utils/randomStr';
import * as crypto from 'crypto';
import { ApiPaginatedResponse } from 'src/decorator/api.paginated.response';
import { RoleService } from '../role/role.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('管理员')
@ApiExtraModels(Admin, LoginResponseDto)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}
  @ApiOperation({
    summary: '登录',
  })
  @ApiMapResponse(LoginResponseDto)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const admin = await this.adminService.findByName(loginDto.username);
    if (admin === null) {
      return error('用户不存在');
    }
    const password = crypto
      .createHash('md5')
      .update(loginDto.password + admin.salt)
      .digest('hex');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (password !== admin.dataValues.password) {
      return error('密码错误');
    }
    const token = this.jwtService.sign(loginDto);
    return success({ token });
  }

  @ApiOperation({
    summary: '添加管理员',
  })
  @ApiMapResponse()
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    const role = await this.roleService.findOne(createAdminDto.roleId);
    if (role === null) {
      return error('角色不存在');
    }
    const admin = await this.adminService.findByName(createAdminDto.username);
    if (admin !== null) {
      return error('管理员已经存在');
    }
    const admin1 = await this.adminService.findByEmail(createAdminDto.email);
    if (admin1 !== null) {
      return error('邮箱已经存在');
    }
    createAdminDto.salt = randomStr(6);
    createAdminDto.password = crypto
      .createHash('md5')
      .update(createAdminDto.password + createAdminDto.salt)
      .digest('hex');
    const res = await this.adminService.create(createAdminDto);
    if (res.id > 0) {
      return success();
    }
    return error('添加失败');
  }

  @ApiOperation({
    summary: '管理员列表',
  })
  @ApiPaginatedResponse(Admin)
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
    const { rows, count } = await this.adminService.findAll(
      current,
      pageSize,
      username,
    );
    return success(pagination(rows, count, current, pageSize));
  }

  @ApiOperation({
    summary: '管理员详情',
  })
  @ApiMapResponse(Admin)
  @ApiParam({
    name: 'id',
    description: '管理员id',
    example: 1,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.adminService.findOne(+id);
    if (admin === null) {
      return error('管理员不能存在');
    }
    return success(admin);
  }

  @ApiOperation({
    summary: '编辑管理员',
  })
  @ApiParam({
    name: 'id',
    description: '管理员id',
    example: 1,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const role = await this.roleService.findOne(updateAdminDto.roleId);
    if (role === null) {
      return error('角色不存在');
    }
    const admin = await this.adminService.findByName(updateAdminDto.username);
    if (admin !== null && admin.id !== id) {
      return error('管理员已经存在');
    }
    const admin1 = await this.adminService.findByEmail(updateAdminDto.email);
    if (admin1 !== null && admin1.id !== id) {
      return error('邮箱已经存在');
    }
    updateAdminDto.salt = randomStr(6);
    updateAdminDto.password = crypto
      .createHash('md5')
      .update(updateAdminDto.password + updateAdminDto.salt)
      .digest('hex');
    const res = await this.adminService.update(+id, updateAdminDto);
    if (res.every((v) => v > 0)) {
      return success();
    }
    return error('添加失败');
  }

  @ApiOperation({
    summary: '删除管理员',
  })
  @ApiMapResponse()
  @ApiParam({
    name: 'id',
    description: '管理员id',
    example: 1,
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.adminService.findOne(id);
    if (admin === null) {
      return error('管理员不存在');
    }
    const res = await this.adminService.remove(+id);
    if (res > 0) {
      return success();
    }
    return error('删除失败');
  }
}
