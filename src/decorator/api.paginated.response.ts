import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-04-28 14:25:02
 * @LastEditTime: 2022-06-15 12:53:58
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\decorator\api.paginated.response.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
export class PaginatedDto {
  @ApiProperty({
    description: '状态：true表示成功；false表示失败',
    type: 'boolean',
    default: true,
  })
  success: boolean;
  @ApiProperty({
    description: '提示信息',
    required: false,
  })
  errorMessage: string;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                allOf: [
                  {
                    properties: {
                      list: {
                        type: 'array',
                        description: '数据',
                        items: {
                          allOf: [{ $ref: getSchemaPath(model) }],
                          properties: {
                            createdAt: {
                              type: 'string',
                              description: '创建时间',
                            },
                            updatedAt: {
                              type: 'string',
                              description: '修改时间',
                            },
                          },
                        },
                      },
                      total: {
                        type: 'number',
                        description: '总数',
                      },
                      totalPage: {
                        type: 'number',
                        description: '总页码',
                      },
                      current: {
                        type: 'number',
                        description: '当前页码',
                      },
                      pageSize: {
                        type: 'number',
                        description: '每页数量',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};
