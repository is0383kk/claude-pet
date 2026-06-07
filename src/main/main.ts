// Main プロセス: 透過・最前面・タスクバー非表示の単一ウィンドウを生成する起点
import { app, BrowserWindow, screen } from "electron";
import * as path from "node:path";
import { registerIpcHandlers } from "./ipc-handlers";
import { WINDOW } from "../shared/constants";

function createMainWindow(): BrowserWindow {
  // タスクバーやドックを除いた作業領域の右下を初期座標にする
  const workArea = screen.getPrimaryDisplay().workArea;
  const x = workArea.x + workArea.width - WINDOW.WIDTH - WINDOW.MARGIN;
  const y = workArea.y + workArea.height - WINDOW.HEIGHT - WINDOW.MARGIN;

  const win = new BrowserWindow({
    width: WINDOW.WIDTH,
    height: WINDOW.HEIGHT,
    x,
    y,
    transparent: true, // 透過ウィンドウ
    frame: false, // タイトルバー無し
    alwaysOnTop: true, // 常に最前面
    skipTaskbar: true, // タスクバー非表示
    resizable: false,
    hasShadow: false,
    show: false, // ちらつき防止のため ready-to-show まで非表示
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "preload.js"),
      contextIsolation: true, // Renderer から Node を直接触らせない
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // フルスクリーンアプリより前面に出すため screen-saver レベルへ昇格
  win.setAlwaysOnTop(true, "screen-saver");

  // HTML はビルド対象外なので src/renderer/ 直下のものを app.getAppPath() 起点でロード
  const indexHtml = path.join(
    app.getAppPath(),
    "src",
    "renderer",
    "index.html"
  );
  win.loadFile(indexHtml);

  // 描画準備完了後に表示してチラつきを抑える
  win.once("ready-to-show", () => {
    win.show();
  });

  return win;
}

app.whenReady().then(() => {
  const win = createMainWindow();
  registerIpcHandlers(win);
});

// 全ウィンドウが閉じたらアプリ終了（Windows 専用想定）
app.on("window-all-closed", () => {
  app.quit();
});
