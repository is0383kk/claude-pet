// Renderer 側から触る window.api の型付きラッパ。実体は preload で contextBridge 経由に注入される
import type {
  ChatSendReq,
  ChatSendRes,
  WindowGetPositionRes,
  WindowSetPositionReq,
  WindowSetPositionRes,
} from "../shared/ipc-contract";

export interface RendererApi {
  chatSend(req: ChatSendReq): Promise<ChatSendRes>;
  setWindowPosition(req: WindowSetPositionReq): Promise<WindowSetPositionRes>;
  getWindowPosition(): Promise<WindowGetPositionRes>;
  quit(): Promise<void>;
  getSpritesheetUrl(): Promise<string>;
}

// グローバル Window に api プロパティが生えていることを TS に伝える
declare global {
  interface Window {
    api: RendererApi;
  }
}

// 各モジュールはこの api を import して使う（直接 window.api を叩かない）
export const api: RendererApi = window.api;
