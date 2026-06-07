// frameless ウィンドウのドラッグ移動。screenX/Y の差分をウィンドウ座標に加算して反映する。
// あわせて pointermove ごとの水平デルタから sprite の row（idle / running-right / running-left）を切り替える
import { api } from "./api.js";
import type { SpriteController } from "./sprite.js";
import { SPRITE } from "../shared/constants.js";

const { RUNNING_DX_THRESHOLD_PX, RUNNING_IDLE_REVERT_MS } = SPRITE;

// ドラッグ開始時のスクリーン座標とウィンドウ座標を保持する
interface DragState {
  pointerId: number;
  startScreenX: number;
  startScreenY: number;
  startWindowX: number;
  startWindowY: number;
}

export function enableWindowDrag(
  handle: HTMLElement,
  sprite: SpriteController
): void {
  let state: DragState | null = null;
  // 向き判定とアイドル復帰用。ドラッグ寿命と一致するため closure 変数で保持する
  let lastScreenX = 0;
  let idleRevertTimerId: number | null = null;

  const clearIdleRevert = (): void => {
    if (idleRevertTimerId !== null) {
      window.clearTimeout(idleRevertTimerId);
      idleRevertTimerId = null;
    }
  };

  handle.addEventListener("pointerdown", async (e) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest("[data-no-drag]")) {
      return;
    }
    try {
      const pos = await api.getWindowPosition();
      state = {
        pointerId: e.pointerId,
        startScreenX: e.screenX,
        startScreenY: e.screenY,
        startWindowX: pos.x,
        startWindowY: pos.y,
      };
      lastScreenX = e.screenX;
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

    // pointermove 1 回ごとの水平デルタで running-right / running-left を判定する
    const frameDx = e.screenX - lastScreenX;
    lastScreenX = e.screenX;
    if (Math.abs(frameDx) >= RUNNING_DX_THRESHOLD_PX) {
      sprite.setAnimationState(frameDx > 0 ? "running-right" : "running-left");
      clearIdleRevert();
      idleRevertTimerId = window.setTimeout(() => {
        sprite.setAnimationState("idle");
        idleRevertTimerId = null;
      }, RUNNING_IDLE_REVERT_MS);
    }
  });

  // pointerup と pointercancel の両方で終了処理を行う共通ハンドラ
  const endDrag = (e: PointerEvent): void => {
    if (!state || e.pointerId !== state.pointerId) return;
    clearIdleRevert();
    try {
      handle.releasePointerCapture(state.pointerId);
    } catch {
      // 既に解放済みなどは無視
    }
    state = null;
    sprite.endRunning();
  };

  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);
}
