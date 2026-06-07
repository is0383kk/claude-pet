// チャット UI の組み立て。送信→「応答中…」プレースホルダ→応答置換 の流れを担当する
import { api } from "./api.js";

interface ChatElements {
  history: HTMLOListElement;
  form: HTMLFormElement;
  input: HTMLTextAreaElement;
  send: HTMLButtonElement;
  quit: HTMLButtonElement;
}

// 履歴 li の見た目を切り替える className として使う
type MessageVariant = "user" | "assistant" | "pending" | "error";

// エラー表示文を 1 箇所に集約
const failureMessage = (detail: string): string =>
  `応答取得に失敗しました（${detail}）`;

export function setupChat(els: ChatElements): void {
  // 多重送信防止フラグ
  let pending = false;

  const submit = async (): Promise<void> => {
    if (pending) return;
    const text = els.input.value.trim();
    if (text.length === 0) {
      els.input.focus();
      return;
    }
    pending = true;
    els.send.disabled = true;
    // ユーザ発言を即時に履歴へ反映し、応答待ちのプレースホルダ行を追加
    appendMessage(els.history, "user", text);
    els.input.value = "";
    const pendingEl = appendMessage(els.history, "pending", "応答中…");

    try {
      const res = await api.chatSend({ text });
      if (res.ok) {
        // プレースホルダを実際の返答テキストに差し替え
        replaceMessage(pendingEl, "assistant", res.replyText);
      } else {
        replaceMessage(pendingEl, "error", failureMessage(res.error));
      }
    } catch (err) {
      // IPC 自体の失敗もチャット欄にエラーとして表示する
      const msg = err instanceof Error ? err.message : String(err);
      replaceMessage(pendingEl, "error", failureMessage(msg));
    } finally {
      pending = false;
      els.send.disabled = false;
      els.input.focus();
    }
  };

  // フォーム submit（送信ボタン）
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    void submit();
  });

  // Enter で送信、Shift+Enter で改行、IME 変換中（isComposing）は送信しない
  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      void submit();
    }
  });

  // 終了ボタン
  els.quit.addEventListener("click", () => {
    void api.quit();
  });

  // 起動直後に入力欄にフォーカスを当てる
  els.input.focus();
}

// 履歴末尾に新しい行を追加してスクロールを末尾に追従させる
function appendMessage(
  history: HTMLOListElement,
  variant: MessageVariant,
  text: string
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = variant;
  li.textContent = text;
  history.appendChild(li);
  history.scrollTop = history.scrollHeight;
  return li;
}

// 既存の li（プレースホルダ等）の中身と種類を差し替える
function replaceMessage(
  li: HTMLLIElement,
  variant: MessageVariant,
  text: string
): void {
  li.className = variant;
  li.textContent = text;
  const history = li.parentElement;
  if (history) {
    history.scrollTop = history.scrollHeight;
  }
}
