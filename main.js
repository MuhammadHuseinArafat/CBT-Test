
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Zenith CBT - Offline Exam System",
    icon: path.join(__dirname, 'icon.ico'), // Opsional: Tambahkan file icon.ico
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Opsional jika butuh fitur native
    }
  });

  // Di production, arahkan ke file index.html hasil build
  win.loadFile('index.html');
  
  // Sembunyikan menu default (opsional agar lebih profesional)
  // win.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
