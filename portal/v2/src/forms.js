'use strict';
/* =========================================================
   AUTH (sign in, forgot password, request access)
   ========================================================= */
let heroTimer = null;
function authBrand() {
  const steps = [['Notary assigned', '10:37 AM'], ['Scheduler assigned', '10:41 AM'], ['Date & time set', '10:44 AM'], ['Signing completed', '4:52 PM']];
  return `<section class="auth-brand on-night" aria-label="About Notary Nexxus">${guilloche()}
    <div class="auth-eyebrow"><span class="dot"></span>Signing service management</div>
    <div class="auth-hero"><h1 class="auth-h">Every signing,<br>from order to <em>seal.</em></h1>
      <p class="auth-sub">Take orders, dispatch notaries, schedule signings, handle documents and invoice clients — one workspace for your staff, your clients and notaries in the field.</p>
      <div class="auth-demo"><div id="hero-seal">${seal([0, 0, 0, 0], 112, { center: true, tip: false })}</div>
        <ul class="auth-legend" id="hero-legend">${steps.map((s, i) => `<li>${quad(i)}<span>${s[0]}</span><span class="t">${s[1]}</span></li>`).join('')}</ul></div></div>
    <div class="auth-foot"><span>${icon('shield', 15)}Security-first by design</span><span>${icon('lock', 15)}256-bit encryption</span><span>${icon('users', 15)}Role-based access for staff, clients and notaries</span></div>
    <div class="auth-copy">© 2026 Notary Nexxus LLC</div></section>`;
}
function authForm(view, data = {}) {
  const lock = `<div class="logo-lockup">${LOGO(34)}<span class="wm">Notary Nexxus</span></div>`;
  if (view === 'forgot') return `<form class="auth-form" data-form="forgot" novalidate>${lock}
    <h2 class="auth-title">Reset your password</h2><p class="auth-desc">Enter the email you sign in with. We’ll send a link to set a new password.</p>
    <div style="margin-top:28px">${fld('email', 'Email', { type: 'email', req: true, ph: 'you@company.com', err: 'Enter the email you sign in with', attrs: 'autocomplete="username"' })}</div>
    <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top:22px">Send reset link</button>
    <p class="auth-note"><a class="link" href="#/signin">${icon('arrowL', 13)}Back to sign in</a></p></form>`;
  if (view === 'forgot-sent') return `<div class="auth-form">${lock}<h2 class="auth-title">Check your email</h2>
    <div class="auth-done"><span class="ok">${icon('mail', 18)}</span><p>We sent a reset link to <b>${esc(data.email)}</b>. It expires in 30 minutes. Didn’t get it? Check spam, or send it again.</p></div>
    <button class="btn btn-lg btn-block" style="margin-top:20px" data-action="resend-reset">Send it again</button>
    <p class="auth-note"><a class="link" href="#/signin">${icon('arrowL', 13)}Back to sign in</a></p></div>`;
  if (view === 'request') return `<form class="auth-form" data-form="request" novalidate>${lock}
    <h2 class="auth-title">Request access</h2><p class="auth-desc">Your workspace admin will get your request and can invite you.</p>
    <div class="grid2" style="margin-top:28px">${fld('name', 'Full name', { req: true, ph: 'Jordan Avery', err: 'Enter your name' })}${fld('company', 'Company', { req: true, ph: 'Desert Title Co.', err: 'Enter your company' })}
      <div class="span2">${fld('email', 'Work email', { type: 'email', req: true, ph: 'you@company.com', err: 'Enter a valid work email' })}</div>
      <div class="span2">${sel('role', 'I am a…', ['Client (I order signings)', 'Notary', 'Staff member'])}</div></div>
    <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top:22px">Send request</button>
    <p class="auth-note">Already have an account? <a class="link" href="#/signin">Sign in</a></p></form>`;
  if (view === 'request-sent') return `<div class="auth-form">${lock}<h2 class="auth-title">Request sent</h2>
    <div class="auth-done"><span class="ok">${icon('check', 18)}</span><p>Thanks, <b>${esc(first(data.name))}</b>. We’ve let the workspace admin know. You’ll get an invite at <b>${esc(data.email)}</b> once they approve it.</p></div>
    <p class="auth-note"><a class="link" href="#/signin">${icon('arrowL', 13)}Back to sign in</a></p></div>`;
  return `<form class="auth-form" data-form="signin" novalidate>${lock}
    <h2 class="auth-title">Welcome back.</h2><p class="auth-desc">Sign in to your workspace to continue.</p>
    <button type="button" class="btn btn-google" data-action="signin-google">${GOOGLE}Continue with Google</button>
    <div class="divider">or with email</div>
    ${fld('email', 'Email', { type: 'email', req: true, ph: 'you@company.com', err: 'Enter a valid email address', attrs: 'autocomplete="username"', opt: false })}
    <div class="field" data-f="password"><label class="label" for="f-password">Password<span class="spacer"></span><a href="#/forgot-password" class="link">Forgot password?</a></label>
      <div class="iw"><input class="input" id="f-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" data-required style="padding-left:12px;padding-right:44px"><button type="button" class="icon-btn sm suffix" data-action="toggle-pw" aria-label="Show password">${icon('eye', 16)}</button></div>
      <div class="field-err">${icon('alert', 13)}Enter your password</div></div>
    <div class="auth-row"><label class="check"><input type="checkbox" checked> Keep me signed in on this device</label></div>
    <button type="submit" class="btn btn-primary btn-lg btn-block">Sign in ${icon('arrowR', 16)}</button>
    <p class="auth-note">Need access? <a class="link" href="#/request-access">Request access</a></p>
    <div class="auth-secure">${icon('lock', 13)} Protected with two-step verification</div></form>`;
}
function renderAuth(view, data) {
  const fresh = !$('.auth');
  if (fresh) {
    $('#app').innerHTML = `<div class="auth">${authBrand()}<section class="auth-side"><div class="auth-theme">${themeBtn()}</div><div id="auth-slot"></div></section></div>`;
    startHero();
  }
  $('#auth-slot').innerHTML = authForm(view, data);
  if (M.ok()) gsap.from($$('#auth-slot .auth-form > *'), { y: 10, autoAlpha: 0, duration: .4, stagger: .035, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
  const f = $('#auth-slot input'); if (f && !('ontouchstart' in window)) f.focus({ preventScroll: true });
  document.title = { signin: 'Sign in', forgot: 'Reset password', 'forgot-sent': 'Check your email', request: 'Request access', 'request-sent': 'Request sent' }[view] + ' · Notary Nexxus';
}
function startHero() {
  if (heroTimer) clearInterval(heroTimer);
  let k = 0;
  const step = () => {
    const host = $('#hero-seal'); if (!host) { clearInterval(heroTimer); heroTimer = null; return; }
    host.innerHTML = seal([0, 1, 2, 3].map(i => i < k), 112, { center: true, tip: false, draw: k > 0 && k <= 4 });
    $$('#hero-legend li').forEach((li, i) => { li.classList.toggle('on', i < k); li.classList.toggle('gold', k >= 4); li.querySelector('.q').classList.toggle('complete', k >= 4); });
    M.seals(host);
    k = k >= 5 ? 0 : k + 1;
  };
  if (reduceMotion()) { k = 4; step(); } else { step(); heroTimer = setInterval(step, 1400); }
}

/* =========================================================
   NEW ORDER
   ========================================================= */
const REQ = [
  { k: 'client', label: 'Client company', test: d => !!d.client, focus: 'nf-client' },
  { k: 'type', label: 'Signing type', test: d => !!d.type, focus: 'nf-type' },
  { k: 'file', label: 'File number', test: d => !!d.file.trim(), focus: 'nf-file' },
  { k: 'signer', label: 'Signer name', test: d => !!d.signer.trim(), focus: 'nf-signer' },
  { k: 'phone', label: 'Signer phone', test: d => d.phone.replace(/\D/g, '').length === 10, focus: 'nf-phone' },
];
const draftChecks = d => [false, !!d.scheduler, !!(d.date && d.time), false];
function nf(id, label, attrs = '', req = false, ic = '', err = '') {
  const d = S.draft;
  const inp = `<input class="input" id="nf-${id}" data-draft="${id}" value="${esc(d[id])}" ${attrs} ${req ? 'aria-required="true"' : ''}>`;
  return `<div class="field" data-f="${id}"><label class="label" for="nf-${id}">${label}${req ? ' <span class="star" aria-hidden="true">*</span>' : ''}</label>${ic ? `<div class="iw">${icon(ic, 15)}${inp}</div>` : inp}${req ? `<div class="field-err">${icon('alert', 13)}${err || 'This field is required'}</div>` : ''}</div>`;
}
const opt = '<span class="opt">optional</span>';
function pageNew() {
  const d = S.draft, client = clientBy(d.client), dirty = JSON.stringify(d) !== JSON.stringify(emptyDraft());
  return `<a class="back" href="#/orders">${icon('arrowL', 15)}All orders</a>
  <div class="page-head"><div><div class="eyebrow">Order intake</div><h1 class="h1">New signing order</h1><p class="lede">Fields marked <span class="star">*</span> are required. Everything else can be added later from the order page.</p></div>
    <div class="head-actions"><span class="hint" id="draft-saved" aria-live="polite">${dirty ? icon('check', 13) + 'Draft saved' : ''}</span><button class="btn btn-ghost" data-action="clear-draft" ${dirty ? '' : 'disabled'}>Clear form</button></div></div>
  <div class="no-grid"><div class="stack">
    <section class="card sec" id="sec-client"><div class="sec-head"><span class="sec-ic">${icon('building', 16)}</span><div><h2>Client</h2><p>Who ordered the signing</p></div><span class="st" data-sec="client"></span></div>
      <div class="sec-body"><div class="grid2">
        <div class="field" data-f="client"><label class="label" for="nf-client">Client company <span class="star" aria-hidden="true">*</span></label>
          <div class="combo" id="client-combo"><div class="iw">${icon('search', 15)}<input class="input" id="nf-client" autocomplete="off" placeholder="Search clients…" value="${esc(d.client)}" role="combobox" aria-expanded="false" aria-controls="client-list" aria-required="true"></div><div class="combo-list" id="client-list" role="listbox"></div></div>
          <div class="field-err">${icon('alert', 13)}Choose a client</div></div>
        <div class="field" data-f="type"><label class="label" for="nf-type">Signing type <span class="star" aria-hidden="true">*</span></label>
          <div class="sw"><select class="select" id="nf-type" data-draft="type" ${d.client ? '' : 'disabled'} aria-required="true"><option value="">${d.client ? 'Choose a type' : 'Select a client first'}</option>${TYPES.map(t => `<option ${d.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select>${icon('down', 15)}</div><div class="field-err">${icon('alert', 13)}Choose a signing type</div></div>
        ${nf('file', 'File number', 'placeholder="e.g. DT-80544" autocomplete="off"', true, '', 'Enter the client’s file number')}
        <div class="field"><label class="label" for="nf-orderedBy">Ordered by ${opt}</label><div class="sw"><select class="select" id="nf-orderedBy" data-draft="orderedBy" ${client ? '' : 'disabled'}><option value="">${client ? 'Choose a contact' : 'Select a client first'}</option>${client ? client.contacts.map(c => `<option ${d.orderedBy === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join('') : ''}</select>${icon('down', 15)}</div></div>
        ${nf('cc', 'CC email ' + opt, 'type="email" placeholder="name@company.com"', false, 'mail')}
        <div class="field"><span class="label">Order flags</span><div class="flags">
          <button type="button" class="flag-btn" aria-pressed="${d.flags.includes('Rush')}" data-action="draft-flag" data-f="Rush">${icon('zap', 14)}Rush <span class="muted" style="font-weight:400">+${money(S.ws.rush, 0)}</span></button>
          <button type="button" class="flag-btn scan" aria-pressed="${d.flags.includes('Scanbacks')}" data-action="draft-flag" data-f="Scanbacks">${icon('scan', 14)}Scanbacks <span class="muted" style="font-weight:400">+${money(S.ws.scan, 0)}</span></button></div></div>
      </div></div></section>
    <section class="card sec" id="sec-signer"><div class="sec-head"><span class="sec-ic">${icon('user', 16)}</span><div><h2>Signer</h2><p>Who’s signing, and how to reach them</p></div><span class="st" data-sec="signer"></span></div>
      <div class="sec-body"><div class="grid2">
        ${nf('signer', 'Signer name', 'placeholder="Full legal name" autocomplete="off"', true, '', 'Enter the signer’s full name')}
        ${nf('phone', 'Signer phone', 'type="tel" inputmode="tel" placeholder="(555) 555-5555"', true, 'phone', 'Enter a 10-digit phone number')}
        ${nf('email', 'Signer email ' + opt, 'type="email" placeholder="name@example.com"', false, 'mail')}
        <div class="field"><label class="label" for="nf-sms">SMS number ${opt}</label><div class="iw">${icon('msg', 15)}<input class="input" id="nf-sms" data-draft="sms" type="tel" inputmode="tel" placeholder="(555) 555-5555" value="${esc(d.sms)}" ${d.smsSame ? 'disabled' : ''}></div>
          <label class="check" style="margin-top:8px"><input type="checkbox" id="nf-smsSame" ${d.smsSame ? 'checked' : ''}>Same as signer phone</label></div>
      </div></div></section>
    <section class="card sec" id="sec-appt"><div class="sec-head"><span class="sec-ic">${icon('cal', 16)}</span><div><h2>Appointment &amp; location</h2><p>When and where the signing happens</p></div><span class="st" data-sec="appt"></span></div>
      <div class="sec-body"><div class="grid3">
        ${nf('date', 'Date', `type="date" min="${TODAY}"`)}${nf('time', 'Time', 'type="time" step="900"')}
        <div class="field"><label class="label" for="nf-tz">Time zone</label><div class="sw"><select class="select" id="nf-tz" data-draft="tz">${['Arizona (MST)', 'Pacific (PT)', 'Mountain (MT)', 'Central (CT)', 'Eastern (ET)'].map(t => `<option ${d.tz === t ? 'selected' : ''}>${t}</option>`).join('')}</select>${icon('down', 15)}</div></div>
        <div class="field span-all"><label class="label" for="nf-street">Street address</label><div class="combo" id="addr-combo"><div class="iw">${icon('pin', 15)}<input class="input" id="nf-street" data-draft="street" autocomplete="off" placeholder="Start typing an address…" value="${esc(d.street)}" role="combobox" aria-expanded="false" aria-controls="addr-list"></div><div class="combo-list" id="addr-list" role="listbox"></div></div></div>
        ${nf('unit', 'Apt, suite or unit ' + opt, 'placeholder="e.g. Apt 4B"')}${nf('city', 'City', 'placeholder="City"')}
        <div class="grid2" style="gap:16px 12px">${nf('st', 'State', 'placeholder="AZ" maxlength="2" style="text-transform:uppercase"')}${nf('zip', 'ZIP', 'inputmode="numeric" placeholder="85001" maxlength="5"')}</div>
      </div></div></section>
    <section class="card sec ${d.type === 'Delivery' ? '' : 'hidden'}" id="sec-vehicle"><div class="sec-head"><span class="sec-ic">${icon('car', 16)}</span><div><h2>Vehicle &amp; delivery</h2><p>Shown for delivery signings</p></div></div>
      <div class="sec-body"><div class="grid3">${nf('year', 'Year', 'inputmode="numeric" placeholder="2026" maxlength="4"')}${nf('make', 'Make', 'placeholder="e.g. Lexus"')}${nf('model', 'Model', 'placeholder="e.g. RX 350h"')}
        <div class="span2">${nf('vin', 'VIN', 'placeholder="17 characters" maxlength="17" style="text-transform:uppercase;font-family:var(--font-mono)"')}</div>
        <div class="field"><label class="label" for="nf-driver">Delivery driver</label><div class="sw"><select class="select" id="nf-driver" data-draft="driver"><option value="">Choose a driver</option>${S.drivers.filter(x => x.active).map(x => `<option ${d.driver === x.name ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>${icon('down', 15)}</div></div></div></div></section>
    <section class="card sec" id="sec-docs"><div class="sec-head"><span class="sec-ic">${icon('file', 16)}</span><div><h2>Documents</h2><p>We read uploads with OCR and offer to fill in the form</p></div></div>
      <div id="draft-docs">${draftDocs()}</div>
      <button class="dropzone" data-action="upload" data-id="draft"><span class="dz-ic">${icon('upload', 17)}</span><span><b>Upload documents</b> or drop them here<br><span class="sm">Loan packages, IDs and supporting files · PDF, JPG or PNG up to 50 MB</span></span></button>
      <div style="padding:0 20px 20px;margin-top:-6px;font-size:12.5px;color:var(--text-3)">No files handy? <button class="link" data-action="sample-doc">Try a sample loan package</button></div></section>
    <section class="card sec" id="sec-more"><div class="sec-head"><span class="sec-ic">${icon('headset', 16)}</span><div><h2>Scheduling &amp; notes</h2><p>Optional — you can set these later</p></div></div>
      <div class="sec-body"><div class="grid2">
        <div class="field"><label class="label" for="nf-scheduler">Scheduler ${opt}</label><div class="sw"><select class="select" id="nf-scheduler" data-draft="scheduler"><option value="">Assign later</option>${S.team.filter(t => t.status === 'Active').map(s => `<option ${d.scheduler === s.name ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select>${icon('down', 15)}</div></div><div></div>
        <div class="field span2"><label class="label" for="nf-notes">Special instructions ${opt}</label><textarea class="textarea" id="nf-notes" data-draft="notes" placeholder="Gate codes, parking, ID requirements — anything the notary should know">${esc(d.notes)}</textarea></div></div></div></section>
  </div>
  <aside class="sum" aria-label="Order summary"><div id="summary">${summaryCard()}</div></aside></div>
  <div class="no-mobile-bar" id="mobile-bar">${mobileBar()}</div>`;
}
function draftDocs() {
  const docs = S.draft.docs; if (!docs.length) return '';
  return `<ul class="docs" style="border-bottom:1px solid var(--line)">${docs.map((d, i) => `<li><div class="doc-ic ${d.kind}">${d.kind === 'img' ? 'JPG' : 'PDF'}</div><div class="doc-main"><div class="doc-name" title="${esc(d.name)}">${esc(d.name)}</div><div class="doc-meta">${d.pages} page${d.pages > 1 ? 's' : ''} · ${d.size}</div>
    ${d.ocr === 'reading' ? `<div class="ocr reading">${icon('sparkles', 14)}<span style="flex:1">Reading ${d.pages} pages…<span class="bar"></span></span></div>`
      : d.found ? `<div class="ocr">${icon('sparkles', 14)}<span style="flex:1">Found <b>${esc(d.found.signer)}</b>, file <b class="mono">${esc(d.found.file)}</b> and <b>${esc(d.found.street)}, ${esc(d.found.city)}</b>. ${d.applied ? '<span style="color:var(--green);font-weight:500">Added to the form.</span>' : `<button class="link" data-action="ocr-fill" data-i="${i}">Fill in the form</button>`}</span></div>`
      : `<div class="ocr">${icon('sparkles', 14)}<span>Read ${d.pages} page${d.pages > 1 ? 's' : ''} · ${Math.max(1, Math.round(d.pages / 4))} signature lines found.</span></div>`}
    </div><div class="doc-actions"><button class="icon-btn sm" data-action="remove-doc" data-i="${i}" aria-label="Remove ${esc(d.name)}" data-tip="Remove">${icon('x', 16)}</button></div></li>`).join('')}</ul>`;
}
let prevReq = new Set();
function summaryCard() {
  const d = S.draft, ch = draftChecks(d), done = ch.filter(Boolean).length, ok = REQ.filter(r => r.test(d)).length, left = REQ.length - ok;
  const loc = d.street ? `${esc(d.street)}${d.unit ? ', ' + esc(d.unit) : ''}<span class="s">${[d.city, d.st.toUpperCase(), d.zip].filter(Boolean).map(esc).join(', ')}</span>` : '';
  const appt = d.date ? `${fmtDate(d.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}<span class="s">${d.time ? to12h(d.time) + ' · ' + esc(d.tz) : 'Time TBD'}</span>` : '';
  const c = clientBy(d.client), est = c && d.type ? (c.fees[d.type] || 0) + (d.flags.includes('Rush') ? S.ws.rush : 0) + (d.flags.includes('Scanbacks') ? S.ws.scan : 0) : 0;
  return `<div class="sum-card on-night"><div class="sum-head"><span class="t">Order summary</span><span class="chip">Draft</span></div>
    <div class="sum-seal">${seal(ch, 76, { center: true, tip: false })}<div style="min-width:0"><div class="t truncate">${d.client ? esc(d.client) : 'No client yet'}</div><div class="s">Opens at ${done} of 4. ${done < 2 ? 'Add a date, time and scheduler to start further along.' : 'Next: invite a notary from the order page.'}</div></div></div>
    <dl class="sum-list">
      <div><dt>Signer</dt><dd class="${d.signer ? '' : 'none'}">${d.signer ? esc(d.signer) + (d.phone ? `<span class="s mono">${esc(d.phone)}</span>` : '') : '—'}</dd></div>
      <div><dt>Type</dt><dd class="${d.type ? '' : 'none'}">${d.type ? esc(d.type) + (d.file ? `<span class="s mono">${esc(d.file)}</span>` : '') : '—'}</dd></div>
      <div><dt>When</dt><dd class="${appt ? '' : 'none'}">${appt || '—'}</dd></div>
      <div><dt>Where</dt><dd class="${loc ? '' : 'none'}">${loc || '—'}</dd></div>
      ${d.flags.length ? `<div><dt>Flags</dt><dd>${d.flags.join(' · ')}</dd></div>` : ''}${d.docs.length ? `<div><dt>Files</dt><dd>${d.docs.length} document${d.docs.length > 1 ? 's' : ''}</dd></div>` : ''}
</dl><div class="rc-total"><span>Estimated fee</span><b>${est ? money(est) : '—'}</b></div>
    <div class="req"><div class="req-head"><span>Required fields</span><b>${ok} of ${REQ.length}</b></div><div class="req-bar ${left ? '' : 'full'}"><i style="width:${ok / REQ.length * 100}%"></i></div>
      <ul>${REQ.map(r => `<li class="${r.test(d) ? 'ok' : ''}" data-k="${r.k}"><button type="button" data-action="focus" data-to="${r.focus}"><span class="bx">${r.test(d) ? icon('check', 10) : ''}</span>${r.label}</button></li>`).join('')}</ul></div>
    <div class="sum-cta"><button class="btn btn-primary btn-lg btn-block" data-action="place" ${left ? 'disabled' : ''}>${left ? `${left} required field${left > 1 ? 's' : ''} left` : `Place order ${icon('arrowR', 16)}`}</button>
      <p class="fine">The order opens as Active. You’ll invite or assign a notary from the order page.</p></div></div>`;
}
function mobileBar() {
  const left = REQ.length - REQ.filter(r => r.test(S.draft)).length;
  return `<div class="tx"><b>${left ? `${left} required field${left > 1 ? 's' : ''} left` : 'Ready to place'}</b>${left ? 'Fields marked * are required' : 'Review the summary above'}</div><button class="btn btn-primary" data-action="place" ${left ? 'disabled' : ''}>Place order</button>`;
}
function updateSummary() {
  if (route().parts[0] !== 'new') return;
  $('#summary').innerHTML = summaryCard(); $('#mobile-bar').innerHTML = mobileBar();
  const now = new Set(REQ.filter(r => r.test(S.draft)).map(r => r.k));
  now.forEach(k => { if (!prevReq.has(k)) M.pop($(`.req li[data-k="${k}"] .bx`), .3); });
  if (now.size === REQ.length && prevReq.size < REQ.length) M.pop($('.sum-cta .btn'), .94);
  prevReq = now;
  const d = S.draft, secs = { client: !!(d.client && d.type && d.file.trim()), signer: REQ[3].test(d) && REQ[4].test(d), appt: !!(d.date && d.time && d.street) };
  Object.entries(secs).forEach(([k, ok]) => {
    const el = $(`[data-sec="${k}"]`); if (!el) return;
    const was = el.closest('.sec').classList.contains('sec-done');
    el.innerHTML = ok ? `<span class="chip green">${icon('check', 12)}Complete</span>` : '';
    el.closest('.sec').classList.toggle('sec-done', ok);
    if (ok && !was) M.pop(el.firstChild, .7);
  });
  const veh = $('#sec-vehicle');
  if (veh) { const show = d.type === 'Delivery', hid = veh.classList.contains('hidden'); veh.classList.toggle('hidden', !show); if (show && hid) M.expand(veh); }
}
function markSaved() { const ds = $('#draft-saved'); if (ds) ds.innerHTML = `${icon('check', 13)}Draft saved`; const cb = $('[data-action="clear-draft"]'); if (cb) cb.disabled = false; }
function comboRender(listEl, items) {
  const combo = listEl.closest('.combo'); combo.classList.toggle('open', items.length > 0);
  combo.querySelector('input').setAttribute('aria-expanded', items.length > 0); listEl.innerHTML = items.join('');
}
function showClientList(q) {
  q = (q || '').toLowerCase();
  const items = S.clients.filter(c => !q || c.name.toLowerCase().includes(q)).map((c, i) => `<button type="button" class="combo-opt ${i ? '' : 'hl'}" role="option" data-action="pick-client" data-name="${esc(c.name)}">${av(c.name, 'sq')}<span style="min-width:0;flex:1"><span class="nm truncate" style="display:block">${esc(c.name)}</span><span class="mt" style="display:block">${esc(c.category)} · ${c.contacts.length} contacts</span></span><span class="r">${c.ordersMonth} this month</span></button>`);
  if (!items.length) items.push(`<div class="np-help" style="padding:10px;margin:0">No client named “${esc(q)}”. <a class="link" href="#/clients/new">Add a client</a></div>`);
  comboRender($('#client-list'), items);
}
function showAddrList(q) {
  q = (q || '').toLowerCase().trim();
  const items = q.length < 2 ? [] : ADDRESSES.filter(a => (a.street + ' ' + a.city).toLowerCase().includes(q)).slice(0, 5).map((a, i) => `<button type="button" class="combo-opt ${i ? '' : 'hl'}" role="option" data-action="pick-addr" data-i="${ADDRESSES.indexOf(a)}">${icon('pin', 15)}<span><span class="nm" style="display:block">${esc(a.street)}</span><span class="mt">${esc(a.city)}, ${a.st} ${a.zip}</span></span></button>`);
  comboRender($('#addr-list'), items);
}
function pickClient(name) {
  const d = S.draft, c = clientBy(name); d.client = name; d.orderedBy = '';
  $('#nf-client').value = name; $('#client-combo').classList.remove('open');
  const type = $('#nf-type'); type.disabled = false; type.options[0].textContent = 'Choose a type';
  if (!d.type && c.category === 'Vehicle delivery') { d.type = 'Delivery'; type.value = 'Delivery'; }
  const ob = $('#nf-orderedBy'); ob.disabled = false; ob.innerHTML = '<option value="">Choose a contact</option>' + c.contacts.map(x => `<option>${esc(x.name)}</option>`).join('');
  $$('[data-f="client"],[data-f="type"]').forEach(f => f.classList.remove('invalid'));
  updateSummary(); markSaved(); (d.type ? $('#nf-file') : type).focus();
}
function pickAddr(i) {
  const a = ADDRESSES[i]; Object.assign(S.draft, { street: a.street, city: a.city, st: a.st, zip: a.zip });
  ['street', 'city', 'st', 'zip'].forEach(k => { $('#nf-' + k).value = S.draft[k]; });
  $('#addr-combo').classList.remove('open'); updateSummary(); markSaved(); $('#nf-unit').focus();
}
function addDraftDoc(doc) {
  doc.ocr = 'reading'; S.draft.docs.push(doc); $('#draft-docs').innerHTML = draftDocs(); updateSummary(); markSaved();
  setTimeout(() => {
    doc.ocr = 'done';
    if (doc.sample) doc.found = { signer: 'Morgan Ellis', file: 'DT-80544', street: '1820 E Camelback Rd', city: 'Phoenix', st: 'AZ', zip: '85016', phone: '(602) 555-0193' };
    if (route().parts[0] === 'new') { $('#draft-docs').innerHTML = draftDocs(); M.flash($('#draft-docs .ocr')); }
  }, 2000);
}
function ocrFill(i) {
  const doc = S.draft.docs[i], f = doc.found, d = S.draft, filled = [];
  const set = (k, v) => { if (!d[k]) { d[k] = v; const el = $('#nf-' + k); if (el) { el.value = v; const fl = el.closest('.field'); fl && fl.classList.remove('invalid'); M.flash(el); } filled.push(k); } };
  ['signer', 'file', 'phone', 'street', 'city', 'st', 'zip'].forEach(k => set(k, f[k]));
  doc.applied = true; $('#draft-docs').innerHTML = draftDocs(); updateSummary(); markSaved();
  toast(filled.length ? `Filled ${filled.length} field${filled.length > 1 ? 's' : ''} from the document` : 'Those fields already have values — nothing changed', { icon: 'sparkles' });
}
function placeOrder() {
  const d = S.draft, missing = REQ.filter(r => !r.test(d));
  if (missing.length) {
    missing.forEach(r => { const f = $(`[data-f="${r.k}"]`); if (f) f.classList.add('invalid'); });
    const el = document.getElementById(missing[0].focus); if (el) { el.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }); setTimeout(() => el.focus({ preventScroll: true }), 300); }
    return;
  }
  const id = S.nextId++;
  const o = O({ id, file: d.file.trim(), created: 'Nov 19, 2026 · 2:15 PM', date: d.date || null, time: d.time ? to12h(d.time) : null, tz: (d.tz.match(/\((\w+)\)/) || [, 'MST'])[1], signer: d.signer.trim(), phone: d.phone, sms: d.smsSame ? d.phone : d.sms, email: d.email, cc: d.cc, type: d.type, street: d.street || 'Address to be confirmed', unit: d.unit, city: d.city || '—', st: (d.st || 'AZ').toUpperCase(), zip: d.zip, client: d.client, orderedBy: d.orderedBy, scheduler: d.scheduler || null, notary: null, flags: d.flags.slice(), docs: d.docs.length });
  if (d.type === 'Delivery' && (d.make || d.vin)) o.vehicle = { year: d.year, make: d.make, model: d.model, vin: d.vin.toUpperCase() };
  if (d.type === 'Delivery' && d.driver) { const dr = S.drivers.find(x => x.name === d.driver); o.driver = { name: dr.name, phone: dr.phone }; }
  o.docsList = d.docs.map(x => ({ name: x.name, kind: x.kind, pages: x.pages, size: x.size, by: 'Jonathan Means', at: 'Just now', ocr: { state: 'done', sig: Math.max(1, Math.round(x.pages / 4)), text: `<b>Read ${x.pages} pages.</b> ${Math.max(1, Math.round(x.pages / 4))} signature lines found.` } }));
  o.messages = []; o.activity = [{ t: 'Just now', txt: 'Order created by <b>Jonathan Means</b>', c: 'ink' }];
  if (d.notes) o.instructions = { client: [d.notes], company: [`Scanbacks are due within ${S.ws.scanHours} hours of signing.`] };
  const c = clientBy(d.client); if (c) c.ordersMonth++;
  S.orders.unshift(o); S.draft = emptyDraft(); prevReq = new Set(); S.tab = 'active';
  go('#/orders/' + id); toast(`Order <b>${id}</b> placed`, { icon: 'badge' });
}

/* =========================================================
   ADD PAGES (client / notary / driver)
   ========================================================= */
function formPage(back, backLabel, title, lede, kind, inner, foot, cta, width = 760) {
  return `<div class="form-page" style="max-width:${width}px"><a class="back" href="${back}">${icon('arrowL', 15)}${backLabel}</a>
    <div class="page-head"><div><div class="eyebrow">Directory</div><h1 class="h1">${title}</h1><p class="lede">${lede}</p></div></div>
    <form class="card form-card" data-form="${kind}" novalidate id="form-${kind}">${inner}</form>
    <div class="form-foot"><p>${foot}</p><a class="btn btn-ghost" href="${back}">Cancel</a><button class="btn btn-primary" type="submit" form="form-${kind}">${cta} ${icon('arrowR', 15)}</button></div></div>`;
}
const secHead = (ic, h, p = '', top = false) => `<div class="sec-head" ${top ? 'style="border-top:1px solid var(--line)"' : ''}><span class="sec-ic">${icon(ic, 16)}</span><div><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div></div>`;
function pageAddClient() {
  return formPage('#/clients', 'Clients', 'Add client', 'Create a client contact and place them at a company.', 'client',
    `${secHead('user', 'Contact details')}<div class="sec-body"><div class="grid2">
      ${fld('first', 'First name', { req: true, ph: 'Jordan', err: 'Enter a first name' })}${fld('last', 'Last name', { req: true, ph: 'Avery', err: 'Enter a last name' })}
      ${sel('role', 'Role', ['Client user', 'Client admin', 'View only'], 'Client user', { req: true })}${fld('email', 'Email address', { type: 'email', req: true, ph: 'name@company.com', err: 'Enter a valid email address' })}
      ${fld('phone', 'Phone', { type: 'tel', req: true, ph: '(555) 555-5555', err: 'Enter a 10-digit phone number' })}</div>
      <p class="help" style="margin-top:12px">Client admins can add their own teammates. View only users can track orders but can’t place them.</p></div>
    ${secHead('building', 'Company', '', true)}<div class="sec-body">
      <div class="radio-cards" role="radiogroup" aria-label="Company"><label class="radio-card"><input type="radio" name="co" value="new" checked data-change="co"><div><div class="t">New company</div><div class="d">Creates the company along with this contact</div></div></label>
        <label class="radio-card"><input type="radio" name="co" value="existing" data-change="co"><div><div class="t">Existing company</div><div class="d">Adds this contact to a company you already work with</div></div></label></div>
      <div class="grid2" style="margin-top:18px" id="co-new">${fld('company', 'Company name', { req: true, ph: 'Desert Title Co.', err: 'Enter the company name' })}${sel('cat', 'Client category', ['Title & escrow', 'Vehicle delivery', 'Lender', 'Law firm', 'Other'], '', { req: true })}</div>
      <div class="hidden" style="margin-top:18px" id="co-existing">${sel('existing', 'Company', S.clients.map(c => c.name), '', { req: true })}</div></div>`,
    'Saving adds the contact to your directory. They won’t get an email until you invite them.', 'Create client');
}
function pageAddNotary() {
  const langs = ['English', 'Spanish', 'Mandarin', 'Vietnamese', 'Tagalog', 'Arabic'];
  return formPage('#/notaries', 'Notaries', 'Add notary', 'Start with the basics. The notary fills in the rest when they set up their profile.', 'notary',
    `${secHead('stamp', 'Notary details')}<div class="sec-body"><div class="grid2">
      ${fld('first', 'First name', { req: true, ph: 'Jordan', err: 'Enter a first name' })}${fld('last', 'Last name', { req: true, ph: 'Avery', err: 'Enter a last name' })}
      ${fld('email', 'Email address', { type: 'email', req: true, ph: 'notary@example.com', err: 'Enter a valid email address' })}${fld('phone', 'Phone', { type: 'tel', req: true, ph: '(555) 555-5555', err: 'Enter a 10-digit phone number' })}</div></div>
    ${secHead('badge', 'Commission & coverage', 'Used to match notaries to nearby orders', true)}<div class="sec-body"><div class="grid3">
      ${fld('commissionNo', 'Commission number', { ph: '2024-123456', attrs: 'style="font-family:var(--font-mono)"' })}${fld('expires', 'Commission expires', { type: 'date' })}${fld('rate', 'Usual rate', { ph: '125', icon: 'dollar', attrs: 'inputmode="decimal"' })}
      <div class="span2">${fld('city', 'Home base', { ph: 'Phoenix, AZ' })}</div>${fld('radius', 'Travel radius (miles)', { ph: '30', attrs: 'inputmode="numeric"' })}
      <div class="field span-all"><span class="label">Languages</span><div class="flags">${langs.map((l, i) => `<button type="button" class="flag-btn scan" aria-pressed="${!i}" data-action="press" data-lang="${l}">${l}</button>`).join('')}</div></div></div>
      <label class="check" style="margin-top:18px"><input type="checkbox" name="invite" checked>Email an invite so they can set up their profile</label></div>`,
    'You can edit any of this later from the notary’s profile.', 'Create notary');
}
function pageAddDriver() {
  return formPage('#/drivers', 'Drivers', 'Add driver', 'A driver needs a name and phone number so the office can reach them. Once saved, you can pick them on any delivery order.', 'driver',
    `<div class="sec-body"><div class="grid2">${fld('name', 'Full name', { req: true, ph: 'Full name', err: 'Enter the driver’s name' })}${fld('phone', 'Phone', { type: 'tel', req: true, ph: '(555) 555-5555', err: 'Enter a 10-digit phone number' })}
      <div class="span2">${fld('email', 'Email', { type: 'email', ph: 'name@example.com', help: 'Used for delivery updates only.' })}</div>
      <div class="span2">${sel('client', 'Works with', [['', 'Any client'], ...S.clients.filter(c => c.category === 'Vehicle delivery').map(c => c.name)])}</div></div></div>`,
    '', 'Add driver', 620);
}
function submitAdd(kind, form) {
  if (!validate(form)) return;
  const v = formData(form);
  if (kind === 'client') {
    const name = `${v.first.trim()} ${v.last.trim()}`, contact = ct(name, v.role, v.email.trim(), v.phone);
    if (v.co === 'new') {
      const c = { name: v.company.trim(), slug: slugify(v.company), category: v.cat, since: 'Nov 2026', phone: v.phone, billing: v.email.trim(), address: '', terms: 'Net 15', ordersMonth: 0, revenue: 0, notes: '', fees: Object.assign({}, S.ws.fees), contacts: [contact] };
      S.clients.push(c); go('#/clients/' + c.slug); toast(`<b>${esc(c.name)}</b> added with ${esc(name)} as ${esc(v.role.toLowerCase())}`);
    } else { const c = clientBy(v.existing); c.contacts.push(contact); go('#/clients/' + c.slug); toast(`<b>${esc(name)}</b> added to ${esc(c.name)}`); }
  } else if (kind === 'notary') {
    const name = `${v.first.trim()} ${v.last.trim()}`;
    const n = { name, slug: slugify(name), city: v.city || 'Phoenix, AZ', radius: parseInt(v.radius) || 25, commissionNo: v.commissionNo, commission: v.expires, status: 'invited', invitedAt: 'Nov 19', signings: 0, langs: $$('[data-lang][aria-pressed="true"]').map(b => b.dataset.lang), rate: parseInt(String(v.rate).replace(/\D/g, '')) || null, distance: 10, phone: v.phone, email: v.email, since: 'Nov 2026', onTime: null, accept: null, response: '—', days: [0, 0, 0, 0, 0, 0, 0], eo: '', bg: 'Not started' };
    S.notaries.push(n); go('#/notaries/' + n.slug); toast(`<b>${esc(name)}</b> added${v.invite ? ' — invite sent to ' + esc(v.email) : ''}`, { icon: v.invite ? 'send' : 'circlecheck' });
  } else {
    S.drivers.unshift({ name: v.name.trim(), phone: v.phone, email: v.email, active: true, deliveries: 0, client: v.client });
    go('#/drivers'); toast(`<b>${esc(v.name.trim())}</b> added — you can pick them on delivery orders`);
  }
}

/* =========================================================
   EDIT DIALOGS
   ========================================================= */
function editAddressModal(o) {
  openModal({ title: 'Edit signing location', desc: `Order ${o.id} · ${esc(o.signer)}`,
    body: `<div class="grid2"><div class="span2">${fld('street', 'Street address', { req: true, value: o.street, err: 'Enter a street address', icon: 'pin' })}</div>${fld('unit', 'Apt, suite or unit', { value: o.unit })}${fld('city', 'City', { req: true, value: o.city, err: 'Enter a city' })}${fld('st', 'State', { req: true, value: o.st, attrs: 'maxlength="2" style="text-transform:uppercase"' })}${fld('zip', 'ZIP', { req: true, value: o.zip, attrs: 'inputmode="numeric" maxlength="5"' })}</div>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Save location</button>`,
    onSubmit: v => { Object.assign(o, { street: v.street.trim(), unit: v.unit.trim(), city: v.city.trim(), st: v.st.toUpperCase(), zip: v.zip }); pushActivity(o, 'Signing location updated', ''); refreshDetail(); toast('Signing location saved'); } });
}
function editClientModal(c) {
  openModal({ title: `Edit ${esc(c.name)}`, desc: 'Company details used on orders and invoices.',
    body: `<div class="grid2"><div class="span2">${fld('name', 'Company name', { req: true, value: c.name, err: 'Enter the company name' })}</div>${sel('category', 'Category', ['Title & escrow', 'Vehicle delivery', 'Lender', 'Law firm', 'Other'], c.category)}${fld('phone', 'Main phone', { type: 'tel', value: c.phone })}
      <div class="span2">${fld('billing', 'Billing email', { type: 'email', req: true, value: c.billing, err: 'Enter a valid billing email', icon: 'mail' })}</div><div class="span2">${fld('address', 'Billing address', { value: c.address })}</div>${sel('terms', 'Payment terms', ['Due on receipt', 'Net 15', 'Net 30'], c.terms)}</div>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Save changes</button>`,
    onSubmit: v => { const old = c.name; Object.assign(c, { name: v.name.trim(), category: v.category, phone: v.phone, billing: v.billing.trim(), address: v.address.trim(), terms: v.terms });
      if (old !== c.name) { S.orders.forEach(o => { if (o.client === old) o.client = c.name; }); c.slug = slugify(c.name); go('#/clients/' + c.slug); } else render(false);
      toast(`<b>${esc(c.name)}</b> saved`); } });
}
function contactModal(c, idx) {
  const p = idx != null ? c.contacts[idx] : ct('', 'Client user', '', '');
  openModal({ title: idx != null ? 'Edit contact' : 'Add contact', desc: esc(c.name),
    body: `<div class="grid2"><div class="span2">${fld('name', 'Full name', { req: true, value: p.name, err: 'Enter a name' })}</div>${sel('role', 'Role', ['Client user', 'Client admin', 'View only'], p.role)}${fld('phone', 'Phone', { type: 'tel', value: p.phone })}<div class="span2">${fld('email', 'Email', { type: 'email', req: true, value: p.email, err: 'Enter a valid email address' })}</div></div>`,
    foot: `${idx != null && c.contacts.length > 1 ? `<button type="button" class="btn btn-ghost btn-danger" data-action="rm-contact" data-slug="${c.slug}" data-i="${idx}">${icon('trash', 14)}Remove</button><span class="spacer"></span>` : ''}<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">${idx != null ? 'Save contact' : 'Add contact'}</button>`,
    onSubmit: v => { const n = ct(v.name.trim(), v.role, v.email.trim(), v.phone); if (idx != null) c.contacts[idx] = n; else c.contacts.push(n); render(false); toast(`<b>${esc(n.name)}</b> ${idx != null ? 'saved' : 'added to ' + esc(c.name)}`); } });
}
function pricingModal(c) {
  openModal({ title: 'Edit pricing', desc: `What ${esc(c.name)} pays per signing. Rush (+${money(S.ws.rush, 0)}) and scanbacks (+${money(S.ws.scan, 0)}) use workspace rates.`,
    body: `<div class="grid2">${TYPES.map(t => fld('fee_' + t, t, { value: c.fees[t], icon: 'dollar', req: true, attrs: 'inputmode="decimal"', err: 'Enter an amount' })).join('')}</div>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Save pricing</button>`,
    onSubmit: v => { TYPES.forEach(t => { c.fees[t] = parseFloat(v['fee_' + t]) || c.fees[t]; }); render(false); toast(`Pricing saved for <b>${esc(c.name)}</b>`); } });
}
function notaryModal(n) {
  openModal({ title: `Edit ${esc(n.name)}`, desc: 'Contact, commission and coverage.',
    body: `<div class="grid2">${fld('phone', 'Phone', { type: 'tel', req: true, value: n.phone, err: 'Enter a 10-digit phone number' })}${fld('email', 'Email', { type: 'email', req: true, value: n.email, err: 'Enter a valid email' })}
      ${fld('commissionNo', 'Commission number', { value: n.commissionNo, attrs: 'style="font-family:var(--font-mono)"' })}${fld('commission', 'Commission expires', { type: 'date', value: n.commission })}
      ${fld('city', 'Home base', { value: n.city })}${fld('radius', 'Travel radius (miles)', { value: n.radius, attrs: 'inputmode="numeric"' })}${fld('rate', 'Usual rate', { value: n.rate || '', icon: 'dollar', attrs: 'inputmode="decimal"' })}</div>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Save changes</button>`,
    onSubmit: v => { Object.assign(n, { phone: v.phone, email: v.email.trim(), commissionNo: v.commissionNo, commission: v.commission, city: v.city, radius: parseInt(v.radius) || n.radius, rate: parseFloat(v.rate) || null }); render(false); toast(`<b>${esc(n.name)}</b> saved`); } });
}
function driverModal(dr) {
  openModal({ title: `Edit ${esc(dr.name)}`, desc: `${dr.deliveries} deliveries`,
    body: `<div class="grid2"><div class="span2">${fld('name', 'Full name', { req: true, value: dr.name, err: 'Enter a name' })}</div>${fld('phone', 'Phone', { type: 'tel', req: true, value: dr.phone, err: 'Enter a 10-digit phone number' })}${fld('email', 'Email', { type: 'email', value: dr.email })}<div class="span2">${sel('client', 'Works with', [['', 'Any client'], ...S.clients.filter(c => c.category === 'Vehicle delivery').map(c => c.name)], dr.client)}</div></div>`,
    foot: `<button type="button" class="btn btn-ghost ${dr.active ? 'btn-danger' : ''}" data-action="driver-toggle" data-name="${esc(dr.name)}">${icon(dr.active ? 'ban' : 'rotate', 14)}${dr.active ? 'Deactivate' : 'Reactivate'}</button><span class="spacer"></span><button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Save driver</button>`,
    onSubmit: v => { const old = dr.name; Object.assign(dr, { name: v.name.trim(), phone: v.phone, email: v.email, client: v.client }); S.orders.forEach(o => { if (o.driver && o.driver.name === old) Object.assign(o.driver, { name: dr.name, phone: dr.phone }); }); render(false); toast(`<b>${esc(dr.name)}</b> saved`); } });
}
function inviteMemberModal() {
  openModal({ title: 'Invite a teammate', desc: 'They’ll get an email to join this workspace.',
    body: `<div class="grid2"><div class="span2">${fld('name', 'Full name', { req: true, err: 'Enter a name' })}</div><div class="span2">${fld('email', 'Work email', { type: 'email', req: true, err: 'Enter a valid email', icon: 'mail' })}</div>${sel('role', 'Role', ['Scheduler', 'Admin', 'Billing', 'View only'])}</div>
      <p class="help" style="margin-top:12px">Admins manage settings and billing. Schedulers manage orders and notaries.</p>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">${icon('send', 14)}Send invite</button>`,
    onSubmit: v => { S.team.push({ name: v.name.trim(), email: v.email.trim(), role: v.role, status: 'Invited', last: '—' }); render(false); toast(`Invite sent to <b>${esc(v.email.trim())}</b>`, { icon: 'send' }); } });
}
function messageNotaryModal(n) {
  openModal({ title: `Message ${esc(n.name)}`, desc: `Sends by text to ${esc(n.phone)} and by email.`,
    body: `<div class="field" data-f="text"><label class="label" for="f-text">Message</label><textarea class="textarea" id="f-text" name="text" data-required placeholder="Hi ${esc(first(n.name))}, …"></textarea><div class="field-err">${icon('alert', 13)}Write a message</div></div>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">${icon('send', 14)}Send</button>`,
    onSubmit: () => toast(`Message sent to <b>${esc(n.name)}</b>`, { icon: 'send' }) });
}
function shortcutsModal() {
  const rows = [['N', 'New order'], ['⌘ K  or  /', 'Search everything'], ['↑ ↓', 'Move between orders'], ['Enter', 'Preview the order'], ['O', 'Open the order'], ['X', 'Select the order'], ['Esc', 'Close a panel or dialog']];
  openModal({ title: 'Keyboard shortcuts', size: 'sm', body: `<div style="display:grid;gap:10px">${rows.map(r => `<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px"><span>${r[1]}</span><span style="display:flex;gap:4px">${r[0].split('  or  ').map(k => `<kbd>${k}</kbd>`).join('<span class="muted">or</span>')}</span></div>`).join('')}</div>`, foot: `<button type="button" class="btn btn-primary" data-action="close-modal">Done</button>` });
}
