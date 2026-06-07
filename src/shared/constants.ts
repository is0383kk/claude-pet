// プロジェクト全体で参照する定数の集約。
// Main / Preload / Renderer のいずれからも参照可能（純粋な値のみを置くこと）。

// ウィンドウレイアウト（Main プロセスで利用）
export const WINDOW = {
  // 透過ウィンドウのサイズ
  WIDTH: 520,
  HEIGHT: 320,
  // 画面端からのマージン（右下寄せの隙間）
  MARGIN: 24,
} as const;

// 現在表示するペットの識別子。pets/<PET_ID>/ 以下を読む
export const PET_ID = "sample";

// ペットアセットのファイル名規約
export const PET_ASSETS = {
  ROOT_DIR: "pets",
  SPRITESHEET_FILENAME: "spritesheet.webp",
} as const;

// スプライトシート仕様（docs/pets-guide/animation-rows.md と一致させること）
export const SPRITE = {
  // 1 セルの大きさ
  CELL_W: 192,
  CELL_H: 208,
  // 行 0 が idle 状態
  ROW_IDLE: 0,
  // 各フレームの表示時間（ms）。長短を混ぜて自然な揺らぎを出す
  FRAME_DURATIONS_MS: [280, 110, 110, 140, 140, 320],
} as const;

// Agent SDK 関連の固定設定（Main プロセスで利用）
export const AGENT_SDK_PACKAGE = "@anthropic-ai/claude-agent-sdk";

// query() に渡すデフォルトオプション。読み取り系のみ許可
export const AGENT_OPTIONS = {
  ALLOWED_TOOLS: ["Read", "Glob", "Grep"],
  PERMISSION_MODE: "default",
  // プロジェクト直下の .claude/settings.json を読む
  SETTING_SOURCES: ["project"],
} as const;
