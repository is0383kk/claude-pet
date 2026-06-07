// frameless ウィンドウのドラッグ移動。screenX/Y の差分をウィンドウ座標に加算して反映する
import { api } from "./api.js";

// ドラッグ開始時のスクリーン座標とウィンドウ座標を保持する
interface DragState {
  pointerId: number;
  startScreenX: number;
  startScreenY: number;
  startWindowX: number;
  startWindowY: number;
}

export function enableWindowDrag(handle: HTMLElement): void {
  let state: DragState | null = null;

  handle.addEventListener("pointerdown", async (e) => {
    // 左クリックのみ受け付ける
    if (e.button !== 0) return;
    // [data-no-drag] 配下（チャット UI など）はドラッグ対象外
    const target = e.target as HTMLElement | null;
    if (target && target.closest("[data-no-drag]")) {
      return;
    }
    try {
      // 初期ウィンドウ座標を Main から取得し、以降の差分計算の基準にする
      const pos = await api.getWindowPosition();
      state = {
        pointerId: e.pointerId,
        startScreenX: e.screenX,
        startScreenY: e.screenY,
        startWindowX: pos.x,
        startWindowY: pos.y,
      };
      // ドラッグ中は要素外に出てもイベントを取り続ける
      handle.setPointerCapture(e.pointerId);
    } catch (err) {
      console.warn("[drag] failed to capture window position", err);
    }
  });

  handle.addEventListener("pointermove", (e) => {
    if (!state || e.pointerId !== state.pointerId) return;
    // 開始位置からの差分を初期ウィンドウ座標に加えて新しい位置を算出
    const dx = e.screenX - state.startScreenX;
    const dy = e.screenY - state.startScreenY;
    const x = state.startWindowX + dx;
    const y = state.startWindowY + dy;
    api.setWindowPosition({ x, y }).catch((err) => {
      console.warn("[drag] setWindowPosition failed", err);
    });
  });

  // pointerup と pointercancel の両方で終了処理を行う共通ハンドラ
  const endDrag = (e: PointerEvent): void => {
    if (!state || e.pointerId !== state.pointerId) return;
    try {
      handle.releasePointerCapture(state.pointerId);
    } catch {
      // 既に解放済みなどは無視
    }
    state = null;
  };

  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);
}
