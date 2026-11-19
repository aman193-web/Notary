'use strict';
/* =========================================================
   ICONS (Lucide-style paths, ISC)
   ========================================================= */
const I = {
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  down:'<path d="m6 9 6 6 6-6"/>', up:'<path d="m18 15-6-6-6 6"/>',
  right:'<path d="m9 18 6-6-6-6"/>', left:'<path d="m15 18-6-6 6-6"/>',
  arrowL:'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', arrowR:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  ext:'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  orders:'<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  building:'<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  truck:'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  stamp:'<path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13"/>',
  pen:'<path d="M12 20h9"/><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z"/>',
  pencil:'<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  pin:'<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  cal:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  calx:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  userx:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5"/><path d="m22 8-5 5"/>',
  userplus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
  headset:'<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
  dollar:'<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  activity:'<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  more:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  filter:'<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  sort:'<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  sparkles:'<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
  eye:'<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>',
  panel:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  history:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  send:'<path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/>',
  car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  circlecheck:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  menu:'<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
  pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  enter:'<path d="M9 10 4 15l5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
  badge:'<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  rotate:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  table:'<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>',
  board:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/>',
  chart:'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  printer:'<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  key:'<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  laptop:'<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  smartphone:'<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  receipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
};
const icon = (n, s = 16, c = '') => `<svg class="ic ${c}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;
const GOOGLE = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
let logoN = 0;
const LOGO = (s = 28) => { const id = 'lg' + (logoN++); return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="16" fill="#D7F552"/><path d="M10 22.5V9.5l12 13V9.5" fill="none" stroke="#111214" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="9.5" r="1.9" fill="#111214"/></svg>`; };

/* =========================================================
   UTILS
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
};
const TODAY = '2026-11-19';
const NOW = new Date(2026, 10, 19, 14, 15);
const fmtDate = (iso, opts) => iso ? new Date(iso + 'T12:00:00').toLocaleDateString('en-US', opts || { weekday: 'short', month: 'short', day: 'numeric' }) : '';
const money = (n, dec = 2) => (n < 0 ? '−' : '') + '$' + Math.abs(Number(n)).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const initials = n => String(n || '').replace(/&.*$/, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const HUES = [222, 196, 256, 162, 28, 340, 205, 280];
const hue = n => { let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return HUES[h % HUES.length]; };
const av = (n, cls = '') => `<span class="av ${cls}" style="--h:${hue(n)}" aria-hidden="true">${esc(initials(n))}</span>`;
const first = n => String(n || '').split(' ')[0];
const slugify = s => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtPhone = v => { const d = String(v).replace(/\D/g, '').slice(0, 10); if (d.length < 4) return d; if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`; return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`; };
const to12h = t => { if (!t) return ''; if (/[ap]m/i.test(t)) return t; const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
const to24h = t => { const m = String(t || '').match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return ''; const h = (+m[1]) % 12 + (m[3].toUpperCase() === 'PM' ? 12 : 0); return `${String(h).padStart(2, '0')}:${m[2]}`; };
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isEmail = v => /^\S+@\S+\.\S+$/.test(String(v).trim());
const dayDiff = iso => Math.round((new Date(iso + 'T12:00:00') - new Date(TODAY + 'T12:00:00')) / 864e5);
const dayLabel = iso => { const d = dayDiff(iso); return d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d === -1 ? 'Yesterday' : fmtDate(iso); };
function sigDate(o) {
  if (!o.date) return null;
  const [y, m, d] = o.date.split('-').map(Number);
  const t = to24h(o.time); const [h, mi] = t ? t.split(':').map(Number) : [23, 59];
  return new Date(y, m - 1, d, h, mi);
}
function rel(o) {
  const d = sigDate(o); if (!d || !o.time) return '';
  const diff = (d - NOW) / 60000; if (Math.abs(diff) > 18 * 60) return '';
  const a = Math.abs(diff), h = Math.floor(a / 60), m = Math.round(a % 60);
  const s = h >= 3 ? h + 'h' : ([h ? h + 'h' : '', m ? m + 'm' : ''].filter(Boolean).join(' ') || 'now');
  return diff > 0 ? 'in ' + s : s + ' ago';
}
function download(name, blob) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
const ascii = s => String(s).replace(/[—–]/g, '-').replace(/[·•]/g, '-').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E]/g, '');
function makePdf(title, lines) {
  const pe = s => ascii(s).replace(/[\\()]/g, m => '\\' + m);
  const body = ['BT', '/F1 18 Tf', '56 780 Td', `(${pe(title)}) Tj`, '/F1 10 Tf', '0 -26 Td'];
  lines.slice(0, 44).forEach(l => body.push(`(${pe(l)}) Tj`, '0 -15 Td'));
  body.push('ET');
  const content = body.join('\n');
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  let pdf = '%PDF-1.4\n'; const offs = [];
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
const csv = rows => rows.map(r => r.map(c => { const s = String(c == null ? '' : c); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n');

/* =========================================================
   DATA (test data)
   ========================================================= */
const TYPES = ['Delivery', 'Purchase', 'Refinance', 'Seller', 'HELOC'];
const ct = (name, role, email, phone) => ({ name, role, email, phone });
const CLIENTS = [
  { name: 'Auto Concierge', category: 'Vehicle delivery', since: 'Mar 2026', phone: '(480) 555-0110', billing: 'ap@autoconcierge.example', address: '8800 E Raintree Dr, Scottsdale, AZ 85260', terms: 'Net 15', ordersMonth: 31, revenue: 7940, notes: 'Prefers text updates. Deliveries after 4 PM need manager approval.',
    fees: { Delivery: 175, Purchase: 225, Refinance: 200, Seller: 175, HELOC: 150 },
    contacts: [ct('Jordan Avery', 'Client admin', 'jordan@autoconcierge.example', '(480) 555-0110'), ct('Kim Torres', 'Client user', 'kim@autoconcierge.example', '(480) 555-0111'), ct('Ray Lindqvist', 'Client user', 'ray@autoconcierge.example', '(480) 555-0112'), ct('Ana Ruiz', 'Client user', 'ana@autoconcierge.example', '(480) 555-0113')] },
  { name: 'Desert Title Co.', category: 'Title & escrow', since: 'Apr 2026', phone: '(602) 555-0184', billing: 'billing@deserttitle.example', address: '2 N Central Ave, Phoenix, AZ 85004', terms: 'Net 30', ordersMonth: 18, revenue: 3420, notes: 'Scanbacks required on every purchase file.',
    fees: { Delivery: 175, Purchase: 210, Refinance: 190, Seller: 165, HELOC: 150 },
    contacts: [ct('Meredith Lane', 'Client admin', 'mlane@deserttitle.example', '(602) 555-0184'), ct('Paul Whitman', 'Client user', 'pwhitman@deserttitle.example', '(602) 555-0185'), ct('Sasha Green', 'Client user', 'sgreen@deserttitle.example', '(602) 555-0186')] },
  { name: 'Copper State Escrow', category: 'Title & escrow', since: 'Jun 2026', phone: '(480) 555-0199', billing: 'ar@copperstate.example', address: '7150 E Camelback Rd, Scottsdale, AZ 85251', terms: 'Net 15', ordersMonth: 9, revenue: 1710, notes: '',
    fees: { Delivery: 175, Purchase: 225, Refinance: 190, Seller: 175, HELOC: 150 },
    contacts: [ct('Victor Huang', 'Client admin', 'victor@copperstate.example', '(480) 555-0199'), ct('Liz Romero', 'Client user', 'liz@copperstate.example', '(480) 555-0198')] },
  { name: 'Pinnacle Lending', category: 'Lender', since: 'Aug 2026', phone: '(623) 555-0147', billing: 'payables@pinnaclelending.example', address: '1 E Washington St, Phoenix, AZ 85004', terms: 'Net 30', ordersMonth: 7, revenue: 950, notes: 'HELOC packages arrive the day before signing.',
    fees: { Delivery: 175, Purchase: 225, Refinance: 200, Seller: 175, HELOC: 135 },
    contacts: [ct('Alicia Grant', 'Client admin', 'agrant@pinnaclelending.example', '(623) 555-0147'), ct('Mo Haddad', 'Client user', 'mo@pinnaclelending.example', '(623) 555-0148')] },
  { name: 'Summit Auto Group', category: 'Vehicle delivery', since: 'Oct 2026', phone: '(480) 555-0102', billing: 'accounts@summitauto.example', address: '1600 W Bell Rd, Phoenix, AZ 85023', terms: 'Due on receipt', ordersMonth: 3, revenue: 260, notes: '',
    fees: { Delivery: 160, Purchase: 225, Refinance: 200, Seller: 175, HELOC: 150 },
    contacts: [ct('Ben Whitaker', 'Client admin', 'ben@summitauto.example', '(480) 555-0102'), ct('Cara Doyle', 'Client user', 'cara@summitauto.example', '(480) 555-0103')] },
].map(c => Object.assign(c, { slug: slugify(c.name) }));
const NOTARIES = [
  { name: 'Marcus Bell', city: 'Glendale, AZ', radius: 30, commissionNo: '2023-118204', commission: '2028-03-14', status: 'active', signings: 212, langs: ['English'], rate: 125, distance: 4.2, phone: '(602) 555-0177', email: 'marcus.bell@example.com', since: 'Mar 2026', onTime: 98, accept: 86, response: '12 min', days: [1, 1, 1, 1, 1, 1, 0], eo: '2027-06-30', bg: 'Verified Jan 2026' },
  { name: 'Rafael Soto', city: 'Peoria, AZ', radius: 30, commissionNo: '2023-104417', commission: '2027-02-19', status: 'active', signings: 74, langs: ['English', 'Spanish'], rate: 115, distance: 7.5, phone: '(623) 555-0131', email: 'rsoto@example.com', since: 'May 2026', onTime: 95, accept: 71, response: '25 min', days: [1, 1, 0, 1, 1, 1, 1], eo: '2027-01-31', bg: 'Verified Apr 2026' },
  { name: 'Elena Ruiz', city: 'Phoenix, AZ', radius: 40, commissionNo: '2022-099311', commission: '2027-01-08', status: 'active', signings: 348, langs: ['English', 'Spanish'], rate: 140, distance: 9.8, phone: '(602) 555-0119', email: 'elena.ruiz@example.com', since: 'Mar 2026', onTime: 99, accept: 64, response: '8 min', days: [1, 1, 1, 1, 0, 0, 0], eo: '2027-09-30', bg: 'Verified Feb 2026' },
  { name: 'Hannah Liu', city: 'Tempe, AZ', radius: 20, commissionNo: '', commission: '', status: 'invited', invitedAt: 'Nov 17', signings: 0, langs: ['English', 'Mandarin'], rate: null, distance: 12.3, phone: '(480) 555-0158', email: 'hliu@example.com', since: 'Nov 2026', onTime: null, accept: null, response: '—', days: [0, 0, 0, 0, 0, 0, 0], eo: '', bg: 'Not started' },
  { name: 'Dana Whitfield', city: 'Scottsdale, AZ', radius: 25, commissionNo: '2025-130088', commission: '2029-08-22', status: 'active', signings: 96, langs: ['English'], rate: 130, distance: 14.1, phone: '(480) 555-0166', email: 'dana.w@example.com', since: 'Jul 2026', onTime: 100, accept: 90, response: '6 min', days: [1, 1, 1, 1, 1, 0, 0], eo: '2028-08-31', bg: 'Verified Jul 2026' },
  { name: 'Tom Okafor', city: 'Mesa, AZ', radius: 35, commissionNo: '2024-121950', commission: '2028-11-02', status: 'active', signings: 157, langs: ['English', 'Igbo'], rate: 120, distance: 18.6, phone: '(480) 555-0124', email: 'tom.okafor@example.com', since: 'Apr 2026', onTime: 93, accept: 80, response: '18 min', days: [0, 1, 1, 1, 1, 1, 1], eo: '2027-11-30', bg: 'Verified Apr 2026' },
].map(n => Object.assign(n, { slug: slugify(n.name) }));
const DRIVERS = [
  { name: 'Darrin Steele', phone: '(961) 757-0272', email: 'darrin.s@example.com', active: true, deliveries: 28, client: 'Auto Concierge' },
  { name: 'Kayla Moss', phone: '(480) 555-0163', email: '', active: true, deliveries: 17, client: 'Summit Auto Group' },
  { name: 'Luis Romero', phone: '(602) 555-0128', email: 'lromero@example.com', active: false, deliveries: 42, client: 'Auto Concierge' },
];
const TEAM = [
  { name: 'Jonathan Means', email: 'jonathan@notarynexxus.example', role: 'Admin', status: 'Active', last: 'Now' },
  { name: 'Priya Shah', email: 'priya@notarynexxus.example', role: 'Scheduler', status: 'Active', last: '12 min ago' },
  { name: 'Carlos Mendez', email: 'carlos@notarynexxus.example', role: 'Scheduler', status: 'Active', last: 'Yesterday' },
];
const ADDRESSES = [
  { street: '1820 E Camelback Rd', city: 'Phoenix', st: 'AZ', zip: '85016' }, { street: '4410 N Scottsdale Rd', city: 'Scottsdale', st: 'AZ', zip: '85251' },
  { street: '7803 W Bluefield Ave', city: 'Glendale', st: 'AZ', zip: '85308' }, { street: '2250 W Southern Ave', city: 'Mesa', st: 'AZ', zip: '85202' },
  { street: '9620 N 7th St', city: 'Phoenix', st: 'AZ', zip: '85020' }, { street: '1530 E Apache Blvd', city: 'Tempe', st: 'AZ', zip: '85281' },
  { street: '3100 S Gilbert Rd', city: 'Chandler', st: 'AZ', zip: '85286' },
];
const DAILY = {
  nov: { label: 'November', orders: [3, 4, 2, 5, 4, 3, 1, 2, 5, 4, 6, 3, 4, 5, 4, 3, 6, 2, 2], signings: [2, 1, 3, 2, 2, 4, 1, 1, 3, 2, 3, 2, 2, 3, 2, 1, 2, 2, 3], revenue: 14280, payouts: 8115, byClient: [7940, 3420, 1710, 950, 260], byType: [6440, 3150, 2800, 1190, 700] },
  oct: { label: 'October', orders: [2, 1, 3, 2, 2, 1, 2, 3, 1, 2, 2, 1, 3, 2, 2, 1, 2, 2, 3, 1, 2, 2, 1, 2, 3, 2, 1, 2, 2, 1, 3], signings: [1, 1, 2, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 2, 0, 1, 1, 2, 1, 1, 1, 0, 1, 2, 1, 1, 1, 2, 1, 2], revenue: 12940, payouts: 7620, byClient: [7100, 3150, 1540, 890, 260], byType: [5800, 2900, 2500, 1100, 640] },
};
const sum = a => a.reduce((x, y) => x + y, 0);

const O = o => Object.assign({ status: 'active', tz: 'MST', flags: [], docs: 0, msgs: 0, unread: 0, invites: [], pastDue: false, st: 'AZ', unit: '', sms: '', email: '', cc: '', orderedBy: '', createdBy: 'Jonathan Means' }, o);
const ORDERS = [
  O({ id: 101262, file: 'HTD-4471', created: 'Nov 18, 2026 · 11:14 AM', date: '2026-11-20', time: null, signer: 'Avery Collins', phone: '(602) 555-0142', email: 'avery.collins@example.com', type: 'Delivery', street: '7803 W Bluefield Ave', city: 'Glendale', zip: '85308', client: 'Auto Concierge', orderedBy: 'Jordan Avery', scheduler: null, notary: null, flags: ['Rush'], docs: 3, msgs: 2, unread: 1,
    vehicle: { year: 2025, make: 'Porsche', model: 'Taycan 4S', vin: 'WP0AB2Y12SSA41877' }, driver: { name: 'Luis Romero', phone: '(602) 555-0128', deactivated: true },
    invites: [
      { name: 'Marcus Bell', pay: 125, status: 'pending', at: 'Nov 18 · 10:37 AM', receipts: [['Email delivered', '10:37 AM'], ['SMS delivered', '10:37 AM'], ['Opened', '10:52 AM']] },
      { name: 'Elena Ruiz', pay: 110, status: 'declined', at: 'Nov 18 · 9:41 AM', note: 'Declined — unavailable Friday' },
      { name: 'Rafael Soto', pay: 110, status: 'expired', at: 'Nov 17 · 4:05 PM', note: 'No reply in 2 hours' }],
    instructions: { client: ['Call the signer 30 minutes before arrival.', 'Gate code 4471 at the community entrance.'], company: ['Scanbacks are due within 2 hours of signing.', 'Photograph the odometer at delivery and upload it to this order.'] },
    docsList: [
      { name: 'Retail installment contract.pdf', kind: 'pdf', pages: 24, size: '3.1 MB', by: 'Jordan Avery · Auto Concierge', at: 'Nov 18, 11:20 AM', ocr: { state: 'done', text: '<b>Signer name and VIN match this order.</b> 6 signature lines and 9 initials found.', sig: 6 } },
      { name: 'Driver license — Avery Collins.jpg', kind: 'img', pages: 1, size: '840 KB', by: 'Jordan Avery · Auto Concierge', at: 'Nov 18, 11:21 AM', ocr: { state: 'done', text: '<b>Name matches the signer.</b> ID valid through Apr 2029.', sig: 0 } },
      { name: 'Delivery checklist.pdf', kind: 'pdf', pages: 2, size: '190 KB', by: 'Jonathan Means', at: 'Nov 18, 11:32 AM', ocr: { state: 'none' } }],
    messages: [
      { who: 'Jordan Avery', org: 'Auto Concierge', tag: 'Client', at: 'Nov 18, 11:22 AM', text: 'Customer asked for the delivery after 4 PM — they get home from work around then.' },
      { who: 'Jonathan Means', org: 'You', tag: 'Client & notary', at: 'Nov 18, 11:40 AM', text: 'Got it. We’ll lock in the time as soon as a notary accepts and confirm here.' }],
    activity: [
      { t: 'Nov 18 · 10:52 AM', txt: '<b>Marcus Bell</b> opened the invite', c: 'ink' }, { t: 'Nov 18 · 10:37 AM', txt: 'Invite sent to <b>Marcus Bell</b> at $125.00', c: 'ink' },
      { t: 'Nov 18 · 9:58 AM', txt: '<b>Elena Ruiz</b> declined the invite', c: 'amber' }, { t: 'Nov 18 · 11:21 AM', txt: '<b>Auto Concierge</b> uploaded 2 documents', c: '' },
      { t: 'Nov 18 · 11:14 AM', txt: 'Order created by <b>Jonathan Means</b>', c: '' }] }),
  O({ id: 101248, file: 'AC-3333', created: 'Nov 17, 2026 · 10:11 PM', date: '2026-11-21', time: '5:00 PM', signer: 'Natalie Brooks', phone: '(602) 555-6009', type: 'Delivery', street: '12055 W Westland Rd', city: 'Peoria', zip: '85383', client: 'Auto Concierge', orderedBy: 'Kim Torres', scheduler: null, notary: null, docs: 2, vehicle: { year: 2026, make: 'Lexus', model: 'RX 350h', vin: '2T2BAMCA6TC031152' }, driver: { name: 'Darrin Steele', phone: '(961) 757-0272' } }),
  O({ id: 101421, file: 'DT-80193', created: 'Nov 18, 2026 · 10:29 PM', date: '2026-12-03', time: '1:30 PM', signer: 'Samuel Ortiz', phone: '(602) 555-0100', type: 'Purchase', street: '200 W Washington St', city: 'Phoenix', zip: '85003', client: 'Desert Title Co.', orderedBy: 'Meredith Lane', scheduler: null, notary: 'Elena Ruiz', flags: ['Scanbacks'], docs: 5, msgs: 1, pay: 140 }),
  O({ id: 101254, file: 'DRV-006', created: 'Nov 16, 2026 · 8:02 PM', date: '2026-11-22', time: '6:00 AM', tz: 'PST', signer: 'Marin Underwood', phone: '(480) 555-0188', type: 'Delivery', street: '650 California St', city: 'San Francisco', st: 'CA', zip: '94111', client: 'Auto Concierge', orderedBy: 'Ray Lindqvist', scheduler: 'Jonathan Means', notary: null, docs: 2, msgs: 4, unread: 2, vehicle: { year: 2025, make: 'BMW', model: 'iX xDrive50', vin: 'WB523CF06SCS40218' }, driver: { name: 'Darrin Steele', phone: '(961) 757-0272' } }),
  O({ id: 101430, file: 'CSE-22817', created: 'Nov 19, 2026 · 9:12 AM', date: '2026-11-19', time: '3:30 PM', signer: 'Grace & Daniel Kim', phone: '(480) 555-0137', type: 'Refinance', street: '4410 N Scottsdale Rd', city: 'Scottsdale', zip: '85251', client: 'Copper State Escrow', orderedBy: 'Victor Huang', scheduler: 'Priya Shah', notary: 'Dana Whitfield', flags: ['Scanbacks'], docs: 7, msgs: 3, pay: 130 }),
  O({ id: 101433, file: 'PL-90412', created: 'Nov 19, 2026 · 10:40 AM', date: null, time: null, signer: 'Robert Hale', phone: '(623) 555-0175', type: 'HELOC', street: '1530 E Apache Blvd', city: 'Tempe', zip: '85281', client: 'Pinnacle Lending', orderedBy: 'Alicia Grant', scheduler: 'Priya Shah', notary: null, msgs: 1, unread: 1 }),
  O({ id: 101418, file: 'DT-77105', created: 'Nov 15, 2026 · 2:48 PM', date: '2026-11-18', time: '6:00 PM', signer: 'Leah Morgan', phone: '(480) 555-0121', type: 'Seller', street: '2250 W Southern Ave', city: 'Mesa', zip: '85202', client: 'Desert Title Co.', orderedBy: 'Paul Whitman', scheduler: 'Jonathan Means', notary: 'Tom Okafor', pastDue: true, docs: 4, pay: 120 }),
  O({ id: 101409, file: 'AC-1187', created: 'Nov 14, 2026 · 4:15 PM', date: '2026-11-19', time: '9:00 AM', signer: 'Chris Valdez', phone: '(602) 555-0149', type: 'Delivery', street: '9620 N 7th St', city: 'Phoenix', zip: '85020', client: 'Auto Concierge', orderedBy: 'Ana Ruiz', scheduler: 'Priya Shah', notary: 'Marcus Bell', pastDue: true, docs: 3, msgs: 1, pay: 125, vehicle: { year: 2026, make: 'Audi', model: 'Q6 e-tron', vin: 'WA1BCBFZ7TP014622' }, driver: { name: 'Kayla Moss', phone: '(480) 555-0163' } }),
  O({ id: 101398, status: 'hold', file: 'PL-90377', created: 'Nov 12, 2026 · 1:02 PM', date: '2026-11-24', time: '11:00 AM', signer: 'Owen Patel', phone: '(480) 555-0190', type: 'Refinance', street: '3100 S Gilbert Rd', city: 'Chandler', zip: '85286', client: 'Pinnacle Lending', orderedBy: 'Mo Haddad', scheduler: 'Priya Shah', notary: null, docs: 1, msgs: 2 }),
  O({ id: 101377, status: 'cancelled', file: 'DT-76990', created: 'Nov 9, 2026 · 9:30 AM', date: '2026-11-14', time: '2:00 PM', signer: 'Jasmine Reed', phone: '(480) 555-0114', type: 'Purchase', street: '880 N Val Vista Dr', city: 'Gilbert', zip: '85234', client: 'Desert Title Co.', orderedBy: 'Sasha Green', scheduler: 'Carlos Mendez', notary: 'Elena Ruiz', docs: 3, msgs: 1 }),
  O({ id: 101392, status: 'cancelled', file: 'SAG-0412', created: 'Nov 11, 2026 · 3:44 PM', date: '2026-11-15', time: '10:30 AM', signer: 'Ethan Cole', phone: '(623) 555-0102', type: 'Delivery', street: '15640 W Bell Rd', city: 'Surprise', zip: '85374', client: 'Summit Auto Group', orderedBy: 'Ben Whitaker', scheduler: 'Priya Shah', notary: null, docs: 1 }),
  O({ id: 101405, status: 'completed', file: 'CSE-22801', created: 'Nov 14, 2026 · 10:05 AM', date: '2026-11-19', time: '11:00 AM', signer: 'Ava Thompson', phone: '(480) 555-0161', type: 'Refinance', street: '8125 E Indian Bend Rd', city: 'Scottsdale', zip: '85250', client: 'Copper State Escrow', orderedBy: 'Liz Romero', scheduler: 'Carlos Mendez', notary: 'Dana Whitfield', docs: 6, msgs: 2, pay: 130 }),
  O({ id: 101401, status: 'completed', file: 'CSE-22790', created: 'Nov 13, 2026 · 8:20 AM', date: '2026-11-18', time: '10:00 AM', signer: 'Maya Fischer', phone: '(480) 555-0153', type: 'Refinance', street: '2950 W Ray Rd', city: 'Chandler', zip: '85224', client: 'Copper State Escrow', orderedBy: 'Victor Huang', scheduler: 'Priya Shah', notary: 'Dana Whitfield', docs: 8, msgs: 2, pay: 130 }),
  O({ id: 101396, status: 'completed', file: 'AC-1170', created: 'Nov 12, 2026 · 6:05 PM', date: '2026-11-17', time: '4:30 PM', signer: 'Noah Bennett', phone: '(602) 555-0166', type: 'Delivery', street: '4725 E Indian School Rd', city: 'Phoenix', zip: '85018', client: 'Auto Concierge', orderedBy: 'Jordan Avery', scheduler: 'Jonathan Means', notary: 'Marcus Bell', docs: 4, msgs: 3, pay: 125 }),
  O({ id: 101390, status: 'completed', file: 'DT-77011', created: 'Nov 10, 2026 · 11:48 AM', date: '2026-11-16', time: '1:00 PM', signer: 'Sophia Turner', phone: '(480) 555-0181', type: 'Purchase', street: '7014 E Camelback Rd', city: 'Scottsdale', zip: '85251', client: 'Desert Title Co.', orderedBy: 'Meredith Lane', scheduler: 'Carlos Mendez', notary: 'Elena Ruiz', docs: 6, msgs: 1, pay: 140 }),
  O({ id: 101385, status: 'completed', file: 'DT-76952', created: 'Nov 9, 2026 · 2:15 PM', date: '2026-11-14', time: '11:30 AM', signer: 'Liam Brooks', phone: '(480) 555-0144', type: 'Seller', street: '1020 E Baseline Rd', city: 'Gilbert', zip: '85233', client: 'Desert Title Co.', orderedBy: 'Paul Whitman', scheduler: 'Priya Shah', notary: 'Tom Okafor', docs: 4, pay: 120 }),
  O({ id: 101379, status: 'completed', file: 'SAG-0398', created: 'Nov 8, 2026 · 5:30 PM', date: '2026-11-13', time: '3:00 PM', signer: 'Isabella Grant', phone: '(623) 555-0170', type: 'Delivery', street: '10255 W McDowell Rd', city: 'Avondale', zip: '85392', client: 'Summit Auto Group', orderedBy: 'Cara Doyle', scheduler: 'Jonathan Means', notary: 'Rafael Soto', docs: 3, msgs: 1, pay: 115 }),
];
const ALERTS = [
  { key: 'noNotary', label: 'No notary assigned', icon: 'userx', test: o => !o.notary },
  { key: 'pastDue', label: 'Not marked complete', icon: 'pen', test: o => o.pastDue },
  { key: 'noScheduler', label: 'No scheduler assigned', icon: 'headset', test: o => !o.scheduler },
  { key: 'missingTime', label: 'Missing date or time', icon: 'calx', test: o => !o.date || !o.time },
];
const STAGES = [
  { key: 'notary', label: 'Needs a notary', desc: 'Invite or assign someone', q: 0 },
  { key: 'schedule', label: 'Needs scheduling', desc: 'Missing scheduler, date or time', q: 1 },
  { key: 'ready', label: 'Ready to sign', desc: 'Everything is set', q: 2 },
  { key: 'complete', label: 'Awaiting completion', desc: 'Signing time has passed', q: 3 },
];

/* =========================================================
   STATE
   ========================================================= */
const emptyDraft = () => ({ client: '', type: '', file: '', orderedBy: '', cc: '', flags: [], signer: '', phone: '', email: '', sms: '', smsSame: false, date: '', time: '', tz: 'Arizona (MST)', street: '', unit: '', city: '', st: '', zip: '', year: '', make: '', model: '', vin: '', driver: '', scheduler: '', notes: '', docs: [] });
const S = {
  orders: ORDERS, clients: CLIENTS, notaries: NOTARIES, drivers: DRIVERS, team: TEAM,
  tab: 'active', alert: null, q: '', sort: 'attention', dir: 1, types: new Set(), clientsF: new Set(), sel: new Set(),
  view: store.get('nn-view') === 'board' ? 'board' : 'table',
  overview: store.get('nn-overview') !== 'hidden',
  collapsed: store.get('nn-collapsed') === '1',
  showDeactivated: false, driverQ: '', clientQ: '', clientCat: 'All', notaryQ: '', notaryF: 'All', period: 'nov',
  pick: {}, pay: {}, ntQ: {}, draft: emptyDraft(), nextId: 101434, notifRead: false, counted: false,
  ws: { name: 'Notary Nexxus Demo', tz: 'Arizona (MST)', scanHours: 2, rush: 50, scan: 25, fees: { Delivery: 175, Purchase: 225, Refinance: 200, Seller: 175, HELOC: 150 } },
  me: { first: 'Jonathan', last: 'Means', email: 'jonathan@notarynexxus.example', phone: '(602) 555-0100', tz: 'Arizona (MST)' },
  notif: { newOrder: [1, 0, 1], declined: [1, 1, 1], overdue: [1, 1, 1], docs: [0, 0, 1], digest: [1, 0, 0] },
  sec: { twoStep: true, google: true, timeout: '30 minutes' },
  sessions: [{ dev: 'MacBook Pro · Chrome', where: 'Phoenix, AZ', when: 'This device', cur: true, icon: 'laptop' }, { dev: 'iPhone 16 · Safari', where: 'Phoenix, AZ', when: '2 hours ago', icon: 'smartphone' }, { dev: 'Windows · Edge', where: 'Tempe, AZ', when: 'Nov 12', icon: 'laptop' }],
};

/* =========================================================
   ORDER LOGIC
   ========================================================= */
const checksOf = o => [!!o.notary, !!o.scheduler, !!(o.date && o.time), o.status === 'completed'];
const needsOf = o => o.status !== 'active' ? 0 : ALERTS.filter(a => a.test(o)).length;
const stageOf = o => !o.notary ? 'notary' : o.pastDue ? 'complete' : (!o.scheduler || !o.date || !o.time) ? 'schedule' : 'ready';
const byId = id => S.orders.find(o => String(o.id) === String(id));
const clientBy = name => S.clients.find(c => c.name === name);
const notaryBy = name => S.notaries.find(n => n.name === name);
const pendingInvite = o => (o.invites || []).find(i => i.status === 'pending');
const addr1 = o => o.street + (o.unit ? ', ' + o.unit : '');
const addr2 = o => `${o.city}, ${o.st} ${o.zip}`.trim();
const statusLabel = s => ({ active: 'Active', hold: 'On hold', completed: 'Completed', cancelled: 'Cancelled', deleted: 'Deleted' }[s]);
const tabName = t => ({ active: 'Active', hold: 'On hold', cancelled: 'Cancelled', completed: 'Completed', deleted: 'Deleted' }[t]);
const mapsUrl = o => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr1(o) + ', ' + addr2(o));
const clientLink = name => { const c = clientBy(name); return c ? `<a class="name-link" href="#/clients/${c.slug}">${esc(name)}</a>` : esc(name); };
const notaryLink = name => { const n = notaryBy(name); return n ? `<a class="name-link" href="#/notaries/${n.slug}">${esc(name)}</a>` : esc(name); };
function feesFor(o) {
  const c = clientBy(o.client); const fee = (c && c.fees[o.type]) || S.ws.fees[o.type] || 175;
  const rush = o.flags.includes('Rush') ? S.ws.rush : 0, scan = o.flags.includes('Scanbacks') ? S.ws.scan : 0;
  const pend = pendingInvite(o); const pay = o.pay || (pend && pend.pay) || 0;
  return { fee, rush, scan, rev: fee + rush + scan, pay, profit: fee + rush + scan - pay };
}
const pushActivity = (o, txt, c = 'ink') => { ensureDetail(o); o.activity.unshift({ t: 'Just now', txt, c }); };
function ensureDetail(o) {
  if (o._d) return o;
  const pool = {
    Delivery: [['Retail installment contract.pdf', 'pdf', 22], ['Odometer statement.pdf', 'pdf', 1], ['Photo ID — signer.jpg', 'img', 1], ['Delivery checklist.pdf', 'pdf', 2]],
    Purchase: [['Closing disclosure.pdf', 'pdf', 5], ['Deed of trust.pdf', 'pdf', 18], ['Promissory note.pdf', 'pdf', 6], ['Photo ID — signer.jpg', 'img', 1], ['Scanback checklist.pdf', 'pdf', 1], ['Settlement statement.pdf', 'pdf', 3]],
    Refinance: [['Loan package.pdf', 'pdf', 112], ['Closing disclosure.pdf', 'pdf', 5], ['Right to cancel.pdf', 'pdf', 2], ['Photo ID — borrower.jpg', 'img', 1], ['Photo ID — co-borrower.jpg', 'img', 1], ['Scanback checklist.pdf', 'pdf', 1], ['First payment letter.pdf', 'pdf', 1], ['Title commitment.pdf', 'pdf', 9]],
    Seller: [['Seller package.pdf', 'pdf', 26], ['Warranty deed.pdf', 'pdf', 3], ['Photo ID — seller.jpg', 'img', 1], ['Affidavit of value.pdf', 'pdf', 2]],
    HELOC: [['HELOC agreement.pdf', 'pdf', 34], ['Photo ID — borrower.jpg', 'img', 1]],
  }[o.type] || [];
  const day = o.created.split(' · ')[0].replace(', 2026', '');
  if (!o.docsList) o.docsList = pool.slice(0, o.docs).map(([name, kind, pages], i) => ({ name, kind, pages, size: kind === 'img' ? '760 KB' : (pages * 0.12 + 0.2).toFixed(1) + ' MB', by: `${i === 0 ? (o.orderedBy || 'Client') + ' · ' : ''}${o.client}`, at: day, ocr: i < 2 ? { state: 'done', sig: kind === 'img' ? 0 : Math.max(2, Math.round(pages / 4)), text: kind === 'img' ? '<b>Name matches the signer.</b> ID is valid.' : `<b>Signer name matches this order.</b> ${Math.max(2, Math.round(pages / 4))} signature lines found.` } : { state: 'none' } }));
  if (!o.messages) {
    const lines = [[o.orderedBy || 'Client contact', o.client, 'Client', 'Please confirm the notary once assigned — the signer prefers text updates.'], ['Priya Shah', 'You', 'Internal', 'Signer confirmed by phone. Street parking is available.'], [o.notary || 'Notary', 'Notary', 'Notary', 'On my way — ETA 15 minutes.'], [o.orderedBy || 'Client contact', o.client, 'Client', 'Thanks! Scanbacks look good.']];
    o.messages = lines.slice(0, o.msgs).map(([who, org, tag, text], i) => ({ who, org, tag, at: `${fmtDate(o.date || TODAY, { month: 'short', day: 'numeric' })}, ${['9:12 AM', '10:05 AM', '12:48 PM', '1:30 PM'][i]}`, text }));
  }
  if (!o.activity) {
    const a = [], t = o.created.replace(', 2026', '');
    if (o.status === 'completed') a.push({ t: fmtDate(o.date, { month: 'short', day: 'numeric' }) + ' · ' + (o.time || ''), txt: `Signing completed by <b>${esc(o.notary)}</b>`, c: 'foil' });
    if (o.notary) a.push({ t, txt: `<b>${esc(o.notary)}</b> accepted the invite`, c: 'green' });
    if (o.scheduler) a.push({ t, txt: `Scheduler set to <b>${esc(o.scheduler)}</b>`, c: 'ink' });
    if (o.docs) a.push({ t, txt: `<b>${esc(o.client)}</b> uploaded ${o.docs} document${o.docs > 1 ? 's' : ''}`, c: '' });
    a.push({ t, txt: `Order created by <b>${esc(o.createdBy)}</b>`, c: '' });
    o.activity = a;
  }
  if (!o.instructions) o.instructions = { client: [o.type === 'Delivery' ? 'Confirm the delivery window with the signer the morning of.' : 'Signer must bring a second form of ID.'], company: [`Scanbacks are due within ${S.ws.scanHours} hours of signing.`] };
  o._d = true; return o;
}

/* =========================================================
   SEAL
   ========================================================= */
const polar = (cx, cy, r, a) => { const rad = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; };
const f2 = n => n.toFixed(2);
function arc(cx, cy, r, a0, a1) { const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1); return `M${f2(x0)} ${f2(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f2(x1)} ${f2(y1)}`; }
const scCache = {};
function scallop(n) {
  if (scCache[n]) return scCache[n];
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = i / n * 360, a1 = (i + 1) / n * 360, p = polar(50, 50, 45, a0), m = polar(50, 50, 51, (a0 + a1) / 2), q = polar(50, 50, 45, a1);
    if (!i) d += `M${f2(p[0])} ${f2(p[1])} `;
    d += `Q${f2(m[0])} ${f2(m[1])} ${f2(q[0])} ${f2(q[1])} `;
  }
  return (scCache[n] = d + 'Z');
}
const SEG = ['Notary', 'Scheduler', 'Date & time', 'Completed'];
const sealTip = ch => esc(`<b>${ch.filter(Boolean).length} of 4 done</b><br>` + ch.map((ok, i) => `<span class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '○'}</span> ${SEG[i]}`).join('<br>'));
function seal(ch, size = 34, { draw = false, center = false, tip = true } = {}) {
  const done = ch.filter(Boolean).length, complete = done === 4, gap = 12;
  const segs = ch.map((ok, i) => `<path class="seg${ok ? ' on' : ''}" d="${arc(50, 50, 33, i * 90 + gap / 2, (i + 1) * 90 - gap / 2)}" pathLength="100" style="--d:${i * 140}ms"/>`).join('');
  const mid = complete ? '<path class="ck" d="M38 51l8.5 8.5L63 42" pathLength="60"/>' : center ? `<text class="n" x="50" y="56">${done}</text><text class="of" x="50" y="68">OF 4</text>` : '';
  const cls = `seal${complete ? ' complete' : ''}${draw ? (window.gsap && !reduceMotion() ? ' gs-draw' : ' css-draw') : ''}`;
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${done} of 4 steps done"${tip ? ` data-tip="${sealTip(ch)}"` : ''}><path class="edge" d="${scallop(size > 60 ? 30 : 20)}"/><circle class="inner" cx="50" cy="50" r="24"/>${segs}${mid}</svg>`;
}
function quad(i, on = true, complete = false) {
  const segs = [0, 1, 2, 3].map(k => `<path class="${k === i && on ? 'on' : ''}" d="${arc(12, 12, 8, k * 90 + 8, (k + 1) * 90 - 8)}"/>`).join('');
  return `<svg class="q${complete ? ' complete' : ''}" viewBox="0 0 24 24" aria-hidden="true">${segs}</svg>`;
}

/* =========================================================
   MOTION (GSAP — optional, reduced-motion aware)
   ========================================================= */
const M = {
  ok: () => !!window.gsap && !reduceMotion(),
  page(root) {
    if (!M.ok()) return;
    const kids = Array.from(root.children).slice(0, 8);
    gsap.from(kids, { y: 12, autoAlpha: 0, duration: .45, ease: 'power3.out', stagger: .05, clearProps: 'transform,opacity,visibility' });
    M.seals(root);
  },
  seals(root = document) {
    if (!M.ok()) return;
    $$('.seal.gs-draw', root).forEach(svg => {
      svg.classList.remove('gs-draw');
      const on = $$('.seg.on', svg), ck = $('.ck', svg);
      gsap.fromTo(on, { strokeDasharray: 100, strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: .7, ease: 'power2.out', stagger: .13 });
      if (ck) {
        gsap.fromTo(ck, { strokeDasharray: 60, strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: .45, delay: .5, ease: 'power2.out' });
        gsap.fromTo(svg, { scale: .9, rotate: -8 }, { scale: 1, rotate: 0, duration: .9, delay: .35, ease: 'elastic.out(1, .55)', transformOrigin: '50% 50%' });
      }
    });
  },
  rows(root) {
    if (!M.ok() || !root) return;
    const els = $$('tbody tr:not(.grp), .ocard, .bcard', root).slice(0, 16);
    gsap.from(els, { y: 6, autoAlpha: 0, duration: .32, ease: 'power2.out', stagger: .022, clearProps: 'transform,opacity,visibility' });
  },
  count(root = document) {
    $$('[data-count]', root).forEach(el => {
      const to = +el.dataset.count, fmt = el.dataset.fmt;
      const out = v => fmt === 'money' ? money(Math.round(v), 0) : Math.round(v).toLocaleString('en-US');
      if (!M.ok()) { el.textContent = out(to); return; }
      const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.1, ease: 'power2.out', onUpdate: () => { el.textContent = out(o.v); } });
    });
  },
  bars(root) {
    if (!M.ok()) return;
    gsap.from($$('.cols .col i', root), { scaleY: 0, duration: .6, ease: 'power3.out', stagger: .015, transformOrigin: 'bottom' });
    gsap.from($$('.hb .tr i', root), { scaleX: 0, duration: .7, ease: 'power3.out', stagger: .06, transformOrigin: 'left' });
  },
  pop(el, scale = .6) { if (M.ok() && el) gsap.fromTo(el, { scale }, { scale: 1, duration: .4, ease: 'back.out(3)' }); },
  flash(el) { if (M.ok() && el) gsap.fromTo(el, { backgroundColor: 'var(--ink-soft)' }, { backgroundColor: 'transparent', duration: 1.2, ease: 'power1.out', clearProps: 'backgroundColor' }); },
  menuIn(el) { if (M.ok()) gsap.from(el, { autoAlpha: 0, y: -4, scale: .98, duration: .16, ease: 'power2.out' }); },
  overlayIn(wrap, panelSel, from) {
    if (!M.ok()) return;
    gsap.from($('.modal-scrim,.palette-scrim,.drawer-scrim', wrap), { autoAlpha: 0, duration: .2 });
    gsap.from($(panelSel, wrap), Object.assign({ duration: .32, ease: 'power3.out' }, from));
  },
  overlayOut(wrap, panelSel, to, done) {
    if (!M.ok()) { done(); return; }
    gsap.to($('.modal-scrim,.palette-scrim,.drawer-scrim', wrap), { autoAlpha: 0, duration: .18 });
    gsap.to($(panelSel, wrap), Object.assign({ duration: .2, ease: 'power2.in', onComplete: done }, to));
  },
  swap(el) { if (M.ok() && el) gsap.from(el, { autoAlpha: 0, x: 10, duration: .25, ease: 'power2.out' }); },
  collapse(el, done) { if (!M.ok() || !el) { done(); return; } gsap.to(el, { height: 0, autoAlpha: 0, marginTop: 0, marginBottom: 0, duration: .35, ease: 'power2.inOut', onComplete: done }); },
  expand(el) { if (M.ok() && el) gsap.from(el, { height: 0, autoAlpha: 0, duration: .4, ease: 'power2.out', clearProps: 'height,opacity,visibility' }); },
};

/* =========================================================
   TOOLTIP
   ========================================================= */
let tipEl = null;
function hideTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
function showTip(t) {
  hideTip();
  tipEl = document.createElement('div'); tipEl.className = 'tip'; tipEl.setAttribute('role', 'tooltip');
  tipEl.innerHTML = t.getAttribute('data-tip'); tipEl._for = t; document.body.appendChild(tipEl);
  const r = t.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  let x = r.left + r.width / 2 - w / 2, y = r.top - h - 8;
  if (y < 8) y = r.bottom + 8;
  x = Math.max(8, Math.min(x, innerWidth - w - 8));
  tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px';
  if (M.ok()) gsap.from(tipEl, { autoAlpha: 0, y: 3, duration: .14 });
}
document.addEventListener('mouseover', e => {
  const t = e.target.closest && e.target.closest('[data-tip]');
  if (!t) { hideTip(); return; }
  if (!tipEl || tipEl._for !== t) showTip(t);
});
document.addEventListener('scroll', hideTip, { passive: true, capture: true });

/* =========================================================
   TOASTS
   ========================================================= */
function toast(msg, opts = {}) {
  const host = $('#toasts');
  while (host.children.length > 2) host.firstChild.remove();
  const el = document.createElement('div');
  el.className = 'toast' + (opts.warn ? ' warn' : '') + (M.ok() ? '' : ' css-in');
  el.setAttribute('role', 'status');
  const act = opts.undo ? { label: 'Undo', fn: opts.undo } : opts.action;
  el.innerHTML = `${icon(opts.icon || (opts.warn ? 'alert' : 'circlecheck'), 16)}<span class="tx">${msg}</span>${act ? `<button type="button">${esc(act.label)}</button>` : ''}`;
  host.appendChild(el);
  if (M.ok()) gsap.from(el, { y: 16, autoAlpha: 0, scale: .98, duration: .35, ease: 'power3.out' });
  const kill = () => { if (!el.isConnected) return; if (M.ok()) gsap.to(el, { y: 8, autoAlpha: 0, duration: .2, onComplete: () => el.remove() }); else el.remove(); };
  if (act) el.querySelector('button').addEventListener('click', () => { act.fn(); kill(); });
  setTimeout(kill, act ? 6000 : 3600);
}

/* =========================================================
   MENUS (content resolved by menuHTML in app.js)
   ========================================================= */
let menuEl = null, menuBtn = null;
function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); menuBtn = null; } }
const mi = (label, attrs, ic, cls = '', right = '') => `<button type="button" class="mi ${cls}" role="menuitem" ${attrs}>${ic ? icon(ic, 15) : ''}<span>${label}</span>${right ? `<span class="r">${right}</span>` : ''}</button>`;
function openMenu(btn, key) {
  if (menuBtn === btn) { closeMenu(); return; }
  closeMenu(); hideTip();
  const el = document.createElement('div');
  el.className = 'menu' + (key === 'notifs' ? ' wide' : ''); el.setAttribute('role', 'menu'); el.dataset.key = key; el.dataset.y = scrollY;
  el.innerHTML = menuHTML(key);
  document.body.appendChild(el);
  const r = btn.getBoundingClientRect(), mw = el.offsetWidth, mh = el.offsetHeight;
  let left = r.right - mw; if (left < 8) left = Math.min(r.left, innerWidth - mw - 8);
  let top = r.bottom + 6; if (top + mh > innerHeight - 8) top = Math.max(8, r.top - mh - 6);
  el.style.left = Math.max(8, left) + 'px'; el.style.top = top + 'px';
  menuEl = el; menuBtn = btn; btn.setAttribute('aria-expanded', 'true');
  M.menuIn(el);
  const f = el.querySelector('.mi, input'); if (f && key !== 'notifs') f.focus({ preventScroll: true });
}

/* =========================================================
   MODAL
   ========================================================= */
let modal = null;
function openModal({ title, desc = '', body, foot = '', size = '', onSubmit, onOpen }) {
  closeModal(true); closeMenu(); hideTip();
  const prev = document.activeElement;
  const w = document.createElement('div'); w.className = 'modal-wrap';
  w.innerHTML = `<div class="modal-scrim" data-action="close-modal"></div><form class="modal ${size}" role="dialog" aria-modal="true" aria-labelledby="modal-title" novalidate data-form="modal">
    <div class="modal-head"><div style="flex:1;min-width:0"><h2 id="modal-title">${title}</h2>${desc ? `<p>${desc}</p>` : ''}</div><button type="button" class="icon-btn sm" data-action="close-modal" aria-label="Close">${icon('x', 16)}</button></div>
    <div class="modal-body">${body}</div>${foot === false ? '' : `<div class="modal-foot">${foot}</div>`}</form>`;
  document.body.appendChild(w); document.body.classList.add('no-scroll');
  modal = { el: w, onSubmit, prev };
  M.overlayIn(w, '.modal', { y: 16, scale: .98, autoAlpha: 0 });
  const f = w.querySelector('.modal-body input:not([type=hidden]):not([disabled]), .modal-body select, .modal-body textarea, .modal-foot .btn-primary'); if (f) f.focus({ preventScroll: true });
  if (onOpen) onOpen(w);
}
function closeModal(instant) {
  if (!modal) return;
  const { el, prev } = modal; modal = null;
  if (!$('.drawer-wrap')) document.body.classList.remove('no-scroll');
  const done = () => { el.remove(); if (prev && prev.isConnected) prev.focus({ preventScroll: true }); };
  if (instant) done(); else M.overlayOut(el, '.modal', { y: 10, autoAlpha: 0 }, done);
}
function validate(form) {
  let bad = null;
  $$('[data-required]', form).forEach(inp => {
    if (inp.closest('.hidden')) return;
    const v = inp.value.trim(), f = inp.closest('.field');
    const wrong = !v || (inp.type === 'email' && !isEmail(v)) || (inp.dataset.phone !== undefined && v.replace(/\D/g, '').length !== 10);
    if (f) f.classList.toggle('invalid', wrong);
    if (wrong && !bad) bad = inp;
  });
  if (bad) { bad.focus(); if (M.ok()) gsap.fromTo(bad.closest('.field') || bad, { x: -4 }, { x: 0, duration: .4, ease: 'elastic.out(1, .3)' }); }
  return !bad;
}
const formData = form => Object.fromEntries(new FormData(form).entries());
/* field helper used by modals + form pages */
function fld(name, label, { type = 'text', value = '', req = false, ph = '', help = '', err = '', attrs = '', icon: ic = '', opt = !req } = {}) {
  const inp = `<input class="input" id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(ph)}" ${req ? 'data-required aria-required="true"' : ''} ${type === 'tel' ? 'data-phone inputmode="tel"' : ''} ${attrs}>`;
  return `<div class="field" data-f="${name}"><label class="label" for="f-${name}">${label}${req ? ' <span class="star" aria-hidden="true">*</span>' : opt ? ' <span class="opt">optional</span>' : ''}</label>${ic ? `<div class="iw">${icon(ic, 15)}${inp}</div>` : inp}${help ? `<div class="help">${help}</div>` : ''}${req ? `<div class="field-err">${icon('alert', 13)}${err || 'This field is required'}</div>` : ''}</div>`;
}
function sel(name, label, options, value = '', { req = false, attrs = '' } = {}) {
  return `<div class="field" data-f="${name}"><label class="label" for="f-${name}">${label}${req ? ' <span class="star">*</span>' : ''}</label><div class="sw"><select class="select" id="f-${name}" name="${name}" ${attrs}>${options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>${icon('down', 15)}</div></div>`;
}
function confirmModal({ title, desc, confirm = 'Confirm', danger = false, onConfirm }) {
  openModal({ title, desc, size: 'sm', body: '', foot: `<button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn ${danger ? 'btn-danger-solid' : 'btn-primary'}">${esc(confirm)}</button>`, onSubmit: () => { onConfirm(); } });
  $('.modal-body').remove();
}

/* Engraved guilloche rosette (certificate/banknote motif) */
let gCache = null;
function guilloche() {
  if (gCache) return gCache;
  let d = '';
  for (let k = 0; k < 48; k++) {
    const rot = k / 48 * Math.PI, pts = [];
    for (let t = 0; t <= 360; t += 4) {
      const a = t * Math.PI / 180, r = 180 + 34 * Math.sin(a * 7), x = r * Math.cos(a), y = r * Math.sin(a) * .42;
      pts.push((x * Math.cos(rot) - y * Math.sin(rot) + 250).toFixed(1) + ' ' + (x * Math.sin(rot) + y * Math.cos(rot) + 250).toFixed(1));
    }
    d += 'M' + pts.join('L') + 'Z';
  }
  return (gCache = `<svg class="guilloche" viewBox="0 0 500 500" aria-hidden="true"><path d="${d}"/></svg>`);
}
/* Sliding underline for list tabs */
const inkPrev = {};
function placeInk() {
  $$('.seg-ctl.slide').forEach((g, gi) => {
    let ink = $(':scope > .tab-ink', g); if (!ink) { ink = document.createElement('span'); ink.className = 'tab-ink'; g.insertBefore(ink, g.firstChild); }
    const act = $(':scope > button.active', g); if (!act) { ink.style.opacity = '0'; return; }
    ink.style.opacity = '1';
    const left = act.offsetLeft, width = act.offsetWidth, key = location.hash.split('?')[0] + '|' + gi, prev = inkPrev[key];
    ink.style.left = left + 'px'; ink.style.width = width + 'px';
    if (prev && M.ok() && (prev.left !== left || prev.width !== width)) gsap.fromTo(ink, { left: prev.left, width: prev.width }, { left, width, duration: .42, ease: 'power3.out' });
    inkPrev[key] = { left, width };
  });
}
/* Brief working state on buttons that commit something */
function busy(btn, fn, ms = 450) { if (!btn || reduceMotion()) { fn(); return; } btn.classList.add('loading'); btn.setAttribute('aria-busy', 'true'); setTimeout(() => { btn.classList.remove('loading'); btn.removeAttribute('aria-busy'); fn(); }, ms); }

/* Timeline + progress-track motion */
M.day = root => {
  if (!M.ok()) return; const t = $('.day-track', root); if (!t) return;
  gsap.from($('.day-past', t), { width: 0, duration: 1.1, ease: 'power2.out' });
  gsap.from($('.day-now', t), { scaleY: 0, duration: .5, delay: .7, ease: 'back.out(2.5)' });
  $$('.dm', t).forEach((m, i) => gsap.from(m.children, { autoAlpha: 0, y: m.classList.contains('dn') ? 10 : -6, duration: .45, delay: .3 + i * .1, stagger: .05, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }));
};
M.track = root => {
  if (!M.ok()) return; const t = $('.track', root); if (!t) return;
  gsap.from($('.track-line', t), { scaleX: 0, transformOrigin: 'left center', duration: .9, ease: 'power2.inOut' });
  gsap.from($$('.tnode', t), { scale: .3, autoAlpha: 0, duration: .5, stagger: .14, delay: .15, ease: 'back.out(2.5)', clearProps: 'transform,opacity,visibility' });
};
M.meters = root => { if (M.ok()) gsap.from($$('.mbar i, .left-bar i, .tk-split i', root), { scaleX: 0, transformOrigin: 'left center', duration: .8, stagger: .03, ease: 'power3.out' }); };
const pageMotion = M.page;
M.page = root => { pageMotion(root); M.day(root); M.track(root); M.meters(root); };

/* ---- V2 motion polish: stop CSS transitions fighting GSAP, keep the pill thumb in place ---- */
const quiet = els => { els = [].concat(els).filter(Boolean); els.forEach(e => e.classList && e.classList.add('gs-busy')); return () => els.forEach(e => e.classList && e.classList.toggle('gs-busy', false)); };
M.rows = root => {
  if (!M.ok() || !root) return;
  const els = $$('tbody tr:not(.grp), .ocard, .bcard, .ccard, .ncard, .drv', root).slice(0, 16); if (!els.length) return;
  const done = quiet(els);
  gsap.fromTo(els, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .34, ease: 'power2.out', stagger: .025, overwrite: true, clearProps: 'transform,opacity,visibility', onComplete: done });
};
const pageIn = M.page;
M.page = root => { const done = quiet(Array.from(root.children).slice(0, 8).concat($$('.tile,.ccard,.ncard,.nq-row,.td-row', root))); pageIn(root); setTimeout(done, 900); };
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => placeInk());
if (window.ResizeObserver) { let raf = 0; new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => placeInk()); }).observe(document.documentElement); }
