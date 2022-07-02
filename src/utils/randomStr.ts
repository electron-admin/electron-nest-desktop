/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-04-28 17:13:38
 * @LastEditTime: 2022-04-28 17:13:39
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \nest-admin\src\utils\randomStr.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
export const randomStr = (length: number): string => {
  const seeder =
    'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let randomStr = '';
  for (let i = 0; i < length; i++) {
    randomStr += seeder.charAt(Math.floor(Math.random() * seeder.length));
  }
  return randomStr;
};
