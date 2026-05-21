<script lang="ts">
  import DeclarationPage from '$lib/DeclarationPage.svelte';
  import InsuranceCard from '$lib/InsuranceCard.svelte';
  import PrintCards from '$lib/PrintCards.svelte';
  import { agencies, defaultAgency } from '$lib/agencies.js';
  import type { Agency } from '$lib/agencies.js';
  import { generateRandomPolicy } from '$lib/randomPolicy.js';

  // ── Agency State ──────────────────────────────────────────
  let selectedAgencyId = $state(defaultAgency.id);
  const agency = $derived(agencies.find(a => a.id === selectedAgencyId) ?? defaultAgency);

  // Reset pool when company changes so stale pool names don't carry over
  $effect(() => {
    selectedAgencyId;
    form.companyPool = '';
  });

  // ── Form State ────────────────────────────────────────────
  let activeTab = $state<'form' | 'print'>('form');

  let form = $state({
    policyNumber: '',
    effectiveDate: '',
    expirationDate: '',
    issueDate: new Date().toISOString().split('T')[0],
    agentName: '',
    agentPhone: '',
    agentAddress: '',
    agentCode: '',
    policyStatus: 'Active',
    companyPool: '',
    naicNumber: '',
    policyState: '',
    insuredName: '',
    insuredDOB: '',
    insuredAddress: '',
    insuredCity: '',
    insuredState: '',
    insuredZip: '',
    insuredPhone: '',
    insuredEmail: '',
    vehYear: '',
    vehMake: '',
    vehModel: '',
    vehVin: '',
    vehColor: '',
    veh2Year: '',
    veh2Make: '',
    veh2Model: '',
    veh2Vin: '',
    veh2Color: '',
    coverage: 'Liability',
    liabilityCoverage: '25/50/25',
    umBiCoverage: '',
    medPayCoverage: '',
    collisionDed: '',
    comprehensiveDed: '',
    rentalCoverage: '',
    rideshareCoverage: '',
    roadsideCoverage: '',
    vehicles: [] as any[],
    limit: '',
    deductible: '',
    totalPremium: '',
    downPayment: '',
    paymentPlan: '',
    billingSchedule: '',
    multiPolicyDiscount: false,
    advanceQuoteDiscount: false,
    claimFreeDiscount: false,
    safeDriverDiscount: false,
    paperlessDiscount: false,
    paidInFullDiscount: false,
    affinityDiscount: false,
    otherDiscount1: '',
    otherDiscount2: '',
  });

  $effect(() => {
    const vehicles = [];
    if (form.vehYear || form.vehMake || form.vehModel || form.vehVin) {
      vehicles.push({
        year: form.vehYear,
        make: form.vehMake,
        model: form.vehModel,
        vin: form.vehVin,
        color: form.vehColor,
        coverage: form.coverage,
        limit: form.limit,
        deductible: form.deductible,
      });
    }
    if (form.veh2Year || form.veh2Make || form.veh2Model || form.veh2Vin) {
      vehicles.push({
        year: form.veh2Year,
        make: form.veh2Make,
        model: form.veh2Model,
        vin: form.veh2Vin,
        color: form.veh2Color,
        coverage: form.coverage,
        limit: form.limit,
        deductible: form.deductible,
      });
    }
    form.vehicles = vehicles;
  });

  function generateNAIC() {
    // NAIC numbers are 5-digit codes; real ranges vary by company type.
    // We generate a realistic random 5-digit number (10000–99999).
    form.naicNumber = String(Math.floor(10000 + Math.random() * 90000));
  }

  function clearForm() {
    Object.keys(form).forEach(k => {
      if (k !== 'issueDate' && k !== 'policyStatus' && k !== 'coverage') {
        (form as any)[k] = k === 'vehicles' ? [] : '';
      }
    });
  }

  function printDocs() {
    // Page layout is fully handled by CSS (@page margins + width: 7.8in on content).
    // This guarantees 1-page declaration and 1-page cards on all devices/browsers.
    window.print();
  }

  function fillRandom() {
    const generated = generateRandomPolicy(agency);
    Object.keys(generated).forEach(k => {
      (form as any)[k] = (generated as any)[k];
    });
  }
</script>

<!-- PRINT-ONLY LAYOUT -->
<div class="print-only">
  <div class="print-decl">
    <DeclarationPage data={form} {agency} />
  </div>
  <PrintCards data={form} {agency} />
</div>

<!-- SCREEN UI -->
<div class="ui-wrapper" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor}">
  <header class="app-header" style="background:{agency.primaryColor}">
    <div class="header-brand">
      {#if agency.logo}
        <div class="header-logo-box"><img src="/logos/{agency.logo}" alt={agency.shortName} class="header-logo-img" /></div>
      {:else}
        <svg viewBox="0 0 40 40" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="19" fill={agency.primaryColor} stroke={agency.darkColor} stroke-width="1.5"/>
          <text x="20" y="28" font-family="Arial Black,Arial" font-size="18" font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
        </svg>
      {/if}
      <div>
        <strong>Insurance Toolkit</strong>
        <small>{agency.shortName} — Declaration & ID Card Generator</small>
      </div>
    </div>

    <div class="header-center">
      <label class="agency-label" for="agency-select">Company:</label>
      <select id="agency-select" class="agency-select" bind:value={selectedAgencyId}>
        {#each agencies as a}
          <option value={a.id}>{a.shortName}</option>
        {/each}
      </select>
    </div>

    <nav class="tab-nav">
      <button class:active={activeTab === 'form'} onclick={() => activeTab = 'form'}>
        📋 Customer Form
      </button>
      <button class:active={activeTab === 'print'} onclick={() => activeTab = 'print'}>
        🖨️ Preview & Print
      </button>
    </nav>
  </header>

  {#if activeTab === 'form'}
  <main class="form-main">
    <div class="quick-bar" style="--brand:{agency.primaryColor}">
      <span class="quick-label">Quick actions:</span>
      <button class="btn-random-top" onclick={fillRandom} style="background:{agency.primaryColor}">
        🎲 Fill Random {agency.shortName} Policy
      </button>
      <button class="btn-clear-top" onclick={clearForm}>🗑️ Clear Form</button>
    </div>
    <div class="form-grid">

      <!-- Policy Info -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">📄 Policy Information</div>
        <div class="field-row">
          <label>Policy Number</label>
          <input type="text" bind:value={form.policyNumber} placeholder="POL-000000" />
        </div>
        <div class="field-row three">
          <div>
            <label>Effective Date</label>
            <input type="date" bind:value={form.effectiveDate} />
          </div>
          <div>
            <label>Expiration Date</label>
            <input type="date" bind:value={form.expirationDate} />
          </div>
          <div>
            <label>Date Issued</label>
            <input type="date" bind:value={form.issueDate} />
          </div>
        </div>
        <div class="field-row three">
          <div>
            <label>Agent / Agency Name</label>
            <input type="text" bind:value={form.agentName} placeholder="Jane Smith" />
          </div>
          <div>
            <label>Agent Phone</label>
            <input type="tel" bind:value={form.agentPhone} placeholder="(555) 000-0000" />
          </div>
          <div>
            <label>Agent Code</label>
            <input type="text" bind:value={form.agentCode} placeholder="AGT-000" />
          </div>
        </div>
        <div class="field-row">
          <label>Agent Address</label>
          <input type="text" bind:value={form.agentAddress} placeholder="123 Main St, Rapid City, SD 57701" />
        </div>
        <div class="field-row three">
          <div>
            <label>Policy State</label>
            <input type="text" bind:value={form.policyState} placeholder="CA" maxlength="2" />
          </div>
          <div>
            <label>Company / Pool</label>
            <select bind:value={form.companyPool}>
              <option value="">Select pool...</option>
              {#each agency.pools as pool}
                <option value={pool}>{pool}</option>
              {/each}
            </select>
          </div>
          <div>
            <label>NAIC Number</label>
            <div class="input-with-btn">
              <input type="text" bind:value={form.naicNumber} placeholder="e.g. 25143" maxlength="6" />
              <button type="button" class="btn-generate-naic" onclick={generateNAIC} style="border-color:{agency.primaryColor};color:{agency.primaryColor}">
                🎲 Generate
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Named Insured -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">👤 Named Insured</div>
        <div class="field-row">
          <label>Insured Name (Last, First, MI)</label>
          <input type="text" bind:value={form.insuredName} placeholder="DOE, JOHN, M" />
        </div>
        <div class="field-row two">
          <div>
            <label>Date of Birth</label>
            <input type="date" bind:value={form.insuredDOB} />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="tel" bind:value={form.insuredPhone} placeholder="(555) 000-0000" />
          </div>
        </div>
        <div class="field-row">
          <label>Street Address</label>
          <input type="text" bind:value={form.insuredAddress} placeholder="123 Main St" />
        </div>
        <div class="field-row three">
          <div>
            <label>City</label>
            <input type="text" bind:value={form.insuredCity} placeholder="Los Angeles" />
          </div>
          <div>
            <label>State</label>
            <input type="text" bind:value={form.insuredState} placeholder="CA" maxlength="2" />
          </div>
          <div>
            <label>ZIP Code</label>
            <input type="text" bind:value={form.insuredZip} placeholder="90000" />
          </div>
        </div>
        <div class="field-row">
          <label>Email Address</label>
          <input type="email" bind:value={form.insuredEmail} placeholder="john@example.com" />
        </div>
      </section>

      <!-- Vehicle 1 -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">🚗 Vehicle 1</div>
        <div class="field-row four">
          <div><label>Year</label><input type="text" bind:value={form.vehYear} placeholder="2024" /></div>
          <div><label>Make</label><input type="text" bind:value={form.vehMake} placeholder="Toyota" /></div>
          <div><label>Model</label><input type="text" bind:value={form.vehModel} placeholder="Camry" /></div>
          <div><label>Color</label><input type="text" bind:value={form.vehColor} placeholder="Silver" /></div>
        </div>
        <div class="field-row">
          <label>VIN</label>
          <input type="text" bind:value={form.vehVin} placeholder="1HGBH41JXMN109186" style="font-family:monospace;font-size:13px;letter-spacing:0.5px" />
        </div>
      </section>

      <!-- Vehicle 2 -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">🚗 Vehicle 2 <span class="optional-tag">(optional)</span></div>
        <div class="field-row four">
          <div><label>Year</label><input type="text" bind:value={form.veh2Year} placeholder="2022" /></div>
          <div><label>Make</label><input type="text" bind:value={form.veh2Make} placeholder="Honda" /></div>
          <div><label>Model</label><input type="text" bind:value={form.veh2Model} placeholder="Civic" /></div>
          <div><label>Color</label><input type="text" bind:value={form.veh2Color} placeholder="Black" /></div>
        </div>
        <div class="field-row">
          <label>VIN</label>
          <input type="text" bind:value={form.veh2Vin} placeholder="2HGBH41JXMN109186" style="font-family:monospace;font-size:13px;letter-spacing:0.5px" />
        </div>
      </section>

      <!-- Coverage -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">🛡️ Coverage Details</div>
        <div class="field-row two">
          <div>
            <label>Coverage Type</label>
            <select bind:value={form.coverage}>
              <option>Liability</option>
              <option>Full Coverage</option>
              <option>Collision Only</option>
              <option>Comprehensive Only</option>
            </select>
          </div>
          <div>
            <label>Liability Limits (BI/PD)</label>
            <select bind:value={form.liabilityCoverage}>
              <option value="">Select...</option>
              <option>25/50/25</option>
              <option>50/100/50</option>
              <option>100/300/100</option>
              <option>250/500/250</option>
              <option>500/500/500</option>
              <option>100 CSL</option>
              <option>300 CSL</option>
              <option>500 CSL</option>
            </select>
          </div>
        </div>
        <div class="field-row two">
          <div>
            <label>Uninsured / Underinsured Motorist BI</label>
            <select bind:value={form.umBiCoverage}>
              <option value="">Not Included</option>
              <option>25/50</option>
              <option>50/100</option>
              <option>100/300</option>
              <option>250/500</option>
              <option>500/500</option>
            </select>
          </div>
          <div>
            <label>Medical Payments (MedPay)</label>
            <select bind:value={form.medPayCoverage}>
              <option value="">Not Included</option>
              <option>$1,000</option>
              <option>$2,000</option>
              <option>$5,000</option>
              <option>$10,000</option>
              <option>$25,000</option>
            </select>
          </div>
        </div>
        <div class="field-row two">
          <div>
            <label>Collision Deductible</label>
            <select bind:value={form.collisionDed}>
              <option value="">Not Included</option>
              <option>$250</option>
              <option>$500</option>
              <option>$1,000</option>
              <option>$1,500</option>
              <option>$2,000</option>
              <option>$2,500</option>
            </select>
          </div>
          <div>
            <label>Comprehensive Deductible</label>
            <select bind:value={form.comprehensiveDed}>
              <option value="">Not Included</option>
              <option>$100</option>
              <option>$250</option>
              <option>$500</option>
              <option>$1,000</option>
              <option>$2,500</option>
            </select>
          </div>
        </div>
        <div class="field-row two">
          <div>
            <label>Rental Reimbursement</label>
            <select bind:value={form.rentalCoverage}>
              <option value="">Not Included</option>
              <option>$30/day (max $900)</option>
              <option>$40/day (max $1,200)</option>
              <option>$50/day (max $1,500)</option>
              <option>$75/day (max $2,250)</option>
            </select>
          </div>
          <div>
            <label>Roadside Assistance</label>
            <select bind:value={form.roadsideCoverage}>
              <option value="">Not Included</option>
              <option>Included — Basic</option>
              <option>Included — Premium</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Premium -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">💰 Premium</div>
        <div class="field-row two">
          <div>
            <label>Total 6-Month Premium</label>
            <input type="text" bind:value={form.totalPremium} placeholder="$850.00" />
          </div>
          <div>
            <label>Down Payment / Init. Payment</label>
            <input type="text" bind:value={form.downPayment} placeholder="$150.00" />
          </div>
        </div>
        <div class="field-row two">
          <div>
            <label>Payment Plan</label>
            <select bind:value={form.paymentPlan}>
              <option value="">Select...</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Semi-Annual</option>
              <option>Annual</option>
              <option>Paid in Full</option>
            </select>
          </div>
          <div>
            <label>Billing Schedule</label>
            <input type="text" bind:value={form.billingSchedule} placeholder="Monthly — 5th" />
          </div>
        </div>
      </section>

      <!-- Discounts -->
      <section class="form-section">
        <div class="section-heading" style="color:{agency.primaryColor};border-bottom-color:{agency.lightBg}">🎟️ Applied Discounts</div>
        <div class="discounts-grid">
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.multiPolicyDiscount} /> Multi-Policy</label>
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.advanceQuoteDiscount} /> Advance Quote</label>
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.claimFreeDiscount} /> Claim-Free</label>
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.safeDriverDiscount} /> Safe Driver</label>
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.paperlessDiscount} /> Paperless</label>
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.paidInFullDiscount} /> Paid-in-Full</label>
          <label class="discount-check" style="--brand:{agency.primaryColor}"><input type="checkbox" bind:checked={form.affinityDiscount} /> Affinity/Group</label>
        </div>
        <div class="field-row two" style="margin-top:10px">
          <div>
            <label>Other Discount 1</label>
            <input type="text" bind:value={form.otherDiscount1} placeholder="e.g. Good Student" />
          </div>
          <div>
            <label>Other Discount 2</label>
            <input type="text" bind:value={form.otherDiscount2} placeholder="e.g. Occupation" />
          </div>
        </div>
      </section>

    </div>

    <div class="form-actions">
      <button class="btn-clear" onclick={clearForm}>🗑️ Clear</button>
      <button class="btn-random" style="border-color:{agency.primaryColor};color:{agency.primaryColor}" onclick={fillRandom}>🎲 Random Policy</button>
      <button class="btn-preview" style="background:{agency.primaryColor}" onclick={() => activeTab = 'print'}>👁️ Preview & Print →</button>
    </div>
  </main>
  {/if}

  {#if activeTab === 'print'}
  <main class="preview-main">
    <div class="preview-toolbar">
      <p class="preview-note">📺 Preview below — <strong>Print</strong> sends to your printer · <strong>Save as PDF</strong> opens the print dialog, then choose "Save as PDF" as destination</p>
      <div class="preview-btns">
        <button class="btn-back" onclick={() => activeTab = 'form'}>← Back to Form</button>
        <button class="btn-print" style="background:{agency.primaryColor}" onclick={printDocs}>🖨️ Print</button>
        <button class="btn-pdf" style="border-color:{agency.primaryColor};color:{agency.primaryColor}" onclick={printDocs}>📄 Save as PDF</button>
      </div>
    </div>
    <div class="preview-scroll">
      <div class="preview-label">DECLARATION PAGE</div>
      <div class="preview-sheet">
        <DeclarationPage data={form} {agency} />
      </div>
      <div class="preview-label" style="margin-top:24px">ID CARD PREVIEW <span style="font-weight:400;text-transform:none;letter-spacing:0">&nbsp;— click "See Back ▶" to flip</span></div>
      <div class="card-preview-row">
        <InsuranceCard data={form} {agency} />
      </div>

      <div class="preview-label" style="margin-top:24px">PRINT LAYOUT — 2 COPIES (front + back side by side)</div>
      <div class="preview-sheet">
        <PrintCards data={form} {agency} />
      </div>
    </div>
  </main>
  {/if}
</div>

<style>
  @media print {
    :global(html), :global(body) {
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      overflow: visible !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    :global(.ui-wrapper) { display: none !important; }

    :global(.print-only) {
      display: block !important;
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    /* Force @page sizing and margins for ALL print output */
    @page {
      size: letter portrait;
      margin: 0;
    }

    /* Declaration page: keep on 1 page, lock width to letter-content */
    :global(.print-decl) {
      width: 8.5in !important;
      max-width: 8.5in !important;
      padding: 0 !important;
      margin: 0 !important;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      box-sizing: border-box;
      overflow: hidden;
    }
    :global(.print-decl .page) {
      width: 8.5in !important;
      max-width: 8.5in !important;
      padding: 0.2in 0.25in !important;
      margin: 0 !important;
      border: none !important;
      box-sizing: border-box;
      font-size: 7px !important;
      line-height: 1.15 !important;
      overflow: hidden;
    }
    :global(.print-decl .letterhead) { padding-bottom: 2px; margin-bottom: 3px; }
    :global(.print-decl .section) { margin-bottom: 3px; }
    :global(.print-decl .section-title) { padding: 1px 4px; font-size: 6.5px; }
    :global(.print-decl .row) { margin-bottom: 1px; }
    :global(.print-decl label) { font-size: 6px; }
    :global(.print-decl .field) { min-height: 9px; padding: 0 2px; font-size: 7.5px; }
    :global(.print-decl table) { font-size: 7px; }
    :global(.print-decl th) { padding: 1px 3px; font-size: 6px; }
    :global(.print-decl td) { padding: 1px 3px; }
    :global(.print-decl .discount-chip) { padding: 1px 3px; font-size: 6px; }
    :global(.print-decl .signatures) { margin-top: 3px; }
    :global(.print-decl .footnote) { margin-top: 2px; font-size: 5.5px; }

    /* Cards: start on page 2 */
    :global(.cards-page) {
      page-break-before: always;
      break-before: page;
      page-break-inside: avoid;
      break-inside: avoid;
      width: 8.5in !important;
      max-width: 8.5in !important;
      padding: 0 !important;
      box-sizing: border-box;
      margin: 0;
    }
    :global(.cards-page .id-card) {
      height: 1.875in !important;
      width: 3.125in !important;
    }
  }

  :global(.print-only) { display: none; }

  .ui-wrapper {
    min-height: 100vh;
    background: #f0f2f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    color: white;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    transition: background 0.25s;
  }
  .header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header-brand strong { font-size: 18px; display: block; }
  .header-brand small { font-size: 12px; opacity: 0.85; }
  .header-logo-box {
    background: white;
    border-radius: 6px;
    width: 42px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    flex-shrink: 0;
  }
  .header-logo-img { max-width: 100%; max-height: 100%; object-fit: contain; }

  .header-center {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .agency-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    white-space: nowrap;
  }
  .agency-select {
    padding: 7px 12px;
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 7px;
    background: rgba(255,255,255,0.15);
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    min-width: 160px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='white' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
  }
  .agency-select:focus { outline: 2px solid rgba(255,255,255,0.6); }
  .agency-select option { background: #333; color: white; }

  .tab-nav { display: flex; gap: 4px; }
  .tab-nav button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.8);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.15s;
  }
  .tab-nav button.active {
    background: white;
    color: #333;
  }
  .tab-nav button:hover:not(.active) { background: rgba(255,255,255,0.25); }

  .form-main { padding: 20px; }

  .quick-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 900px;
    margin: 0 auto 16px;
    background: white;
    border-radius: 10px;
    padding: 12px 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    flex-wrap: wrap;
  }
  .quick-label { font-size: 13px; color: #888; font-weight: 500; margin-right: 4px; }
  .btn-random-top {
    padding: 9px 20px;
    border: none;
    border-radius: 7px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    letter-spacing: 0.2px;
  }
  .btn-random-top:hover { opacity: 0.85; }
  .btn-clear-top {
    padding: 9px 16px;
    border: 2px solid #ddd;
    border-radius: 7px;
    background: white;
    color: #777;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-clear-top:hover { border-color: #bbb; color: #333; }

  .form-grid { display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto; }

  .form-section {
    background: white;
    border-radius: 10px;
    padding: 18px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .section-heading {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e8f5ee;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.25s, border-bottom-color 0.25s;
  }
  .optional-tag { font-size: 11px; font-weight: 400; color: #999; }

  .input-with-btn {
    display: flex;
    gap: 6px;
    align-items: stretch;
  }
  .input-with-btn input { flex: 1; min-width: 0; }
  .btn-generate-naic {
    padding: 0 10px;
    border: 1.5px solid;
    border-radius: 6px;
    background: white;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }
  .btn-generate-naic:hover { opacity: 0.75; }

  .field-row { display: grid; gap: 6px; margin-bottom: 10px; }
  .field-row:last-child { margin-bottom: 0; }
  .field-row.two { grid-template-columns: 1fr 1fr; }
  .field-row.three { grid-template-columns: 1fr 1fr 1fr; }
  .field-row.four { grid-template-columns: 0.7fr 1fr 1fr 0.7fr; }

  label { font-size: 12px; font-weight: 600; color: #444; display: block; margin-bottom: 3px; }
  input, select {
    width: 100%;
    padding: 8px 10px;
    border: 1.5px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color 0.15s;
    background: #fafafa;
  }
  input:focus, select:focus {
    outline: none;
    border-color: var(--brand, #006B49);
    background: white;
  }
  input::placeholder { color: #bbb; }
  select { cursor: pointer; }

  .discounts-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .discount-check {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1.5px solid #ddd;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s;
    user-select: none;
  }
  .discount-check:has(input:checked) {
    border-color: var(--brand, #006B49);
    background: color-mix(in srgb, var(--brand, #006B49) 12%, white);
    color: var(--brand, #006B49);
  }
  .discount-check input[type=checkbox] { cursor: pointer; width: 16px; height: 16px; accent-color: var(--brand, #006B49); }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    max-width: 900px;
    margin: 0 auto;
    position: sticky;
    bottom: 0;
    background: linear-gradient(to top, rgba(240,242,245,1) 80%, transparent);
  }
  .btn-clear {
    padding: 12px 24px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background: white;
    color: #666;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-clear:hover { border-color: #999; color: #333; }
  .btn-random {
    padding: 12px 24px;
    border: 2px solid;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-random:hover { opacity: 0.75; }
  .btn-preview {
    padding: 12px 28px;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-preview:hover { opacity: 0.88; }

  .preview-main { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .preview-toolbar {
    background: white;
    border-radius: 10px;
    padding: 14px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 900px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .preview-note { font-size: 13px; color: #666; margin: 0; }
  .preview-btns { display: flex; gap: 10px; align-items: center; }
  .btn-back {
    padding: 10px 18px;
    border: 2px solid #ddd;
    border-radius: 7px;
    background: white;
    color: #555;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-back:hover { border-color: #bbb; }
  .btn-print {
    padding: 10px 22px;
    border: none;
    border-radius: 7px;
    color: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-print:hover { opacity: 0.88; }
  .btn-pdf {
    padding: 10px 18px;
    border: 2px solid;
    border-radius: 7px;
    background: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-pdf:hover { opacity: 0.75; }
  .preview-scroll { width: 100%; max-width: 900px; }
  .card-preview-row {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 900px;
  }
  .preview-label {
    font-size: 11px;
    font-weight: 700;
    color: #888;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .preview-sheet {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    overflow: hidden;
    border: 1px solid #e0e0e0;
  }

  @media (max-width: 700px) {
    .field-row.two, .field-row.three, .field-row.four { grid-template-columns: 1fr; }
    .tab-nav button { padding: 7px 10px; font-size: 12px; }
    .app-header { flex-direction: column; align-items: flex-start; }
    .header-center { width: 100%; }
    .agency-select { width: 100%; }
  }
</style>
