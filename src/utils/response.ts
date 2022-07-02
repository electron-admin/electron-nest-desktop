/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-04-28 15:07:53
 * @LastEditTime: 2022-06-14 15:59:51
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\utils\response.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
export const success = (data = {}, message = 'success') => {
  return {
    success: true,
    errorMessage: message,
    data,
  };
};
export const error = (message = 'error', data = {}) => {
  return {
    success: false,
    errorMessage: message,
    data,
  };
};
export function pagination<T>(
  list: T[],
  total: number,
  current = 1,
  pageSize = 15,
) {
  return {
    list,
    pageSize,
    total,
    totalPage: Math.ceil(total / pageSize),
    current,
  };
}
