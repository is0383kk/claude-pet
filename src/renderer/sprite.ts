// スプライトシートから idle アニメ（row 0, 6 フレーム）を canvas にループ描画する
// セル仕様は docs/pets-guide/animation-rows.md と一致させる必要がある
import { SPRITE } from "../shared/constants.js";

const { CELL_W, CELL_H, ROW_IDLE, FRAME_DURATIONS_MS } = SPRITE;
const FRAME_COUNT = FRAME_DURATIONS_MS.length;

export async function startIdleAnimation(
  canvas: HTMLCanvasElement,
  errorEl: HTMLElement,
  spritesheetUrl: string
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // 2D コンテキストが取れない環境では代替表示に切り替える
    showError(canvas, errorEl);
    return;
  }

  let img: HTMLImageElement;
  try {
    img = await loadImage(spritesheetUrl);
  } catch (err) {
    console.warn("[sprite] image load failed", err);
    showError(canvas, errorEl);
    return;
  }

  let frame = 0;
  // setInterval ではなくフレームごとに setTimeout を連鎖させて可変尺を実現
  const tick = (): void => {
    ctx.clearRect(0, 0, CELL_W, CELL_H);
    const sx = frame * CELL_W;
    const sy = ROW_IDLE * CELL_H;
    ctx.drawImage(img, sx, sy, CELL_W, CELL_H, 0, 0, CELL_W, CELL_H);
    const duration = FRAME_DURATIONS_MS[frame];
    frame = (frame + 1) % FRAME_COUNT;
    window.setTimeout(tick, duration);
  };
  tick();
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
