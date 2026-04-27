(() => {
  const data = window.PRESS_DATA;
  if (!data) throw new Error('Falta data.js: window.PRESS_DATA no esta definido.');

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

  const countryEntries = Object.entries(data.countries || {});
  const themeEntries = Object.entries(data.themes || {});
  let activeCountry = 'all';
  let activeTheme = null;
  let searchTerm = '';
  let activeCoverCountry = 'all';
  let lbCur = 0;
  let lbFiltered = [];

  function country(code) { return data.countries[code] || { name: code, flag: '', color: '#888' }; }
  function theme(code) { return data.themes[code] || { label: code, className: '', color: '#888' }; }

  function renderHeader() {
    const countriesCount = countryEntries.length;
    const coversCount = (data.covers || []).length;
    const topicsCount = (data.summary || []).reduce((a,g) => a + (g.topics || []).length, 0) || (data.news || []).length;
    $('#hdr').innerHTML = `
      <div class="hdr-brand"><div class="hdr-dot"></div><div><div style="font-size:9px;letter-spacing:3px;color:var(--accent);text-transform:uppercase;margin-bottom:4px;">${esc(data.edition.eyebrow)}</div><div class="hdr-title">${esc(data.edition.title)} <span>${esc(data.edition.titleAccent)}</span></div></div></div>
      <div class="hdr-right"><div class="hdr-date">${esc(data.edition.dateLabel)}</div><div class="hdr-meta">${countriesCount} paises · ${coversCount} portadas · ${topicsCount} temas</div><div style="display:flex;gap:16px;margin-top:8px;justify-content:flex-end;"><div style="text-align:center;"><div class="hdr-count">${coversCount}</div><div style="font-size:9px;color:var(--muted);">portadas</div></div><div style="text-align:center;"><div class="hdr-count">${topicsCount}</div><div style="font-size:9px;color:var(--muted);">temas</div></div><div style="text-align:center;"><div class="hdr-count">${countriesCount}</div><div style="font-size:9px;color:var(--muted);">paises</div></div></div></div>`;
    $('#footer').innerHTML = `<div class="ftr-brand"><strong>${esc((data.edition.footerBrand || '').split(' · ')[0])}</strong>${esc((data.edition.footerBrand || '').includes(' · ') ? ' · ' + (data.edition.footerBrand || '').split(' · ').slice(1).join(' · ') : '')}</div><div class="ftr-note">${esc(data.edition.footerNote)} · ${coversCount} portadas</div>`;
  }

  function renderTicker() {
    const items = data.ticker || [];
    $('#ticker').innerHTML = [...items, ...items].map(i => `<span class="t-item"><span class="t-flag">${esc(i[0])}</span>${esc(i[1])}<span class="t-sep">|</span></span>`).join('');
  }

  function switchTab(id) {
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $('#tab-' + id).classList.add('active');
    $(`.tab-btn[data-tab="${id}"]`).classList.add('active');
  }

  function renderCross() {
    $('#cross-grid').innerHTML = (data.crossTopics || []).map((c, idx) => `<div class="cross-card" data-cross="${idx}"><div class="cross-icon">${esc(c.icon)}</div><div class="cross-body"><div class="cross-label">${esc(c.label)}</div><div class="cross-text">${esc(c.text)}</div><div class="cross-flags">${esc(c.flags)}</div></div><div class="cross-badge">${esc(c.badge)}</div></div>`).join('');
    $$('#cross-grid .cross-card').forEach(el => el.addEventListener('click', () => {
      const c = data.crossTopics[Number(el.dataset.cross)];
      if (!c || !c.action) return;
      if (c.action.type === 'theme') filterTheme(c.action.value);
      if (c.action.type === 'search') { searchTerm = c.action.value; $('#searchInput').value = searchTerm; renderNews(); }
    }));
  }

  function renderFilters() {
    $('#country-filters').innerHTML = `<button class="fbt active" data-country="all">🌎 Todos</button>` + countryEntries.map(([code,c]) => `<button class="fbt" data-country="${code}"><span class="fbt-flag">${esc(c.flag)}</span> ${esc(c.name)}</button>`).join('');
    $('#theme-filters').innerHTML = themeEntries.map(([code,t]) => `<button class="fbt" data-theme="${code}" style="color:${esc(t.color)}">● ${esc(t.label)}</button>`).join('');
    $$('#country-filters .fbt').forEach(btn => btn.addEventListener('click', () => filterCountry(btn.dataset.country)));
    $$('#theme-filters .fbt').forEach(btn => btn.addEventListener('click', () => filterThemeButton(btn.dataset.theme)));
    $('#searchInput').addEventListener('input', e => { searchTerm = e.target.value; renderNews(); });
  }

  function renderNews() {
    const q = searchTerm.toLowerCase();
    let visible = 0;
    $('#news-grid').innerHTML = (data.news || []).map(n => {
      const c = country(n.country);
      const t = theme(n.theme);
      const hit = activeCountry === 'all' || n.country === activeCountry;
      const hitTheme = !activeTheme || n.theme === activeTheme;
      const hitQ = !q || [n.headline, n.desc, n.detail, n.source, ...(n.tags || [])].join(' ').toLowerCase().includes(q);
      const hidden = hit && hitTheme && hitQ ? '' : ' hidden';
      if (!hidden) visible++;
      return `<div class="card${hidden}" data-news="${esc(n.id)}"><div class="card-accent-bar" style="background:${esc(c.color)}"></div><div class="card-body"><div class="card-top"><span class="card-flag">${esc(c.flag)}</span><span class="card-source" style="color:${esc(c.color)}">${esc(n.source)}</span></div><div class="card-headline">${esc(n.headline)}</div><div class="card-desc">${esc(n.desc)}</div></div><div class="card-footer"><span class="card-theme-badge ${esc(t.className)}">${esc(t.label)}</span><span class="card-expand-hint">Ver mas →</span></div></div>`;
    }).join('');
    $('#count-badge').textContent = `${visible} noticias`;
    $('#empty-state').style.display = visible === 0 ? 'block' : 'none';
    $$('#news-grid .card').forEach(el => el.addEventListener('click', () => openModal((data.news || []).find(n => String(n.id) === el.dataset.news))));
  }

  function filterCountry(code) {
    activeCountry = code; activeTheme = null; searchTerm = ''; $('#searchInput').value = '';
    $$('#country-filters .fbt').forEach(b => b.classList.toggle('active', b.dataset.country === code));
    $$('#theme-filters .fbt').forEach(b => b.classList.remove('active'));
    renderNews();
  }
  function filterThemeButton(code) { activeTheme = activeTheme === code ? null : code; $$('#theme-filters .fbt').forEach(b => b.classList.toggle('active', activeTheme === b.dataset.theme)); renderNews(); }
  function filterTheme(code) { activeCountry = 'all'; activeTheme = code; searchTerm = ''; $('#searchInput').value = ''; $$('#country-filters .fbt').forEach(b => b.classList.toggle('active', b.dataset.country === 'all')); $$('#theme-filters .fbt').forEach(b => b.classList.toggle('active', b.dataset.theme === code)); renderNews(); }

  function openModal(n) {
    if (!n) return;
    const c = country(n.country), t = theme(n.theme);
    $('#m-flag').textContent = c.flag;
    $('#m-source').style.color = c.color;
    $('#m-source').textContent = n.source;
    $('#m-title').textContent = n.headline;
    $('#m-theme').className = 'modal-theme ' + t.className;
    $('#m-theme').textContent = t.label;
    $('#m-body').innerHTML = `<p>${esc(n.desc)}</p><p>${esc(n.detail)}</p>`;
    $('#m-link-wrap').innerHTML = n.url ? `<a class="modal-link-btn" href="${esc(n.url)}" target="_blank" rel="noopener">🌐 Ir al medio</a>` : '';
    $('#m-footer').textContent = `Fuente: ${n.source} · Eyewatch Press Intelligence · ${data.edition.isoDate}`;
    $('#modal').classList.add('open');
  }

  function renderCountryNav(containerId, handler) {
    const el = $(containerId);
    el.innerHTML = `<button class="pcn active" data-country="all">🌎 Todas</button>` + countryEntries.map(([code,c]) => `<button class="pcn" data-country="${code}">${esc(c.flag)} ${esc(c.name)}</button>`).join('');
    el.querySelectorAll('.pcn').forEach(btn => btn.addEventListener('click', () => { el.querySelectorAll('.pcn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); handler(btn.dataset.country); }));
  }

  function renderCovers() {
    $('#covers-eyebrow').textContent = `📰 Portadas del Dia — ${data.edition.dateLabel}`;
    $('#covers-title').textContent = data.edition.headline;
    $('#covers-sub').textContent = data.edition.subheadline;
    renderCountryNav('#pcnav-portadas', code => { activeCoverCountry = code; renderCoversGroups(); });
    renderCoversGroups();
  }
  function renderCoversGroups() {
    const covers = data.covers || [];
    $('#covers-section').innerHTML = countryEntries.map(([code,c]) => {
      const items = covers.filter(x => x.country === code);
      if (!items.length) return '';
      const hidden = activeCoverCountry !== 'all' && activeCoverCountry !== code ? ' hidden' : '';
      return `<div class="covers-country-group${hidden}" data-country="${code}"><div class="country-group-header"><span class="cgh-flag">${esc(c.flag)}</span><span class="cgh-name">${esc(c.name)}</span><span class="cgh-count">${items.length} portadas</span><div class="cgh-line" style="background:linear-gradient(90deg,${esc(c.color)}55,transparent)"></div></div><div class="covers-row">${items.map(item => `<div class="cover-card" data-cover="${covers.indexOf(item)}"><div class="cover-accent" style="background:${esc(c.color)}"></div><div class="cover-img-wrap"><img class="cover-img" src="${esc(item.src)}" alt="${esc(item.source)}"><div class="cover-overlay"><div class="cover-overlay-btn">Ampliar portada</div></div></div><div class="cover-info"><div class="cover-source">${esc(item.source)}</div><div class="cover-country-tag">${esc(c.name)}</div></div></div>`).join('')}</div></div>`;
    }).join('');
    $$('#covers-section .cover-card').forEach(el => el.addEventListener('click', () => openLightbox(Number(el.dataset.cover))));
    lbFiltered = covers.map((_,i) => i).filter(i => activeCoverCountry === 'all' || covers[i].country === activeCoverCountry);
  }

  function openLightbox(idx) { lbCur = idx; lbFiltered = (data.covers || []).map((_,i) => i).filter(i => activeCoverCountry === 'all' || data.covers[i].country === activeCoverCountry); renderLightbox(); $('#lb-overlay').classList.add('open'); }
  function renderLightbox() {
    const item = data.covers[lbCur]; const c = country(item.country); const pos = lbFiltered.indexOf(lbCur);
    $('#lb-img').src = item.src; $('#lb-src').innerHTML = `${esc(c.flag)} <strong>${esc(item.source)}</strong>`; $('#lb-hl').textContent = item.headline || ''; $('#lb-url').href = item.url || '#'; $('#lb-url').textContent = '🌐 Ir a ' + item.source; $('#lb-num').textContent = pos + 1; $('#lb-tot').textContent = lbFiltered.length;
  }
  function lbNav(dir) { if (!lbFiltered.length) return; const pos = lbFiltered.indexOf(lbCur); lbCur = lbFiltered[(pos + dir + lbFiltered.length) % lbFiltered.length]; renderLightbox(); }

  function renderSummary() {
    $('#summary-eyebrow').textContent = `📋 Resumen por Pais — ${data.edition.dateLabel}`;
    renderCountryNav('#pcnav-resumen', code => renderSummaryGroups(code));
    renderSummaryGroups('all');
  }
  function renderSummaryGroups(code) {
    const groups = data.summary || [];
    $('#summary-section').innerHTML = groups.map(g => {
      const c = country(g.country); const hidden = code !== 'all' && g.country !== code ? ' hidden' : '';
      return `<div class="summary-group${hidden}" data-country="${esc(g.country)}"><div class="summary-group-header"><div class="sgh-left"><span class="sgh-flag">${esc(c.flag)}</span><div><div class="sgh-name">${esc(c.name)}</div><div class="sgh-sub">${(g.topics || []).length} temas destacados</div></div></div><div class="sgh-bar" style="background:${esc(c.color)}"></div><span class="sgh-count" style="color:${esc(c.color)};border-color:${esc(c.color)}44">${(g.topics || []).length} temas</span></div><div class="stopic-grid">${(g.topics || []).map(t => { const th = theme(t.theme); return `<div class="stopic-card"><div class="stopic-header"><span class="stopic-icon">${esc(t.icon)}</span><div class="stopic-title-wrap"><div class="stopic-title">${esc(t.title)}</div><span class="stopic-tag" style="background:${esc(th.color)}22;color:${esc(th.color)};">${esc(th.label)}</span></div></div><div class="stopic-desc">${esc(t.desc)}</div><div class="stopic-medios"><span class="stopic-medios-label">Cobertura:</span> ${esc(t.media)}</div></div>`; }).join('')}</div></div>`;
    }).join('');
  }

  function bindGlobal() {
    $$('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
    $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').classList.remove('open'); });
    $('#modal-close').addEventListener('click', () => $('#modal').classList.remove('open'));
    $('#lb-overlay').addEventListener('click', e => { if (e.target.id === 'lb-overlay') $('#lb-overlay').classList.remove('open'); });
    $('#lb-close').addEventListener('click', () => $('#lb-overlay').classList.remove('open'));
    ['#lb-prev','#lb-prev-2'].forEach(id => $(id).addEventListener('click', e => { e.stopPropagation(); lbNav(-1); }));
    ['#lb-next','#lb-next-2'].forEach(id => $(id).addEventListener('click', e => { e.stopPropagation(); lbNav(1); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#modal').classList.remove('open'); $('#lb-overlay').classList.remove('open'); } if ($('#lb-overlay').classList.contains('open')) { if (e.key === 'ArrowLeft') lbNav(-1); if (e.key === 'ArrowRight') lbNav(1); } });
  }

  renderHeader(); renderTicker(); renderCross(); renderFilters(); renderNews(); renderCovers(); renderSummary(); bindGlobal();
})();
