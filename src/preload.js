// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')
const electron = require('electron')
var screenElectron = electron.screen
contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
})

// const BrowserWindow = electron.remote.BrowserWindow;
  
// const win = BrowserWindow.getFocusedWindow();
// // let win = BrowserWindow.getAllWindows()[0];
// win.setIgnoreMouseEvents(true);
  
// // var forward = document.getElementById('forward');
// // forward.addEventListener('mouseenter', () => {
// //     console.log('Mouse Entered the Region...Disabling Click')
//     win.setIgnoreMouseEvents(true, { forward: true });
// // });
  
// // forward.addEventListener('mouseleave', () => {
// //     console.log('Mouse Left the Region...Event Emitted')
// //     win.setIgnoreMouseEvents(false);
// // });