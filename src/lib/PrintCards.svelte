<script lang="ts">
  import type { Agency } from './agencies.js';
  interface Props { data: any; agency: Agency; }
  let { data, agency }: Props = $props();

  const fmt = (v: string | number | undefined, fallback = '') => v ?? fallback;
  const fmtDate = (v: string | undefined) => {
    if (!v) return 'MM/DD/YYYY';
    const d = new Date(v);
    return (d.getMonth()+1).toString().padStart(2,'0') + '/' +
           d.getDate().toString().padStart(2,'0') + '/' + d.getFullYear();
  };
  const veh1 = $derived(data.vehicles?.[0] ?? { year: data.vehYear, make: data.vehMake, model: data.vehModel, vin: data.vehVin });
  const veh2 = $derived(data.vehicles?.[1] ?? null);
</script>

<!--
  Single-page layout — two copies, each copy is front | back side-by-side.
  Fold on the CENTER dashed line → laminate → wallet card.
  Cut on the HORIZONTAL dashed line between copies.
-->
<div class="cards-page">
  <div class="page-label screen-only">INSURANCE ID CARDS — 2 COPIES · Fold on center line · Cut between copies · Laminate</div>

  {#each [1, 2] as copy}

    <!-- ── ONE COPY: FRONT (left) | BACK (right) ── -->
    <div class="card-pair">

      <!-- FRONT -->
      <div class="id-card front-card" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">
        <div class="card-header">
          {#if agency.logo}
            <div class="logo-box"><img src="/logos/{agency.logo}" alt={agency.shortName} class="logo-img"/></div>
          {:else}
            <svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill={agency.primaryColor} stroke={agency.darkColor} stroke-width="1.5"/>
              <text x="20" y={agency.letter.length > 1 ? '26' : '29'} font-family="Arial Black,Arial" font-size={agency.letter.length > 1 ? '13' : '20'} font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
            </svg>
          {/if}
          <div class="header-text">
            <strong>{agency.name}</strong>
            <small>South Dakota Proof of Insurance</small>
          </div>
        </div>
        <div class="card-body">
          <div class="r"><span class="l">Policy #</span><span class="v">{fmt(data.policyNumber)}</span></div>
          <div class="r"><span class="l">Effective</span><span class="v">{fmtDate(data.effectiveDate)}</span><span class="l ml">Expires</span><span class="v">{fmtDate(data.expirationDate)}</span></div>
          <div class="r"><span class="l">Insured</span><span class="v full">{fmt(data.insuredName)}</span></div>
          <div class="r"><span class="l">Vehicle</span><span class="v full">{fmt(veh1.year)} {fmt(veh1.make)} {fmt(veh1.model)}</span></div>
          <div class="r"><span class="l">VIN</span><span class="v mono">{fmt(veh1.vin)}</span></div>
          {#if veh2}
          <div class="r"><span class="l">Veh 2</span><span class="v full">{fmt(veh2.year)} {fmt(veh2.make)} {fmt(veh2.model)}</span></div>
          <div class="r"><span class="l">VIN 2</span><span class="v mono">{fmt(veh2.vin)}</span></div>
          {/if}
        </div>
        <div class="card-footer">
          <span class="ft-l">Agent: {fmt(data.agentName)}{data.agentPhone ? ' · '+data.agentPhone : ''}</span>
          <span class="ft-r">{agency.phone}</span>
        </div>
      </div>

      <!-- FOLD LINE -->
      <div class="fold-line">
        <span class="fold-label screen-only">✂ fold</span>
      </div>

      <!-- BACK -->
      <div class="id-card back-card" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">
        <div class="card-header" style="background:var(--brand-dark)">
          {#if agency.logo}
            <div class="logo-box"><img src="/logos/{agency.logo}" alt={agency.shortName} class="logo-img"/></div>
          {:else}
            <svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill={agency.darkColor} stroke={agency.darkColor} stroke-width="1.5"/>
              <text x="20" y={agency.letter.length > 1 ? '26' : '29'} font-family="Arial Black,Arial" font-size={agency.letter.length > 1 ? '13' : '20'} font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
            </svg>
          {/if}
          <div class="header-text">
            <strong>{agency.name}</strong>
            <small>South Dakota — In Case of Accident</small>
          </div>
        </div>
        <div class="card-body back-body">
          <div class="bs">
            <div class="bh">IN CASE OF ACCIDENT</div>
            <ol class="blist">
              <li>Check for injuries — call <strong>911</strong> if anyone is hurt.</li>
              <li>Move to safety; turn on hazard lights.</li>
              <li>Exchange info with all drivers involved.</li>
              <li>Photograph damage, plates &amp; location.</li>
              <li>Do <strong>not</strong> admit fault at the scene.</li>
              <li>Report to your agent within 24 hours.</li>
            </ol>
          </div>
          <div class="bs">
            <div class="bh">EXCHANGE THIS INFO</div>
            <div class="bexch">
              <span>✓ Name &amp; address</span>
              <span>✓ Driver's license #</span>
              <span>✓ License plate #</span>
              <span>✓ Policy # &amp; insurer</span>
            </div>
          </div>
          <div class="bs">
            <div class="bh">SD MINIMUMS — SDCL 32-35</div>
            <div class="blim">BI: $25,000/person · $50,000/accident &nbsp;|&nbsp; PD: $25,000</div>
          </div>
        </div>
        <div class="card-footer">
          <span class="ft-l">Claims: {agency.claimsPhone}</span>
          <span class="ft-r">{agency.website}</span>
        </div>
      </div>
    </div>

    <!-- Cut line between copies (not after last) -->
    {#if copy === 1}
      <div class="cut-line">
        <span class="cut-label screen-only">✂ cut here</span>
      </div>
    {/if}

  {/each}

  <div class="page-note screen-only">
    Fold on dashed center line · Laminate for wallet use · Electronic copy accepted per SDCL 32-35-119
  </div>
</div>

<style>
  @media print {
    .screen-only { display: none !important; }
    .cards-page {
      padding: 0.4in 0.5in;
      page-break-inside: avoid;
      break-inside: avoid;
      border: none;
      border-radius: 0;
      box-shadow: none;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    .card-pair {
      page-break-inside: avoid;
      break-inside: avoid;
      justify-content: center;
    }
    /* Slightly narrower cards so two fit on any device */
    .id-card { width: 3.1in; flex-shrink: 0; }
    .fold-line { margin: 0 3px; }
    .cut-line { margin: 6px 0; }
  }

  .cards-page {
    font-family: Arial, Helvetica, sans-serif;
    background: white;
    padding: 16px 20px 12px;
  }

  .page-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #888;
    text-align: center;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #ddd;
  }

  /* ── Card pair row ── */
  .card-pair {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0;
  }

  /* ── Fold line (vertical center dashes) ── */
  .fold-line {
    width: 0;
    border-left: 2px dashed #999;
    margin: 0 2px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fold-label {
    position: absolute;
    background: white;
    font-size: 8px;
    color: #aaa;
    padding: 2px 3px;
    white-space: nowrap;
    writing-mode: vertical-rl;
    letter-spacing: 1px;
  }

  /* ── Cut line (horizontal between copies) ── */
  .cut-line {
    border-top: 1.5px dashed #bbb;
    margin: 8px 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cut-label {
    background: white;
    font-size: 8px;
    color: #aaa;
    padding: 0 6px;
    letter-spacing: 0.5px;
  }

  /* ── Card: identical fixed size for front and back ── */
  .id-card {
    width: 3.375in;
    height: 2.25in;
    border: 1.5px solid var(--brand);
    border-radius: 8px;
    overflow: hidden;
    font-size: 10px;
    color: #1a1a1a;
    background: white;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .card-header {
    background: var(--brand);
    color: white;
    padding: 5px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .logo-box {
    background: white;
    border-radius: 4px;
    width: 30px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    flex-shrink: 0;
  }
  .logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .header-text { display: flex; flex-direction: column; line-height: 1.2; }
  .header-text strong { font-size: 10px; }
  .header-text small { font-size: 7px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.4px; }

  .card-body { padding: 5px 8px; flex: 1; overflow: hidden; }
  .r { display: flex; align-items: baseline; margin-bottom: 2px; flex-wrap: wrap; }
  .l { font-size: 8px; font-weight: 700; color: #777; text-transform: uppercase; width: 46px; flex-shrink: 0; }
  .ml { margin-left: 8px; }
  .v { font-size: 10px; font-weight: 600; }
  .v.full { flex: 1; }
  .v.mono { font-family: 'Courier New', monospace; font-size: 8px; }

  .back-body { padding: 4px 8px; flex: 1; overflow: hidden; }
  .bs { margin-bottom: 4px; }
  .bh { font-size: 7px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--brand); border-bottom: 1px solid color-mix(in srgb, var(--brand) 20%, white); padding-bottom: 1px; margin-bottom: 2px; }
  .blist { margin: 0; padding-left: 11px; font-size: 7.5px; line-height: 1.45; }
  .blist li { margin-bottom: 0; }
  .bexch { display: flex; flex-wrap: wrap; gap: 0 8px; font-size: 7.5px; }
  .blim { font-size: 7.5px; color: #333; }

  .card-footer {
    background: var(--brand-light, #f8f8f8);
    border-top: 1px solid #ddd;
    padding: 3px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }
  .ft-l { font-size: 7px; color: #555; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ft-r { font-size: 8px; font-weight: 700; color: var(--brand); white-space: nowrap; margin-left: 4px; }

  .page-note {
    text-align: center;
    font-size: 9px;
    color: #aaa;
    margin-top: 10px;
    font-style: italic;
  }
</style>
