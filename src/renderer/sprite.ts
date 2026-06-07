// スプライトシートからアニメ行を canvas にループ描画する。
// idle (row 0) を基本に、ドラッグ中は running-right (row 1) / running-left (row 2) に切り替えられる。
// セル仕様は docs/pets-guide/animation-rows.md と一致させる必要がある
import { SPRITE } from "../shared/constants.js";

const {
  CELL_W,
  CELL_H,
  ROW_IDLE,
  ROW_RUNNING_RIGHT,
  ROW_RUNNING_LEFT,
  IDLE_FRAME_DURATIONS_MS,
  RUNNING_FRAME_DURATIONS_MS,
} = SPRITE;

export type AnimationState = "idle" | "running-right" | "running-left";

export interface SpriteController {
  setAnimationState(next: AnimationState): void;
  endRunning(): void;
}

interface AnimationDef {
  row: number;
  durations: readonly number[];
}

const ANIMATIONS: Record<AnimationState, AnimationDef> = {
  "idle": { row: ROW_IDLE, durations: IDLE_FRAME_DURATIONS_MS },
  "running-right": { row: ROW_RUNNING_RIGHT, durations: RUNNING_FRAME_DURATIONS_MS },
  "running-left": { row: ROW_RUNNING_LEFT, durations: RUNNING_FRAME_DURATIONS_MS },
};

export async function startIdleAnimation(
  canvas: HTMLCanvasElement,
  errorEl: HTMLElement,
  spritesheetUrl: string
): Promise<SpriteController> {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    showError(canvas, errorEl);
    return noopController();
  }

  let img: HTMLImageElement;
  try {
    img = await loadImage(spritesheetUrl);
  } catch (err) {
    console.warn("[sprite] image load failed", err);
    showError(canvas, errorEl);
    return noopController();
  }

  let currentState: AnimationState = "idle";
  let currentFrame = 0;
  let timeoutId: number | null = null;

  const drawCurrent = (): void => {
    const { row } = ANIMATIONS[currentState];
    ctx.clearRect(0, 0, CELL_W, CELL_H);
    ctx.drawImage(img, currentFrame * CELL_W, row * CELL_H, CELL_W, CELL_H, 0, 0, CELL_W, CELL_H);
  };

  const cancelNext = (): void => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const scheduleNext = (): void => {
    const { durations } = ANIMATIONS[currentState];
    timeoutId = window.setTimeout(() => {
      currentFrame = (currentFrame + 1) % durations.length;
      drawCurrent();
      scheduleNext();
    }, durations[currentFrame]);
  };

  drawCurrent();
  scheduleNext();

  const setAnimationState = (next: AnimationState): void => {
    if (next === currentState) return;
    cancelNext();
    currentState = next;
    currentFrame = 0;
    drawCurrent();
    scheduleNext();
  };

  const endRunning = (): void => {
    if (currentState === "idle") return;
    cancelNext();
    const { durations } = ANIMATIONS[currentState];
    currentFrame = durations.length - 1;
    drawCurrent();
    // 最終フレームを規定時間見せた後、idle 先頭へ切り替えてループ再開
    timeoutId = window.setTimeout(() => {
      currentState = "idle";
      currentFrame = 0;
      drawCurrent();
      scheduleNext();
    }, durations[currentFrame]);
  };

  return { setAnimationState, endRunning };
}

// HTMLImageElement のロードを Promise 化
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load: ${src}`));
    img.src = src;
  });
}

// canvas を隠してエラー要素に切り替える共通処理。bootstrap 失敗時にも再利用する
export function showError(canvas: HTMLCanvasElement, errorEl: HTMLElement): void {
  canvas.hidden = true;
  errorEl.hidden = false;
}

// sprite 初期化失敗時に渡す no-op コントローラ。drag 側からの呼び出しを黙って吸収する
export function noopController(): SpriteController {
  return {
    setAnimationState: () => {},
    endRunning: () => {},
  };
}
