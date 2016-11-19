const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
//const util = require('./app/js/util.js')
let util = require('util');var FFI = require('ffi');

function TEXT(text){
   return new Buffer(text, 'ucs2').toString('binary');
}

var user32 = new FFI.Library("user32", {
   'MessageBoxW': 
   [
      'int32', [ 'int32', 'string', 'string', 'int32' ]
   ]
});

var OK_or_Cancel = user32.MessageBoxW(
   0, TEXT('I am Node.JS!'), TEXT('Hello, World!'), 1
);
console.log(OK_or_Cancel);


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