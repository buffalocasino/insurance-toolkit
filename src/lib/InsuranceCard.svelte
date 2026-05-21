<script lang="ts">
  import type { Agency } from './agencies.js';
  interface Props { data: any; agency: Agency; }
  let { data, agency }: Props = $props();

  let flipped = $state(false);

  const fmt = (v: string | number | undefined, fallback = '') => v ?? fallback;

  const fmtDate = (v: string | undefined) => {
    if (!v) return 'MM/DD/YYYY';
    const d = new Date(v);
    return (d.getMonth() + 1).toString().padStart(2, '0') + '/' + d.getDate().toString().padStart(2, '0') + '/' + d.getFullYear();
  };

  const cardEffDate = $derived(data.effectiveDate);
  const cardExpDate = $derived(data.expirationDate);

  const veh = $derived(data.vehicles?.[0] ?? {
    year: data.vehYear,
    make: data.vehMake,
    model: data.vehModel,
    vin: data.vehVin,
    color: data.vehColor,
  });
</script>

<div class="card-wrap">
  <!-- State title above card -->
  <div class="state-title">SOUTH DAKOTA PROOF OF INSURANCE</div>

  <!-- Flip container -->
  <div class="flip-scene">
    <div class="flip-card" class:is-flipped={flipped}>

      <!-- ── FRONT ── -->
      <div class="flip-face front" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">
        <div class="card-header">
          {#if agency.logo}
            <div class="logo-box"><img src="/logos/{agency.logo}" alt={agency.shortName} class="logo-img" /></div>
          {:else}
            <svg viewBox="0 0 40 40" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill={agency.primaryColor} stroke={agency.darkColor} stroke-width="1.5"/>
              <text x="20" y="28" font-family="Arial Black,Arial" font-size="18" font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
            </svg>
          {/if}
          <div class="header-text">
            <strong>{agency.name}</strong>
            <small>Proof of Insurance — Vehicle</small>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="info-label">Policy #</span>
            <span class="info-value">{fmt(data.policyNumber)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Effective</span>
            <span class="info-value">{fmtDate(cardEffDate)}</span>
            <span class="info-label" style="margin-left:10px">Expires</span>
            <span class="info-value">{fmtDate(cardExpDate)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Insured</span>
            <span class="info-value full">{fmt(data.insuredName)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Vehicle</span>
            <span class="info-value full">{fmt(veh.year)} {fmt(veh.make)} {fmt(veh.model)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">VIN</span>
            <span class="info-value mono">{fmt(veh.vin)}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="agent-info">
            <span class="info-label">Agent:</span> {fmt(data.agentName)}{data.agentPhone ? ' · ' + data.agentPhone : ''}
            {#if data.agentAddress}<div style="font-size:8px;color:#aaa;margin-top:1px">{fmt(data.agentAddress)}</div>{/if}
          </div>
          <button class="flip-btn" onclick={() => flipped = true} style="color:{agency.primaryColor}">
            See Back ▶
          </button>
        </div>
      </div>

      <!-- ── BACK ── -->
      <div class="flip-face back" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">
        <div class="card-header back-header">
          {#if agency.logo}
            <div class="logo-box logo-box-sm"><img src="/logos/{agency.logo}" alt={agency.shortName} class="logo-img" /></div>
          {:else}
            <svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill={agency.darkColor} stroke={agency.darkColor} stroke-width="1.5"/>
              <text x="20" y="28" font-family="Arial Black,Arial" font-size="18" font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
            </svg>
          {/if}
          <div class="misrep-warning">
            MISREPRESENTATION OF INSURANCE IS A FIRST DEGREE MISDEMEANOR
          </div>
        </div>

        <div class="card-body back-body">
          <div class="symbol-intro">How to identify your coverage — See policy for full name and definition</div>
          <div class="symbol-grid">
            <div class="sym"><b>A</b> Bodily Injury Liability</div>
            <div class="sym"><b>B</b> Property Damage Liability</div>
            <div class="sym"><b>C</b> Medical Payments</div>
            <div class="sym"><b>D</b> Comprehensive</div>
            <div class="sym"><b>G</b> Collision</div>
            <div class="sym"><b>H</b> Emergency Road Service</div>
            <div class="sym"><b>P</b> No-Fault</div>
            <div class="sym"><b>R1</b> Car Rental &amp; Travel Expenses</div>
            <div class="sym"><b>S</b> Death, Dismemberment &amp; Loss of Sight</div>
            <div class="sym"><b>U</b> Uninsured Motor Vehicle</div>
            <div class="sym"><b>U3</b> Uninsured Motor Vehicle Nonstacked</div>
            <div class="sym"><b>ONOC</b> Use of Nonowned Cars</div>
          </div>
        </div>

        <div class="card-footer">
          <div class="agent-info" style="font-size:8px">
            Claims: <strong>{agency.claimsPhone}</strong> · {agency.website}
          </div>
          <button class="flip-btn" onclick={() => flipped = false} style="color:{agency.primaryColor}">
            ◄ Front
          </button>
        </div>
      </div>

    </div><!-- /flip-card -->
  </div><!-- /flip-scene -->
</div>

<style>
  @media print {
    .flip-btn { display: none !important; }
    .state-title { font-size: 8pt; }
    /* Print both sides stacked */
    .flip-scene { perspective: none; }
    .flip-card { transform: none !important; position: static; }
    .flip-face { position: static; backface-visibility: visible !important; transform: none !important; }
    .flip-face.back { margin-top: 12px; border-top: 2px dashed #ccc; }
  }

  .card-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    gap: 6px;
  }

  .state-title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #555;
    text-align: center;
  }

  .flip-scene {
    perspective: 1000px;
    width: 3.375in;
  }

  .flip-card {
    width: 100%;
    min-height: 2.8in;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
  }
  .flip-card.is-flipped { transform: rotateY(180deg); }

  .flip-face {
    width: 100%;
    background: white;
    border: 2px solid var(--brand);
    border-radius: 10px;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    color: #1a1a1a;
    box-shadow: 0 3px 12px rgba(0,0,0,0.12);
    backface-visibility: hidden;
  }

  .flip-face.back {
    position: absolute;
    top: 0; left: 0;
    transform: rotateY(180deg);
  }

  /* ── Header ── */
  .card-header {
    background: var(--brand);
    color: white;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo-box {
    background: white;
    border-radius: 5px;
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    flex-shrink: 0;
  }
  .logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .header-text { display: flex; flex-direction: column; line-height: 1.3; }
  .header-text strong { font-size: 12px; letter-spacing: 0.3px; }
  .header-text small { font-size: 9px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Body ── */
  .card-body { padding: 8px 10px; }
  .info-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 3px;
    flex-wrap: wrap;
  }
  .info-label {
    font-size: 9px;
    font-weight: 700;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    width: 52px;
    flex-shrink: 0;
  }
  .info-value { font-size: 11px; font-weight: 600; }
  .info-value.full { flex: 1; }
  .info-value.mono { font-family: 'Courier New', monospace; font-size: 9px; }

  /* ── Back header ── */
  .back-header {
    background: var(--brand-dark) !important;
    padding: 6px 10px !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }
  .logo-box-sm {
    width: 28px !important;
    height: 22px !important;
    flex-shrink: 0;
  }
  .misrep-warning {
    font-size: 8px;
    font-weight: 800;
    color: white;
    line-height: 1.35;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex: 1;
  }

  /* ── Back body ── */
  .back-body { padding: 6px 10px; }
  .symbol-intro {
    font-size: 8px;
    font-style: italic;
    color: #555;
    margin-bottom: 5px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 3px;
  }
  .symbol-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 8px;
  }
  .sym {
    font-size: 8.5px;
    color: #222;
    line-height: 1.4;
  }
  .sym b {
    color: var(--brand-dark);
    font-weight: 800;
    margin-right: 2px;
  }

  /* ── Footer ── */
  .card-footer {
    background: var(--brand-light, #f8f8f8);
    border-top: 1px solid #ddd;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .agent-info { font-size: 9px; color: #555; flex: 1; }
  .flip-btn {
    border: 2px solid currentColor;
    border-radius: 5px;
    background: white;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    padding: 3px 10px;
    white-space: nowrap;
    opacity: 0.9;
    letter-spacing: 0.3px;
  }
  .flip-btn:hover { opacity: 1; background: color-mix(in srgb, currentColor 10%, white); }
</style>
