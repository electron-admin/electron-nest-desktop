import { pagination, success, error } from './../../utils/response';
/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:32:41
 * @LastEditTime: 2022-06-14 15:35:40
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\role\role.controller.ts
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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { ApiPaginatedResponse } from 'src/decorator/api.paginated.response';
import { ApiMapResponse } from 'src/decorator/api.map.response';
@ApiTags('角色')
@ApiExtraModels(Role)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '添加角色',
  })
  @ApiMapResponse()
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.findByName(createRoleDto.name);
    if (role !== null) {
      return error('角色已经存在');
    }
    const res = await this.roleService.create(createRoleDto);
    if (res.id > 0) {
      return success();
    }
    return error('添加失败');
  }
  @ApiOperation({
    summary: '角色列表',
  })
  @ApiPaginatedResponse(Role)
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
    name: 'name',
    description: '角色名称',
    example: '最爱白菜吖',
    required: false,
  })
  @Get()
  async findAll(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('name') name: string,
  ) {
    const { rows, count } = await this.roleService.findAll(
      current,
      pageSize,
      name,
    );
    return success(pagination(rows, count, current, pageSize));
  }

  @ApiOperation({
    summary: '角色详情',
  })
  @ApiMapResponse(Role)
  @ApiParam({
    name: 'id',
    description: '角色id',
    example: 1,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOne(+id);
    return success(role);
  }

  @ApiOperation({
    summary: '编辑角色',
  })
  @ApiParam({
    name: 'id',
    description: '角色id',
    example: 1,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.roleService.findByName(updateRoleDto.name);
    if (role !== null && role.id !== id) {
      return error('角色已经存在');
    }
    const res = await this.roleService.update(+id, updateRoleDto);
    if (res.every((v) => v > 0)) {
      return success();
    }
    return error('更新失败');
  }

  @ApiOperation({
    summary: '删除角色',
  })
  @ApiMapResponse()
  @ApiParam({
    name: 'id',
    description: '角色id',
    example: 1,
  })
  @Delete(':id')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOne(id);
    if (role === null) {
      return error('角色不存在');
    }
    const res = await this.roleService.remove(+id);
    if (res > 0) {
      return success();
    }
    return error('删除失败');
  }
}
