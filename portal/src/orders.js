'use strict';
/* =========================================================
   ORDERS — list
   ========================================================= */
function spark(data) {
  const w = 84, h = 32, mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - 3 - ((v - mn) / (mx - mn || 1)) * (h - 8)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + f2(p[0]) + ' ' + f2(p[1])).join(' '), last = pts[pts.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="a" d="${line} L${w} ${h} L0 ${h} Z"/><path class="l" d="${line}"/><circle cx="${f2(last[0])}" cy="${f2(last[1])}" r="2.4"/></svg>`;
}
function deltaChip(now, prev, pct) {
  const d = now - prev;
  if (!d) return '<span class="delta flat">±0</span>';
  const v = pct ? Math.round(d / prev * 100) + '%' : Math.abs(d);
  return `<span class="delta ${d < 0 ? 'down' : ''}">${d > 0 ? '+' : '−'}${v}</span>`;
}
function overview() {
  const n = DAILY.nov, o = DAILY.oct, L = a => a[a.length - 1], P = a => a[a.length - 2];
  const k = [
    ['Signings', 'today', L(n.signings), P(n.signings), `${P(n.signings)} yesterday`, n.signings],
    ['Signings', 'November', sum(n.signings), sum(o.signings), `${sum(o.signings)} in October`, n.signings, true],
    ['Orders', 'today', L(n.orders), P(n.orders), `${P(n.orders)} yesterday`, n.orders],
    ['Orders', 'November', sum(n.orders), sum(o.orders), `${sum(o.orders)} in October`, n.orders, true],
  ];
  const profit = n.revenue - n.payouts, margin = Math.round(profit / n.revenue * 1000) / 10;
  return `<section class="card overview" aria-label="At a glance">
    ${k.map(x => `<div class="kpi"><div class="kpi-label">${x[0]} <span class="per">· ${x[1]}</span></div>
      <div class="kpi-row"><div class="kpi-value" data-count="${x[2]}">${x[2]}</div>${spark(x[5].slice(-14))}</div>
      <div class="kpi-foot">${deltaChip(x[2], x[3], x[6])}<span class="truncate">${x[4]}</span></div></div>`).join('')}
    <div class="fin">
      <div class="fin-top"><div class="kpi-label">Revenue <span class="per">· November</span></div><a class="link" href="#/reports">Report ${icon('right', 13)}</a></div>
      <div class="kpi-row" style="margin-top:10px"><div class="kpi-value" data-count="${n.revenue}" data-fmt="money">${money(n.revenue, 0)}</div>${deltaChip(n.revenue, o.revenue, true)}</div>
      <div class="fin-stats"><div><div class="k">Notary payouts</div><div class="v">${money(n.payouts, 0)}</div></div><div><div class="k">Gross profit</div><div class="v">${money(profit, 0)}</div></div></div>
      <div class="margin"><span>${margin}% margin</span><span class="bar" aria-hidden="true"><i class="p" style="width:${100 - margin}%"></i><i class="g" style="width:${margin}%"></i></span></div>
    </div></section>`;
}
function alertsCard(active) {
  const total = active.filter(o => needsOf(o)).length;
  return `<section class="card" aria-label="Needs you">
    <div class="card-head"><span class="pulse" aria-hidden="true"></span><span class="card-title">Needs you</span><span class="card-sub">· ${total} order${total === 1 ? '' : 's'}</span><span class="spacer"></span>${S.alert ? `<button class="link quiet" data-action="alert" data-key="">${icon('x', 13)}Clear filter</button>` : ''}</div>
    <div class="alert-grid">${ALERTS.map(a => {
      const list = active.filter(a.test), n = list.length;
      const ids = list.slice(0, 3).map(o => o.id).join(', ') + (n > 3 ? ` +${n - 3}` : '');
      return `<button class="atile ${S.alert === a.key ? 'active' : ''}" data-action="alert" data-key="${a.key}" aria-pressed="${S.alert === a.key}" ${n ? '' : 'disabled'}>
        <span class="ci">${icon(a.icon, 16)}</span><span class="tx"><span class="n" style="display:block">${n}</span><span class="l" style="display:block">${a.label}</span><span class="s truncate" style="display:block">${n ? ids : 'All clear'}</span></span>${icon('arrowR', 15, 'go')}</button>`;
    }).join('')}</div></section>`;
}
function todayCard() {
  const today = S.orders.filter(o => o.date === TODAY && o.status !== 'deleted' && o.status !== 'cancelled').sort((a, b) => sigDate(a) - sigDate(b));
  const tmr = S.orders.filter(o => o.status === 'active' && o.date && dayDiff(o.date) === 1).length;
  let nowPlaced = false;
  const rows = today.map(o => {
    const t = sigDate(o), past = t < NOW, done = o.status === 'completed';
    let marker = '';
    if (!past && !nowPlaced) { nowPlaced = true; marker = nowLine(); }
    const cls = done ? 'done' : o.pastDue || past ? 'late' : marker ? 'next' : '';
    const chip = done ? `<span class="chip foil">${icon('badge', 12)}Sealed</span>` : (o.pastDue || past) ? '<span class="chip red">Mark complete</span>' : `<span class="chip ink">${rel(o)}</span>`;
    return marker + `<button class="ag ${cls}" data-action="peek" data-id="${o.id}"><span class="ag-time">${esc(o.time)}</span><span class="ag-rail"><span class="ag-dot"></span></span>
      <span class="ag-main"><span class="nm truncate" style="display:block">${esc(o.signer)}</span><span class="mt truncate" style="display:block">${o.id} · ${esc(o.city)} · ${esc(o.notary || 'No notary')}</span></span>${chip}</button>`;
  }).join('') + (nowPlaced ? '' : nowLine());
  return `<section class="card" aria-label="Today's signings">
    <div class="card-head"><span class="card-ic">${icon('cal', 15)}</span><span class="card-title">Today</span><span class="card-sub">· ${fmtDate(TODAY, { weekday: 'short', month: 'short', day: 'numeric' })} · ${today.length} signing${today.length === 1 ? '' : 's'}</span></div>
    <div class="agenda">${today.length ? rows : '<div class="ag-empty">No signings today.</div>'}</div>
    <div class="card-foot"><span>Tomorrow · ${tmr} signing${tmr === 1 ? '' : 's'}</span><button class="link" data-action="by-date">See upcoming ${icon('right', 13)}</button></div></section>`;
}
const nowLine = () => `<div class="ag-now" aria-label="Current time"><span>${NOW.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span><span class="nd"></span><span class="ln"></span></div>`;

function filteredOrders() {
  let list = S.orders.filter(o => o.status === S.tab);
  if (S.alert) { const a = ALERTS.find(x => x.key === S.alert); list = list.filter(a.test); }
  if (S.types.size) list = list.filter(o => S.types.has(o.type));
  if (S.clientsF.size) list = list.filter(o => S.clientsF.has(o.client));
  if (S.q) { const q = S.q.toLowerCase().trim(); list = list.filter(o => [o.id, o.file, o.signer, o.client, o.city, o.street, o.phone, o.notary, o.scheduler].join(' ').toLowerCase().includes(q)); }
  const dk = o => o.date ? sigDate(o).getTime() : 9e15;
  const cmp = { attention: (a, b) => needsOf(b) - needsOf(a) || dk(a) - dk(b), date: (a, b) => dk(a) - dk(b), id: (a, b) => a.id - b.id, signer: (a, b) => a.signer.localeCompare(b.signer), client: (a, b) => a.client.localeCompare(b.client) || a.id - b.id };
  return list.sort((a, b) => cmp[S.sort](a, b) * (S.sort === 'attention' ? 1 : S.dir));
}
function signingCell(o) {
  if (!o.date) return `<div class="sg-date warn">Not scheduled</div><div class="sg-time">Needs a date</div>`;
  const d = dayDiff(o.date), r = o.status === 'active' ? rel(o) : '';
  return `<div class="sg-date ${d === 0 ? 'today' : ''}">${d === 0 ? '<span class="dot"></span>' : ''}${dayLabel(o.date)}${r ? `<span class="rel-chip ${r.endsWith('ago') ? 'late' : ''}">${r}</span>` : ''}</div>
    <div class="sg-time ${o.time ? '' : 'tbd'}">${o.time ? `${o.time} <span class="tz">${o.tz}</span>` : 'Time TBD'}</div>`;
}
function teamCell(o) {
  const pend = !o.notary && pendingInvite(o);
  const sched = o.scheduler ? `<span class="nm">${esc(o.scheduler)}</span>` : '<span class="tm-none">Unassigned</span>';
  const not = o.notary ? `<span class="nm">${esc(o.notary)}</span>` : pend ? `<span class="nm tm-pending">Invited · ${esc(first(pend.name))}</span>` : '<span class="tm-none">Unassigned</span>';
  return `<div class="tm" data-tip="Scheduler">${icon('headset', 13)}${sched}</div><div class="tm" data-tip="Notary">${icon('stamp', 13)}${not}</div>`;
}
function progText(o) {
  const n = needsOf(o);
  if (o.status === 'completed') return '<div class="prog-s done">Sealed</div>';
  if (o.status !== 'active') return `<div class="prog-s">${statusLabel(o.status)}</div>`;
  return n ? `<div class="prog-s need">${n} need${n === 1 ? 's' : ''} you</div>` : '<div class="prog-s">On track</div>';
}
const flagIcons = o => (o.flags.includes('Rush') ? `<span class="flag-ic" data-tip="Rush">${icon('zap', 11)}</span>` : '') + (o.flags.includes('Scanbacks') ? `<span class="flag-ic scan" data-tip="Scanbacks">${icon('scan', 11)}</span>` : '');
const fileMeta = o => `<div class="ord-meta"><span>${esc(o.file)}</span><span class="${o.docs ? 'has' : ''}" data-tip="${o.docs} document${o.docs === 1 ? '' : 's'}">${icon('file', 11)}${o.docs}</span><span class="${o.unread ? 'unread' : o.msgs ? 'has' : ''}" data-tip="${o.msgs} message${o.msgs === 1 ? '' : 's'}${o.unread ? ` · ${o.unread} unread` : ''}">${icon('msg', 11)}${o.msgs}</span></div>`;
function nextAction(o, size = 'btn-sm') {
  const c = `btn ${size}`;
  if (o.status === 'deleted') return `<button class="${c}" data-action="restore" data-id="${o.id}">${icon('undo', 14)}Restore</button>`;
  if (o.status !== 'active') return `<a class="${c} btn-ghost" href="#/orders/${o.id}">View order</a>`;
  if (!o.notary) return `<a class="${c} btn-ink" href="#/orders/${o.id}?notary">${icon('stamp', 14)}Assign notary</a>`;
  if (o.pastDue) return `<button class="${c} btn-ink" data-action="complete" data-id="${o.id}">${icon('check', 14)}Mark complete</button>`;
  if (!o.date || !o.time) return `<a class="${c}" href="#/orders/${o.id}?time">${icon('clock', 14)}Set ${o.date ? 'time' : 'date'}</a>`;
  if (!o.scheduler) return `<button class="${c}" data-action="menu" data-menu="sched:${o.id}">${icon('headset', 14)}Assign scheduler</button>`;
  return `<a class="${c} btn-ghost" href="#/orders/${o.id}">View order</a>`;
}
function groupOf(o) {
  if (!o.date) return 'Not scheduled';
  const d = dayDiff(o.date);
  return d < 0 ? 'Earlier' : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d <= 7 ? 'Next 7 days' : 'Later';
}
function sortTh(key, label, cls = '') {
  const on = S.sort === key, ic = on ? (S.dir > 0 ? 'up' : 'down') : 'sort';
  return `<th class="${cls}" aria-sort="${on ? (S.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button class="th-sort ${on ? 'on' : ''}" data-action="sort-col" data-key="${key}">${label}${icon(ic, 12)}</button></th>`;
}
function emptyList() {
  let h, p, b = '';
  if (S.q || S.alert || S.types.size || S.clientsF.size) { h = 'No orders match these filters'; p = S.q ? `Nothing in ${tabName(S.tab).toLowerCase()} orders matches “${esc(S.q)}”.` : 'Try another filter, or clear them to see every order.'; b = `<button class="btn" data-action="clear-filters">Clear filters</button>`; }
  else if (S.tab === 'deleted') { h = 'No deleted orders'; p = 'Orders you delete appear here, where you can restore them.'; }
  else if (S.tab === 'hold') { h = 'Nothing on hold'; p = 'Put an order on hold when it’s waiting on the client. It leaves the active list until you resume it.'; }
  else { h = 'No orders here yet'; p = 'Place a new signing order to get started.'; b = `<a class="btn btn-primary" href="#/new">${icon('plus', 15)}New order</a>`; }
  return `<div class="empty"><div class="empty-ic">${icon(S.tab === 'deleted' ? 'trash' : 'orders', 22)}</div><h3>${h}</h3><p>${p}</p>${b}</div>`;
}
function tableView(list) {
  const allSel = list.length && list.every(o => S.sel.has(o.id));
  let grp = null;
  const rows = list.map(o => {
    let g = '';
    if (S.sort === 'date') { const k = groupOf(o); if (k !== grp) { grp = k; g = `<tr class="grp"><td colspan="8">${k}<span class="n">${list.filter(x => groupOf(x) === k).length}</span></td></tr>`; } }
    return g + `<tr class="clickable ${S.sel.has(o.id) ? 'selected' : ''} ${peekId === o.id ? 'peeked' : ''}" data-peek="${o.id}" tabindex="0" aria-label="Order ${o.id}, ${esc(o.signer)}">
      <td class="cb"><input type="checkbox" data-sel="${o.id}" ${S.sel.has(o.id) ? 'checked' : ''} aria-label="Select order ${o.id}"></td>
      <td class="c-order"><div class="oc">${seal(checksOf(o), 36)}<div class="oc-tx"><div class="ord-line"><a class="ord-no" href="#/orders/${o.id}">${o.id}</a>${flagIcons(o)}</div>${fileMeta(o)}${progText(o)}</div></div></td>
      <td>${signingCell(o)}</td>
      <td><div class="cell-1" title="${esc(o.signer)}">${esc(o.signer)}</div><div class="cell-2 mono">${esc(o.phone)}</div></td>
      <td><div class="loc-type">${o.type}</div><div class="cell-2" style="color:var(--text-2)" title="${esc(addr1(o))}">${esc(addr1(o))}</div><div class="cell-2" title="${esc(addr2(o))}">${esc(addr2(o))}</div></td>
      <td><div class="cell-1" title="${esc(o.client)}">${esc(o.client)}</div><div class="cell-2">${esc(o.orderedBy || '—')}</div></td>
      <td>${teamCell(o)}</td>
      <td class="r"><div class="row-act">${nextAction(o)}<button class="icon-btn sm" data-action="menu" data-menu="order:${o.id}" aria-label="More actions for order ${o.id}">${icon('more', 16)}</button></div></td></tr>`;
  }).join('');
  const cards = list.map(o => {
    const n = needsOf(o);
    return `<button class="ocard" data-peek="${o.id}">${seal(checksOf(o), 40, { tip: false })}
      <span style="min-width:0"><span class="ord-no">${o.id}${flagIcons(o)}</span><span class="cell-1" style="display:block;margin-top:2px">${esc(o.signer)}</span></span>
      <span class="r">${o.date ? `<span class="sg-date ${dayDiff(o.date) === 0 ? 'today' : ''}" style="justify-content:flex-end">${dayLabel(o.date)}</span><span class="sg-time ${o.time ? '' : 'tbd'}" style="display:block">${o.time || 'Time TBD'}</span>` : '<span class="sg-date warn">Not scheduled</span>'}</span>
      <span class="meta"><span>${icon('building', 12)}${esc(o.client)}</span><span>${icon('pin', 12)}${esc(o.city)}</span>${n ? `<span style="color:var(--red);font-weight:500">${n} need${n === 1 ? 's' : ''} you</span>` : ''}</span></button>`;
  }).join('');
  return `<div class="table-wrap orders-wrap" id="orders-scroll"><table class="dt orders">
    <colgroup><col class="c-cb"><col class="c-order"><col class="c-sign"><col><col><col><col><col class="c-next"></colgroup>
    <thead><tr><th class="cb"><input type="checkbox" data-sel="all" ${allSel ? 'checked' : ''} aria-label="Select all orders"></th>
      ${sortTh('id', 'Order', 'c-order')}${sortTh('date', 'Signing')}${sortTh('signer', 'Signer')}<th>Type &amp; location</th>${sortTh('client', 'Client')}<th>Team</th><th class="r">Next step</th></tr></thead>
    <tbody>${rows}</tbody></table></div><div class="order-cards">${cards}</div>`;
}
function boardView(list) {
  return `<div class="board">${STAGES.map(st => {
    const items = list.filter(o => stageOf(o) === st.key);
    return `<section class="bcol" aria-label="${st.label}"><div class="bcol-head">${quad(st.q)}${st.label}<span class="n">${items.length}</span></div><div class="bcol-desc">${st.desc}</div>
      ${items.length ? items.map(o => `<button class="bcard ${peekId === o.id ? 'peeked' : ''}" data-peek="${o.id}">
        <span class="bcard-top">${seal(checksOf(o), 30)}<span style="min-width:0"><span class="ord-no">${o.id}${flagIcons(o)}</span><span class="cell-2" style="display:block">${esc(o.type)} · ${esc(o.city)}</span></span>
          <span class="r">${o.date ? `<span class="sg-date ${dayDiff(o.date) === 0 ? 'today' : ''}" style="justify-content:flex-end;font-size:12.5px">${dayLabel(o.date)}</span><span class="sg-time ${o.time ? '' : 'tbd'}" style="display:block">${o.time || 'Time TBD'}</span>` : '<span class="sg-date warn" style="font-size:12.5px">No date</span>'}</span></span>
        <span class="bcard-mid"><span class="cell-1" style="display:block">${esc(o.signer)}</span><span class="cell-2" style="display:block">${esc(o.client)}</span></span>
        <span class="bcard-foot"><span class="av-stack">${o.scheduler ? av(o.scheduler, 'sm') : ''}${o.notary ? av(o.notary, 'sm') : ''}${!o.scheduler && !o.notary ? '<span class="tm-none">Unassigned</span>' : ''}</span><span style="display:inline-flex;gap:10px" class="mono">${icon('file', 12)}${o.docs} ${icon('msg', 12)}${o.msgs}</span></span></button>`).join('') : '<div class="bempty">Nothing here</div>'}</section>`;
  }).join('')}</div>`;
}
function activeFilters() {
  const chips = [];
  if (S.alert) chips.push(['Needs', ALERTS.find(a => a.key === S.alert).label, 'alert']);
  S.types.forEach(t => chips.push(['Type', t, 'type:' + t]));
  S.clientsF.forEach(c => chips.push(['Client', c, 'client:' + c]));
  if (S.q) chips.push(['Search', `“${S.q}”`, 'q']);
  if (!chips.length) return '';
  return `<div class="active-filters"><span class="lbl">Filtered by</span>${chips.map(([k, v, id]) => `<span class="fchip"><span class="k">${k}:</span>${esc(v)}<button data-action="rm-filter" data-f="${esc(id)}" aria-label="Remove filter ${esc(v)}">${icon('x', 12)}</button></span>`).join('')}<button class="link quiet" data-action="clear-filters">Clear all</button></div>`;
}
function ordersView() {
  const list = filteredOrders(), board = S.view === 'board' && S.tab === 'active';
  const total = S.orders.filter(o => o.status === S.tab).length;
  return `${activeFilters()}${list.length ? (board ? boardView(list) : tableView(list)) : emptyList()}
    <div class="table-foot"><span>Showing ${list.length} of ${total} ${tabName(S.tab).toLowerCase()} order${total === 1 ? '' : 's'}</span>${board ? '' : '<span class="keys"><kbd>↑</kbd><kbd>↓</kbd> move <kbd>Enter</kbd> preview <kbd>O</kbd> open <kbd>X</kbd> select</span>'}</div>`;
}
function pageOrders() {
  const active = S.orders.filter(o => o.status === 'active');
  const cnt = s => S.orders.filter(o => o.status === s).length;
  const todayN = S.orders.filter(o => o.date === TODAY && !['deleted', 'cancelled'].includes(o.status)).length;
  const needN = active.filter(o => needsOf(o)).length;
  const sortLabel = { attention: 'Needs attention', date: 'Signing date', id: 'Order number', signer: 'Signer', client: 'Client' }[S.sort];
  return `
  <div class="page-head">
    <div><div class="eyebrow">${fmtDate(TODAY, { weekday: 'long', month: 'long', day: 'numeric' })}</div><h1 class="h1">Orders</h1>
      <p class="lede">${active.length} active · ${todayN} signing${todayN === 1 ? '' : 's'} today · ${needN} need${needN === 1 ? 's' : ''} you</p></div>
    <div class="head-actions">
      <button class="btn btn-ghost" data-action="overview-toggle" aria-expanded="${S.overview}">${icon(S.overview ? 'eyeoff' : 'eye', 15)}${S.overview ? 'Hide overview' : 'Show overview'}</button>
      <button class="btn" data-action="export-orders">${icon('download', 15)}Export CSV</button>
      <a class="btn btn-primary" href="#/new">${icon('plus', 15)}New order</a></div>
  </div>
  <div class="ov-wrap" id="ov-wrap">${S.overview ? overview() : ''}</div>
  <div class="band">${alertsCard(active)}${todayCard()}</div>
  <section class="card orders-card" id="orders-card" aria-label="Orders">
    <div class="toolbar">
      <div class="seg-ctl" role="tablist">${['active', 'hold', 'cancelled', 'completed', 'deleted'].map(t => `<button class="${S.tab === t ? 'active' : ''}" role="tab" aria-selected="${S.tab === t}" data-action="tab" data-tab="${t}">${tabName(t)}<span class="n">${cnt(t)}</span></button>`).join('')}</div>
      <div class="tb-spacer"></div>
      <div class="iw search">${icon('search', 15)}<input class="input" id="order-q" type="search" placeholder="Search order, signer, client…" value="${esc(S.q)}" aria-label="Search orders" autocomplete="off"></div>
      <button class="btn btn-sm" style="height:34px" data-action="menu" data-menu="filters" id="filters-btn">${icon('filter', 15)}Filters${S.types.size + S.clientsF.size ? `<span class="filter-count">${S.types.size + S.clientsF.size}</span>` : ''}</button>
      <button class="btn btn-sm" style="height:34px" data-action="menu" data-menu="sort">${icon('sort', 15)}<span class="muted">Sort:</span> ${sortLabel}</button>
      <div class="seg-ctl icons" role="group" aria-label="View">
        <button class="${S.view === 'table' || S.tab !== 'active' ? 'active' : ''}" data-action="view" data-v="table" aria-label="Table view" data-tip="Table">${icon('table', 15)}</button>
        <button class="${S.view === 'board' && S.tab === 'active' ? 'active' : ''}" data-action="view" data-v="board" aria-label="Board view" data-tip="${S.tab === 'active' ? 'Board by next step' : 'Board shows active orders'}" ${S.tab === 'active' ? '' : 'disabled'}>${icon('board', 15)}</button></div>
    </div>
    <div id="orders-view">${ordersView()}</div>
  </section>
  <div id="bulk-host">${bulkBar()}</div>`;
}
function bulkBar() {
  if (!S.sel.size) return '';
  return `<div class="bulk" role="region" aria-label="Bulk actions"><span class="n">${S.sel.size} selected</span>
    <button class="btn btn-sm" data-action="menu" data-menu="bulk-sched">${icon('headset', 14)}Assign scheduler</button>
    ${S.tab === 'active' ? `<button class="btn btn-sm" data-action="bulk-hold">${icon('pause', 14)}Put on hold</button>` : ''}
    <button class="btn btn-sm" data-action="bulk-export">${icon('download', 14)}Export</button>
    ${S.tab !== 'deleted' ? `<button class="btn btn-sm del" data-action="bulk-delete">${icon('trash', 14)}Delete</button>` : ''}
    <button class="icon-btn sm x" data-action="bulk-clear" aria-label="Clear selection">${icon('x', 16)}</button></div>`;
}
let prevSel = 0;
function refreshList(animate) {
  const v = $('#orders-view'); if (!v) return;
  v.innerHTML = ordersView();
  const had = prevSel; prevSel = S.sel.size;
  $('#bulk-host').innerHTML = bulkBar();
  if (!had && S.sel.size && M.ok()) gsap.from('.bulk', { y: 24, autoAlpha: 0, duration: .3, ease: 'power3.out' });
  const fb = $('#filters-btn'); if (fb) fb.innerHTML = `${icon('filter', 15)}Filters${S.types.size + S.clientsF.size ? `<span class="filter-count">${S.types.size + S.clientsF.size}</span>` : ''}`;
  bindScrollShadow();
  if (animate) M.rows(v);
}
function refreshOrders(animate) {
  if (route().parts[0] !== 'orders' || route().parts[1]) return;
  const y = scrollY, qf = document.activeElement && document.activeElement.id === 'order-q';
  $('#page').innerHTML = pageOrders();
  scrollTo(0, y); bindScrollShadow(); prevSel = S.sel.size;
  if (qf) { const q = $('#order-q'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  if (animate) M.rows($('#orders-view'));
  updateNavCounts();
}
function bindScrollShadow() {
  const w = $('#orders-scroll'); if (!w) return;
  const f = () => w.classList.toggle('scrolled', w.scrollLeft > 2); w.onscroll = f; f();
}
function exportOrders(list, name) {
  const rows = [['Order', 'File', 'Status', 'Signing date', 'Time', 'Time zone', 'Signer', 'Phone', 'Type', 'Address', 'City', 'State', 'ZIP', 'Client', 'Ordered by', 'Scheduler', 'Notary']]
    .concat(list.map(o => [o.id, o.file, statusLabel(o.status), o.date || '', o.time || '', o.tz, o.signer, o.phone, o.type, addr1(o), o.city, o.st, o.zip, o.client, o.orderedBy, o.scheduler || '', o.notary || '']));
  download(name, new Blob([csv(rows)], { type: 'text/csv' }));
  toast(`Exported ${list.length} order${list.length === 1 ? '' : 's'} to <b>${esc(name)}</b>`, { icon: 'download' });
}

/* =========================================================
   PEEK DRAWER
   ========================================================= */
let peekId = null;
function peekHTML(o) {
  const ch = checksOf(o), list = filteredOrders(), idx = list.findIndex(x => x.id === o.id), pend = pendingInvite(o);
  const steps = [
    ['Notary', o.notary ? notaryLink(o.notary) : pend ? `<span class="tm-pending">Invited · ${esc(pend.name)}</span>` : null, o.status === 'active' ? `<a class="link" href="#/orders/${o.id}?notary">${o.notary ? 'Change' : 'Assign'}</a>` : ''],
    ['Scheduler', o.scheduler ? esc(o.scheduler) : null, o.status === 'active' ? `<button class="link" data-action="menu" data-menu="sched:${o.id}">${o.scheduler ? 'Change' : 'Assign'}</button>` : ''],
    ['Date & time', o.date ? `${dayLabel(o.date)} · ${o.time ? o.time + ' ' + o.tz : 'Time TBD'}` : null, o.status === 'active' ? `<a class="link" href="#/orders/${o.id}?time">${o.date && o.time ? 'Edit' : 'Set'}</a>` : ''],
    ['Completed', o.status === 'completed' ? 'Sealed' : o.pastDue ? '<span style="color:var(--red)">Signing time passed</span>' : null, o.status === 'active' && o.notary ? `<button class="link" data-action="complete" data-id="${o.id}">Mark</button>` : ''],
  ];
  return `<div class="dr-head">
      <button class="icon-btn sm" data-action="peek-step" data-d="-1" aria-label="Previous order" ${idx > 0 ? '' : 'disabled'}>${icon('up', 16)}</button>
      <button class="icon-btn sm" data-action="peek-step" data-d="1" aria-label="Next order" ${idx > -1 && idx < list.length - 1 ? '' : 'disabled'}>${icon('down', 16)}</button>
      <span class="pos">${idx > -1 ? `${idx + 1} / ${list.length}` : ''}</span><span class="spacer"></span>
      <a class="btn btn-sm" href="#/orders/${o.id}">Open order ${icon('ext', 13)}</a>
      <button class="icon-btn sm" data-action="close-peek" aria-label="Close preview">${icon('x', 16)}</button></div>
    <div class="dr-body">
      <div class="dr-hero">${seal(ch, 64, { center: true, draw: true })}<div class="tx"><div class="eyebrow truncate">${o.type} · ${esc(o.client)}</div><h2 id="peek-title">Order ${o.id}</h2>
        <div class="dr-chips"><button class="status-pill ${o.status}" style="height:24px;font-size:12px" data-action="menu" data-menu="status:${o.id}">${o.status === 'active' ? '<span class="dot"></span>' : ''}${statusLabel(o.status)} ${icon('down', 12)}</button>${o.flags.map(f => `<span class="chip ${f === 'Rush' ? 'amber' : 'ink'}">${icon(f === 'Rush' ? 'zap' : 'scan', 12)}${f}</span>`).join('')}</div></div></div>
      <div class="dr-steps">${steps.map((s, i) => `<div class="dr-step">${quad(i, ch[i], ch.every(Boolean))}<span class="k">${s[0]}</span><span class="v ${s[1] ? '' : 'none'}">${s[1] || (i === 3 ? 'After the signing' : 'Missing')}</span>${s[2]}</div>`).join('')}</div>
      <div class="dr-sec"><h3>Signer</h3><dl class="dr-kv"><div><dt>Name</dt><dd>${esc(o.signer)}</dd></div><div><dt>Phone</dt><dd><a class="name-link mono" href="tel:${o.phone.replace(/\D/g, '')}">${esc(o.phone)}</a></dd></div><div><dt>Email</dt><dd>${o.email ? `<a class="name-link" href="mailto:${esc(o.email)}">${esc(o.email)}</a>` : '<span class="muted">Not provided</span>'}</dd></div></dl></div>
      <div class="dr-sec"><h3>Signing</h3><dl class="dr-kv"><div><dt>When</dt><dd>${o.date ? `${fmtDate(o.date, { weekday: 'long', month: 'short', day: 'numeric' })} · ${o.time ? o.time + ' ' + o.tz : '<span class="tm-pending">Time TBD</span>'}${rel(o) ? ` <span class="muted">(${rel(o)})</span>` : ''}` : '<span class="tm-pending">Not scheduled</span>'}</dd></div>
        <div><dt>Where</dt><dd>${esc(addr1(o))}<br><span class="muted">${esc(addr2(o))}</span><br><a class="link" href="${mapsUrl(o)}" target="_blank" rel="noopener">Open in Maps ${icon('ext', 12)}</a></dd></div>
        <div><dt>Client</dt><dd>${clientLink(o.client)}${o.orderedBy ? ` <span class="muted">· ${esc(o.orderedBy)}</span>` : ''}</dd></div><div><dt>File</dt><dd class="mono">${esc(o.file)}</dd></div></dl></div>
      <div class="dr-sec"><h3>Files &amp; messages</h3><div class="dr-files"><a href="#/orders/${o.id}?docs">${icon('file', 16)}<span><b>${o.docs}</b> documents</span></a><a href="#/orders/${o.id}?messages">${icon('msg', 16)}<span><b>${o.msgs}</b> messages${o.unread ? ` <span class="chip ink">${o.unread} new</span>` : ''}</span></a></div></div>
    </div>
    <div class="dr-foot">${nextAction(o, '').replace('btn-ghost', '')}<a class="btn btn-primary" href="#/orders/${o.id}">Open full order</a></div>`;
}
function openPeek(id) {
  const o = byId(id); if (!o) return;
  closeMenu(); hideTip();
  const fresh = !$('.drawer-wrap');
  peekId = o.id;
  let w = $('.drawer-wrap');
  if (!w) { w = document.createElement('div'); w.className = 'drawer-wrap'; w.innerHTML = '<div class="drawer-scrim" data-action="close-peek"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="peek-title"></aside>'; document.body.appendChild(w); document.body.classList.add('no-scroll'); }
  $('.drawer', w).innerHTML = peekHTML(o);
  if (fresh) M.overlayIn(w, '.drawer', { xPercent: 100, duration: .38 }); else M.swap($('.dr-body', w));
  M.seals(w);
  $$('[data-peek]').forEach(r => r.classList.toggle('peeked', +r.dataset.peek === o.id));
  if (fresh) { const c = $('[data-action="close-peek"].icon-btn', w); if (c) c.focus({ preventScroll: true }); }
}
function closePeek() {
  const w = $('.drawer-wrap'); if (!w) return;
  const id = peekId; peekId = null;
  $$('[data-peek].peeked').forEach(r => r.classList.remove('peeked'));
  M.overlayOut(w, '.drawer', { xPercent: 100 }, () => { w.remove(); if (!modal) document.body.classList.remove('no-scroll'); const row = $(`tr[data-peek="${id}"]`); if (row) row.focus({ preventScroll: true }); });
}
function refreshPeek() { if (peekId && $('.drawer')) { $('.drawer').innerHTML = peekHTML(byId(peekId)); } }
function peekStep(d) { const list = filteredOrders(), i = list.findIndex(x => x.id === peekId), n = list[i + d]; if (n) openPeek(n.id); }

/* =========================================================
   ORDER DETAIL
   ========================================================= */
function fieldDD(o, key, val, opts = {}) {
  return `<dd class="editable ${val ? '' : 'empty-v'} ${opts.mono ? 'mono' : ''}" data-edit="${key}" data-id="${o.id}" tabindex="0" role="button" aria-label="Edit ${opts.label || key}"><span class="v" title="${esc(val || '')}">${val ? esc(val) : (opts.ph || '—')}</span><span class="pen">${icon('pencil', 12)}</span></dd>`;
}
function mapSVG() {
  return `<svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect class="blk" x="20" y="14" width="70" height="38" rx="3"/><rect class="blk" x="110" y="14" width="90" height="38" rx="3"/><rect class="blk" x="300" y="80" width="80" height="44" rx="3"/><rect class="blk" x="20" y="84" width="60" height="40" rx="3"/><path class="park" d="M222 10h64v52h-64z"/><path class="road" stroke-width="10" d="M0 68h400"/><path class="road" stroke-width="7" d="M100 0v140"/><path class="road" stroke-width="7" d="M290 0v140"/><path class="road" stroke-width="5" d="M0 30c80 4 140 70 210 70s120-40 190-36"/><path class="road2" stroke-width="1" stroke-dasharray="4 5" d="M0 68h400"/></svg><span class="pin-ring"></span><span class="pin"><svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 35s12-11.2 12-21A12 12 0 0 0 2 14c0 9.8 12 21 12 21Z" fill="currentColor"/><circle cx="14" cy="14" r="4.5" fill="#fff"/></svg></span>`;
}
function stepCells(o) {
  const ch = checksOf(o), complete = ch.every(Boolean), pend = pendingInvite(o), act = o.status === 'active';
  const cells = [
    ['Notary', ch[0], o.notary || (pend ? `Invite sent · ${pend.name}` : null), 'Unassigned', act ? `<button class="link" data-action="scroll" data-to="notary-card">${o.notary ? 'Change' : pend ? 'Manage invite' : 'Find a notary'}</button>` : ''],
    ['Scheduler', ch[1], o.scheduler, 'Unassigned', act ? `<button class="link" data-action="menu" data-menu="sched:${o.id}">${o.scheduler ? 'Change' : 'Assign'} ${icon('down', 13)}</button>` : ''],
    ['Date & time', ch[2], o.date ? `${fmtDate(o.date)} · ${o.time ? o.time + ' ' + o.tz : 'Time TBD'}` : null, 'Not scheduled', act ? `<button class="link" data-action="edit-field" data-id="${o.id}" data-key="${o.date ? 'time' : 'date'}">${ch[2] ? 'Reschedule' : o.date ? 'Set time' : 'Set date'}</button>` : ''],
    ['Completed', ch[3], o.status === 'completed' ? 'Signing completed' : o.pastDue ? 'Signing time has passed' : 'After the signing', '', act && o.notary ? `<button class="link" data-action="complete" data-id="${o.id}">Mark complete</button>` : ''],
  ];
  return `<div class="steps">${cells.map((c, i) => {
    const st = c[1] ? '<span class="st ok">Done</span>' : i === 3 ? (o.pastDue && act ? '<span class="st need">Needs you</span>' : '<span class="st wait">Pending</span>') : act ? '<span class="st need">Needs you</span>' : '<span class="st wait">—</span>';
    return `<div class="step"><div class="step-top">${quad(i, c[1], complete)}${c[0]}${st}</div><div class="step-val ${c[2] ? '' : 'none'}" title="${esc(c[2] || c[3])}">${esc(c[2] || c[3])}</div>${c[4]}</div>`;
  }).join('')}</div>`;
}
function notaryCard(o) {
  const head = `<div class="card-head"><span class="card-ic">${icon('stamp', 15)}</span><span class="card-title">Notary</span><span class="spacer"></span>${o.notary ? `<span class="chip green">${icon('check', 12)}Assigned</span>` : pendingInvite(o) ? '<span class="chip amber">Awaiting reply</span>' : '<span class="chip red">Unassigned</span>'}</div>`;
  if (o.notary) {
    const n = notaryBy(o.notary) || { phone: '—', email: '—', city: '' };
    return `<section class="card" id="notary-card">${head}<div class="np-sec">
      <div class="assigned">${av(o.notary, 'lg')}<div style="min-width:0;flex:1"><div class="nm truncate">${notaryLink(o.notary)}</div><div class="cell-2">${esc(n.city)}${n.signings ? ' · ' + n.signings + ' signings' : ''}</div></div>
      <div class="inv-pay"><div class="v">${money(o.pay || n.rate || 0)}</div><div class="l">Notary pay</div></div></div>
      <div class="contact-row"><a href="tel:${String(n.phone).replace(/\D/g, '')}" class="name-link">${icon('phone', 14)}<span class="mono">${esc(n.phone)}</span></a><a href="mailto:${esc(n.email)}" class="name-link">${icon('mail', 14)}<span class="truncate">${esc(n.email)}</span></a></div>
      ${o.status === 'active' ? `<div class="inv-actions"><button class="btn btn-sm" data-action="msg-notary">${icon('msg', 14)}Message</button><button class="btn btn-sm btn-ghost btn-danger" data-action="unassign" data-id="${o.id}">Unassign</button></div>` : ''}
    </div></section>`;
  }
  const q = (S.ntQ[o.id] || '').toLowerCase();
  const list = S.notaries.filter(n => n.status === 'active' && (!q || (n.name + ' ' + n.city).toLowerCase().includes(q))).sort((a, b) => a.distance - b.distance).slice(0, 4);
  const picked = S.pick[o.id], pend = (o.invites || []).filter(i => i.status === 'pending'), hist = (o.invites || []).filter(i => i.status !== 'pending');
  return `<section class="card" id="notary-card">${head}
    <div class="np-sec"><div class="np-title">Find a notary <span class="muted" style="font-weight:400;font-size:12px">· nearest to ${esc(o.city)}</span></div>
      <div class="iw">${icon('search', 15)}<input class="input" id="nt-q" data-id="${o.id}" placeholder="Search by name or city" value="${esc(S.ntQ[o.id] || '')}" aria-label="Search notaries" autocomplete="off"></div>
      <div class="sugg" role="listbox" aria-label="Suggested notaries">${list.length ? list.map(n => `<button role="option" aria-selected="${picked === n.name}" class="${picked === n.name ? 'picked' : ''}" data-action="nt-pick" data-id="${o.id}" data-name="${esc(n.name)}">${av(n.name)}<span style="min-width:0;flex:1"><span class="nm truncate" style="display:block">${esc(n.name)}</span><span class="mt truncate" style="display:block">${n.distance} mi · ${n.signings} signings${n.langs.length > 1 ? ' · ' + n.langs.slice(1).join(', ') : ''}</span></span><span class="rt">${money(n.rate, 0)}<span class="mt" style="display:block">usual</span></span>${picked === n.name ? `<span class="pk">${icon('check', 16)}</span>` : ''}</button>`).join('') : '<div class="np-help" style="padding:10px 12px;margin:0">No notaries match. Try a nearby city.</div>'}</div>
      <div style="margin-top:14px" class="field"><label class="label" for="nt-pay">Offered pay</label><div class="iw">${icon('dollar', 15)}<input class="input mono" id="nt-pay" data-id="${o.id}" inputmode="decimal" value="${esc(S.pay[o.id] != null ? S.pay[o.id] : '')}" placeholder="0.00"></div></div>
      <div class="np-actions"><button class="btn" data-action="invite" data-id="${o.id}" ${picked ? '' : 'disabled'}>${icon('send', 14)}Send invite</button><button class="btn btn-primary" data-action="assign-notary" data-id="${o.id}" ${picked ? '' : 'disabled'}>${icon('check', 14)}Assign</button></div>
      <p class="np-help">${picked ? `<b style="color:var(--text)">${esc(first(picked))}</b>: an invite lets them accept or decline; assigning books them right away.` : 'Pick a notary to invite or assign. Invites go out by email and text.'}</p></div>
    ${pend.length || hist.length ? `<div class="np-sec"><div class="np-title">Invites <span class="card-count">${o.invites.length}</span></div>
      ${pend.map(inv => { const i = o.invites.indexOf(inv); return `<div class="inv"><div class="inv-top"><span>Invited ${esc(inv.at)}</span><span class="chip amber"><span class="dot"></span>Awaiting reply</span></div><div class="inv-body"><div class="inv-who">${av(inv.name)}<span class="nm truncate">${esc(inv.name)}</span><div class="inv-pay"><div class="v">${money(inv.pay)}</div><div class="l">Offered</div></div></div>
        <div class="receipts">${(inv.receipts || [['Email delivered', 'just now']]).map(r => `<span>${icon('check', 13)}${r[0]} <span class="muted">${r[1]}</span></span>`).join('')}</div>
        <div class="inv-actions"><button class="btn btn-sm btn-primary" data-action="assign-invite" data-id="${o.id}" data-i="${i}">Assign now</button><button class="btn btn-sm" data-action="resend-invite" data-id="${o.id}" data-i="${i}">${icon('send', 13)}Resend</button><button class="btn btn-sm btn-ghost" data-action="cancel-invite" data-id="${o.id}" data-i="${i}">Cancel invite</button></div></div></div>`; }).join('')}
      ${hist.length ? `<details class="hist"><summary>History (${hist.length}) <span class="link">Show ${icon('down', 13)}</span></summary>${hist.map(h => `<div class="hist-row">${av(h.name)}<div style="min-width:0"><div style="color:var(--text);font-weight:500" class="truncate">${esc(h.name)} · ${money(h.pay)}</div><div class="muted truncate" style="font-size:11.5px">${esc(h.note || h.status)}</div></div><span class="t">${esc(h.at)}</span></div>`).join('')}</details>` : ''}</div>` : ''}
  </section>`;
}
function billingCard(o) {
  const b = feesFor(o), pct = b.rev ? Math.round(b.profit / b.rev * 1000) / 10 : 0, pend = pendingInvite(o);
  return `<section class="card"><div class="card-head"><span class="card-ic">${icon('dollar', 15)}</span><span class="card-title">Billing &amp; profit</span><span class="spacer"></span><span class="chip ${o.invoiced ? 'green' : ''}">${o.invoiced ? 'Invoice sent' : o.status === 'completed' ? 'Ready to invoice' : 'Estimate'}</span></div>
    <div class="bill">
      <div class="bill-row"><span>${o.type} signing fee</span><span class="v">${money(b.fee)}</span></div>
      ${b.rush ? `<div class="bill-row"><span>Rush</span><span class="v">${money(b.rush)}</span></div>` : ''}${b.scan ? `<div class="bill-row"><span>Scanbacks</span><span class="v">${money(b.scan)}</span></div>` : ''}
      <div class="bill-row sub"><span>Notary pay ${o.notary ? '' : pend ? '<span class="muted">(offered)</span>' : '<span class="muted">(not set)</span>'}</span><span class="v">− ${money(b.pay)}</span></div>
      <div class="bill-row total"><span>Gross profit</span><span class="v">${money(b.profit)}</span></div>
      <div class="bill-bar" aria-hidden="true"><i style="width:${b.rev ? b.pay / b.rev * 100 : 0}%;background:var(--text-3);opacity:.35"></i><i style="flex:1;background:var(--green)"></i></div>
      <div class="bill-legend"><span><i style="background:var(--text-3);opacity:.5"></i>Payout</span><span><i style="background:var(--green)"></i>Profit · ${pct}%</span><span style="margin-left:auto">Billed ${money(b.rev)}</span></div></div>
    <div class="card-foot"><span>Invoice · <b style="color:var(--text);font-weight:500">${o.invoiced ? 'Sent to ' + esc(o.client) : o.status === 'completed' ? 'Draft ready' : 'After completion'}</b></span><button class="link" data-action="invoice" data-id="${o.id}">Preview ${icon('right', 13)}</button></div></section>`;
}
function docsCard(o) {
  return `<section class="card" id="docs-card"><div class="card-head"><span class="card-ic">${icon('file', 15)}</span><span class="card-title">Documents</span><span class="card-count">${o.docsList.length}</span><span class="spacer"></span>${o.docsList.length ? `<button class="btn btn-sm" data-action="dl-packet" data-id="${o.id}">${icon('download', 14)}Download packet</button>` : ''}</div>
    ${o.docsList.length ? `<ul class="docs">${o.docsList.map((d, i) => `<li><div class="doc-ic ${d.kind}">${d.kind === 'img' ? 'JPG' : 'PDF'}</div><div class="doc-main"><button class="doc-name" data-action="doc-preview" data-id="${o.id}" data-i="${i}" title="${esc(d.name)}">${esc(d.name)}</button><div class="doc-meta">${d.pages} page${d.pages > 1 ? 's' : ''} · ${d.size} · ${esc(d.by)} · ${esc(d.at)}</div>
      ${d.ocr.state === 'done' ? `<div class="ocr">${icon('sparkles', 14)}<span>${d.ocr.text}</span></div>` : d.ocr.state === 'reading' ? `<div class="ocr reading">${icon('sparkles', 14)}<span style="flex:1">Reading ${d.pages} page${d.pages > 1 ? 's' : ''}…<span class="bar"></span></span></div>` : `<div class="ocr pending">${icon('sparkles', 14)}<span>Not read yet. <button class="link" data-action="ocr" data-id="${o.id}" data-i="${i}">Read with OCR</button> to check names and find signature lines.</span></div>`}
      </div><div class="doc-actions"><button class="icon-btn sm" aria-label="Preview ${esc(d.name)}" data-tip="Preview" data-action="doc-preview" data-id="${o.id}" data-i="${i}">${icon('eye', 16)}</button><button class="icon-btn sm" aria-label="Download ${esc(d.name)}" data-tip="Download" data-action="doc-dl" data-id="${o.id}" data-i="${i}">${icon('download', 16)}</button></div></li>`).join('')}</ul>` : ''}
    <button class="dropzone" data-action="upload" data-id="${o.id}"><span class="dz-ic">${icon('upload', 17)}</span><span><b>Upload documents</b> or drop them here<br><span class="sm">Loan packages, IDs and scanbacks · PDF, JPG or PNG up to 50 MB</span></span></button></section>`;
}
function messagesCard(o) {
  return `<section class="card" id="messages-card"><div class="card-head"><span class="card-ic">${icon('msg', 15)}</span><span class="card-title">Messages</span><span class="card-count">${o.messages.length}</span></div>
    ${o.messages.length ? `<div class="thread">${o.messages.map(m => `<div class="msg">${av(m.who)}<div style="flex:1;min-width:0"><div class="msg-head"><b>${esc(m.who)}</b><span class="muted">${esc(m.org)}</span><span class="chip ${m.tag === 'Internal' ? 'amber' : m.tag === 'Client' ? '' : 'ink'}">${esc(m.tag)}</span><span class="t">${esc(m.at)}</span></div><div class="msg-body">${esc(m.text)}</div></div></div>`).join('')}</div>` : '<div class="np-help" style="padding:16px 20px 4px;margin:0">No messages yet. Messages you send here reach the client, the notary, or stay internal.</div>'}
    <div class="composer"><textarea id="msg-in" placeholder="Write a message…" aria-label="Message"></textarea>
      <div class="composer-row"><div class="sw"><select class="select" id="msg-aud" aria-label="Who sees this message"><option>Client &amp; notary</option><option>Client</option><option>Notary</option><option>Internal</option></select>${icon('down', 13)}</div><span class="spacer"></span><span class="hint" style="margin-right:4px"><kbd>⌘</kbd><kbd>Enter</kbd></span><button class="btn btn-sm btn-primary" data-action="send-msg" data-id="${o.id}">${icon('send', 13)}Send</button></div></div></section>`;
}
function detailPrimary(o) {
  if (o.status === 'deleted') return `<button class="btn btn-primary" data-action="restore" data-id="${o.id}">${icon('undo', 15)}Restore order</button>`;
  if (o.status === 'hold' || o.status === 'cancelled') return `<button class="btn btn-primary" data-action="set-status" data-id="${o.id}" data-s="active">${icon('rotate', 15)}Move to active</button>`;
  if (o.status === 'completed') return `<button class="btn btn-primary" data-action="invoice" data-id="${o.id}">${icon('receipt', 15)}${o.invoiced ? 'View invoice' : 'Send invoice'}</button>`;
  if (!o.notary) return `<button class="btn btn-primary" data-action="scroll" data-to="notary-card">${icon('stamp', 15)}Assign notary</button>`;
  if (o.pastDue) return `<button class="btn btn-primary" data-action="complete" data-id="${o.id}">${icon('check', 15)}Mark complete</button>`;
  if (!o.date || !o.time) return `<button class="btn btn-primary" data-action="edit-field" data-id="${o.id}" data-key="${o.date ? 'time' : 'date'}">${icon('clock', 15)}Set ${o.date ? 'time' : 'date'}</button>`;
  if (!o.scheduler) return `<button class="btn btn-primary" data-action="menu" data-menu="sched:${o.id}">${icon('headset', 15)}Assign scheduler</button>`;
  return `<button class="btn btn-primary" data-action="complete" data-id="${o.id}">${icon('check', 15)}Mark complete</button>`;
}
function pageOrder(o, draw) {
  ensureDetail(o);
  const v = o.vehicle, dr = o.driver;
  return `<a class="back" href="#/orders">${icon('arrowL', 15)}All orders</a>
  <section class="card oh">
    <div class="oh-main">${seal(checksOf(o), 92, { draw, center: true })}
      <div class="oh-title"><div class="oh-row"><h1 class="h1">Order ${o.id}</h1>
          <button class="status-pill ${o.status}" data-action="menu" data-menu="status:${o.id}" aria-label="Change status">${o.status === 'active' ? '<span class="dot"></span>' : ''}${statusLabel(o.status)} ${icon('down', 13)}</button>
          ${o.flags.map(f => `<span class="chip ${f === 'Rush' ? 'amber' : 'ink'}">${icon(f === 'Rush' ? 'zap' : 'scan', 12)}${f}</span>`).join('')}</div>
        <div class="oh-meta"><span>${icon('building', 14)}${clientLink(o.client)}</span><span>${icon('file', 14)}${o.type}</span><span>File <span class="mono">${esc(o.file)}</span></span><span>${icon('clock', 14)}Created ${esc(o.created.replace(', 2026', ''))} by ${esc(o.createdBy)}</span></div></div>
      <div class="oh-actions"><button class="btn" data-action="scroll" data-to="msg-in">${icon('msg', 15)}Message</button>${detailPrimary(o)}
        <button class="icon-btn bordered" data-action="menu" data-menu="detail:${o.id}" aria-label="More order actions">${icon('more', 17)}</button></div></div>
    ${stepCells(o)}</section>
  <div class="detail-grid">
    <div class="stack">
      <section class="card"><div class="card-head"><span class="card-ic">${icon('orders', 15)}</span><span class="card-title">Order information</span><span class="spacer"></span><span class="hint">${icon('pencil', 12)}Click a value to edit</span></div>
        <div class="card-body">
          <div class="fgroup"><div class="fgroup-title">Signer &amp; contact</div><dl class="fields">
            <div class="f"><dt>Signer</dt>${fieldDD(o, 'signer', o.signer, { label: 'signer' })}</div>
            <div class="f"><dt>Phone</dt>${fieldDD(o, 'phone', o.phone, { mono: true, label: 'phone' })}</div>
            <div class="f"><dt>SMS number</dt>${fieldDD(o, 'sms', o.sms, { mono: true, ph: 'Same as phone', label: 'SMS number' })}</div>
            <div class="f"><dt>Ordered by</dt>${fieldDD(o, 'orderedBy', o.orderedBy, { label: 'ordered by' })}</div>
            <div class="f span2"><dt>Email</dt>${fieldDD(o, 'email', o.email, { ph: 'Add email', label: 'email' })}</div>
            <div class="f span2"><dt>CC email</dt>${fieldDD(o, 'cc', o.cc, { ph: 'Add CC', label: 'CC email' })}</div></dl></div>
          <div class="fgroup"><div class="fgroup-title">Appointment &amp; location<button class="link" data-action="edit-address" data-id="${o.id}">${icon('pencil', 12)}Edit address</button></div>
            <dl class="fields" style="margin-bottom:16px">
              <div class="f"><dt>Signing date</dt>${fieldDD(o, 'date', o.date ? fmtDate(o.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '', { ph: 'Set date', label: 'signing date' })}</div>
              <div class="f"><dt>Signing time</dt>${fieldDD(o, 'time', o.time || '', { ph: 'Time TBD', label: 'signing time' })}</div>
              <div class="f"><dt>Time zone</dt><dd>${o.tz === 'PST' ? 'Pacific (PST)' : 'Arizona (MST)'}</dd></div></dl>
            <div class="loc"><div class="loc-main"><div class="a1">${esc(addr1(o))}</div><div class="a2">${esc(addr2(o))}</div>
              <div class="loc-actions"><a class="btn btn-sm" href="${mapsUrl(o)}" target="_blank" rel="noopener">${icon('ext', 14)}Open in Maps</a><button class="btn btn-sm btn-ghost" data-action="copy" data-copy="${esc(addr1(o) + ', ' + addr2(o))}">${icon('copy', 14)}Copy address</button></div></div>
              <a class="map" href="${mapsUrl(o)}" target="_blank" rel="noopener" aria-label="Open map in a new tab">${mapSVG()}</a></div></div>
          <div class="fgroup"><div class="fgroup-title">Order</div><dl class="fields">
            <div class="f"><dt>Type</dt><dd>${o.type}</dd></div>
            <div class="f"><dt>File number</dt>${fieldDD(o, 'file', o.file, { mono: true, label: 'file number' })}</div>
            <div class="f span2"><dt>Flags</dt><dd style="gap:6px;flex-wrap:wrap">
              <button class="flag-btn sm" aria-pressed="${o.flags.includes('Rush')}" data-action="flag" data-id="${o.id}" data-f="Rush">${icon('zap', 13)}Rush</button>
              <button class="flag-btn sm scan" aria-pressed="${o.flags.includes('Scanbacks')}" data-action="flag" data-id="${o.id}" data-f="Scanbacks">${icon('scan', 13)}Scanbacks</button></dd></div></dl></div>
          ${v ? `<div class="fgroup"><div class="fgroup-title">Vehicle &amp; delivery</div><dl class="fields">
            <div class="f span2"><dt>Vehicle</dt><dd>${esc([v.year, v.make, v.model].filter(Boolean).join(' '))}</dd></div>
            <div class="f span2"><dt>VIN</dt><dd class="mono"><span class="v">${esc(v.vin)}</span><button class="icon-btn xs" data-action="copy" data-copy="${esc(v.vin)}" aria-label="Copy VIN" data-tip="Copy VIN">${icon('copy', 13)}</button></dd></div>
            <div class="f" style="grid-column:1/-1"><dt>Delivery driver</dt><dd class="warn-row">${dr ? `${esc(dr.name)} <span class="mono muted" style="font-weight:400">${esc(dr.phone)}</span>${dr.deactivated ? `<span class="chip amber">${icon('alert', 12)}Deactivated · still assigned</span>` : ''}` : '<span class="muted" style="font-weight:400">No driver</span>'}<button class="link" data-action="menu" data-menu="driver:${o.id}">${dr ? 'Reassign' : 'Assign driver'} ${icon('down', 12)}</button></dd></div></dl></div>` : ''}
        </div></section>
      ${docsCard(o)}${messagesCard(o)}
      <section class="card"><div class="card-head"><span class="card-ic">${icon('alert', 15)}</span><span class="card-title">Special instructions</span></div>
        <div class="instr"><div><div class="from">${icon('building', 12)}From ${esc(o.client)}</div>${o.instructions.client.map(t => `<p>${esc(t)}</p>`).join('')}</div><div><div class="from">${icon('shield', 12)}From your company</div>${o.instructions.company.map(t => `<p>${esc(t)}</p>`).join('')}</div></div></section>
    </div>
    <aside class="stack">${notaryCard(o)}${billingCard(o)}
      <section class="card"><div class="card-head"><span class="card-ic">${icon('activity', 15)}</span><span class="card-title">Activity</span></div>
        <div class="timeline">${o.activity.map(a => `<div class="tl"><span class="tl-dot ${a.c}"></span><div><div class="tl-txt">${a.txt}</div><div class="tl-t">${esc(a.t)}</div></div></div>`).join('')}</div></section></aside>
  </div>
  <details class="card audit"><summary><span class="card-ic">${icon('history', 15)}</span><span class="card-title">Audit log</span><span class="chip">${icon('lock', 11)}Staff only</span><span class="muted" style="font-size:12.5px">${o.activity.length + 2} events</span>${icon('down', 16, 'chev')}</summary>
    <div class="table-wrap"><table class="dt" style="min-width:560px"><thead><tr><th>Time</th><th>Who</th><th>Event</th><th>Source</th></tr></thead><tbody>
      ${[...o.activity.map(a => { const t = a.txt.replace(/<[^>]+>/g, ''); return [a.t, /created by/.test(t) ? o.createdBy : /^(Invite|Status|Scheduler|Signing marked)/.test(t) ? 'Jonathan Means' : 'System', t, 'Web']; }), [o.created.replace(', 2026', ''), o.createdBy, 'Viewed order', 'Web'], [o.created.replace(', 2026', ''), 'System', 'Signer SMS consent recorded', 'SMS']].map(r => `<tr><td class="mono muted" style="white-space:nowrap">${esc(r[0])}</td><td style="white-space:nowrap">${esc(r[1])}</td><td>${esc(r[2])}</td><td class="muted">${r[3]}</td></tr>`).join('')}
    </tbody></table></div></details>`;
}
function refreshDetail(draw) {
  const r = route(); if (r.parts[0] !== 'orders' || !r.parts[1]) return;
  const y = scrollY; $('#page').innerHTML = pageOrder(byId(r.parts[1]), !!draw); scrollTo(0, y); M.seals($('#page'));
}

/* Document + invoice previews */
function docPreview(o, i) {
  const d = o.docsList[i], sigs = d.ocr.sig || 0;
  const lines = n => Array.from({ length: n }, (_, k) => `<div class="ln" style="width:${[96, 88, 92, 70, 94, 84][k % 6]}%"></div>`).join('');
  const page = d.kind === 'img'
    ? `<div class="paper" style="aspect-ratio:1.586;max-width:380px;padding:6%;font-family:var(--font-ui)"><div style="display:flex;gap:6%;height:100%"><div style="width:32%;background:#E6E7EB;border-radius:4px"></div><div style="flex:1"><div class="ph" style="text-align:left;font-size:10px">Arizona · Driver license</div><div style="margin-top:10px;font-size:9px;color:#666">Name</div><div style="font-size:11px;font-weight:600"><span class="fill">${esc(o.signer)}</span></div>${lines(4)}</div></div></div>`
    : `<div class="paper"><div class="ph">${esc(d.name.replace(/\.pdf$/, ''))}</div><div class="ps">File ${esc(o.file)} · Page 1 of ${d.pages}</div><div style="margin-top:18px;font-size:8.5px;font-family:var(--font-ui)">Borrower / signer: <span class="fill">${esc(o.signer)}</span></div>${lines(9)}
      ${sigs ? `<div class="sig"><span class="sign-flag">SIGN HERE</span><span>${esc(o.signer)} · Signature</span></div>${lines(4)}<div class="sig" style="width:40%"><span class="sign-flag">INITIAL</span><span>Initials</span></div>` : lines(6)}</div>`;
  const finds = d.ocr.state === 'done' ? [`Signer name matches <b>${esc(o.signer)}</b>`, o.vehicle && /contract|odometer/i.test(d.name) ? `VIN matches <b class="mono">${esc(o.vehicle.vin)}</b>` : `File number matches <b class="mono">${esc(o.file)}</b>`, sigs ? `${sigs} signature lines flagged` : 'No signature lines on this file'] : [];
  openModal({ title: esc(d.name), desc: `${d.pages} page${d.pages > 1 ? 's' : ''} · ${d.size} · Uploaded by ${esc(d.by)}`, size: 'lg',
    body: `<div class="dp"><div class="paper-wrap">${page}<div class="pager"><button type="button" class="icon-btn xs" disabled aria-label="Previous page">${icon('left', 14)}</button>Page 1 of ${d.pages}<button type="button" class="icon-btn xs" ${d.pages > 1 ? 'data-action="toast" data-msg="Showing page 2 of the preview"' : 'disabled'} aria-label="Next page">${icon('right', 14)}</button></div></div>
      <div><div class="fgroup-title">${icon('sparkles', 13)}OCR findings</div>${finds.length ? `<ul class="find-list">${finds.map(f => `<li>${icon('check', 14)}<span>${f}</span></li>`).join('')}</ul>` : `<p class="help" style="margin:0 0 12px">This file hasn’t been read yet.</p><button type="button" class="btn btn-sm" data-action="ocr" data-id="${o.id}" data-i="${i}">${icon('sparkles', 14)}Read with OCR</button>`}
        <div class="fgroup-title" style="margin-top:20px">Access</div><ul class="find-list"><li>${icon('eye', 14)}<span>Visible to staff and the assigned notary</span></li><li>${icon('history', 14)}<span>Last opened by Jonathan Means · Nov 18</span></li></ul></div></div>`,
    foot: `<button type="button" class="btn btn-ghost btn-danger" data-action="doc-remove" data-id="${o.id}" data-i="${i}">${icon('trash', 14)}Remove</button><span class="spacer"></span><button type="button" class="btn" data-action="close-modal">Close</button><button type="button" class="btn btn-primary" data-action="doc-dl" data-id="${o.id}" data-i="${i}">${icon('download', 15)}Download</button>` });
}
function invoiceModal(o) {
  const b = feesFor(o), c = clientBy(o.client) || {}, no = 'INV-2026-' + String(o.id).slice(-4);
  const items = [[`${o.type} signing · ${o.signer}`, b.fee], b.rush ? ['Rush fee', b.rush] : null, b.scan ? ['Scanbacks', b.scan] : null].filter(Boolean);
  openModal({ title: o.invoiced ? 'Invoice' : 'Invoice preview', desc: o.status === 'completed' ? (o.invoiced ? `Sent to ${esc(c.billing || o.client)}` : 'Review it, then send it to the client.') : 'This is a draft. You can send it once the signing is marked complete.', size: 'lg',
    body: `<div class="invoice"><div class="inv-head"><div><div class="eyebrow">Invoice</div><div class="inv-no">${no}</div></div><div style="text-align:right;font-size:13px;color:var(--text-2)"><div>Issued ${fmtDate(TODAY, { month: 'short', day: 'numeric', year: 'numeric' })}</div><div>Terms · ${esc(c.terms || 'Net 15')}</div><div>Order <span class="mono">${o.id}</span> · File <span class="mono">${esc(o.file)}</span></div></div></div>
      <div class="inv-parties"><div><div class="k">From</div><b>${esc(S.ws.name)}</b><div class="muted">Phoenix, AZ</div></div><div><div class="k">Bill to</div><b>${esc(o.client)}</b><div class="muted">${esc(c.address || '')}</div><div class="muted">${esc(c.billing || '')}</div></div></div>
      <table class="dt" style="min-width:0"><thead><tr><th>Item</th><th class="r">Amount</th></tr></thead><tbody>${items.map(([l, v]) => `<tr><td>${esc(l)}</td><td class="r money">${money(v)}</td></tr>`).join('')}</tbody></table>
      <div class="inv-total"><span class="muted">Total due</span><span class="v">${money(b.rev)}</span></div></div>`,
    foot: `<button type="button" class="btn" data-action="inv-pdf" data-id="${o.id}">${icon('download', 15)}Download PDF</button><span class="spacer"></span><button type="button" class="btn btn-ghost" data-action="close-modal">Close</button>${o.status === 'completed' && !o.invoiced ? `<button type="submit" class="btn btn-primary">${icon('send', 14)}Send to client</button>` : ''}`,
    onSubmit: () => { o.invoiced = true; pushActivity(o, `Invoice <b>${no}</b> sent to ${esc(o.client)}`, 'green'); refreshDetail(); toast(`Invoice <b>${no}</b> sent to ${esc(c.billing || o.client)}`, { icon: 'send' }); } });
}
