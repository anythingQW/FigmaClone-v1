const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

const STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { width: 1400, height: 900 };
}

function saveWindowState() {
  if (!mainWindow) return;
  try {
    const bounds = mainWindow.getBounds();
    fs.writeFileSync(STATE_FILE, JSON.stringify({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: mainWindow.isMaximized(),
    }));
  } catch (e) {}
}

function createWindow() {
  const state = loadWindowState();

  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#09090b',
    title: 'Flavor — Vector Graphic Editor',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (state.isMaximized) mainWindow.maximize();

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New Project', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:new-project'))") },
        { type: 'separator' },
        {
          label: 'Export',
          submenu: [
            { label: 'Export as JSON', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:export', {detail:'json'}))") },
            { label: 'Export as PNG', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:export', {detail:'png'}))") },
            { label: 'Export as SVG', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:export', {detail:'svg'}))") },
          ]
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:undo'))") },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:redo'))") },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:select-all'))") },
        { label: 'Duplicate', accelerator: 'CmdOrCtrl+D', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:duplicate'))") },
        { label: 'Delete', accelerator: 'Delete', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:delete'))") },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Select (V)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'select'}))") },
        { label: 'Hand (H)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'hand'}))") },
        { type: 'separator' },
        { label: 'Rectangle (R)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'rectangle'}))") },
        { label: 'Ellipse (O)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'ellipse'}))") },
        { label: 'Line (L)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'line'}))") },
        { label: 'Text (T)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'text'}))") },
        { label: 'Frame (F)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:tool', {detail:'frame'}))") },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Shortcuts (Shift+?)', click: () => mainWindow.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('app:shortcuts'))") },
        { type: 'separator' },
        { label: 'GitHub Repository', click: () => shell.openExternal('https://github.com') },
        { label: 'About Flavor', click: () => dialog.showMessageBox(mainWindow, { type: 'info', title: 'About Flavor', message: 'Flavor v1.0.0', detail: 'A collaborative vector graphic editor.\nBuilt with Next.js, Electron, and Canvas.' }) },
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe'
  });

  const loadApp = () => {
    mainWindow.loadURL('http://localhost:8080').catch(() => {
      setTimeout(loadApp, 1000);
    });
  };

  serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Ready on http://localhost:8080')) {
      loadApp();
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server: ${data}`);
  });

  setTimeout(() => {
    if (mainWindow && mainWindow.webContents.getURL() === '') {
      loadApp();
    }
  }, 10000);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  saveWindowState();
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
