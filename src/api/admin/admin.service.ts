/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-13 20:21:10
 * @LastEditTime: 2022-06-14 11:43:42
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\api\admin\admin.service.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Role } from '../role/entities/role.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private adminModel: typeof Admin) {}
  create(createAdminDto: CreateAdminDto) {
    return this.adminModel.create(createAdminDto);
  }
  findByName(username: string) {
    return this.adminModel.findOne({ where: { username } });
  }
  findByEmail(email: string) {
    return this.adminModel.findOne({ where: { email } });
  }
  findAll(page = 1, limit = 1, username = '') {
    const where = {};
    if (username !== null) {
      where['username'] = {
        [Op.like]: `%${username}%`,
      };
    }
    return this.adminModel.findAndCountAll({
      order: [['id', 'desc']],
      offset: (page - 1) * limit,
      limit,
      where,
      include: [Role],
    });
  }

  findOne(id: number) {
    return this.adminModel.findByPk(id);
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.adminModel.update(updateAdminDto, { where: { id } });
  }

  remove(id: number) {
    return this.adminModel.destroy({ where: { id } });
  }
}
