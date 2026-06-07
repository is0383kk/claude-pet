// IPC ハンドラの一括登録。Renderer からの window.api 経由の呼び出しを Main 側の処理に橋渡しする
import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "node:path";
import * as url from "node:url";
import {
  IPC,
  type ChatSendReq,
  type ChatSendRes,
  type WindowSetPositionReq,
  type WindowSetPositionRes,
  type WindowGetPositionRes,
  type PetGetSpritesheetUrlRes,
} from "../shared/ipc-contract";
import * as agentClient from "./agent-client";
import { PET_ASSETS, PET_ID } from "../shared/constants";

export function registerIpcHandlers(win: BrowserWindow): void {
  // チャット送信: Agent SDK へ委譲し結果を返す
  ipcMain.handle(
    IPC.chatSend,
    async (_e, req: ChatSendReq): Promise<ChatSendRes> => {
      if (!req || typeof req.text !== "string") {
        return { ok: false, error: "不正なリクエスト" };
      }
      return agentClient.send(req.text);
    }
  );

  // ウィンドウ位置の設定（ドラッグ移動で利用）。整数化が必要なため Math.round で丸める
  ipcMain.handle(
    IPC.windowSetPosition,
    (_e, req: WindowSetPositionReq): WindowSetPositionRes => {
      try {
        const x = Math.round(req.x);
        const y = Math.round(req.y);
        win.setPosition(x, y);
        return { ok: true };
      } catch (err) {
        console.warn("[window:setPosition] failed", err);
        return { ok: false };
      }
    }
  );

  // ウィンドウ位置の取得（ドラッグ開始時の基準値として使う）
  ipcMain.handle(
    IPC.windowGetPosition,
    (): WindowGetPositionRes => {
      const [x, y] = win.getPosition();
      return { x, y };
    }
  );

  // 終了ボタン押下でアプリ全体を終了
  ipcMain.handle(IPC.appQuit, (): void => {
    app.quit();
  });

  // スプライトシートを file:// URL に変換して返す（Renderer から相対パスでは届かないため）
  ipcMain.handle(
    IPC.petGetSpritesheetUrl,
    (): PetGetSpritesheetUrlRes => {
      const abs = path.join(
        app.getAppPath(),
        PET_ASSETS.ROOT_DIR,
        PET_ID,
        PET_ASSETS.SPRITESHEET_FILENAME
      );
      return url.pathToFileURL(abs).href;
    }
  );
}
