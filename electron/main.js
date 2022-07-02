/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-06-12 18:01:26
 * @LastEditTime: 2022-07-02 14:07:06
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \electron-nest-desktop\electron\main.js
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ3: 大前端QQ交流群3: 473246571
 * @公众账号: 乐编码
 * 惑而不从师，其为惑也，终不解矣
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
const {
  app,
  BrowserWindow,
  screen,
  Tray,
  Menu,
  shell,
  dialog,
  nativeImage,
} = require('electron');
const path = require('path');
const isMac = process.platform === 'darwin';
require(path.resolve(__dirname, '../dist/main.js'));

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    // Electron获取屏幕工作窗口尺寸
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    icon: path.resolve(__dirname, 'favicon_256.ico'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on('close', (e) => {
    if (app.quitting) {
      e.preventDefault();
      console.log(1111);
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: '退出' + app.name,
          defaultId: 0,
          cancelId: 1,
          message: '确定要退出吗？',
          buttons: ['退出', '取消'],
        })
        .then((r) => {
          if (r.response === 0) {
            e.preventDefault(); //阻止默认行为，一定要有
            mainWindow = null;
            app.exit(); //exit()直接关闭客户端，不会执行quit();
          }
        });
      app.quitting = false;
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
  // electron 拦截所有页面跳转
  // mainWindow.webContents.on('will-navigate', (e, url) => {
  //   e.preventDefault();
  //   console.log(url);
  //   // shell.openExternal(url);
  // });
  // // 处理 window.open 跳转
  mainWindow.webContents.setWindowOpenHandler((data) => {
    // shell.openExternal(data.url);
    console.log(data);
    return {
      action: 'deny',
    };
  });

  // 允许跨域
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({
        requestHeaders: { Origin: '*', ...details.requestHeaders },
      });
    },
  );
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          'Access-Control-Allow-Origin': ['*'],
          ...details.responseHeaders,
        },
      });
    },
  );

  isDev && mainWindow.webContents.openDevTools();
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3006'
      : `file://${path.join(__dirname, '../ui/index.html')}`,
  );
}

app.whenReady().then(() => {
  createWindow();

  // 托盘图标
  const icon = nativeImage.createFromPath(
    path.resolve(__dirname, 'favicon_256.ico'),
  );
  const tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '仓库地址',
      type: 'normal',
      click: async () => {
        await shell.openExternal(
          'https://github.com/electron-admin/electron-vite-vue',
        );
      },
    },
    {
      label: 'QQ交流1群',
      type: 'normal',
      click: async () => {
        await shell.openExternal(
          'http://qm.qq.com/cgi-bin/qm/qr?k=J_cuD735wsluYuqT62WIf5OCLS7qRh1W&jump_from=webapi',
        );
      },
    },
    {
      label: 'QQ交流3群',
      type: 'normal',
      click: async () => {
        await shell.openExternal(
          'https://qm.qq.com/cgi-bin/qm/qr?k=cf5oBj3Tl9TsJ3Mk-ILzVJYi-F7tBEvI&jump_from=webapi',
        );
      },
    },
    {
      label: '显示',
      click: () => {
        mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      },
    },
    {
      role: 'minimize',
      label: '最小化',
      click: () => {
        mainWindow.minimize();
      },
    },
    {
      role: 'hide',
      label: '隐藏',
      click: () => {
        mainWindow.hide();
      },
    },
    {
      role: 'togglefullscreen',
      label: '全屏',
      click: () => {
        mainWindow.setFullScreen(mainWindow.isFullScreen() !== true);
      },
    },
    {
      label: '退出',
      click: () => {
        app.quitting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip('electron-nest-desktop\n武汉跃码教育科技有限公司');
  tray.setContextMenu(contextMenu);
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
  tray.on('click', () => {
    mainWindow.show();
  });
  // 菜单
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      label: '文档',
      submenu: [
        {
          label: 'swagger文档',
          click: async () => {
            await shell.openExternal('http://localhost:3006/api');
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
