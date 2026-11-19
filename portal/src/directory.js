'use strict';
const dirHead = (title, lede, action) => `<div class="page-head"><div><div class="eyebrow">Directory</div><h1 class="h1">${title}</h1><p class="lede">${lede}</p></div><div class="head-actions">${action}</div></div>`;
const searchBox = (id, val, ph) => `<div class="iw search">${icon('search', 15)}<input class="input" id="${id}" type="search" placeholder="${ph}" value="${esc(val)}" aria-label="${ph}" autocomplete="off"></div>`;
const activeOf = name => S.orders.filter(o => o.client === name && o.status === 'active').length;
function miniOrders(list, empty) {
  if (!list.length) return `<div class="empty" style="padding:36px 20px"><div class="empty-ic">${icon('orders', 20)}</div><h3>${empty}</h3></div>`;
  return `<div class="table-wrap"><table class="dt" style="min-width:560px;table-layout:fixed"><colgroup><col style="width:150px"><col style="width:130px"><col><col style="width:110px"></colgroup>
    <thead><tr><th>Order</th><th>Signing</th><th>Signer</th><th class="r">Status</th></tr></thead><tbody>
    ${list.map(o => `<tr class="clickable" data-href="#/orders/${o.id}"><td><div class="oc">${seal(checksOf(o), 28)}<a class="ord-no" href="#/orders/${o.id}">${o.id}</a></div></td><td>${signingCell(o)}</td><td><div class="cell-1">${esc(o.signer)}</div><div class="cell-2">${o.type} · ${esc(o.city)}</div></td><td class="r"><span class="chip ${o.status === 'completed' ? 'foil' : o.status === 'active' ? (needsOf(o) ? 'red' : 'ink') : ''}">${o.status === 'active' && needsOf(o) ? needsOf(o) + (needsOf(o) === 1 ? ' needs' : ' need') + ' you' : statusLabel(o.status)}</span></td></tr>`).join('')}
    </tbody></table></div>`;
}

/* ---------- Clients ---------- */
function pageClients() {
  const cats = ['All', 'Vehicle delivery', 'Title & escrow', 'Lender'], q = S.clientQ.toLowerCase();
  const list = S.clients.filter(c => (S.clientCat === 'All' || c.category === S.clientCat) && (!q || (c.name + c.contacts.map(x => x.name + x.email).join(' ')).toLowerCase().includes(q)));
  return `${dirHead('Clients', `${S.clients.length} companies that send you signings. Open one to manage contacts, pricing and orders.`, `<a class="btn btn-primary" href="#/clients/new">${icon('plus', 15)}Add client</a>`)}
  <section class="card"><div class="dir-tools"><div class="seg-ctl">${cats.map(c => `<button class="${S.clientCat === c ? 'active' : ''}" data-action="client-cat" data-cat="${esc(c)}">${esc(c)}<span class="n">${c === 'All' ? S.clients.length : S.clients.filter(x => x.category === c).length}</span></button>`).join('')}</div><span class="tb-spacer"></span>${searchBox('client-q', S.clientQ, 'Search companies or contacts')}</div>
    ${list.length ? `<div class="table-wrap"><table class="dt dir-table"><colgroup><col style="width:30%"><col style="width:24%"><col style="width:15%"><col style="width:11%"><col style="width:12%"><col style="width:8%"></colgroup>
      <thead><tr><th>Company</th><th>Primary contact</th><th>Phone</th><th class="r">Active</th><th class="r">Revenue · Nov</th><th></th></tr></thead><tbody>
      ${list.map(c => { const p = c.contacts[0] || {}; return `<tr class="clickable" data-href="#/clients/${c.slug}"><td><div class="co">${av(c.name, 'sq lg')}<div class="co-tx"><a class="cell-1 name-link" style="display:block" href="#/clients/${c.slug}">${esc(c.name)}</a><div class="cell-2">${esc(c.category)} · since ${esc(c.since)}</div></div></div></td>
        <td><div class="cell-1">${esc(p.name || '—')}</div><div class="cell-2">${esc(p.email || '')}</div></td><td class="mono cell-1" style="font-weight:400">${esc(c.phone)}</td>
        <td class="r money">${activeOf(c.name)}</td><td class="r money">${money(c.revenue, 0)}</td><td class="r" style="color:var(--text-3)">${icon('right', 16)}</td></tr>`; }).join('')}</tbody></table></div>`
      : `<div class="empty"><div class="empty-ic">${icon('building', 22)}</div><h3>No clients match</h3><p>Try another name, or add the company as a new client.</p><a class="btn" href="#/clients/new">${icon('plus', 15)}Add client</a></div>`}
    <div class="table-foot"><span>Showing ${list.length} of ${S.clients.length} clients</span></div></section>`;
}
function pageClient(c) {
  const orders = S.orders.filter(o => o.client === c.name && o.status !== 'deleted').sort((a, b) => b.id - a.id);
  const done = orders.filter(o => o.status === 'completed').length, avg = c.ordersMonth ? c.revenue / c.ordersMonth : 0;
  return `<a class="back" href="#/clients">${icon('arrowL', 15)}Clients</a>
  <section class="card"><div class="profile-head">${av(c.name, 'xl sq')}<div class="tx"><div class="eyebrow">${esc(c.category)}</div><h1 class="h1 truncate" style="margin-top:4px">${esc(c.name)}</h1>
      <div class="profile-meta"><span>${icon('phone', 14)}<span class="mono">${esc(c.phone)}</span></span><span>${icon('mail', 14)}${esc(c.billing)}</span><span>${icon('clock', 14)}Client since ${esc(c.since)}</span></div></div>
    <div class="head-actions"><button class="btn" data-action="edit-client" data-slug="${c.slug}">${icon('pencil', 14)}Edit</button><button class="btn" data-action="client-orders" data-slug="${c.slug}">${icon('orders', 14)}View orders</button><button class="btn btn-primary" data-action="client-new-order" data-slug="${c.slug}">${icon('plus', 15)}New order</button></div></div>
    <div class="stat-strip"><div><div class="k">Orders · Nov</div><div class="v" data-count="${c.ordersMonth}">${c.ordersMonth}</div></div><div><div class="k">Active now</div><div class="v">${activeOf(c.name)}</div></div><div><div class="k">Revenue · Nov</div><div class="v" data-count="${c.revenue}" data-fmt="money">${money(c.revenue, 0)}</div></div><div><div class="k">Avg. per order</div><div class="v">${money(avg, 0)}</div></div><div><div class="k">Payment terms</div><div class="v sm">${esc(c.terms)}</div></div></div></section>
  <div class="two-col"><div class="stack">
    <section class="card"><div class="card-head"><span class="card-ic">${icon('orders', 15)}</span><span class="card-title">Recent orders</span><span class="card-count">${orders.length}</span><span class="spacer"></span><button class="link" data-action="client-orders" data-slug="${c.slug}">See all in Orders ${icon('right', 13)}</button></div>${miniOrders(orders.slice(0, 6), 'No orders yet')}
      ${done ? `<div class="card-foot"><span>${done} completed this month</span></div>` : ''}</section>
    <section class="card"><div class="card-head"><span class="card-ic">${icon('users', 15)}</span><span class="card-title">Contacts</span><span class="card-count">${c.contacts.length}</span><span class="spacer"></span><button class="btn btn-sm" data-action="add-contact" data-slug="${c.slug}">${icon('userplus', 14)}Add contact</button></div>
      <ul class="people">${c.contacts.map((p, i) => `<li>${av(p.name)}<div class="tx"><div class="nm truncate">${esc(p.name)}</div><div class="mt truncate">${esc(p.email)}${p.phone ? ' · ' + esc(p.phone) : ''}</div></div><span class="chip ${p.role === 'Client admin' ? 'ink' : ''}">${esc(p.role)}</span><button class="icon-btn sm" data-action="edit-contact" data-slug="${c.slug}" data-i="${i}" aria-label="Edit ${esc(p.name)}" data-tip="Edit">${icon('pencil', 14)}</button></li>`).join('')}</ul></section>
  </div><aside class="stack">
    <section class="card"><div class="card-head"><span class="card-ic">${icon('dollar', 15)}</span><span class="card-title">Pricing</span><span class="spacer"></span><button class="link" data-action="edit-pricing" data-slug="${c.slug}">${icon('pencil', 12)}Edit</button></div>
      ${TYPES.map(t => `<div class="price-row"><span>${t}</span><span class="money">${money(c.fees[t])}${c.fees[t] !== S.ws.fees[t] ? ' <span class="chip ink" style="margin-left:6px">Custom</span>' : ''}</span></div>`).join('')}
      <div class="card-foot"><span>Rush +${money(S.ws.rush, 0)} · Scanbacks +${money(S.ws.scan, 0)}</span></div></section>
    <section class="card"><div class="card-head"><span class="card-ic">${icon('building', 15)}</span><span class="card-title">Billing</span><span class="spacer"></span><button class="link" data-action="edit-client" data-slug="${c.slug}">${icon('pencil', 12)}Edit</button></div>
      <dl class="kv"><div><dt>Billing email</dt><dd>${esc(c.billing)}</dd></div><div><dt>Address</dt><dd>${esc(c.address || '—')}</dd></div><div><dt>Terms</dt><dd>${esc(c.terms)}</dd></div></dl></section>
    <section class="card"><div class="card-head"><span class="card-ic">${icon('pen', 15)}</span><span class="card-title">Notes</span><span class="card-sub">· staff only</span></div>
      <div class="card-body"><textarea class="textarea" id="client-notes" data-slug="${c.slug}" placeholder="Preferences, billing quirks, anything the team should know">${esc(c.notes)}</textarea><div class="help" id="notes-state">Saved automatically</div></div></section>
  </aside></div>`;
}

/* ---------- Notaries ---------- */
const expiring = n => n.commission && (new Date(n.commission) - NOW) / 864e5 < 120;
const nStatus = n => n.status === 'invited' ? ['ink', 'Invite sent'] : n.status === 'inactive' ? ['', 'Inactive'] : expiring(n) ? ['amber', 'Renew soon'] : ['green', 'Active'];
function pageNotaries() {
  const q = S.notaryQ.toLowerCase(), filters = ['All', 'Active', 'Renew soon', 'Invite sent'];
  const list = S.notaries.filter(n => (!q || (n.name + n.city + n.langs.join(' ')).toLowerCase().includes(q)) && (S.notaryF === 'All' || nStatus(n)[1] === S.notaryF));
  return `${dirHead('Notaries', 'Your notary network across the Phoenix metro — commissions, coverage and track record.', `<a class="btn btn-primary" href="#/notaries/new">${icon('plus', 15)}Add notary</a>`)}
  <div class="summary-strip"><div class="seg-ctl">${filters.map(f => `<button class="${S.notaryF === f ? 'active' : ''}" data-action="notary-f" data-f="${f}">${f}<span class="n">${f === 'All' ? S.notaries.length : S.notaries.filter(n => nStatus(n)[1] === f).length}</span></button>`).join('')}</div><span class="tb-spacer"></span><div style="width:min(300px,100%)">${searchBox('notary-q', S.notaryQ, 'Search name, city or language')}</div></div>
  ${list.length ? `<div class="ncards">${list.map(n => { const [sc, sl] = nStatus(n); return `<a class="card clickable ncard" href="#/notaries/${n.slug}">
    <div class="ncard-top">${av(n.name, 'lg')}<div class="tx"><div class="nm truncate">${esc(n.name)}</div><div class="ct"><span class="truncate">${icon('pin', 12)}${esc(n.city)} · ${n.radius} mi</span></div></div><span class="chip ${sc}">${sl}</span></div>
    <div class="nstats"><div><div class="k">Signings</div><div class="v">${n.signings}</div></div><div><div class="k">Usual rate</div><div class="v">${n.rate ? '$' + n.rate : '—'}</div></div><div><div class="k">Commission</div><div class="v sm" style="${expiring(n) ? 'color:var(--amber)' : ''}">${n.commission ? fmtDate(n.commission, { month: 'short', year: 'numeric' }) : 'Pending'}</div></div></div>
    <div class="nmeta"><span class="langs">${n.langs.map(l => `<span class="chip">${esc(l)}</span>`).join('')}</span><span class="mono muted">${esc(n.phone)}</span></div></a>`; }).join('')}</div>`
    : `<div class="card empty"><div class="empty-ic">${icon('stamp', 22)}</div><h3>No notaries match</h3><p>Try a nearby city, a language, or a different filter.</p></div>`}`;
}
function pageNotary(n) {
  const [sc, sl] = nStatus(n), orders = S.orders.filter(o => (o.notary === n.name || (o.invites || []).some(i => i.name === n.name && i.status === 'pending')) && o.status !== 'deleted').sort((a, b) => (sigDate(b) || 0) - (sigDate(a) || 0));
  const open = S.orders.filter(o => o.status === 'active' && !o.notary).length;
  return `<a class="back" href="#/notaries">${icon('arrowL', 15)}Notaries</a>
  ${n.status === 'invited' ? `<div class="banner">${icon('send', 16)}<span class="tx"><b>Invite sent ${esc(n.invitedAt || '')}.</b> ${esc(first(n.name))} hasn’t set up their profile yet, so they can’t take orders.</span><button class="btn btn-sm" data-action="resend-notary" data-slug="${n.slug}">Resend invite</button></div>`
    : expiring(n) ? `<div class="banner amber">${icon('alert', 16)}<span class="tx"><b>Commission expires ${fmtDate(n.commission, { month: 'short', day: 'numeric', year: 'numeric' })}.</b> Ask for proof of renewal so they stay assignable.</span><button class="btn btn-sm" data-action="request-renewal" data-slug="${n.slug}">Request renewal proof</button></div>` : ''}
  <section class="card"><div class="profile-head">${av(n.name, 'xl')}<div class="tx"><div class="eyebrow">Notary · ${esc(n.city)}</div><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px"><h1 class="h1 truncate">${esc(n.name)}</h1><span class="chip lg ${sc}">${sl}</span></div>
      <div class="profile-meta"><a class="name-link" href="tel:${n.phone.replace(/\D/g, '')}">${icon('phone', 14)}<span class="mono">${esc(n.phone)}</span></a><a class="name-link" href="mailto:${esc(n.email)}">${icon('mail', 14)}${esc(n.email)}</a><span>${icon('clock', 14)}With you since ${esc(n.since)}</span></div></div>
    <div class="head-actions"><button class="btn" data-action="edit-notary" data-slug="${n.slug}">${icon('pencil', 14)}Edit</button><button class="btn" data-action="msg-notary-profile" data-slug="${n.slug}">${icon('msg', 14)}Message</button>
      <button class="btn btn-primary" data-action="menu" data-menu="ninv:${n.slug}" ${n.status === 'active' && open ? '' : 'disabled'}>${icon('send', 14)}Invite to an order</button>
      <button class="icon-btn bordered" data-action="menu" data-menu="notary:${n.slug}" aria-label="More actions">${icon('more', 17)}</button></div></div>
    <div class="stat-strip"><div><div class="k">Signings completed</div><div class="v" data-count="${n.signings}">${n.signings}</div></div><div><div class="k">On time</div><div class="v">${n.onTime != null ? n.onTime + '%' : '—'}</div></div><div><div class="k">Accepts invites</div><div class="v">${n.accept != null ? n.accept + '%' : '—'}</div></div><div><div class="k">Usual rate</div><div class="v">${n.rate ? money(n.rate, 0) : '—'}</div></div><div><div class="k">Replies in</div><div class="v sm">${esc(n.response)}</div></div></div></section>
  <div class="two-col"><div class="stack">
    <section class="card"><div class="card-head"><span class="card-ic">${icon('orders', 15)}</span><span class="card-title">Assignments &amp; invites</span><span class="card-count">${orders.length}</span></div>${miniOrders(orders, n.status === 'invited' ? 'No assignments until they finish setup' : 'No assignments yet')}</section>
  </div><aside class="stack">
    <section class="card"><div class="card-head"><span class="card-ic">${icon('badge', 15)}</span><span class="card-title">Commission &amp; credentials</span></div>
      <dl class="kv"><div><dt>Commission no.</dt><dd class="mono">${esc(n.commissionNo || '—')}</dd></div><div><dt>Expires</dt><dd style="${expiring(n) ? 'color:var(--amber);font-weight:500' : ''}">${n.commission ? fmtDate(n.commission, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</dd></div>
        <div><dt>E&amp;O insurance</dt><dd>${n.eo ? 'Through ' + fmtDate(n.eo, { month: 'short', year: 'numeric' }) : '—'}</dd></div><div><dt>Background check</dt><dd>${n.bg.startsWith('Verified') ? `<span class="chip green">${icon('check', 12)}${esc(n.bg)}</span>` : esc(n.bg)}</dd></div></dl></section>
    <section class="card"><div class="card-head"><span class="card-ic">${icon('pin', 15)}</span><span class="card-title">Coverage</span></div>
      <dl class="kv"><div><dt>Home base</dt><dd>${esc(n.city)}</dd></div><div><dt>Travel radius</dt><dd>${n.radius} miles</dd></div><div><dt>Languages</dt><dd style="display:flex;gap:5px;flex-wrap:wrap">${n.langs.map(l => `<span class="chip">${esc(l)}</span>`).join('')}</dd></div>
        <div><dt>Available</dt><dd><div class="days">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<span class="${n.days[i] ? 'on' : ''}" aria-label="${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]} ${n.days[i] ? 'available' : 'unavailable'}">${d}</span>`).join('')}</div></dd></div></dl></section>
  </aside></div>`;
}

/* ---------- Drivers ---------- */
function pageDrivers() {
  const q = S.driverQ.toLowerCase(), list = S.drivers.filter(x => (S.showDeactivated || x.active) && (!q || (x.name + x.phone + x.email).toLowerCase().includes(q)));
  const off = S.drivers.filter(x => !x.active).length;
  return `${dirHead('Drivers', 'Everyone who can be assigned to a vehicle delivery. Select a driver to edit their details.', `<a class="btn btn-primary" href="#/drivers/new">${icon('plus', 15)}Add driver</a>`)}
  <section class="card"><div class="dir-tools">${searchBox('driver-q', S.driverQ, 'Search name, phone or email')}<span class="tb-spacer"></span><label class="check"><span class="toggle"><input type="checkbox" id="show-deact" ${S.showDeactivated ? 'checked' : ''}><i></i></span>Show deactivated (${off})</label></div>
    ${list.length ? list.map(x => `<div class="drv ${x.active ? '' : 'off'}" data-action="edit-driver" data-name="${esc(x.name)}" role="button" tabindex="0" aria-label="Edit ${esc(x.name)}"><span class="truck">${icon('truck', 18)}</span><div class="drv-main"><div class="nm"><span class="truncate">${esc(x.name)}</span>${x.active ? '' : '<span class="chip">Deactivated</span>'}</div>
      <div class="mt"><span class="mono">${icon('phone', 12)}${esc(x.phone)}</span>${x.email ? `<span class="truncate">${icon('mail', 12)}${esc(x.email)}</span>` : ''}<span>${icon('building', 12)}${esc(x.client || 'Any client')}</span><span>${x.deliveries} deliveries</span></div></div>
      <div class="r"><button class="btn btn-sm" data-action="edit-driver" data-name="${esc(x.name)}">${icon('pencil', 13)}Edit</button>${x.active ? `<button class="btn btn-sm btn-danger" data-action="driver-toggle" data-name="${esc(x.name)}">${icon('ban', 13)}Deactivate</button>` : `<button class="btn btn-sm" data-action="driver-toggle" data-name="${esc(x.name)}">${icon('rotate', 13)}Reactivate</button>`}</div></div>`).join('')
    : `<div class="empty"><div class="empty-ic">${icon('truck', 22)}</div><h3>No drivers found</h3><p>${S.driverQ ? 'Nobody matches that search.' : 'Add a driver so you can assign them to delivery orders.'}</p></div>`}</section>`;
}

/* ---------- Reports ---------- */
function pageReports() {
  const p = DAILY[S.period], other = DAILY[S.period === 'nov' ? 'oct' : 'nov'], profit = p.revenue - p.payouts, margin = Math.round(profit / p.revenue * 1000) / 10;
  const orders = sum(p.orders), mx = Math.max(...p.orders), top = Math.ceil(mx / 2) * 2;
  const k = [['Revenue', money(p.revenue, 0), p.revenue], ['Notary payouts', money(p.payouts, 0), p.payouts], ['Gross profit', money(profit, 0), profit], ['Margin', margin + '%', null], ['Orders', orders, orders]];
  const hb = (labels, vals) => { const t = sum(vals), m = Math.max(...vals); return `<div class="hbars">${labels.map((l, i) => `<div class="hb" data-tip="${esc(`<b>${esc(l)}</b><br>${money(vals[i], 0)} · ${Math.round(vals[i] / t * 100)}% of revenue`)}"><span class="lb">${esc(l)}</span><span class="tr"><i style="width:${vals[i] / m * 100}%"></i></span><span class="vl">${money(vals[i], 0)}</span><span class="sh">${Math.round(vals[i] / t * 100)}%</span></div>`).join('')}</div>`; };
  const mon = S.period === 'nov' ? 'Nov' : 'Oct';
  return `<div class="page-head"><div><div class="eyebrow">Reports</div><h1 class="h1">Financials</h1><p class="lede">${S.period === 'nov' ? 'November to date (Nov 1–19)' : 'October (full month)'}. Compared with ${other.label}.</p></div>
    <div class="head-actions"><div class="seg-ctl"><button class="${S.period === 'nov' ? 'active' : ''}" data-action="period" data-p="nov">November</button><button class="${S.period === 'oct' ? 'active' : ''}" data-action="period" data-p="oct">October</button></div><button class="btn" data-action="export-report">${icon('download', 15)}Export CSV</button></div></div>
  <section class="card"><div class="stat-strip" style="border-top:0">${k.map(x => `<div><div class="k">${x[0]}</div><div class="v" ${x[2] != null ? `data-count="${x[2]}" ${String(x[1]).startsWith('$') ? 'data-fmt="money"' : ''}` : ''}>${x[1]}</div></div>`).join('')}</div></section>
  <section class="card" style="margin-top:20px"><div class="card-head"><span class="card-ic">${icon('chart', 15)}</span><span class="card-title">Orders per day</span><span class="card-sub">· ${orders} in ${p.label}</span></div>
    <div class="chart-pad"><div class="cols" role="img" aria-label="Orders per day in ${p.label}, peak ${mx}">
      ${[top, top / 2, 0].map(v => `<div class="gl" style="bottom:${v / top * 100}%"><span>${v}</span></div>`).join('')}
      ${p.orders.map((v, i) => `<div class="col ${S.period === 'nov' && i === p.orders.length - 1 ? 'today' : ''}" data-tip="${esc(`<b>${mon} ${i + 1}</b><br>${v} order${v === 1 ? '' : 's'} · ${p.signings[i]} signing${p.signings[i] === 1 ? '' : 's'}`)}"><i style="height:${v / top * 100}%"></i></div>`).join('')}</div>
      <div class="cols-x">${p.orders.map((_, i) => `<span>${(i + 1) % 2 ? i + 1 : ''}</span>`).join('')}</div></div>
    <details style="border-top:1px solid var(--line)"><summary class="link" style="padding:12px 20px;cursor:pointer">View as table</summary><div class="table-wrap"><table class="dt" style="min-width:0"><thead><tr><th>Day</th><th class="r">Orders</th><th class="r">Signings</th></tr></thead><tbody>${p.orders.map((v, i) => `<tr><td>${mon} ${i + 1}</td><td class="r money">${v}</td><td class="r money">${p.signings[i]}</td></tr>`).join('')}</tbody></table></div></details></section>
  <div class="rep-grid"><section class="card"><div class="card-head"><span class="card-ic">${icon('building', 15)}</span><span class="card-title">Revenue by client</span></div>${hb(S.clients.map(c => c.name), p.byClient.slice(0, S.clients.length).concat(Array(Math.max(0, S.clients.length - p.byClient.length)).fill(0)))}</section>
    <section class="card"><div class="card-head"><span class="card-ic">${icon('file', 15)}</span><span class="card-title">Revenue by signing type</span></div>${hb(TYPES, p.byType)}</section></div>`;
}

/* ---------- Settings ---------- */
const SET_TABS = [['profile', 'Profile', 'user'], ['workspace', 'Workspace', 'building'], ['team', 'Team', 'users'], ['notifications', 'Notifications', 'bell'], ['security', 'Security', 'shield']];
function pageSettings(tab = 'profile') {
  if (!SET_TABS.some(t => t[0] === tab)) tab = 'profile';
  const save = (label = 'Save changes') => `<div class="card-foot" style="justify-content:flex-end"><button type="submit" class="btn btn-primary">${label}</button></div>`;
  let body = '';
  if (tab === 'profile') body = `<form class="card" data-form="set-profile" novalidate><div class="card-head"><span class="card-title">Your profile</span></div><div class="card-body">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px"><span class="av xl" style="background:#3A5CF0;color:#fff">${initials(S.me.first + ' ' + S.me.last)}</span><div><div style="font-weight:600">${esc(S.me.first + ' ' + S.me.last)}</div><div class="muted" style="font-size:13px">Admin · ${esc(S.ws.name)}</div></div></div>
      <div class="grid2">${fld('first', 'First name', { req: true, value: S.me.first, err: 'Enter your first name' })}${fld('last', 'Last name', { req: true, value: S.me.last, err: 'Enter your last name' })}${fld('email', 'Email', { type: 'email', req: true, value: S.me.email, err: 'Enter a valid email', icon: 'mail' })}${fld('phone', 'Mobile', { type: 'tel', value: S.me.phone, help: 'Used for two-step verification and urgent alerts.' })}${sel('tz', 'Time zone', ['Arizona (MST)', 'Pacific (PT)', 'Mountain (MT)', 'Central (CT)', 'Eastern (ET)'], S.me.tz)}</div></div>${save()}</form>`;
  if (tab === 'workspace') body = `<form class="card" data-form="set-workspace" novalidate><div class="card-head"><span class="card-title">Workspace</span></div><div class="card-body"><div class="grid2">
      ${fld('name', 'Workspace name', { req: true, value: S.ws.name, err: 'Enter a name' })}${sel('tz', 'Default time zone', ['Arizona (MST)', 'Pacific (PT)', 'Mountain (MT)', 'Central (CT)', 'Eastern (ET)'], S.ws.tz)}
      ${fld('scanHours', 'Scanbacks due within (hours)', { value: S.ws.scanHours, attrs: 'inputmode="numeric"' })}<div></div>
      ${fld('rush', 'Rush fee', { value: S.ws.rush, icon: 'dollar', attrs: 'inputmode="decimal"' })}${fld('scan', 'Scanbacks fee', { value: S.ws.scan, icon: 'dollar', attrs: 'inputmode="decimal"' })}</div>
      <div class="fgroup-title" style="margin-top:24px">Default signing fees</div><div class="grid3">${TYPES.map(t => fld('fee_' + t, t, { value: S.ws.fees[t], icon: 'dollar', attrs: 'inputmode="decimal"' })).join('')}</div>
      <p class="help">New clients start with these fees. You can override them per client.</p></div>${save()}</form>`;
  if (tab === 'team') body = `<section class="card"><div class="card-head"><span class="card-title">Team</span><span class="card-count">${S.team.length}</span><span class="spacer"></span><button class="btn btn-sm btn-primary" data-action="invite-member">${icon('userplus', 14)}Invite teammate</button></div>
      <div class="table-wrap"><table class="dt" style="min-width:600px;table-layout:fixed"><colgroup><col><col style="width:150px"><col style="width:120px"><col style="width:120px"><col style="width:60px"></colgroup><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Last active</th><th></th></tr></thead><tbody>
      ${S.team.map((m, i) => `<tr><td><div class="co">${av(m.name)}<div class="co-tx"><div class="cell-1">${esc(m.name)}${i === 0 ? ' <span class="muted" style="font-weight:400">(you)</span>' : ''}</div><div class="cell-2">${esc(m.email)}</div></div></div></td>
        <td>${i === 0 ? esc(m.role) : `<div class="sw"><select class="select sm" data-team-role="${i}" aria-label="Role for ${esc(m.name)}">${['Admin', 'Scheduler', 'Billing', 'View only'].map(r => `<option ${m.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>${icon('down', 14)}</div>`}</td>
        <td><span class="chip ${m.status === 'Active' ? 'green' : 'ink'}">${m.status}</span></td><td class="muted">${esc(m.last)}</td>
        <td class="r">${i === 0 ? '' : `<button class="icon-btn sm" data-action="rm-member" data-i="${i}" aria-label="Remove ${esc(m.name)}" data-tip="Remove">${icon('trash', 15)}</button>`}</td></tr>`).join('')}</tbody></table></div></section>`;
  if (tab === 'notifications') {
    const ev = [['newOrder', 'New order placed', 'A client places an order'], ['declined', 'Notary declines', 'An invite is declined or expires'], ['overdue', 'Signing not completed', 'Signing time passes without completion'], ['docs', 'Documents uploaded', 'A client or notary uploads files'], ['digest', 'Daily summary', 'Tomorrow’s schedule at 5 PM']];
    body = `<section class="card"><div class="card-head"><span class="card-title">Notifications</span><span class="card-sub">· choose how you hear about each event</span></div><div class="table-wrap"><table class="dt matrix" style="min-width:560px"><thead><tr><th>Event</th><th class="c">Email</th><th class="c">Text</th><th class="c">In app</th></tr></thead><tbody>
      ${ev.map(([k, t, d]) => `<tr><td><div class="cell-1">${t}</div><div class="cell-2">${d}</div></td>${[0, 1, 2].map(c => `<td class="c"><span class="toggle"><input type="checkbox" data-notif="${k}:${c}" ${S.notif[k][c] ? 'checked' : ''} aria-label="${t} by ${['email', 'text', 'in app'][c]}"><i></i></span></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  }
  if (tab === 'security') body = `<section class="card"><div class="card-head"><span class="card-title">Sign-in &amp; security</span></div>
      <div class="set-row"><div class="tx"><div class="t">Two-step verification</div><div class="d">Ask for a code from your phone when signing in on a new device.</div></div><span class="toggle"><input type="checkbox" data-sec="twoStep" ${S.sec.twoStep ? 'checked' : ''} aria-label="Two-step verification"><i></i></span></div>
      <div class="set-row"><div class="tx"><div class="t">Allow Google sign-in</div><div class="d">Team members can sign in with their Google Workspace account.</div></div><span class="toggle"><input type="checkbox" data-sec="google" ${S.sec.google ? 'checked' : ''} aria-label="Allow Google sign-in"><i></i></span></div>
      <div class="set-row"><div class="tx"><div class="t">Sign out after inactivity</div><div class="d">Applies to everyone in this workspace.</div></div><div class="sw" style="width:180px"><select class="select sm" data-sec="timeout" aria-label="Inactivity timeout">${['15 minutes', '30 minutes', '1 hour', '8 hours'].map(v => `<option ${S.sec.timeout === v ? 'selected' : ''}>${v}</option>`).join('')}</select>${icon('down', 14)}</div></div>
      <div class="set-row"><div class="tx"><div class="t">Password</div><div class="d">Last changed Sep 2, 2026.</div></div><button class="btn btn-sm" data-action="change-pw">${icon('key', 14)}Change password</button></div></section>
    <section class="card" style="margin-top:20px"><div class="card-head"><span class="card-title">Active sessions</span><span class="spacer"></span>${S.sessions.length > 1 ? '<button class="btn btn-sm btn-danger" data-action="end-sessions">Sign out other sessions</button>' : ''}</div>
      ${S.sessions.map((s, i) => `<div class="set-row"><span class="truck">${icon(s.icon, 17)}</span><div class="tx"><div class="t">${esc(s.dev)} ${s.cur ? '<span class="chip green">This device</span>' : ''}</div><div class="d">${esc(s.where)} · ${esc(s.when)}</div></div>${s.cur ? '' : `<button class="btn btn-sm" data-action="end-session" data-i="${i}">Sign out</button>`}</div>`).join('')}</section>`;
  return `<div class="page-head"><div><div class="eyebrow">Settings</div><h1 class="h1">${SET_TABS.find(t => t[0] === tab)[1]}</h1></div></div>
    <div class="set-grid"><nav class="set-nav" aria-label="Settings">${SET_TABS.map(t => `<a href="#/settings/${t[0]}" class="${tab === t[0] ? 'active' : ''}">${icon(t[2], 16)}${t[1]}</a>`).join('')}</nav><div>${body}</div></div>`;
}
function changePwModal() {
  openModal({ title: 'Change password', size: 'sm', body: `<div style="display:grid;gap:16px">${fld('cur', 'Current password', { type: 'password', req: true, err: 'Enter your current password' })}${fld('new', 'New password', { type: 'password', req: true, help: 'At least 12 characters.', err: 'Enter a new password' })}</div>`,
    foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Update password</button>`,
    onSubmit: v => { if (v.new.length < 12) { const f = $('[data-f="new"]'); f.classList.add('invalid'); f.querySelector('.field-err').innerHTML = icon('alert', 13) + 'Use at least 12 characters'; return false; } toast('Password updated', { icon: 'key' }); } });
}
