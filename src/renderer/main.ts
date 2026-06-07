// Renderer のエントリ。DOM を集約して各機能（ドラッグ・チャット・スプライト）を配線する
import { api } from "./api.js";
import {
  startIdleAnimation,
  showError as showSpriteError,
  noopController,
  type SpriteController,
} from "./sprite.js";
import { enableWindowDrag } from "./drag.js";
import { setupChat } from "./chat.js";

async function bootstrap(): Promise<void> {
  // 必要な DOM 要素を一括取得（欠落していれば即時例外でフェイルファスト）
  const petArea = requireEl<HTMLDivElement>("pet-area");
  const canvas = requireEl<HTMLCanvasElement>("pet");
  const petError = requireEl<HTMLDivElement>("pet-error");
  const history = requireEl<HTMLOListElement>("history");
  const form = requireEl<HTMLFormElement>("composer");
  const input = requireEl<HTMLTextAreaElement>("input");
  const send = requireEl<HTMLButtonElement>("send");
  const quit = requireEl<HTMLButtonElement>("quit");

  // スプライトを先に初期化し、得られた controller をドラッグに引き渡す
  let spriteController: SpriteController;
  try {
    const url = await api.getSpritesheetUrl();
    spriteController = await startIdleAnimation(canvas, petError, url);
  } catch (err) {
    console.warn("[bootstrap] sprite init failed", err);
    showSpriteError(canvas, petError);
    spriteController = noopController();
  }

  // ペットエリアをドラッグハンドルに、チャット UI に各種ハンドラを登録
  enableWindowDrag(petArea, spriteController);
  setupChat({ history, form, input, send, quit });
}

// id 指定で要素を取得し、無ければ例外を投げるヘルパ
function requireEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`element not found: #${id}`);
  }
  return el as T;
}

// トップレベル await を避けつつ、Promise の浮きを void で明示
void bootstrap();
