<script lang="ts">
  import type { Agency } from './agencies.js';
  import SignaturePad from './SignaturePad.svelte';
  interface Props { data: any; agency: Agency; }
  // NAIC is on the data object
  let { data, agency }: Props = $props();

  const fmt = (v: string | number | undefined, fallback = '') => v ?? fallback;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fmtDate = (v: string | undefined) => {
    if (!v) return '____________';
    const d = new Date(v);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  const fmtCurrency = (v: string | number | undefined) => {
    if (v == null || v === '') return '$___________';
    const stripped = String(v).replace(/[$,]/g, '').trim();
    const num = Number(stripped);
    if (isNaN(num)) return String(v); // already formatted (e.g. "$500") — show as-is
    if (num === 0) return '$0.00';
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };
</script>

<div class="page" id="declaration" style="--brand:{agency.primaryColor};--brand-dark:{agency.darkColor};--brand-light:{agency.lightBg}">
  <div class="letterhead">
    <div class="logo-area">
      <div class="f-logo">
        {#if agency.logo}
          <img src="/logos/{agency.logo}" alt={agency.shortName} style="width:60px;height:60px;object-fit:contain;" />
        {:else}
          <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" fill={agency.primaryColor} stroke={agency.darkColor} stroke-width="2"/>
            <text x="30" y="38" font-family="Arial Black,Arial" font-size="26" font-weight="900" fill="white" text-anchor="middle">{agency.letter}</text>
          </svg>
        {/if}
      </div>
      <div class="company-name">
        <strong>{agency.name}</strong><br/>
        <small>{data.agentAddress || agency.address}</small><br/>
        <small>{data.agentPhone || agency.phone} | {agency.website}</small>
      </div>
    </div>
    <div class="doc-title">AUTO INSURANCE DECLARATION</div>
  </div>

  <div class="section policy-info">
    <div class="row three-col">
      <div>
        <label>Policy Number</label>
        <div class="field">{fmt(data.policyNumber)}</div>
      </div>
      <div>
        <label>Policy Effective Date</label>
        <div class="field">{fmtDate(data.effectiveDate)}</div>
      </div>
      <div>
        <label>Policy Expiration Date</label>
        <div class="field">{fmtDate(data.expirationDate)}</div>
      </div>
    </div>
    <div class="row three-col">
      <div>
        <label>Agency / Agent</label>
        <div class="field">{fmt(data.agentName)}{data.agentPhone ? ' · ' + data.agentPhone : ''}</div>
        {#if data.agentAddress}<div class="field" style="margin-top:2px;font-size:10px">{fmt(data.agentAddress)}</div>{/if}
      </div>
      <div>
        <label>Agent Code</label>
        <div class="field">{fmt(data.agentCode)}</div>
      </div>
      <div>
        <label>Date Issued</label>
        <div class="field">{fmtDate(data.issueDate)}</div>
      </div>
    </div>
  </div>

  <div class="section named-insured">
    <div class="section-title">NAMED INSURED</div>
    <div class="row two-col">
      <div>
        <label>Insured Name (Last, First, MI)</label>
        <div class="field">{fmt(data.insuredName)}</div>
      </div>
      <div>
        <label>Date of Birth</label>
        <div class="field">{fmtDate(data.insuredDOB)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Street Address</label>
        <div class="field">{fmt(data.insuredAddress)}</div>
      </div>
      <div>
        <label>City, State, ZIP</label>
        <div class="field">{fmt(data.insuredCity)} {fmt(data.insuredState)} {fmt(data.insuredZip)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Phone Number</label>
        <div class="field">{fmt(data.insuredPhone)}</div>
      </div>
      <div>
        <label>Email Address</label>
        <div class="field">{fmt(data.insuredEmail)}</div>
      </div>
    </div>
  </div>

  <div class="section vehicles">
    <div class="section-title">COVERED VEHICLES</div>
    {#if data.vehicles && data.vehicles.length > 0}
      <table>
        <thead>
          <tr>
            <th>Year</th><th>Make</th><th>Model</th><th>VIN</th>
            <th>Coverage</th><th>Limit</th><th>Deductible</th>
          </tr>
        </thead>
        <tbody>
          {#each data.vehicles as v, i}
            <tr>
              <td>{fmt(v.year)}</td>
              <td>{fmt(v.make)}</td>
              <td>{fmt(v.model)}</td>
              <td>{fmt(v.vin)}</td>
              <td>{fmt(v.coverage)}</td>
              <td>{fmtCurrency(v.limit)}</td>
              <td>{fmtCurrency(v.deductible)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div class="empty-vehicles">
        <div class="row five-col">
          <div><label>Year</label><div class="field">{fmt(data.vehYear)}</div></div>
          <div><label>Make</label><div class="field">{fmt(data.vehMake)}</div></div>
          <div><label>Model</label><div class="field">{fmt(data.vehModel)}</div></div>
          <div><label>VIN</label><div class="field">{fmt(data.vehVin)}</div></div>
          <div><label>Color</label><div class="field">{fmt(data.vehColor)}</div></div>
        </div>
      </div>
    {/if}
  </div>

  <div class="section coverage-details">
    <div class="section-title">COVERAGE DETAILS</div>
    <div class="row two-col">
      <div>
        <label>Liability Coverage (BI/PD Combined)</label>
        <div class="field">{fmt(data.liabilityCoverage)}</div>
      </div>
      <div>
        <label>Uninsured Motorist BI</label>
        <div class="field">{fmt(data.umBiCoverage)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Medical Payments</label>
        <div class="field">{fmt(data.medPayCoverage)}</div>
      </div>
      <div>
        <label>Collision Deductible</label>
        <div class="field">{fmtCurrency(data.collisionDed)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Comprehensive Deductible</label>
        <div class="field">{fmtCurrency(data.comprehensiveDed)}</div>
      </div>
      <div>
        <label>Rental Reimbursement</label>
        <div class="field">{fmt(data.rentalCoverage)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Rideshare Coverage</label>
        <div class="field">{fmt(data.rideshareCoverage)}</div>
      </div>
      <div>
        <label>Roadside Assistance</label>
        <div class="field">{fmt(data.roadsideCoverage)}</div>
      </div>
    </div>
  </div>

  <div class="section premium">
    <div class="section-title">PREMIUM SUMMARY</div>
    <div class="row two-col">
      <div>
        <label>Total Premium (6-Month Term)</label>
        <div class="field prem">{fmtCurrency(data.totalPremium)}</div>
      </div>
      <div>
        <label>Down Payment / Init. Payment</label>
        <div class="field prem">{fmtCurrency(data.downPayment)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Payment Plan</label>
        <div class="field">{fmt(data.paymentPlan)}</div>
      </div>
      <div>
        <label>Billing Schedule</label>
        <div class="field">{fmt(data.billingSchedule)}</div>
      </div>
    </div>
  </div>

  <div class="section discounts">
    <div class="section-title">APPLIED DISCOUNTS</div>
    <div class="discounts-grid">
      {#if data.multiPolicyDiscount}<div class="discount-chip">✓ Multi-Policy Discount</div>{/if}
      {#if data.advanceQuoteDiscount}<div class="discount-chip">✓ Advance Quote Discount</div>{/if}
      {#if data.claimFreeDiscount}<div class="discount-chip">✓ Claim-Free Discount</div>{/if}
      {#if data.safeDriverDiscount}<div class="discount-chip">✓ Safe Driver Discount</div>{/if}
      {#if data.paperlessDiscount}<div class="discount-chip">✓ Paperless Discount</div>{/if}
      {#if data.paidInFullDiscount}<div class="discount-chip">✓ Paid-in-Full Discount</div>{/if}
      {#if data.affinityDiscount}<div class="discount-chip">✓ Affinity / Group Discount</div>{/if}
      {#if data.otherDiscount1}<div class="discount-chip">✓ {fmt(data.otherDiscount1)}</div>{/if}
      {#if data.otherDiscount2}<div class="discount-chip">✓ {fmt(data.otherDiscount2)}</div>{/if}
    </div>
  </div>

  <div class="section underwriting">
    <div class="section-title">UNDERWRITING / POLICY STATUS</div>
    <div class="row two-col">
      <div>
        <label>Policy Status</label>
        <div class="field">{fmt(data.policyStatus) || 'Active'}</div>
      </div>
      <div>
        <label>Company / Pool</label>
        <div class="field">{fmt(data.companyPool)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>Line of Business</label>
        <div class="field">Private Passenger Auto</div>
      </div>
      <div>
        <label>State</label>
        <div class="field">{fmt(data.policyState)}</div>
      </div>
    </div>
    <div class="row two-col">
      <div>
        <label>NAIC Number</label>
        <div class="field">{fmt(data.naicNumber)}</div>
      </div>
      <div>
      </div>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-row">
      <div class="sig-box">
        <SignaturePad label="Authorized Representative / Agent Signature" autoName={data.agentName} />
        <div class="sig-date">Date: {fmtDate(data.issueDate)}</div>
      </div>
      <div class="sig-box">
        <SignaturePad label="Insured Signature (Acknowledgment)" autoName={data.insuredName} />
        <div class="sig-date">Date: {fmtDate(data.issueDate)}</div>
      </div>
    </div>
  </div>

  <div class="footnote">
    This declaration supersedes all previous declarations and schedule of coverages for the policy identified above.
    This is a temporary document issued for informational purposes. Official policy provisions govern in case of discrepancy.
    <br/>{agency.name} — {agency.phone}
  </div>
</div>

<style>
  @media print {
    .page {
      padding: 0;
      font-size: 7.5px;
      line-height: 1.2;
      border: none;
      /* Force full letter-content width so narrow mobile viewports don't reflow */
      width: 7.8in !important;
      max-width: 7.8in !important;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    .letterhead     { padding-bottom: 3px; margin-bottom: 4px; border-bottom-width: 2px; }
    .logo-area      { margin-bottom: 2px; gap: 6px; }
    .logo-area img, .logo-area svg { width: 34px !important; height: 34px !important; }
    .company-name   { font-size: 7px; line-height: 1.2; }
    .company-name strong { font-size: 9.5px; }
    .doc-title      { font-size: 10px; letter-spacing: 0.8px; padding: 1px 0; margin-top: 2px; }
    .section        { margin-bottom: 4px; }
    .section-title  { padding: 1px 4px; font-size: 7px; letter-spacing: 0.8px; margin-bottom: 2px; }
    .row            { margin-bottom: 1px; }
    label           { font-size: 6.5px; margin-bottom: 0; letter-spacing: 0.2px; }
    .field          { min-height: 10px; padding: 0 2px; font-size: 8px; }
    .prem .field    { font-size: 9px; border-bottom-width: 1px; }
    table           { font-size: 7.5px; }
    th              { padding: 1px 3px; font-size: 6.5px; }
    td              { padding: 1px 3px; }
    .discounts-grid { gap: 2px; }
    .discount-chip  { padding: 1px 4px; font-size: 7px; }
    .signatures     { margin-top: 5px; padding-top: 3px; }
    .sig-row        { gap: 10px; }
    .sig-date       { font-size: 7px; margin-top: 0; }
    .footnote       { margin-top: 3px; padding-top: 2px; font-size: 6.5px; line-height: 1.2; }
  }
  .page {
    background: #fff;
    color: #1a1a1a;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 1.4;
    max-width: 8.5in;
    margin: 0 auto;
    padding: 0.5in 0.6in;
    border: 1px solid #ccc;
  }
  .letterhead {
    border-bottom: 3px solid var(--brand);
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .logo-area { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
  .company-name { font-size: 11px; line-height: 1.5; }
  .company-name strong { font-size: 15px; color: var(--brand); letter-spacing: 0.5px; }
  .doc-title {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--brand-dark);
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 4px 0;
    margin-top: 6px;
  }
  .section { margin-bottom: 12px; }
  .section-title {
    background: var(--brand);
    color: white;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 3px 8px;
    margin-bottom: 6px;
  }
  .row { margin-bottom: 5px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .five-col { display: grid; grid-template-columns: 0.7fr 1fr 1fr 1.5fr 0.7fr; gap: 6px; }
  label { font-size: 9px; font-weight: 700; color: #555; letter-spacing: 0.5px; text-transform: uppercase; display: block; margin-bottom: 1px; }
  .field {
    border-bottom: 1px solid #333;
    padding: 2px 4px;
    min-height: 18px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    color: #000;
  }
  table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 4px; }
  th { background: var(--brand); color: white; padding: 4px 6px; font-size: 9px; letter-spacing: 0.5px; text-align: left; }
  td { padding: 4px 6px; border-bottom: 1px solid #ccc; vertical-align: top; }
  tr:nth-child(even) td { background: var(--brand-light); }
  .prem { font-weight: 700; }
  .prem .field { font-size: 14px; border-bottom: 2px solid var(--brand); }
  .discounts-grid { display: flex; flex-wrap: wrap; gap: 5px; }
  .discount-chip { background: var(--brand-light); border: 1px solid var(--brand); color: var(--brand-dark); padding: 2px 8px; font-size: 10px; border-radius: 2px; }
  .signatures { margin-top: 18px; padding-top: 10px; border-top: 1px solid #333; }
  .sig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .sig-box { padding-top: 6px; }
  .sig-date { font-size: 9px; color: #777; margin-top: 2px; }
  .footnote {
    margin-top: 14px;
    font-size: 8px;
    color: #777;
    border-top: 1px solid #ddd;
    padding-top: 6px;
    line-height: 1.5;
  }
</style>
