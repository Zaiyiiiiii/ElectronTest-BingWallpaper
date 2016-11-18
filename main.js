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
        frame: false 
    })

    mainWindow.loadURL('file://' + __dirname + '/app/main.html')
    mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow);