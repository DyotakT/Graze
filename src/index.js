const { app, BrowserWindow } = require('electron');
const path = require('path');
const screenElectron = app.BrowserWindow;
const screenElectron2 = app.screen;
// const fileSystem = require('browserify-fs');
const fileSystem = require('fs');
var screenWidth = 0;

console.log(screenElectron2);
// import { Screen } from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// import {screen} from electron;
// const{width, height} = screen.getPrimaryDisplay().workAreaSize;

const createWindow = () => {
  //  let display = electron.screen.getPrimaryDisplay();
  //  let width = display...
  // Create the browser window.
    const {screen} = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    screenWidth = width;
    writeToSettings();

    const mainWindow = new BrowserWindow({
    width: width,
    height: width*0.1,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      devTools: false
    },
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    // alwaysOnTop: true,
    fullscreen: true,
    setIgnoreMouseEvents: false,
  });
  mainWindow.setIgnoreMouseEvents(false);
  // mainWindow.setPosition(0,988)
  mainWindow.setAlwaysOnTop(true, "floating");
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools(); 
  mainWindow.maximize();

};



function writeToSettings() {
  const client = {
    "screenWidth": screenWidth,
  }
  const data = JSON.stringify(client);
  fileSystem.writeFileSync("settings.json", data);
}

// fileSystem.writeFile("../settings.json", data, err=>{
//  if(err){
//    console.log("Error writing file" ,err)
//  } else {
//    console.log('JSON data is written to the file successfully')
//  }
// })
// const win = BrowserWindow.getFocusedWindow();
// // let win = BrowserWindow.getAllWindows()[0];
// win.setIgnoreMouseEvents(true);
  

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

app.on('ready',createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
