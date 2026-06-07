// Preload: contextIsolation 有効下で Renderer に IPC ラッパだけを公開する橋渡し層
import { contextBridge, ipcRenderer } from "electron";
import {
  IPC,
  type ChatSendReq,
  type ChatSendRes,
  type WindowSetPositionReq,
  type WindowSetPositionRes,
  type WindowGetPositionRes,
  type PetGetSpritesheetUrlRes,
} from "../shared/ipc-contract";

// Renderer の window.api として露出する API 群。Node 機能は一切渡さず IPC 呼び出しのみに限定する
const api = {
  chatSend: (req: ChatSendReq): Promise<ChatSendRes> =>
    ipcRenderer.invoke(IPC.chatSend, req),
  setWindowPosition: (
    req: WindowSetPositionReq
  ): Promise<WindowSetPositionRes> =>
    ipcRenderer.invoke(IPC.windowSetPosition, req),
  getWindowPosition: (): Promise<WindowGetPositionRes> =>
    ipcRenderer.invoke(IPC.windowGetPosition),
  quit: (): Promise<void> => ipcRenderer.invoke(IPC.appQuit),
  getSpritesheetUrl: (): Promise<PetGetSpritesheetUrlRes> =>
    ipcRenderer.invoke(IPC.petGetSpritesheetUrl),
};

contextBridge.exposeInMainWorld("api", api);

// Renderer 側で window.api の型として参照する
export type Api = typeof api;
