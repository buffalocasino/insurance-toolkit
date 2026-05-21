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

  // Stable NAIC display
  const naicDisplay = $derived(() => {
    if (data.naicNumber) return `NAIC ${data.naicNumber}`;
    const key = String(data.policyNumber || agency.id + '000000');
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    return `NAIC ${10000 + Math.abs(hash) % 90000}`;
  });

  // Active coverage codes for front legend
  const activeCodes = $derived(() => {
    const codes: Array<{code:string; label:string}> = [];
    if (data.liabilityCoverage) codes.push({ code: 'A', label: 'Liab' });
    if (data.medPayCoverage) codes.push({ code: 'C', label: 'MedPay' });
    if (data.comprehensiveDed) codes.push({ code: 'D', label: 'Comp' });
    if (data.collisionDed) codes.push({ code: 'G', label: 'Coll' });
    if (data.roadsideCoverage) codes.push({ code: 'H', label: 'Road' });
    if (data.umBiCoverage) codes.push({ code: 'U', label: 'UM' });
    if (data.rentalCoverage) codes.push({ code: 'R1', label: 'Rent' });
    if (['NY','FL','HI','KS','KY','MA','MI','ND','NJ','PA','UT'].includes(String(data.policyState || ''))) {
      codes.push({ code: 'P', label: 'PIP' });
    }
    codes.push({ code: 'S', label: 'Death' });
    return codes;
  });

  // Company-specific back content
  const companyConfig = $derived(() => {
    switch (agency.id) {
      case 'statefarm':
        return {
          headerTitle: 'If You Are In An Accident',
          claimsLabel: 'Claims Hotline',
          claimsValue: '1-800-SF-CLAIM',
          claimsSub: '1-800-732-5246',
          custCareLabel: 'Customer Care',
          custCareValue: '1-800-STATE-FARM',
          custCareSub: '1-800-782-8332',
          roadsideLabel: 'Roadside',
          roadsideValue: '1-877-627-5757',
          digitalLabel: 'statefarm.com | Mobile App',
          accidentSteps: [
            { text: 'Stop — pull over safely, check for injuries' },
            { text: 'Call police or highway patrol' },
            { text: 'Exchange names, addresses, phone numbers, driver\'s license numbers' },
            { text: 'Document vehicle info — make, model, year, license plate, VIN' },
            { text: 'Gather witness names and contact information' },
            { text: 'Take photos of all vehicles, damage, scene, road signs' },
            { text: 'Do NOT admit fault at the scene' },
          ],
          coverageLegend: [
            { code:'A', label:'Liability — Bodily Injury' },
            { code:'C', label:'Medical Payments (MedPay)' },
            { code:'D', label:'Comprehensive' },
            { code:'G', label:'Collision' },
            { code:'H', label:'Emergency Road Service' },
            { code:'P', label:'Personal Injury Protection (PIP)' },
            { code:'S', label:'Accidental Death' },
            { code:'U', label:'Uninsured/Underinsured Motorist' },
          ],
          fraudLine: 'FRAUD WARNING: Providing false information or filing a fake claim is a felony punishable by fines and imprisonment.',
          binderLine: 'This card is a verification tool only and does not change, modify, or extend any policy provisions.',
          footerText: 'statefarm.com',
        };
      case 'farmers':
        return {
          headerTitle: 'If You Are In An Accident',
          claimsLabel: 'Claims (24/7)',
          claimsValue: '1-800-435-7764',
          claimsSub: '',
          custCareLabel: 'Customer Service',
          custCareValue: '1-800-515-7406',
          custCareSub: '',
          roadsideLabel: 'Roadside Assist',
          roadsideValue: '1-800-435-7764',
          roadsideSub: '',
          digitalLabel: 'farmers.com | Mobile App',
          accidentSteps: [
            { text: 'Stop immediately — safety first' },
            { text: 'Call police if there are injuries or major damage' },
            { text: 'Exchange information with all parties' },
            { text: 'Get driver names, addresses, license numbers, plate numbers' },
            { text: 'Note vehicle make, model, year, color' },
            { text: 'Take photos of all damage and the scene' },
            { text: 'Do NOT admit fault — let your agent handle it' },
          ],
          coverageLegend: [
            { code:'A', label:'Bodily Injury Liability' },
            { code:'B', label:'Property Damage' },
            { code:'C', label:'Medical Payments' },
            { code:'D', label:'Comprehensive' },
            { code:'G', label:'Collision' },
            { code:'H', label:'Emergency Road Service' },
            { code:'P', label:'Personal Injury Protection' },
            { code:'U', label:'Uninsured Motorist' },
          ],
          fraudLine: 'FRAUD WARNING: Misrepresentation of coverage may result in denial of claim and criminal prosecution.',
          binderLine: 'This card is proof of insurance — present to law enforcement. See policy booklet for coverage terms.',
          footerText: 'farmers.com',
        };
      case 'allstate':
        return {
          headerTitle: 'What To Do In Case of An Accident',
          claimsLabel: 'Claims',
          claimsValue: '1-800-ALLSTATE',
          claimsSub: '1-800-255-7468',
          custCareLabel: 'Customer Service',
          custCareValue: '1-800-ALLSTATE',
          custCareSub: '1-800-255-7468',
          roadsideLabel: 'Roadside',
          roadsideValue: '1-800-ALLSTATE',
          roadsideSub: '',
          digitalLabel: 'allstate.com | Allstate Mobile App',
          accidentSteps: [
            { text: 'Stop — check for injuries, move to safety' },
            { text: 'Call 911 if there are injuries' },
            { text: 'Exchange information with all drivers' },
            { text: 'Get names, addresses, license plates, insurance info' },
            { text: 'Take photos of vehicles and scene' },
            { text: 'Get witness contact information' },
            { text: 'Report to your insurance agent promptly' },
          ],
          coverageLegend: [
            { code:'BI', label:'Bodily Injury' },
            { code:'PD', label:'Property Damage' },
            { code:'UM', label:'Uninsured Motorist' },
            { code:'UIM', label:'Underinsured Motorist' },
            { code:'MED', label:'Medical Payments' },
            { code:'COLL', label:'Collision' },
            { code:'COMP', label:'Comprehensive' },
            { code:'PIP', label:'Personal Injury Protection' },
          ],
          fraudLine: 'WARNING: Misrepresentation of insurance is a crime. Penalties may include denial of claims and prosecution.',
          binderLine: 'This card is verification of insurance only. Coverage subject to policy terms and conditions.',
          footerText: 'allstate.com',
        };
      case 'geico':
        return {
          headerTitle: 'In Case of Accident',
          claimsLabel: 'Claims',
          claimsValue: '1-800-207-7847',
          claimsSub: '',
          custCareLabel: 'Customer Service',
          custCareValue: '1-800-861-8380',
          custCareSub: '',
          roadsideLabel: 'Roadside',
          roadsideValue: '1-800-861-8380',
          roadsideSub: '',
          digitalLabel: 'geico.com | GEICO Mobile App',
          accidentSteps: [
            { text: 'Stop — move to safety if possible' },
            { text: 'Check for injuries — call 911 if needed' },
            { text: 'Exchange information with other drivers' },
            { text: 'Get names, addresses, license numbers, plate numbers' },
            { text: 'Take photos of vehicles and damage' },
            { text: 'Report to GEICO as soon as possible' },
            { text: 'Do not admit fault at the scene' },
          ],
          coverageLegend: [
            { code:'BI', label:'Bodily Injury' },
            { code:'PD', label:'Property Damage' },
            { code:'UM', label:'Uninsured Motorist' },
            { code:'MED', label:'Medical' },
            { code:'COLL', label:'Collision' },
            { code:'COMP', label:'Comprehensive' },
            { code:'PIP', label:'Personal Injury Protection' },
          ],
          fraudLine: 'FRAUD NOTICE: Knowingly providing false information is a crime subject to penalties.',
          binderLine: 'This card proves insurance coverage. Present to law enforcement upon request.',
          footerText: 'geico.com',
        };
      case 'progressive':
        return {
          headerTitle: 'What To Do After an Accident',
          claimsLabel: 'Claims',
          claimsValue: '1-800-776-4777',
          claimsSub: '',
          custCareLabel: 'Customer Service',
          custCareValue: '1-800-776-4737',
          custCareSub: '',
          roadsideLabel: 'Roadside Help',
          roadsideValue: '1-800-776-4737',
          roadsideSub: '',
          digitalLabel: 'progressive.com | Progressive App',
          accidentSteps: [
            { text: 'Stop — check for injuries, move to safety' },
            { text: 'Call 911 if anyone is injured' },
            { text: 'Exchange information with all parties' },
            { text: 'Document — names, plates, insurance info' },
            { text: 'Take photos of damage and scene' },
            { text: 'File claim at progressive.com or call' },
          ],
          coverageLegend: [
            { code:'BI', label:'Bodily Injury' },
            { code:'PD', label:'Property Damage' },
            { code:'UM', label:'Uninsured Motorist' },
            { code:'UIM', label:'Underinsured Motorist' },
            { code:'MED', label:'Medical Payments' },
            { code:'COLL', label:'Collision' },
            { code:'COMP', label:'Comprehensive' },
          ],
          fraudLine: 'FRAUD WARNING: False or incomplete information may result in claim denial and prosecution.',
          binderLine: 'This card is verification of insurance only.',
          footerText: 'progressive.com',
        };
      default:
        return {
          headerTitle: 'If You Are In An Accident',
          claimsLabel: 'Claims',
          claimsValue: agency.claimsPhone,
          claimsSub: '',
          custCareLabel: 'Customer Service',
          custCareValue: agency.phone,
          custCareSub: '',
          roadsideLabel: 'Roadside',
          roadsideValue: agency.claimsPhone,
          roadsideSub: '',
          digitalLabel: `${agency.website} | Mobile App`,
          accidentSteps: [
            { text: 'Stop and check for injuries' },
            { text: 'Call authorities if needed' },
            { text: 'Exchange information with all parties' },
            { text: 'Document vehicle details and damage' },
            { text: 'Take photos of the scene' },
            { text: 'Report to your insurance company' },
          ],
          coverageLegend: [
            { code:'A', label:'Bodily Injury Liability' },
            { code:'B', label:'Property Damage' },
            { code:'C', label:'Medical Payments' },
            { code:'D', label:'Comprehensive' },
            { code:'G', label:'Collision' },
            { code:'H', label:'Emergency Road Service' },
            { code:'P', label:'Personal Injury Protection' },
            { code:'U', label:'Uninsured Motorist' },
          ],
          fraudLine: `FRAUD WARNING: Misrepresentation of insurance coverage is a crime.`,
          binderLine: `This card verifies coverage only. See policy booklet for terms.`,
          footerText: agency.website,
        };
    }
  });

  // Agent address for front footer
  const agentAddr = $derived(() => {
    const parts = [];
    if (data.agentName) parts.push(fmt(data.agentName));
    if (data.agentPhone) parts.push(fmt(data.agentPhone));
    return parts.join(' · ') || fmt(agency.phone);
  });
</script>

<!--
  2 copies, each copy is front | back side-by-side.
  Fold on center dashed line → laminate → wallet card.
  Cut on horizontal dashed line between copies.
-->
<div class="cards-page">
  <div class="page-label screen-only">INSURANCE ID CARDS — 2 COPIES · Fold on center line · Cut between copies · Laminate</div>

  {#each [1, 2] as copy}

    <div class="card-pair">

      <!-- ═══════════════════ FRONT ═══════════════════ -->
      <div class="id-card front-card" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">
        <!-- Header -->
        <div class="card-header">
          {#if agency.logo}
            <div class="logo-box"><img src="/logos/{agency.logo}" alt={agency.shortName} class="logo-img"/></div>
          {:else}
            <svg viewBox="0 0 40 40" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill={agency.primaryColor} stroke={agency.darkColor} stroke-width="1.5"/>
              <text x="20" y="28" font-family="Arial Black,Arial" font-size="16" font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
            </svg>
          {/if}
          <div class="header-text">
            <strong>{agency.name}</strong>
            <small>SOUTH DAKOTA — PROOF OF INSURANCE</small>
          </div>
        </div>

        <!-- Body: 2-col grid -->
        <div class="card-body">
          <!-- Left col: Policy + Dates -->
          <div class="col-left">
            <div class="field-row">
              <span class="fl">Policy #</span>
              <span class="fv">{fmt(data.policyNumber)}</span>
            </div>
            <div class="field-row">
              <span class="fl">Effective</span>
              <span class="fv">{fmtDate(data.effectiveDate)}</span>
            </div>
            <div class="field-row">
              <span class="fl">Expires</span>
              <span class="fv">{fmtDate(data.expirationDate)}</span>
            </div>
            <div class="field-row">
              <span class="fl">Insured</span>
              <span class="fv full">{fmt(data.insuredName)}</span>
            </div>
          </div>

          <!-- Right col: Vehicle + VIN -->
          <div class="col-right">
            <div class="field-row">
              <span class="fl">Vehicle</span>
              <span class="fv full">{fmt(veh1.year)} {fmt(veh1.make)} {fmt(veh1.model)}</span>
            </div>
            <div class="field-row">
              <span class="fl">VIN</span>
              <span class="fv mono">{fmt(veh1.vin)}</span>
            </div>
            {#if veh2}
            <div class="field-row">
              <span class="fl">Veh 2</span>
              <span class="fv full">{fmt(veh2.year)} {fmt(veh2.make)} {fmt(veh2.model)}</span>
            </div>
            <div class="field-row">
              <span class="fl">VIN 2</span>
              <span class="fv mono">{fmt(veh2.vin)}</span>
            </div>
            {/if}
            {#if naicDisplay()}
            <div class="field-row naic-row">
              <span class="fl">NAIC</span>
              <span class="fv naic-tag">{naicDisplay()}</span>
            </div>
            {/if}
          </div>
        </div>

        <!-- Coverage codes strip -->
        {#if activeCodes().length > 0}
        <div class="coverage-strip">
          {#each activeCodes() as item}
            <span class="cov-item"><span class="cov-code">{item.code}</span><span class="cov-label">{item.label}</span></span>
          {/each}
        </div>
        {/if}

        <!-- Footer: Agent info -->
        <div class="card-footer">
          <span class="ft-agent">{fmt(data.agentName)}{data.agentPhone ? ' · ' + fmt(data.agentPhone) : ''}</span>
          {#if data.agentAddress}
          <span class="ft-addr">{fmt(data.agentAddress)}</span>
          {/if}
          <span class="ft-co">{agency.shortName} · {naicDisplay()}</span>
        </div>
      </div>

      <!-- FOLD LINE -->
      <div class="fold-line">
        <span class="fold-label screen-only">✂ fold</span>
      </div>

      <!-- ═══════════════════ BACK ═══════════════════ -->
      <div class="id-card back-card" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">

        <!-- Header bar -->
        <div class="back-header-bar">
          {#if agency.logo}
            <div class="logo-box-sm"><img src="/logos/{agency.logo}" alt={agency.shortName} class="logo-img-sm"/></div>
          {:else}
            <svg viewBox="0 0 40 40" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill={agency.darkColor} stroke={agency.darkColor} stroke-width="1.5"/>
              <text x="20" y="28" font-family="Arial Black,Arial" font-size="16" font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
            </svg>
          {/if}
          <div class="back-title-area">
            <span class="back-co-name">{agency.shortName}</span>
            <span class="back-co-sub">Proof of Insurance · {naicDisplay()}</span>
          </div>
          <div class="misrep-badge">MISREPRESENTATION IS A FELONY</div>
        </div>

        <!-- Body -->
        <div class="back-body">

          <!-- Phone row -->
          <div class="phones-row">
            <div class="phone-block">
              <div class="phone-lbl">{companyConfig().claimsLabel}</div>
              <div class="phone-num">{companyConfig().claimsValue}</div>
              {#if companyConfig().claimsSub}<div class="phone-sub">{companyConfig().claimsSub}</div>{/if}
            </div>
            <div class="phone-divider"></div>
            <div class="phone-block">
              <div class="phone-lbl">{companyConfig().custCareLabel}</div>
              <div class="phone-num">{companyConfig().custCareValue}</div>
              {#if companyConfig().custCareSub}<div class="phone-sub">{companyConfig().custCareSub}</div>{/if}
            </div>
            <div class="phone-divider"></div>
            <div class="phone-block">
              <div class="phone-lbl">{companyConfig().roadsideLabel}</div>
              <div class="phone-num">{companyConfig().roadsideValue}</div>
            </div>
          </div>

          <div class="hr"></div>

          <!-- Checklist -->
          <div class="checklist-title">{companyConfig().headerTitle}</div>
          <div class="checklist">
            {#each companyConfig().accidentSteps as step, i}
              <div class="step-row">
                <span class="step-num">{i+1}</span>
                <span class="step-text">{step.text}</span>
              </div>
            {/each}
          </div>

          <div class="hr"></div>

          <!-- Coverage legend -->
          <div class="legend-title">Coverage Codes</div>
          <div class="legend-grid">
            {#each companyConfig().coverageLegend as item}
              <div class="leg-row">
                <span class="leg-code">{item.code}</span>
                <span class="leg-label">{item.label}</span>
              </div>
            {/each}
          </div>

          <div class="hr"></div>

          <!-- Legal -->
          <div class="legal-text">{companyConfig().fraudLine}</div>
          <div class="legal-sub">{companyConfig().binderLine}</div>
        </div>

        <!-- Footer -->
        <div class="card-footer back-footer">
          <span class="ft-l">{companyConfig().digitalLabel}</span>
          <span class="ft-r">{companyConfig().footerText}</span>
        </div>
      </div>
    </div>

    <!-- Cut between copies -->
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
  /* ══════════════ PRINT ══════════════ */
  @media print {
    :global(body) {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    .screen-only { display: none !important; }
    .cards-page {
      padding: 0 !important;
      page-break-inside: avoid;
      break-inside: avoid;
      border: none;
      box-shadow: none;
      margin: 0;
      width: 8.5in !important;
      max-width: 8.5in !important;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    .card-pair {
      page-break-inside: avoid;
      break-inside: avoid;
      justify-content: center;
      gap: 0;
    }
    .id-card {
      width: 3.125in !important;
      height: 1.875in !important;
      flex-shrink: 0;
    }
    .fold-line { margin: 0 2px; }
    .cut-line { margin: 4px 0; }
  }

  /* ══════════════ SCREEN ══════════════ */
  .cards-page {
    font-family: Arial, sans-serif;
    background: white;
    padding: 20px 24px 16px;
    width: 100%;
    box-sizing: border-box;
  }

  .page-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #999;
    text-align: center;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }

  .card-pair {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0;
  }

  .fold-line {
    width: 0;
    border-left: 2px dashed #aaa;
    margin: 0 3px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fold-label {
    position: absolute;
    background: white;
    font-size: 8px;
    color: #bbb;
    padding: 2px 3px;
    white-space: nowrap;
    writing-mode: vertical-rl;
    letter-spacing: 1px;
  }

  .cut-line {
    border-top: 1.5px dashed #ccc;
    margin: 10px 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cut-label {
    background: white;
    font-size: 8px;
    color: #bbb;
    padding: 0 6px;
    letter-spacing: 0.5px;
  }

  /* ══════════════ CARD SHARED ══════════════ */
  .id-card {
    width: 3.375in;
    height: 2.125in;
    border: 2px solid var(--brand);
    border-radius: 8px;
    overflow: hidden;
    font-family: Arial, sans-serif;
    color: #1a1a1a;
    background: white;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* ─── FRONT CARD ─── */
  .card-header {
    background: var(--brand);
    color: white;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .logo-box {
    background: white;
    border-radius: 5px;
    width: 34px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    flex-shrink: 0;
  }
  .logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .header-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  .header-text strong {
    font-size: 11px;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    color: white;
    letter-spacing: 0.3px;
  }
  .header-text small {
    font-size: 7px;
    font-weight: 500;
    color: rgba(255,255,255,0.82);
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  /* Body: 2-column layout */
  .card-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    gap: 0;
  }
  .col-left {
    flex: 1;
    padding: 5px 8px 3px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-right: 1px solid #eee;
  }
  .col-right {
    flex: 1.1;
    padding: 5px 8px 3px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .field-row {
    display: flex;
    align-items: baseline;
    gap: 0;
  }
  .fl {
    font-size: 6.5px;
    font-weight: 700;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    width: 42px;
    flex-shrink: 0;
    font-family: Arial, sans-serif;
  }
  .fv {
    font-size: 8px;
    font-weight: 600;
    color: #111;
    font-family: Arial, sans-serif;
    flex: 1;
  }
  .fv.full { flex: 1; }
  .fv.mono {
    font-family: 'Courier New', monospace;
    font-size: 6.5px;
    color: #333;
    flex: 1;
  }
  .fv.naic-tag {
    font-size: 7px;
    font-weight: 800;
    background: var(--brand-light);
    color: var(--brand-dark);
    padding: 0 3px;
    border-radius: 2px;
    font-family: Arial, sans-serif;
  }
  .naic-row { margin-top: 1px; }

  /* Coverage strip */
  .coverage-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 3px;
    padding: 2px 8px 2px;
    background: var(--brand-light);
    border-top: 1px solid #ddd;
    flex-shrink: 0;
  }
  .cov-item {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    font-size: 5.5px;
    color: var(--brand-dark);
    font-family: Arial, sans-serif;
  }
  .cov-code {
    font-weight: 900;
    font-size: 6px;
    font-family: 'Arial Black', Arial, sans-serif;
    background: var(--brand);
    color: white;
    padding: 0 2px;
    border-radius: 2px;
    height: 9px;
    display: inline-flex;
    align-items: center;
  }
  .cov-label {
    font-weight: 600;
    font-size: 5.5px;
    color: #333;
  }

  /* Card footer */
  .card-footer {
    background: var(--brand-light, #f5f5f5);
    border-top: 1px solid #ddd;
    padding: 3px 8px;
    display: flex;
    flex-direction: column;
    gap: 0.5px;
    flex-shrink: 0;
  }
  .ft-agent {
    font-size: 6.5px;
    font-weight: 700;
    color: #333;
    font-family: Arial, sans-serif;
  }
  .ft-addr {
    font-size: 5.5px;
    color: #777;
    font-family: Arial, sans-serif;
  }
  .ft-co {
    font-size: 5.5px;
    color: #999;
    font-family: Arial, sans-serif;
  }

  /* ─── BACK CARD ─── */
  .back-header-bar {
    background: var(--brand-dark);
    color: white;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .logo-box-sm {
    background: white;
    border-radius: 3px;
    width: 20px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    flex-shrink: 0;
  }
  .logo-img-sm { max-width: 100%; max-height: 100%; object-fit: contain; }
  .back-title-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    line-height: 1.2;
  }
  .back-co-name {
    font-size: 9px;
    font-weight: 900;
    font-family: 'Arial Black', Arial, sans-serif;
    color: white;
    letter-spacing: 0.5px;
  }
  .back-co-sub {
    font-size: 5.5px;
    color: rgba(255,255,255,0.7);
    font-family: Arial, sans-serif;
  }
  .misrep-badge {
    font-size: 5px;
    font-weight: 900;
    background: white;
    color: var(--brand-dark);
    padding: 1px 4px;
    border-radius: 2px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: Arial, sans-serif;
  }

  .back-body {
    padding: 4px 8px;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Phone row */
  .phones-row {
    display: flex;
    gap: 0;
    align-items: stretch;
  }
  .phone-block {
    flex: 1;
    text-align: center;
    padding: 1px 2px;
  }
  .phone-divider {
    width: 1px;
    background: #ddd;
    margin: 0 2px;
  }
  .phone-lbl {
    font-size: 5px;
    font-weight: 800;
    color: var(--brand-dark);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-family: Arial, sans-serif;
    margin-bottom: 0.5px;
  }
  .phone-num {
    font-size: 6.5px;
    font-weight: 900;
    color: #111;
    line-height: 1.1;
    font-family: Arial, sans-serif;
  }
  .phone-sub {
    font-size: 4.5px;
    color: #666;
    font-family: Arial, sans-serif;
  }

  .hr {
    border-top: 1px solid #ddd;
    margin: 1px 0;
  }

  /* Checklist */
  .checklist-title {
    font-size: 5.5px;
    font-weight: 900;
    color: var(--brand-dark);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: Arial, sans-serif;
    margin-bottom: 0.5px;
  }
  .checklist {
    display: flex;
    flex-direction: column;
    gap: 0.5px;
  }
  .step-row {
    display: flex;
    align-items: baseline;
    gap: 3px;
  }
  .step-num {
    font-size: 5.5px;
    font-weight: 900;
    color: white;
    background: var(--brand);
    border-radius: 50%;
    width: 9px;
    height: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  }
  .step-text {
    font-size: 5.5px;
    color: #222;
    line-height: 1.25;
    font-family: Arial, sans-serif;
  }

  /* Legend */
  .legend-title {
    font-size: 5.5px;
    font-weight: 900;
    color: var(--brand-dark);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-family: Arial, sans-serif;
    margin-bottom: 0.5px;
  }
  .legend-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 6px;
  }
  .leg-row {
    display: flex;
    align-items: baseline;
    gap: 2px;
  }
  .leg-code {
    font-size: 6px;
    font-weight: 900;
    color: white;
    background: var(--brand-dark);
    border-radius: 2px;
    padding: 0 2px;
    min-width: 14px;
    text-align: center;
    flex-shrink: 0;
    line-height: 1.2;
    font-family: 'Arial Black', Arial, sans-serif;
    box-sizing: border-box;
    height: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .leg-label {
    font-size: 5px;
    color: #333;
    line-height: 1.2;
    font-family: Arial, sans-serif;
  }

  /* Legal */
  .legal-text {
    font-size: 5px;
    font-weight: 800;
    color: #c00;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    line-height: 1.15;
    font-family: Arial, sans-serif;
  }
  .legal-sub {
    font-size: 4.5px;
    color: #666;
    line-height: 1.2;
    font-family: Arial, sans-serif;
  }

  /* Back footer */
  .back-footer {
    flex-direction: row;
    justify-content: space-between;
    padding: 2px 8px;
  }
  .back-footer .ft-l {
    font-size: 5.5px;
    color: #555;
    font-family: Arial, sans-serif;
  }
  .back-footer .ft-r {
    font-size: 6px;
    font-weight: 800;
    color: var(--brand);
    font-family: Arial, sans-serif;
    white-space: nowrap;
  }

  .page-note {
    text-align: center;
    font-size: 9px;
    color: #bbb;
    margin-top: 12px;
    font-style: italic;
  }
</style>