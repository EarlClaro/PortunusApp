import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(process.cwd(), 'preload.js') // optional for IPC
    }
  });

  const startURL = process.env.ELECTRON_START_URL || 
                   url.pathToFileURL(path.join(process.cwd(), 'dist/index.html')).href;

  mainWindow.loadURL(startURL);

  // DevTools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });
