// IPC チャネル名・リクエスト/レスポンス型の単一の真実
// Main / Preload / Renderer の 3 領域から import される

// IPC チャネル名定数。チャネルを追加する場合はここを起点に preload と main を同時更新する
export const IPC = {
  chatSend: "chat:send",
  windowSetPosition: "window:setPosition",
  windowGetPosition: "window:getPosition",
  appQuit: "app:quit",
  petGetSpritesheetUrl: "pet:getSpritesheetUrl",
} as const;

// チャット送信のリクエスト/レスポンス。エラーは文字列で返してチャット欄に表示する
export type ChatSendReq = { text: string };
export type ChatSendRes =
  | { ok: true; replyText: string }
  | { ok: false; error: string };

// ウィンドウ位置の設定/取得（ドラッグで利用）
export type WindowSetPositionReq = { x: number; y: number };
export type WindowSetPositionRes = { ok: boolean };

export type WindowGetPositionRes = { x: number; y: number };

// スプライトシートの file:// URL（Renderer から相対パスで届かないため Main で解決する）
export type PetGetSpritesheetUrlRes = string;
