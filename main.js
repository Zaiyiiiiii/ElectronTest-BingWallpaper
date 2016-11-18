const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
//const util = require('./app/js/util.js')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        transparent: true,
        frame: false,
        //fullscreen: true
    })

    mainWindow.loadURL('file://' + __dirname + '/app/main.html')
    mainWindow.webContents.openDevTools()

    mainWindow.webContents.session.on('will-download', (e, item) => {
        const totalBytes = item.getTotalBytes();
        item.on('updated', () => {
            console.log((item.getReceivedBytes() / totalBytes).toString());
        });

        item.on('done', (e, state) => {
            if (!mainWindow.isDestroyed()) {
            }
            if (state === 'interrupted') {
                electron.dialog.showInfoBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
            }
            if (state === 'completed') {
            }
        });
    });
}

app.on('ready', createWindow);