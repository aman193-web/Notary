'use strict';
/* =========================================================
   THEME
   ========================================================= */
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => { const t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : mq.matches; };
const themeBtn = () => `<button class="icon-btn" data-action="theme" aria-label="${isDark() ? 'Switch to light theme' : 'Switch to dark theme'}" data-tip="${isDark() ? 'Light theme' : 'Dark theme'}">${icon(isDark() ? 'sun' : 'moon', 17)}</button>`;
function toggleTheme() {
  const root = document.documentElement, next = isDark() ? 'light' : 'dark';
  if (!reduceMotion()) { root.classList.add('theming'); setTimeout(() => root.classList.remove('theming'), 350); }
  root.setAttribute('data-theme', next); store.set('nn-theme', next); hideTip();
  $$('[data-action="theme"]').forEach(b => { b.outerHTML = themeBtn(); });
  if (M.ok()) gsap.fromTo('[data-action="theme"] svg', { rotate: -90, scale: .5 }, { rotate: 0, scale: 1, duration: .5, ease: 'back.out(2)' });
}
if (mq.addEventListener) mq.addEventListener('change', () => $$('[data-action="theme"]').forEach(b => { b.outerHTML = themeBtn(); }));

/* =========================================================
   ROUTER + SHELL
   ========================================================= */
function route() { const raw = location.hash.replace(/^#\/?/, '') || 'signin'; const [path, query] = raw.split('?'); return { parts: path.split('/'), query: query || '' }; }
function go(h) { if (location.hash === h) render(true); else location.hash = h; }
const AUTH = { signin: 'signin', 'forgot-password': 'forgot', 'request-access': 'request' };
function render(changed) {
  const { parts, query } = route(), p = parts[0], sub = parts[1];
  closeMenu(); hideTip();
  if (changed) { closeModal(true); if ($('.drawer-wrap')) { $('.drawer-wrap').remove(); peekId = null; document.body.classList.remove('no-scroll'); } }
  if (AUTH[p]) { renderAuth(AUTH[p]); return; }
  if (heroTimer) { clearInterval(heroTimer); heroTimer = null; }
  ensureShell();
  let html, crumbs, nav = p;
  const nf = (what, back, label) => { crumbs = [[label, back], ['Not found']]; return `<div class="card empty" style="margin-top:40px"><div class="empty-ic">${icon('search', 22)}</div><h3>That ${what} doesn’t exist</h3><p>It may have been removed, or the link has a typo.</p><a class="btn" href="${back}">${icon('arrowL', 15)}Back to ${label.toLowerCase()}</a></div>`; };
  if (p === 'orders' && sub) { const o = byId(sub); html = o ? pageOrder(o, changed) : nf('order', '#/orders', 'Orders'); if (o) crumbs = [['Orders', '#/orders'], ['Order ' + o.id]]; }
  else if (p === 'orders') { html = pageOrders(); crumbs = [['Orders']]; }
  else if (p === 'new') { html = pageNew(); crumbs = [['Orders', '#/orders'], ['New signing order']]; }
  else if (p === 'reports') { html = pageReports(); crumbs = [['Reports'], ['Financials']]; }
  else if (p === 'settings') { html = pageSettings(sub); crumbs = [['Settings', '#/settings'], [(SET_TABS.find(t => t[0] === sub) || SET_TABS[0])[1]]]; }
  else if (p === 'clients') { if (sub === 'new') { html = pageAddClient(); crumbs = [['Clients', '#/clients'], ['Add client']]; } else if (sub) { const c = S.clients.find(x => x.slug === sub); html = c ? pageClient(c) : nf('client', '#/clients', 'Clients'); if (c) crumbs = [['Clients', '#/clients'], [c.name]]; } else { html = pageClients(); crumbs = [['Clients']]; } }
  else if (p === 'notaries') { if (sub === 'new') { html = pageAddNotary(); crumbs = [['Notaries', '#/notaries'], ['Add notary']]; } else if (sub) { const n = S.notaries.find(x => x.slug === sub); html = n ? pageNotary(n) : nf('notary', '#/notaries', 'Notaries'); if (n) crumbs = [['Notaries', '#/notaries'], [n.name]]; } else { html = pageNotaries(); crumbs = [['Notaries']]; } }
  else if (p === 'drivers') { html = sub === 'new' ? pageAddDriver() : pageDrivers(); crumbs = sub === 'new' ? [['Drivers', '#/drivers'], ['Add driver']] : [['Drivers']]; }
  else { location.replace('#/orders'); return; }
  const page = $('#page'); page.innerHTML = html;
  $('#crumbs').innerHTML = crumbs.map((c, i) => i < crumbs.length - 1 && c[1] ? `<a href="${c[1]}">${esc(c[0])}</a>${icon('right', 13)}` : `<span class="${i === crumbs.length - 1 ? 'cur' : ''}">${esc(c[0])}</span>${i < crumbs.length - 1 ? icon('right', 13) : ''}`).join('');
  $$('.sb-item[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
  $('.shell').classList.remove('drawer');
  document.title = crumbs[crumbs.length - 1][0] + ' · Notary Nexxus';
  updateNavCounts(); bindScrollShadow(); placeInk();
  if (p === 'new') { prevReq = new Set(REQ.filter(r => r.test(S.draft)).map(r => r.k)); updateSummary(); }
  if (changed) {
    scrollTo(0, 0); M.page(page);
    if (!S.counted || p !== 'orders') { M.count(page); if (p === 'orders') S.counted = true; }
    if (p === 'reports') M.bars(page);
    $('#page').focus({ preventScroll: true });
  } else M.seals(page);
  if (p === 'orders' && sub && query) setTimeout(() => deepLink(query, byId(sub)), 80);
}
window.addEventListener('hashchange', () => render(true));
function deepLink(q, o) {
  if (!o) return;
  const to = { notary: 'notary-card', docs: 'docs-card', messages: 'messages-card' }[q];
  if (to) { const el = $('#' + to); if (el) { el.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }); M.flash(el); setTimeout(() => { const i = el.querySelector(q === 'messages' ? 'textarea' : 'input'); if (i) i.focus({ preventScroll: true }); }, 400); } }
  if (q === 'time') { const dd = $(`.editable[data-edit="${o.date ? 'time' : 'date'}"]`); if (dd) { dd.scrollIntoView({ block: 'center' }); startEdit(dd); } }
}
function updateNavCounts() { const c = $('.sb-count[data-c="orders"]'); if (c) c.textContent = S.orders.filter(o => o.status === 'active').length; }
function ensureShell() {
  if ($('#page')) return;
  $('#app').innerHTML = `<div class="shell ${S.collapsed ? 'collapsed' : ''}">
    <aside class="sidebar" aria-label="Main navigation">
      <div class="sb-top"><a class="brand" href="#/orders" aria-label="Notary Nexxus home">${LOGO(28)}<span class="wordmark">Notary Nexxus</span></a>
        <button class="sb-btn collapse-btn" data-action="collapse" aria-label="${S.collapsed ? 'Expand' : 'Collapse'} sidebar" data-tip="${S.collapsed ? 'Expand' : 'Collapse'}">${icon('panel', 17)}</button></div>
      <a class="sb-new" href="#/new" data-tip="New order (N)">${icon('plus', 17)}<span>New order</span><kbd>N</kbd></a>
      <div class="sb-label">Operations</div>
      <a class="sb-item" data-nav="orders" href="#/orders">${icon('orders', 18)}<span>Orders</span><span class="sb-count" data-c="orders"></span></a>
      <a class="sb-item" data-nav="reports" href="#/reports">${icon('chart', 18)}<span>Reports</span></a>
      <div class="sb-label">Directory</div>
      <a class="sb-item" data-nav="clients" href="#/clients">${icon('building', 18)}<span>Clients</span></a>
      <a class="sb-item" data-nav="notaries" href="#/notaries">${icon('stamp', 18)}<span>Notaries</span></a>
      <a class="sb-item" data-nav="drivers" href="#/drivers">${icon('truck', 18)}<span>Drivers</span></a>
      <div class="sb-bottom"><a class="sb-item sb-ver" href="../#/orders" data-tip="Open Version 1 to compare">${icon('rotate', 18)}<span>Switch to V1</span><span class="sb-count">V2</span></a><a class="sb-item" data-nav="settings" href="#/settings">${icon('settings', 18)}<span>Settings</span></a>
        <button class="sb-user" data-action="menu" data-menu="user" aria-label="Account menu"><span class="av">JM</span><span class="who"><span class="nm" style="display:block">${esc(S.me.first + ' ' + S.me.last)}</span><span class="rl" style="display:block">Admin</span></span>${icon('more', 16)}</button></div>
    </aside>
    <div class="scrim" data-action="drawer"></div>
    <div class="main"><header class="topbar"><button class="icon-btn tb-menu" data-action="drawer" aria-label="Open navigation">${icon('menu', 19)}</button>
      <nav class="crumbs" id="crumbs" aria-label="Breadcrumb"></nav>
      <div class="tb-right"><button class="search-trigger" data-action="palette" aria-label="Search">${icon('search', 15)}<span>Search orders, signers, clients…</span><kbd>⌘K</kbd></button>
        <button class="icon-btn" data-action="notifs" aria-label="Notifications" data-tip="Notifications">${icon('bell', 17)}${S.notifRead ? '' : '<span class="badge-dot" id="notif-dot"></span>'}</button>${themeBtn()}</div></header>
      <main id="page" class="page" tabindex="-1" style="outline:none"></main></div></div>`;
}
function toggleCollapse(btn) {
  S.collapsed = !S.collapsed; store.set('nn-collapsed', S.collapsed ? '1' : '0');
  const sh = $('.shell'); btn.setAttribute('aria-label', (S.collapsed ? 'Expand' : 'Collapse') + ' sidebar'); btn.dataset.tip = S.collapsed ? 'Expand' : 'Collapse'; hideTip();
  if (!M.ok()) { sh.classList.toggle('collapsed', S.collapsed); return; }
  if (S.collapsed) { sh.classList.add('collapsed'); gsap.fromTo(sh, { '--sbw': '244px' }, { '--sbw': '72px', duration: .3, ease: 'power2.inOut', clearProps: '--sbw' }); }
  else gsap.fromTo(sh, { '--sbw': '72px' }, { '--sbw': '244px', duration: .3, ease: 'power2.inOut', onComplete: () => { sh.classList.remove('collapsed'); gsap.set(sh, { clearProps: '--sbw' }); } });
}

/* =========================================================
   MENU CONTENT
   ========================================================= */
function menuHTML(key) {
  const [kind, id] = key.split(':'), o = id ? byId(id) : null;
  if (kind === 'order' || kind === 'detail') {
    const a = [];
    if (kind === 'order') a.push(mi('Preview', `data-action="peek" data-id="${o.id}"`, 'eye'), mi('Open order', `data-action="nav" data-to="#/orders/${o.id}"`, 'ext'));
    else a.push(mi('Duplicate as new order', `data-action="duplicate" data-id="${o.id}"`, 'copy'), mi('Print order sheet', 'data-action="print"', 'printer'));
    a.push(mi('Copy order number', `data-action="copy" data-copy="${o.id}"`, 'copy'));
    if (o.status === 'active') { if (o.notary) a.push(mi('Mark complete', `data-action="complete" data-id="${o.id}"`, 'check')); a.push(mi('Put on hold', `data-action="set-status" data-id="${o.id}" data-s="hold"`, 'pause')); if (kind === 'detail') a.push(mi('Cancel order', `data-action="cancel-order" data-id="${o.id}"`, 'ban')); }
    else if (o.status === 'hold' || o.status === 'cancelled') a.push(mi('Move to active', `data-action="set-status" data-id="${o.id}" data-s="active"`, 'rotate'));
    a.push('<div class="menu-sep"></div>', o.status === 'deleted' ? mi('Restore order', `data-action="restore" data-id="${o.id}"`, 'undo') : mi('Delete order', `data-action="delete" data-id="${o.id}"`, 'trash', 'danger'));
    return a.join('');
  }
  if (kind === 'status') return '<div class="menu-label">Order status</div>' + ['active', 'hold', 'completed', 'cancelled'].map(s => mi(statusLabel(s), `data-action="set-status" data-id="${o.id}" data-s="${s}"`, '', o.status === s ? 'on' : '', o.status === s ? icon('check', 14) : '')).join('');
  const staff = S.team.filter(t => t.status === 'Active');
  if (kind === 'sched') return '<div class="menu-label">Assign scheduler</div>' + staff.map(s => mi(`${esc(s.name)}`, `data-action="set-sched" data-id="${o.id}" data-name="${esc(s.name)}"`, '', o.scheduler === s.name ? 'on' : '', o.scheduler === s.name ? icon('check', 14) : s.role)).join('') + (o.scheduler ? '<div class="menu-sep"></div>' + mi('Unassign', `data-action="set-sched" data-id="${o.id}" data-name=""`, 'x') : '');
  if (kind === 'bulk-sched') return '<div class="menu-label">Assign scheduler to selected</div>' + staff.map(s => mi(esc(s.name), `data-action="bulk-sched" data-name="${esc(s.name)}"`, '', '', s.role)).join('');
  if (kind === 'driver') return '<div class="menu-label">Delivery driver</div>' + S.drivers.filter(d => d.active).map(d => mi(esc(d.name), `data-action="set-driver" data-id="${o.id}" data-name="${esc(d.name)}"`, 'truck', o.driver && o.driver.name === d.name ? 'on' : '', o.driver && o.driver.name === d.name ? icon('check', 14) : esc(d.client || ''))).join('') + '<div class="menu-sep"></div>' + mi('Add a driver', 'data-action="nav" data-to="#/drivers/new"', 'plus');
  if (kind === 'sort') return '<div class="menu-label">Sort orders by</div>' + [['attention', 'Needs attention', 1], ['date', 'Signing date (soonest)', 1], ['id', 'Newest first', -1], ['client', 'Client (A–Z)', 1]].map(([k, l, d]) => mi(l, `data-action="sort" data-sort="${k}" data-dir="${d}"`, '', S.sort === k ? 'on' : '', S.sort === k ? icon('check', 14) : '')).join('');
  if (kind === 'filters') {
    const base = S.orders.filter(x => x.status === S.tab), cb = (attr, v, on, n) => `<label class="mi" style="cursor:pointer"><input type="checkbox" ${attr}="${esc(v)}" ${on ? 'checked' : ''} style="accent-color:var(--btn);width:15px;height:15px;margin:0"><span>${esc(v)}</span><span class="r">${n}</span></label>`;
    return '<div class="menu-label">Signing type</div>' + TYPES.map(t => cb('data-type-filter', t, S.types.has(t), base.filter(x => x.type === t).length)).join('') +
      '<div class="menu-sep"></div><div class="menu-label">Client</div>' + S.clients.map(c => cb('data-client-filter', c.name, S.clientsF.has(c.name), base.filter(x => x.client === c.name).length)).join('') +
      (S.types.size + S.clientsF.size ? '<div class="menu-sep"></div>' + mi('Clear filters', 'data-action="clear-types"', 'x') : '');
  }
  if (kind === 'ninv') {
    const n = S.notaries.find(x => x.slug === id), open = S.orders.filter(x => x.status === 'active' && !x.notary);
    return `<div class="menu-label">Orders that need a notary</div>` + open.map(x => mi(`${x.id} · ${esc(x.signer)}`, `data-action="notary-invite" data-slug="${n.slug}" data-id="${x.id}"`, 'send', '', x.date ? dayLabel(x.date) : 'No date')).join('');
  }
  if (kind === 'notary') { const n = S.notaries.find(x => x.slug === id); return mi('Copy email', `data-action="copy" data-copy="${esc(n.email)}"`, 'copy') + '<div class="menu-sep"></div>' + (n.status === 'inactive' ? mi('Reactivate', `data-action="notary-status" data-slug="${n.slug}"`, 'rotate') : mi('Deactivate', `data-action="notary-status" data-slug="${n.slug}"`, 'ban', 'danger')); }
  if (kind === 'user') return `<div style="padding:10px 10px 8px"><div style="font-weight:600">${esc(S.me.first + ' ' + S.me.last)}</div><div class="muted" style="font-size:12px">${esc(S.me.email)}</div></div><div class="menu-sep"></div>` + mi('Your profile', 'data-action="nav" data-to="#/settings/profile"', 'user') + mi('Settings', 'data-action="nav" data-to="#/settings/workspace"', 'settings') + mi('Keyboard shortcuts', 'data-action="shortcuts"', 'enter', '', '?') + '<div class="menu-sep"></div>' + mi('Sign out', 'data-action="signout"', 'logout');
  if (kind === 'notifs') {
    const n = [['amber', 'userx', '<b>Elena Ruiz</b> declined the invite for order <b>101262</b>', '2h ago', '#/orders/101262'], ['red', 'pen', 'Signing for <b>101409</b> passed without being marked complete', '5h ago', '#/orders/101409'], ['ink', 'msg', '<b>Ray Lindqvist</b> sent 2 messages on <b>101254</b>', '6h ago', '#/orders/101254?messages'], ['ink', 'file', '<b>Copper State Escrow</b> uploaded 7 documents to <b>101430</b>', 'Today, 9:14 AM', '#/orders/101430?docs']];
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px 6px"><b style="font-size:13px">Notifications</b>${S.notifRead ? '<span class="muted" style="font-size:12px">All caught up</span>' : '<button class="link" data-action="notif-read">Mark all read</button>'}</div>` + n.map(x => `<a class="notif ${S.notifRead ? '' : 'unread'}" href="${x[4]}"><span class="ni" style="background:var(--${x[0]}-soft);color:var(--${x[0]})">${icon(x[1], 15)}</span><span class="tx">${x[2]}<span class="tm">${x[3]}</span></span></a>`).join('') + `<div class="menu-sep"></div>` + mi('Notification settings', 'data-action="nav" data-to="#/settings/notifications"', 'settings');
  }
  return '';
}

/* =========================================================
   COMMAND PALETTE
   ========================================================= */
let palIdx = 0;
function palItems(q) {
  q = q.toLowerCase().trim(); const out = [];
  const ords = S.orders.filter(o => o.status !== 'deleted' && (!q || [o.id, o.signer, o.client, o.file, o.city].join(' ').toLowerCase().includes(q))).slice(0, q ? 6 : 4);
  if (ords.length) { out.push(['g', q ? 'Orders' : 'Recent orders']); ords.forEach(o => out.push(['i', `Order ${o.id} · ${o.signer}`, `${o.client} · ${o.city}${o.date ? ' · ' + dayLabel(o.date) : ''}`, null, '#/orders/' + o.id, statusLabel(o.status), o])); }
  const cl = q ? S.clients.filter(c => c.name.toLowerCase().includes(q)) : [];
  if (cl.length) { out.push(['g', 'Clients']); cl.slice(0, 3).forEach(c => out.push(['i', c.name, c.category, 'building', '#/clients/' + c.slug, ''])); }
  const nt = q ? S.notaries.filter(n => (n.name + n.city).toLowerCase().includes(q)) : [];
  if (nt.length) { out.push(['g', 'Notaries']); nt.slice(0, 3).forEach(n => out.push(['i', n.name, n.city, 'stamp', '#/notaries/' + n.slug, ''])); }
  const pages = [['New signing order', 'Start a new order', 'plus', '#/new', 'N'], ['Orders', 'All orders', 'orders', '#/orders', ''], ['Financial report', 'Reports', 'chart', '#/reports', ''], ['Clients', 'Directory', 'building', '#/clients', ''], ['Notaries', 'Directory', 'stamp', '#/notaries', ''], ['Drivers', 'Directory', 'truck', '#/drivers', ''], ['Settings', 'Profile, team, security', 'settings', '#/settings', ''], ['Switch theme', isDark() ? 'Use light theme' : 'Use dark theme', isDark() ? 'sun' : 'moon', 'theme', '']].filter(p => !q || (p[0] + ' ' + p[1]).toLowerCase().includes(q));
  if (pages.length) { out.push(['g', 'Go to']); pages.forEach(p => out.push(['i', p[0], p[1], p[2], p[3], p[4]])); }
  return out;
}
function renderPal() {
  const q = $('#pal-q').value, items = palItems(q), n = items.filter(x => x[0] === 'i').length;
  palIdx = Math.max(0, Math.min(palIdx, n - 1)); let k = -1;
  $('#pal-res').innerHTML = n ? items.map(x => { if (x[0] === 'g') return `<div class="pal-group">${x[1]}</div>`; k++;
    return `<button class="pal-item ${k === palIdx ? 'hl' : ''}" data-pal="${esc(x[4])}" data-k="${k}" role="option" aria-selected="${k === palIdx}">${x[6] ? seal(checksOf(x[6]), 28, { tip: false }) : `<span class="pi">${icon(x[3], 15)}</span>`}<span class="tx"><span class="nm truncate" style="display:block">${esc(x[1])}</span><span class="mt truncate" style="display:block">${esc(x[2])}</span></span><span class="r">${x[5] ? (x[5].length === 1 ? `<kbd>${x[5]}</kbd>` : esc(x[5])) : ''}</span></button>`; }).join('')
    : `<div class="empty" style="padding:36px 16px"><h3>No results for “${esc(q)}”</h3><p>Search by order number, signer, client, notary or city.</p></div>`;
  const hl = $('#pal-res .hl'); if (hl) hl.scrollIntoView({ block: 'nearest' });
}
function openPalette() {
  if ($('.palette-wrap')) return; closeMenu(); hideTip();
  const w = document.createElement('div'); w.className = 'palette-wrap';
  w.innerHTML = `<div class="palette-scrim" data-action="close-pal"></div><div class="palette" role="dialog" aria-modal="true" aria-label="Search"><div class="pal-in">${icon('search', 18)}<input id="pal-q" placeholder="Search orders, signers, clients, notaries…" autocomplete="off" aria-label="Search" role="combobox" aria-controls="pal-res" aria-expanded="true"><kbd>Esc</kbd></div><div class="pal-res" id="pal-res" role="listbox"></div><div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`;
  document.body.appendChild(w); palIdx = 0; renderPal(); $('#pal-q').focus();
  M.overlayIn(w, '.palette', { y: -10, scale: .98, autoAlpha: 0, duration: .22 });
}
function closePalette() { const w = $('.palette-wrap'); if (w) M.overlayOut(w, '.palette', { y: -6, autoAlpha: 0 }, () => w.remove()); }
function palGo(t) { const w = $('.palette-wrap'); if (w) w.remove(); if (t === 'theme') toggleTheme(); else go(t); }

/* =========================================================
   ACTIONS
   ========================================================= */
function setStatus(o, s, quiet) {
  const prev = o.status, prevDue = o.pastDue;
  o.status = s; if (s === 'completed') o.pastDue = false;
  pushActivity(o, s === 'completed' ? 'Signing marked complete by <b>Jonathan Means</b>' : `Status changed to <b>${statusLabel(s)}</b>`, s === 'completed' ? 'foil' : 'ink');
  if (!quiet) toast(s === 'completed' ? `Order <b>${o.id}</b> sealed — signing complete` : `Order <b>${o.id}</b> ${s === 'hold' ? 'put on hold' : s === 'active' ? 'moved to active' : 'marked ' + statusLabel(s).toLowerCase()}`, { icon: s === 'completed' ? 'badge' : 'circlecheck', undo: () => { o.status = prev; o.pastDue = prevDue; rerender(true); } });
}
function rerender(draw) {
  const { parts } = route();
  if (parts[0] === 'orders' && parts[1]) refreshDetail(draw);
  else if (parts[0] === 'orders') { refreshOrders(); if (peekId) { refreshPeek(); M.seals($('.drawer')); } }
  else render(false);
  updateNavCounts();
}
const canComplete = o => { if (o.notary) return true; toast('Assign a notary before marking this order complete', { warn: true }); return false; };

document.addEventListener('click', e => {
  const t = e.target;
  const pal = t.closest('[data-pal]'); if (pal) { palGo(pal.dataset.pal); return; }
  if (menuEl && !menuEl.contains(t) && !(menuBtn && menuBtn.contains(t))) closeMenu();
  const a = t.closest('[data-action]');
  if (!a || a.disabled) {
    if (a) return;
    const ed = t.closest('.editable'); if (ed) { startEdit(ed); return; }
    if (t.closest('a,button,input,label,select,textarea,summary')) return;
    const pk = t.closest('[data-peek]'); if (pk) { openPeek(pk.dataset.peek); return; }
    const row = t.closest('[data-href]'); if (row) go(row.dataset.href);
    return;
  }
  const act = a.dataset.action, id = a.dataset.id, o = id && id !== 'draft' ? byId(id) : null, d = a.dataset;
  const cl = d.slug ? S.clients.find(x => x.slug === d.slug) : null, nt = d.slug ? S.notaries.find(x => x.slug === d.slug) : null;
  switch (act) {
    /* shell */
    case 'theme': toggleTheme(); break;
    case 'collapse': toggleCollapse(a); break;
    case 'drawer': $('.shell').classList.toggle('drawer'); break;
    case 'palette': openPalette(); break;
    case 'close-pal': closePalette(); break;
    case 'notifs': openMenu(a, 'notifs'); break;
    case 'notif-read': { S.notifRead = true; const nd = $('#notif-dot'); if (nd) nd.remove(); closeMenu(); toast('All notifications marked read'); break; }
    case 'menu': e.preventDefault(); openMenu(a, d.menu); break;
    case 'nav': closeMenu(); go(d.to); break;
    case 'toast': e.preventDefault(); closeMenu(); toast(esc(d.msg)); break;
    case 'copy': closeMenu(); try { navigator.clipboard && navigator.clipboard.writeText(d.copy); } catch (err) {} toast(`Copied <span class="mono">${esc(d.copy)}</span>`, { icon: 'copy' }); break;
    case 'shortcuts': closeMenu(); shortcutsModal(); break;
    case 'signout': closeMenu(); go('#/signin'); toast('You’re signed out'); break;
    case 'close-modal': closeModal(); break;
    case 'press': a.setAttribute('aria-pressed', a.getAttribute('aria-pressed') !== 'true'); break;
    /* auth */
    case 'signin-google': go('#/orders'); break;
    case 'toggle-pw': { const pw = $('#f-password'), show = pw.type === 'password'; pw.type = show ? 'text' : 'password'; a.innerHTML = icon(show ? 'eyeoff' : 'eye', 16); a.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); break; }
    case 'resend-reset': toast('Reset link sent again', { icon: 'send' }); break;
    /* orders list */
    case 'overview-toggle': {
      S.overview = !S.overview; store.set('nn-overview', S.overview ? null : 'hidden');
      a.innerHTML = `${icon(S.overview ? 'eyeoff' : 'eye', 15)}${S.overview ? 'Hide overview' : 'Show overview'}`; a.setAttribute('aria-expanded', S.overview);
      const w = $('#ov-wrap');
      if (S.overview) { w.innerHTML = overview(); M.expand(w); } else M.collapse(w, () => { w.innerHTML = ''; if (window.gsap) gsap.set(w, { clearProps: 'all' }); });
      break; }
    case 'alert': S.alert = d.key && S.alert !== d.key ? d.key : null; if (S.alert) { S.tab = 'active'; } S.sel.clear(); refreshOrders(true); if (S.alert) $('#orders-card').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }); break;
    case 'by-date': S.sort = 'date'; S.dir = 1; S.tab = 'active'; S.alert = null; S.view = 'table'; refreshOrders(true); $('#orders-card').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }); break;
    case 'tab': S.tab = d.tab; S.sel.clear(); if (S.tab !== 'active') S.alert = null; refreshOrders(true); break;
    case 'view': S.view = d.v; store.set('nn-view', d.v); $$('[data-action="view"]').forEach(b => b.classList.toggle('active', b.dataset.v === d.v)); refreshList(true); break;
    case 'sort': S.sort = d.sort; S.dir = +d.dir || 1; closeMenu(); refreshOrders(true); break;
    case 'sort-col': if (S.sort === d.key) S.dir = -S.dir; else { S.sort = d.key; S.dir = d.key === 'id' ? -1 : 1; } refreshOrders(true); break;
    case 'rm-filter': { const f = d.f; if (f === 'alert') S.alert = null; else if (f === 'q') S.q = ''; else if (f.startsWith('type:')) S.types.delete(f.slice(5)); else if (f.startsWith('client:')) S.clientsF.delete(f.slice(7)); refreshOrders(true); break; }
    case 'clear-types': S.types.clear(); S.clientsF.clear(); closeMenu(); refreshOrders(true); break;
    case 'clear-filters': S.q = ''; S.alert = null; S.types.clear(); S.clientsF.clear(); refreshOrders(true); break;
    case 'export-orders': exportOrders(filteredOrders(), `orders-${S.tab}-${TODAY}.csv`); break;
    case 'bulk-export': exportOrders(S.orders.filter(x => S.sel.has(x.id)), `orders-selected-${TODAY}.csv`); break;
    case 'bulk-clear': S.sel.clear(); refreshList(); break;
    case 'bulk-hold': { const ids = [...S.sel]; ids.forEach(i => setStatus(byId(i), 'hold', true)); S.sel.clear(); refreshOrders(true); toast(`${ids.length} order${ids.length > 1 ? 's' : ''} put on hold`, { undo: () => { ids.forEach(i => { byId(i).status = 'active'; }); refreshOrders(true); } }); break; }
    case 'bulk-delete': { const ids = [...S.sel], prev = ids.map(i => byId(i).status); ids.forEach(i => { byId(i).status = 'deleted'; }); S.sel.clear(); refreshOrders(true); toast(`${ids.length} order${ids.length > 1 ? 's' : ''} moved to Deleted`, { icon: 'trash', undo: () => { ids.forEach((i, k) => { byId(i).status = prev[k]; }); refreshOrders(true); } }); break; }
    case 'bulk-sched': { const ids = [...S.sel]; ids.forEach(i => { byId(i).scheduler = d.name; }); closeMenu(); S.sel.clear(); refreshOrders(true); toast(`<b>${esc(d.name)}</b> is scheduling ${ids.length} order${ids.length > 1 ? 's' : ''}`); break; }
    case 'peek': closeMenu(); openPeek(id); break;
    case 'peek-step': peekStep(+d.d); break;
    case 'close-peek': closePeek(); break;
    /* order state */
    case 'complete': closeMenu(); if (!canComplete(o)) break; setStatus(o, 'completed'); rerender(true); break;
    case 'set-status': closeMenu(); if (o.status === d.s) break; if (d.s === 'completed' && !canComplete(o)) break; setStatus(o, d.s); rerender(d.s === 'completed'); break;
    case 'cancel-order': closeMenu(); confirmModal({ title: `Cancel order ${o.id}?`, desc: `The signing for ${esc(o.signer)} is called off and pending invites are withdrawn. You can move it back to active later.`, confirm: 'Cancel order', danger: true, onConfirm: () => { (o.invites || []).forEach(i => { if (i.status === 'pending') { i.status = 'cancelled'; i.note = 'Order cancelled'; } }); setStatus(o, 'cancelled'); rerender(); } }); break;
    case 'delete': { closeMenu(); const prev = o.status; o.status = 'deleted'; if (route().parts[1]) go('#/orders'); else { if (peekId === o.id) closePeek(); refreshOrders(true); } toast(`Order <b>${o.id}</b> moved to Deleted`, { icon: 'trash', undo: () => { o.status = prev; rerender(); } }); break; }
    case 'restore': closeMenu(); o.status = 'active'; rerender(); toast(`Order <b>${o.id}</b> restored to active`); break;
    case 'set-sched': closeMenu(); o.scheduler = d.name || null; pushActivity(o, o.scheduler ? `Scheduler set to <b>${esc(o.scheduler)}</b>` : 'Scheduler removed'); rerender(true); toast(o.scheduler ? `<b>${esc(o.scheduler)}</b> is scheduling order ${o.id}` : `Scheduler removed from ${o.id}`); break;
    case 'set-driver': { closeMenu(); const dr = S.drivers.find(x => x.name === d.name); o.driver = { name: dr.name, phone: dr.phone }; pushActivity(o, `Driver set to <b>${esc(dr.name)}</b>`, ''); refreshDetail(); toast(`<b>${esc(dr.name)}</b> is driving order ${o.id}`, { icon: 'truck' }); break; }
    case 'duplicate': { closeMenu(); S.draft = Object.assign(emptyDraft(), { client: o.client, type: o.type, orderedBy: o.orderedBy, cc: o.cc, flags: o.flags.slice(), signer: o.signer, phone: o.phone, email: o.email, street: o.street, unit: o.unit, city: o.city, st: o.st, zip: o.zip, scheduler: o.scheduler || '' }); go('#/new'); toast(`Copied order ${o.id} into a new draft. Add a file number to place it.`, { icon: 'copy' }); break; }
    case 'print': closeMenu(); setTimeout(() => window.print(), 50); break;
    /* detail */
    case 'scroll': { const el = document.getElementById(d.to); if (!el) break; el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' }); M.flash(el.closest('.card') || el); setTimeout(() => { const f = el.matches('textarea,input') ? el : el.querySelector('input,textarea'); if (f) f.focus({ preventScroll: true }); }, 350); break; }
    case 'scroll-sec': { const el = document.getElementById(d.to); if (!el) break; $$('.sec-nav button').forEach(b => b.classList.toggle('active', b === a)); placeInk(); el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }); break; }
    case 'edit-field': { const dd = $(`.editable[data-edit="${d.key}"]`); if (dd) { dd.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' }); startEdit(dd); } break; }
    case 'edit-address': editAddressModal(o); break;
    case 'msg-notary': { const aud = $('#msg-aud'); if (aud) aud.value = 'Notary'; const m = $('#msg-in'); m.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' }); setTimeout(() => m.focus({ preventScroll: true }), 300); break; }
    case 'nt-pick': { const n = notaryBy(d.name); S.pick[id] = S.pick[id] === n.name ? null : n.name; S.pay[id] = S.pick[id] ? n.rate.toFixed(2) : S.pay[id]; refreshDetail(); break; }
    case 'invite': busy(a, () => { const name = S.pick[id], pay = parseFloat(S.pay[id]) || 0; if (!pay) { toast('Enter the pay you’re offering before sending the invite', { warn: true }); $('#nt-pay').focus(); return; } o.invites.unshift({ name, pay, status: 'pending', at: 'Nov 19 · just now', receipts: [['Email delivered', 'just now'], ['SMS delivered', 'just now']] }); pushActivity(o, `Invite sent to <b>${esc(name)}</b> at ${money(pay)}`); S.pick[id] = null; refreshDetail(); toast(`Invite sent to <b>${esc(name)}</b> by email and text`, { icon: 'send' }); }); break;
    case 'assign-notary': busy(a, () => { const name = S.pick[id]; o.notary = name; o.pay = parseFloat(S.pay[id]) || notaryBy(name).rate; o.invites.forEach(i => { if (i.status === 'pending') { i.status = 'cancelled'; i.note = 'Closed — notary assigned directly'; } }); pushActivity(o, `<b>${esc(name)}</b> assigned at ${money(o.pay)}`, 'green'); S.pick[id] = null; refreshDetail(true); toast(`<b>${esc(name)}</b> assigned to order ${o.id}`); }); break;
    case 'assign-invite': { const inv = o.invites[+d.i]; inv.status = 'accepted'; inv.note = 'Assigned from invite'; o.notary = inv.name; o.pay = inv.pay; pushActivity(o, `<b>${esc(inv.name)}</b> assigned at ${money(inv.pay)}`, 'green'); refreshDetail(true); toast(`<b>${esc(inv.name)}</b> assigned to order ${o.id}`); break; }
    case 'resend-invite': { const inv = o.invites[+d.i]; inv.receipts = [['Email delivered', 'just now'], ['SMS delivered', 'just now']]; pushActivity(o, `Invite resent to <b>${esc(inv.name)}</b>`); refreshDetail(); toast(`Invite resent to <b>${esc(inv.name)}</b>`, { icon: 'send' }); break; }
    case 'cancel-invite': { const inv = o.invites[+d.i]; inv.status = 'cancelled'; inv.note = 'Invite cancelled'; pushActivity(o, `Invite to <b>${esc(inv.name)}</b> cancelled`, 'amber'); refreshDetail(); toast(`Invite to <b>${esc(inv.name)}</b> cancelled`, { undo: () => { inv.status = 'pending'; refreshDetail(); } }); break; }
    case 'unassign': { const prev = o.notary; o.notary = null; pushActivity(o, `<b>${esc(prev)}</b> unassigned`, 'amber'); refreshDetail(true); toast(`<b>${esc(prev)}</b> unassigned`, { undo: () => { o.notary = prev; refreshDetail(true); } }); break; }
    case 'flag': { const f = d.f; o.flags = o.flags.includes(f) ? o.flags.filter(x => x !== f) : [...o.flags, f]; refreshDetail(); toast(`${f} ${o.flags.includes(f) ? 'added' : 'removed'} · billing updated`); break; }
    case 'send-msg': sendMsg(o); break;
    case 'ocr': { closeModal(true); const doc = o.docsList[+d.i]; doc.ocr = { state: 'reading' }; refreshDetail(); setTimeout(() => { doc.ocr = { state: 'done', sig: 1, text: `<b>Read ${doc.pages} page${doc.pages > 1 ? 's' : ''}.</b> Names and vehicle details match this order.` }; refreshDetail(); M.flash($('#docs-card .ocr')); }, 1800); break; }
    case 'doc-preview': docPreview(o, +d.i); break;
    case 'doc-dl': { const doc = o.docsList[+d.i]; download(doc.name.replace(/\.\w+$/, '') + '.pdf', makePdf(doc.name, [`Order ${o.id} - File ${o.file}`, `Signer: ${o.signer}`, `Uploaded by ${doc.by} - ${doc.at}`, '', 'Preview copy generated by the Notary Nexxus prototype.'])); toast(`Downloading <b>${esc(doc.name)}</b>`, { icon: 'download' }); break; }
    case 'doc-remove': { const i = +d.i, doc = o.docsList.splice(i, 1)[0]; o.docs = o.docsList.length; closeModal(); refreshDetail(); toast(`<b>${esc(doc.name)}</b> removed`, { icon: 'trash', undo: () => { o.docsList.splice(i, 0, doc); o.docs = o.docsList.length; refreshDetail(); } }); break; }
    case 'dl-packet': download(`order-${o.id}-packet.pdf`, makePdf(`Order ${o.id} - document packet`, [`Signer: ${o.signer}`, `Client: ${o.client} - File ${o.file}`, '', ...o.docsList.map((x, i) => `${i + 1}. ${x.name} (${x.pages} pages)`)])); toast(`Downloading packet for order <b>${o.id}</b>`, { icon: 'download' }); break;
    case 'invoice': invoiceModal(o); break;
    case 'inv-pdf': { const b = feesFor(o); download(`invoice-${o.id}.pdf`, makePdf(`Invoice INV-2026-${String(o.id).slice(-4)}`, [`Bill to: ${o.client}`, `Order ${o.id} - ${o.type} signing - ${o.signer}`, '', `Signing fee: ${money(b.fee)}`, b.rush ? `Rush: ${money(b.rush)}` : '', b.scan ? `Scanbacks: ${money(b.scan)}` : '', '', `Total due: ${money(b.rev)}`].filter(x => x !== ''))); toast('Invoice PDF downloaded', { icon: 'download' }); break; }
    case 'upload': S.uploadTarget = id; $('#file-input').click(); break;
    /* new order */
    case 'pick-client': pickClient(d.name); break;
    case 'pick-addr': pickAddr(+d.i); break;
    case 'draft-flag': { const f = d.f; S.draft.flags = S.draft.flags.includes(f) ? S.draft.flags.filter(x => x !== f) : [...S.draft.flags, f]; a.setAttribute('aria-pressed', S.draft.flags.includes(f)); updateSummary(); markSaved(); break; }
    case 'sample-doc': addDraftDoc({ name: 'Loan package — Morgan Ellis.pdf', kind: 'pdf', pages: 96, size: '11.4 MB', sample: true }); break;
    case 'remove-doc': S.draft.docs.splice(+d.i, 1); $('#draft-docs').innerHTML = draftDocs(); updateSummary(); break;
    case 'ocr-fill': ocrFill(+d.i); break;
    case 'clear-draft': { const prev = S.draft; S.draft = emptyDraft(); render(false); toast('Form cleared', { undo: () => { S.draft = prev; render(false); } }); break; }
    case 'place': REQ.every(r => r.test(S.draft)) ? busy(a, placeOrder, 500) : placeOrder(); break;
    case 'focus': { const el = document.getElementById(d.to); if (el) { el.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }); setTimeout(() => el.focus({ preventScroll: true }), 250); } break; }
    /* clients */
    case 'client-cat': S.clientCat = d.cat; render(false); M.rows($('#page')); break;
    case 'edit-client': editClientModal(cl); break;
    case 'add-contact': contactModal(cl); break;
    case 'edit-contact': contactModal(cl, +d.i); break;
    case 'rm-contact': { const c = S.clients.find(x => x.slug === d.slug), p = c.contacts.splice(+d.i, 1)[0]; closeModal(); render(false); toast(`<b>${esc(p.name)}</b> removed`, { undo: () => { c.contacts.splice(+d.i, 0, p); render(false); } }); break; }
    case 'edit-pricing': pricingModal(cl); break;
    case 'client-orders': S.clientsF = new Set([cl.name]); S.tab = 'active'; S.alert = null; S.q = ''; go('#/orders'); setTimeout(() => { const c = $('#orders-card'); if (c) c.scrollIntoView({ block: 'start' }); }, 120); break;
    case 'client-new-order': S.draft = Object.assign(emptyDraft(), { client: cl.name, type: cl.category === 'Vehicle delivery' ? 'Delivery' : '', orderedBy: (cl.contacts[0] || {}).name || '' }); go('#/new'); break;
    /* notaries */
    case 'notary-f': S.notaryF = d.f; render(false); M.rows($('#page')); break;
    case 'edit-notary': notaryModal(nt); break;
    case 'msg-notary-profile': messageNotaryModal(nt); break;
    case 'resend-notary': nt.invitedAt = 'Nov 19'; render(false); toast(`Invite resent to <b>${esc(nt.email)}</b>`, { icon: 'send' }); break;
    case 'request-renewal': toast(`Asked <b>${esc(first(nt.name))}</b> to upload proof of renewal`, { icon: 'send' }); break;
    case 'notary-status': closeMenu(); nt.status = nt.status === 'inactive' ? 'active' : 'inactive'; render(false); toast(`<b>${esc(nt.name)}</b> ${nt.status === 'inactive' ? 'deactivated — they won’t get new invites' : 'reactivated'}`); break;
    case 'notary-invite': { closeMenu(); const ord = byId(id); ord.invites = ord.invites || []; ord.invites.unshift({ name: nt.name, pay: nt.rate, status: 'pending', at: 'Nov 19 · just now', receipts: [['Email delivered', 'just now'], ['SMS delivered', 'just now']] }); pushActivity(ord, `Invite sent to <b>${esc(nt.name)}</b> at ${money(nt.rate)}`); render(false); toast(`Invite for <b>${ord.id}</b> sent to ${esc(nt.name)}`, { icon: 'send', action: { label: 'View order', fn: () => go('#/orders/' + ord.id) } }); break; }
    /* drivers */
    case 'edit-driver': if (!t.closest('button') || t.closest('button') === a) driverModal(S.drivers.find(x => x.name === d.name)); break;
    case 'driver-toggle': { closeModal(true); const dr = S.drivers.find(x => x.name === d.name); dr.active = !dr.active; render(false); toast(`<b>${esc(dr.name)}</b> ${dr.active ? 'reactivated' : 'deactivated'}`, { undo: () => { dr.active = !dr.active; render(false); } }); break; }
    /* reports + settings */
    case 'period': S.period = d.p; render(false); M.count($('#page')); M.bars($('#page')); break;
    case 'export-report': { const p = DAILY[S.period], m = S.period === 'nov' ? 'Nov' : 'Oct'; download(`financials-${S.period}-2026.csv`, new Blob([csv([['Day', 'Orders', 'Signings']].concat(p.orders.map((v, i) => [`${m} ${i + 1}`, v, p.signings[i]])).concat([[], ['Client', 'Revenue']], S.clients.map((c, i) => [c.name, p.byClient[i] || 0]), [[], ['Signing type', 'Revenue']], TYPES.map((x, i) => [x, p.byType[i]])))], { type: 'text/csv' })); toast('Report exported to CSV', { icon: 'download' }); break; }
    case 'invite-member': inviteMemberModal(); break;
    case 'rm-member': { const i = +d.i, m = S.team[i]; confirmModal({ title: `Remove ${esc(m.name)}?`, desc: 'They lose access to this workspace right away. Orders they scheduled stay assigned to them.', confirm: 'Remove', danger: true, onConfirm: () => { S.team.splice(i, 1); render(false); toast(`<b>${esc(m.name)}</b> removed from the team`); } }); break; }
    case 'change-pw': changePwModal(); break;
    case 'end-session': { const s = S.sessions.splice(+d.i, 1)[0]; render(false); toast(`Signed out of ${esc(s.dev)}`); break; }
    case 'end-sessions': S.sessions = S.sessions.filter(s => s.cur); render(false); toast('Signed out of all other sessions'); break;
  }
});
document.addEventListener('dblclick', e => { const pk = e.target.closest('tr[data-peek]'); if (pk && !e.target.closest('a,button,input')) go('#/orders/' + pk.dataset.peek); });

function sendMsg(o) {
  const inp = $('#msg-in'), txt = inp.value.trim(); if (!txt) { inp.focus(); return; }
  const aud = $('#msg-aud').value;
  o.messages.push({ who: 'Jonathan Means', org: 'You', tag: aud, at: 'Just now', text: txt }); o.msgs = o.messages.length;
  refreshDetail(); const last = $$('#messages-card .msg').pop(); M.flash(last);
  toast(aud === 'Internal' ? 'Internal note added' : `Message sent to ${esc(aud.toLowerCase())}`, { icon: 'send' });
}

/* Inline edit */
function startEdit(dd) {
  if (dd.querySelector('input')) return;
  const o = byId(dd.dataset.id), key = dd.dataset.edit, isDate = key === 'date', isTime = key === 'time';
  const cur = isDate ? (o.date || '') : isTime ? to24h(o.time) : (o[key] || '');
  dd.innerHTML = `<input class="input ${['phone', 'sms', 'file'].includes(key) ? 'mono' : ''}" type="${isDate ? 'date' : isTime ? 'time' : key === 'email' || key === 'cc' ? 'email' : 'text'}" value="${esc(cur)}" aria-label="Edit ${esc(key)}">`;
  const inp = dd.querySelector('input'); inp.focus(); if (!isDate && !isTime) inp.select();
  let done = false;
  const finish = save => {
    if (done) return; done = true;
    if (save) {
      let v = inp.value.trim();
      if (['phone', 'sms'].includes(key) && v) v = fmtPhone(v);
      if (isTime && v) v = to12h(v);
      if (['email', 'cc'].includes(key) && v && !isEmail(v)) { toast('That email address doesn’t look right — nothing was saved', { warn: true }); refreshDetail(); return; }
      if ((o[key] || '') !== v) {
        o[key] = v || (isDate || isTime ? null : '');
        if (isDate || isTime) o.pastDue = !!(sigDate(o) && sigDate(o) < NOW && o.status === 'active' && o.notary);
        const label = dd.closest('.f').querySelector('dt').textContent;
        pushActivity(o, `${label} updated`, ''); refreshDetail(isDate || isTime); toast(`${esc(label)} saved`); return;
      }
    }
    refreshDetail();
  };
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); finish(true); } if (ev.key === 'Escape') { ev.stopPropagation(); finish(false); } });
  inp.addEventListener('blur', () => finish(true));
}

/* Inputs */
let notesTimer = null;
document.addEventListener('input', e => {
  const t = e.target, keep = id => { const el = $('#' + id); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
  if (t.id === 'order-q') { S.q = t.value; S.sel.clear(); refreshList(); return; }
  if (t.id === 'client-q') { S.clientQ = t.value; render(false); keep('client-q'); return; }
  if (t.id === 'notary-q') { S.notaryQ = t.value; render(false); keep('notary-q'); return; }
  if (t.id === 'driver-q') { S.driverQ = t.value; render(false); keep('driver-q'); return; }
  if (t.id === 'nt-q') { S.ntQ[t.dataset.id] = t.value; refreshDetail(); keep('nt-q'); return; }
  if (t.id === 'nt-pay') { S.pay[t.dataset.id] = t.value; return; }
  if (t.id === 'pal-q') { palIdx = 0; renderPal(); return; }
  if (t.id === 'client-notes') { const c = S.clients.find(x => x.slug === t.dataset.slug); c.notes = t.value; $('#notes-state').textContent = 'Saving…'; clearTimeout(notesTimer); notesTimer = setTimeout(() => { const s = $('#notes-state'); if (s) s.textContent = 'Saved'; }, 600); return; }
  if (t.id === 'nf-client') { S.draft.client = ''; showClientList(t.value); updateSummary(); return; }
  if (t.hasAttribute('data-phone')) t.value = fmtPhone(t.value);
  const f = t.closest('.field.invalid'); if (f && t.value.trim()) f.classList.remove('invalid');
  if (t.dataset.draft) {
    const k = t.dataset.draft;
    if (k === 'phone' || k === 'sms') t.value = fmtPhone(t.value);
    S.draft[k] = t.value;
    if (k === 'phone' && S.draft.smsSame) { S.draft.sms = t.value; const s = $('#nf-sms'); if (s) s.value = t.value; }
    if (k === 'street') showAddrList(t.value);
    updateSummary(); markSaved();
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.sel) {
    if (t.dataset.sel === 'all') { const ids = filteredOrders().map(o => o.id); ids.forEach(i => t.checked ? S.sel.add(i) : S.sel.delete(i)); }
    else { const i = +t.dataset.sel; t.checked ? S.sel.add(i) : S.sel.delete(i); }
    refreshList(); return;
  }
  if (t.dataset.typeFilter) { t.checked ? S.types.add(t.dataset.typeFilter) : S.types.delete(t.dataset.typeFilter); refreshList(true); return; }
  if (t.dataset.clientFilter) { t.checked ? S.clientsF.add(t.dataset.clientFilter) : S.clientsF.delete(t.dataset.clientFilter); refreshList(true); return; }
  if (t.id === 'show-deact') { S.showDeactivated = t.checked; render(false); return; }
  if (t.id === 'nf-smsSame') { S.draft.smsSame = t.checked; const s = $('#nf-sms'); s.disabled = t.checked; if (t.checked) { S.draft.sms = S.draft.phone; s.value = S.draft.phone; } updateSummary(); return; }
  if (t.dataset.change === 'co') { const isNew = t.value === 'new'; $('#co-new').classList.toggle('hidden', !isNew); $('#co-existing').classList.toggle('hidden', isNew); M.expand(isNew ? $('#co-new') : $('#co-existing')); return; }
  if (t.dataset.teamRole) { const m = S.team[+t.dataset.teamRole]; m.role = t.value; toast(`<b>${esc(m.name)}</b> is now ${esc(t.value.toLowerCase())}`); return; }
  if (t.dataset.notif) { const [k, c] = t.dataset.notif.split(':'); S.notif[k][+c] = t.checked ? 1 : 0; toast('Notification preference saved'); return; }
  if (t.dataset.sec) { S.sec[t.dataset.sec] = t.type === 'checkbox' ? t.checked : t.value; toast(t.dataset.sec === 'twoStep' ? `Two-step verification ${t.checked ? 'on' : 'off'}` : t.dataset.sec === 'google' ? `Google sign-in ${t.checked ? 'allowed' : 'turned off'}` : `Inactivity timeout set to ${esc(t.value)}`, { icon: 'shield' }); return; }
  if (t.dataset.draft && t.tagName === 'SELECT') { S.draft[t.dataset.draft] = t.value; const f = t.closest('.field'); if (t.value && f) f.classList.remove('invalid'); updateSummary(); markSaved(); return; }
  if (t.id === 'file-input') {
    const files = [...t.files]; t.value = ''; if (!files.length) return;
    const meta = f => ({ name: f.name, kind: /\.(jpe?g|png|heic)$/i.test(f.name) ? 'img' : 'pdf', pages: /\.pdf$/i.test(f.name) ? 8 : 1, size: f.size > 1e6 ? (f.size / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1e3)) + ' KB' });
    if (S.uploadTarget === 'draft') files.forEach(f => addDraftDoc(meta(f)));
    else { const o = byId(S.uploadTarget); if (!o) return; files.forEach(f => o.docsList.push(Object.assign(meta(f), { by: 'Jonathan Means', at: 'Just now', ocr: { state: 'reading' } }))); o.docs = o.docsList.length; pushActivity(o, `<b>Jonathan Means</b> uploaded ${files.length} document${files.length > 1 ? 's' : ''}`, ''); refreshDetail();
      setTimeout(() => { o.docsList.forEach(x => { if (x.ocr.state === 'reading') x.ocr = { state: 'done', sig: 1, text: '<b>Read.</b> No conflicts with this order.' }; }); refreshDetail(); }, 1800); toast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`, { icon: 'upload' }); }
  }
});
document.addEventListener('focusin', e => { if (e.target.id === 'nf-client') showClientList(e.target.value); });
document.addEventListener('focusout', e => {
  if (e.target.id === 'nf-client' || e.target.id === 'nf-street') { const combo = e.target.closest('.combo'); setTimeout(() => { if (!combo.contains(document.activeElement)) { combo.classList.remove('open'); e.target.setAttribute('aria-expanded', 'false'); } }, 150); }
});
document.addEventListener('mousedown', e => { if (e.target.closest('.combo-opt')) e.preventDefault(); });
document.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target, kind = form.dataset.form;
  if (kind === 'modal') { if (!validate(form)) return; const fn = modal && modal.onSubmit; const r = fn ? fn(formData(form), form) : null; if (r !== false) closeModal(); return; }
  if (kind === 'signin') { if (validate(form)) busy($('button[type=submit]', form), () => go('#/orders'), 600); return; }
  if (kind === 'forgot') { if (validate(form)) renderAuth('forgot-sent', formData(form)); return; }
  if (kind === 'request') { if (validate(form)) renderAuth('request-sent', formData(form)); return; }
  if (['client', 'notary', 'driver'].includes(kind)) { submitAdd(kind, form); return; }
  if (kind === 'set-profile') { if (!validate(form)) return; const v = formData(form); Object.assign(S.me, { first: v.first.trim(), last: v.last.trim(), email: v.email.trim(), phone: v.phone, tz: v.tz }); $('.sb-user .nm').textContent = S.me.first + ' ' + S.me.last; S.team[0].name = S.me.first + ' ' + S.me.last; toast('Profile saved'); return; }
  if (kind === 'set-workspace') { if (!validate(form)) return; const v = formData(form); Object.assign(S.ws, { name: v.name.trim(), tz: v.tz, scanHours: +v.scanHours || 2, rush: +v.rush || 0, scan: +v.scan || 0 }); TYPES.forEach(t => { S.ws.fees[t] = +v['fee_' + t] || S.ws.fees[t]; }); toast('Workspace settings saved'); }
});

/* Drag & drop */
document.addEventListener('dragover', e => { const dz = e.target.closest && e.target.closest('.dropzone'); if (dz) { e.preventDefault(); dz.classList.add('over'); } });
document.addEventListener('dragleave', e => { const dz = e.target.closest && e.target.closest('.dropzone'); if (dz) dz.classList.remove('over'); });
document.addEventListener('drop', e => {
  const dz = e.target.closest && e.target.closest('.dropzone'); if (!dz) return;
  e.preventDefault(); dz.classList.remove('over'); S.uploadTarget = dz.dataset.id;
  const inp = $('#file-input'); try { inp.files = e.dataTransfer.files; inp.dispatchEvent(new Event('change', { bubbles: true })); } catch (err) {}
});

/* Keyboard */
document.addEventListener('keydown', e => {
  const ae = document.activeElement, typing = /INPUT|TEXTAREA|SELECT/.test(ae.tagName) || ae.isContentEditable;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!AUTH[route().parts[0]]) ($('.palette-wrap') ? closePalette() : openPalette()); return; }
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && ae.id === 'msg-in') { e.preventDefault(); const o = byId(route().parts[1]); if (o) sendMsg(o); return; }
  if ($('.palette-wrap')) {
    const items = $$('.pal-item');
    if (e.key === 'Escape') closePalette();
    else if (e.key === 'ArrowDown') { e.preventDefault(); palIdx = Math.min(items.length - 1, palIdx + 1); renderPal(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palIdx = Math.max(0, palIdx - 1); renderPal(); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = items[palIdx]; if (it) palGo(it.dataset.pal); }
    return;
  }
  if (modal) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key === 'Tab') { const f = $$('button,input,select,textarea,a[href]', modal.el).filter(x => !x.disabled && x.offsetParent); if (f.length) { const i = f.indexOf(ae); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } }
    return;
  }
  if (e.key === 'Escape') {
    if (menuEl) { closeMenu(); return; }
    const open = $('.combo.open'); if (open) { open.classList.remove('open'); return; }
    if ($('.drawer-wrap')) { closePeek(); return; }
    const sh = $('.shell'); if (sh) sh.classList.remove('drawer'); return;
  }
  const combo = ae.closest && ae.closest('.combo.open');
  if (combo && ['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
    const opts = $$('.combo-opt', combo); if (!opts.length) return;
    let i = opts.findIndex(x => x.classList.contains('hl'));
    if (e.key === 'Enter') { e.preventDefault(); (opts[i] || opts[0]).click(); return; }
    e.preventDefault(); opts.forEach(x => x.classList.remove('hl')); i = e.key === 'ArrowDown' ? Math.min(opts.length - 1, i + 1) : Math.max(0, i - 1);
    opts[i].classList.add('hl'); opts[i].scrollIntoView({ block: 'nearest' }); return;
  }
  if (menuEl && ['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); const its = $$('.mi', menuEl); let i = its.indexOf(ae); i = e.key === 'ArrowDown' ? (i + 1) % its.length : (i - 1 + its.length) % its.length; its[i].focus(); return; }
  if (ae.classList && ae.classList.contains('editable') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); startEdit(ae); return; }
  if (ae.matches && ae.matches('.drv') && e.key === 'Enter') { ae.click(); return; }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if ($('.drawer-wrap')) {
    if (['ArrowDown', 'j'].includes(e.key)) { e.preventDefault(); peekStep(1); return; }
    if (['ArrowUp', 'k'].includes(e.key)) { e.preventDefault(); peekStep(-1); return; }
    if (e.key === 'o' && peekId) { go('#/orders/' + peekId); return; }
    return;
  }
  const row = ae.closest && ae.closest('tr[data-peek]');
  if (row) {
    const rows = $$('tr[data-peek]'), i = rows.indexOf(row);
    if (e.key === 'ArrowDown' && rows[i + 1]) { e.preventDefault(); rows[i + 1].focus(); return; }
    if (e.key === 'ArrowUp' && rows[i - 1]) { e.preventDefault(); rows[i - 1].focus(); return; }
    if (e.key === 'Enter') { e.preventDefault(); openPeek(row.dataset.peek); return; }
    if (e.key === 'o') { go('#/orders/' + row.dataset.peek); return; }
    if (e.key === 'x') { const cb = row.querySelector('input[type=checkbox]'); cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); setTimeout(() => { const r = $(`tr[data-peek="${row.dataset.peek}"]`); if (r) r.focus(); }, 0); return; }
  }
  if (AUTH[route().parts[0]]) return;
  if (e.key === 'n' || e.key === 'N') { e.preventDefault(); go('#/new'); }
  else if (e.key === '/') { e.preventDefault(); openPalette(); }
  else if (e.key === '?') { shortcutsModal(); }
  else if (e.key === 'ArrowDown' && route().parts[0] === 'orders' && !route().parts[1]) { const r = $('tr[data-peek]'); if (r && r.offsetParent) { e.preventDefault(); r.focus(); } }
});
addEventListener('resize', () => { closeMenu(); hideTip(); placeInk(); });
addEventListener('scroll', () => { if (menuEl && menuEl.dataset.key !== 'filters' && Math.abs(scrollY - (+menuEl.dataset.y || 0)) > 24) closeMenu(); }, { passive: true });

/* Boot */
if (!location.hash) location.replace('#/signin');
render(true);
