// Окно игры. В своём приложении Esc принадлежит нам целиком: браузер
// не может отобрать полноэкранный режим, поэтому Esc открывает меню
// и ничего больше. Выход из полного экрана — F11 или кнопка в игре.
const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

let win = null;

function create() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#05040a",
    title: "ЗАБОЙ",
    fullscreen: true,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "game.html"));
  win.once("ready-to-show", () => win.show());

  // F11 — полный экран туда-обратно, как везде
  win.webContents.on("before-input-event", (e, input) => {
    if (input.type === "keyDown" && input.key === "F11") {
      win.setFullScreen(!win.isFullScreen());
      e.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  create();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) create(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("will-quit", () => globalShortcut.unregisterAll());
