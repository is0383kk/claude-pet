// Agent SDK の query() ラッパ。session_id を保持して連続会話を成立させる
import { AGENT_OPTIONS, AGENT_SDK_PACKAGE } from "../shared/constants";

type ChatResult =
  | { ok: true; replyText: string }
  | { ok: false; error: string };

// SDK から init で受け取った session_id を保持し、次回以降の query に resume として渡す
let sessionId: string | undefined;

// 型のためのインポート参照。ts は import() の引数を文字列リテラルで要求するため定数化はしない
type SdkModule = typeof import("@anthropic-ai/claude-agent-sdk");
type QueryFn = SdkModule["query"];

// CommonJS 出力でも ESM-only の SDK を読めるよう Function 経由で動的 import する
const dynamicImport = new Function(
  "specifier",
  "return import(specifier)"
) as (specifier: string) => Promise<SdkModule>;

// 起動コスト軽減のため初回ロード後はキャッシュ
let cachedQuery: QueryFn | undefined;

async function loadQuery(): Promise<QueryFn> {
  if (cachedQuery) return cachedQuery;
  const mod = await dynamicImport(AGENT_SDK_PACKAGE);
  cachedQuery = mod.query;
  return cachedQuery;
}

// 1 ターンのチャット送信。例外はすべて { ok: false } に正規化してクラッシュさせない
export async function send(text: string): Promise<ChatResult> {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "空のメッセージは送信できません" };
  }

  try {
    const query = await loadQuery();
    const stream = query({
      prompt: trimmed,
      options: {
        resume: sessionId, // 2 回目以降は前回セッションを継続
        allowedTools: [...AGENT_OPTIONS.ALLOWED_TOOLS],
        permissionMode: AGENT_OPTIONS.PERMISSION_MODE,
        settingSources: [...AGENT_OPTIONS.SETTING_SOURCES],
      },
    });

    let replyText = "";
    let lastError: string | undefined;

    // ストリーミングメッセージから session_id と最終結果を拾う
    for await (const message of stream) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
        continue;
      }
      if (message.type === "result") {
        if (message.subtype === "success") {
          replyText = message.result;
        } else {
          // 失敗系の result は subtype と最初のエラー文を連結して表示用に整形
          lastError = `${message.subtype}: ${
            message.errors?.[0] ?? "詳細なし"
          }`;
        }
      }
    }

    if (lastError) {
      return { ok: false, error: lastError };
    }
    if (replyText.length === 0) {
      return { ok: false, error: "応答が空でした" };
    }
    return { ok: true, replyText };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}
