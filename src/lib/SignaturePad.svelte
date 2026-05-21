<script lang="ts">
  import { generateSignature, SIGNATURE_FONTS } from './generateSignature.js';

  interface Props { label: string; autoName?: string; }
  let { label, autoName = '' }: Props = $props();

  let canvas: HTMLCanvasElement;
  let isDrawing = $state(false);
  let hasSig = $state(false);
  let showFontPicker = $state(false);
  let selectedFont = $state<string | undefined>(undefined); // undefined = auto-pick by name
  let ctx: CanvasRenderingContext2D | null = null;

  function initCtx() {
    if (!ctx) {
      ctx = canvas.getContext('2d')!;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }

  function getXY(e: MouseEvent | TouchEvent): [number, number] {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return [(t.clientX - rect.left) * scaleX, (t.clientY - rect.top) * scaleY];
    }
    return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
  }

  function startDraw(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    initCtx();
    isDrawing = true;
    showFontPicker = false;
    const [x, y] = getXY(e);
    ctx!.beginPath();
    ctx!.moveTo(x, y);
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const [x, y] = getXY(e);
    ctx!.lineTo(x, y);
    ctx!.stroke();
    hasSig = true;
  }

  function endDraw() { isDrawing = false; }

  function clear() {
    initCtx();
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    hasSig = false;
    showFontPicker = false;
  }

  async function autoSign(fontFamily?: string) {
    if (!autoName) return; // nothing to sign
    initCtx();
    const font = fontFamily ?? selectedFont;
    await generateSignature(ctx!, autoName || label, canvas.width, canvas.height, font);
    hasSig = true;
    showFontPicker = false;
  }

  async function pickFont(fontFamily: string) {
    selectedFont = fontFamily;
    await autoSign(fontFamily);
  }
</script>

<div class="sig-pad-wrap">
  <div class="sig-canvas-area" class:has-sig={hasSig}>
    <canvas
      bind:this={canvas}
      width="480"
      height="120"
      class="sig-canvas"
      onmousedown={startDraw}
      onmousemove={draw}
      onmouseup={endDraw}
      onmouseleave={endDraw}
      ontouchstart={startDraw}
      ontouchmove={draw}
      ontouchend={endDraw}
    ></canvas>
    {#if !hasSig}
      <div class="sig-hint">Sign here · or click Auto Sign</div>
    {/if}
  </div>

  <div class="sig-footer">
    <span class="sig-label-txt">{label}</span>
    <div class="sig-actions">
      {#if hasSig}
        <button class="sig-clear" onclick={clear} type="button">✕ Clear</button>
      {/if}
      <button class="sig-font-btn" onclick={() => showFontPicker = !showFontPicker} type="button" title="Choose font style">
        🖋 Style
      </button>
      <button class="sig-auto" onclick={() => autoSign()} type="button">
        {hasSig ? '↺ Redo' : '✍ Auto Sign'}
      </button>
    </div>
  </div>

  {#if showFontPicker}
    <div class="font-picker">
      <div class="font-picker-label">Choose a signature style:</div>
      <div class="font-grid">
        {#each SIGNATURE_FONTS as f}
          <button
            class="font-option"
            class:selected={selectedFont === f.family}
            style="font-family:{f.family}"
            onclick={() => pickFont(f.family)}
            type="button"
          >
            {autoName ? autoName.split(',').reverse().join(' ').trim().split(' ').slice(0,2).join(' ') || 'Signature' : 'Signature'}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .sig-pad-wrap { width: 100%; }

  .sig-canvas-area {
    position: relative;
    width: 100%;
    height: 82px;
    border: 1.5px solid #ccc;
    border-radius: 6px;
    background: #fafafa;
    cursor: crosshair;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .sig-canvas-area:hover { border-color: #999; }
  .sig-canvas-area.has-sig { background: white; border-color: #555; }

  .sig-canvas { width: 100%; height: 100%; display: block; touch-action: none; }

  .sig-hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #bbb;
    pointer-events: none;
    font-style: italic;
  }

  .sig-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }
  .sig-label-txt {
    font-size: 10px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .sig-actions { display: flex; gap: 4px; align-items: center; }

  .sig-auto {
    background: #f0f4ff;
    border: 1px solid #b0c4ff;
    border-radius: 4px;
    font-size: 10px;
    color: #3355cc;
    cursor: pointer;
    padding: 2px 8px;
    font-weight: 600;
  }
  .sig-auto:hover { background: #dce8ff; border-color: #3355cc; }

  .sig-font-btn {
    background: #f8f4ff;
    border: 1px solid #d0b8ff;
    border-radius: 4px;
    font-size: 10px;
    color: #6633cc;
    cursor: pointer;
    padding: 2px 7px;
  }
  .sig-font-btn:hover { background: #ede0ff; }

  .sig-clear {
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 10px;
    color: #999;
    cursor: pointer;
    padding: 2px 8px;
  }
  .sig-clear:hover { border-color: #f44; color: #f44; }

  /* Font picker panel */
  .font-picker {
    margin-top: 6px;
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 12px;
  }
  .font-picker-label {
    font-size: 10px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }
  .font-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .font-option {
    background: white;
    border: 1.5px solid #ddd;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 18px;
    cursor: pointer;
    text-align: center;
    color: #111;
    transition: all 0.15s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .font-option:hover { border-color: #3355cc; background: #f0f4ff; }
  .font-option.selected { border-color: #3355cc; background: #e8efff; }

  @media print {
    .sig-clear, .sig-hint, .sig-actions, .font-picker { display: none !important; }
    .sig-pad-wrap { width: 100%; }
    .sig-canvas-area {
      border: none;
      border-bottom: 1px solid #333;
      border-radius: 0;
      background: white;
      height: 32px !important;
      min-height: 0 !important;
    }
    .sig-footer { margin-top: 1px; }
    .sig-label-txt { font-size: 7px; }
  }
</style>
