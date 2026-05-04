/* ============================================
   NutriLife — app.js
   ============================================ */

// ---- NAVIGATION ----
function showPage(id) {
  document.querySelectorAll('.nl-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nl-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const btn = document.querySelector(`.nl-nav-btn[data-page="${id}"]`);
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Close mobile menu
  const nav = document.getElementById('navMenu');
  if (nav && nav.classList.contains('show')) {
    bootstrap.Collapse.getInstance(nav)?.hide();
  }
  if (id === 'receitas') renderReceitas();
}

// ---- CALC TABS ----
function switchTab(id, el) {
  document.querySelectorAll('.nl-tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nl-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  if (el) el.classList.add('active');
}

// ---- IMC ----
function calcIMC() {
  const h = parseFloat(document.getElementById('imc-altura').value);
  const p = parseFloat(document.getElementById('imc-peso').value);
  if (!h || !p || h < 100 || p < 30) {
    showToast('Preencha altura e peso com valores válidos.', 'warning');
    return;
  }
  const imc = p / Math.pow(h / 100, 2);
  const classes = [
    { max: 18.5,     label: 'Abaixo do peso',   color: '#1e40af', pct: 5  },
    { max: 25,       label: 'Peso normal ✓',     color: '#166534', pct: 28 },
    { max: 30,       label: 'Sobrepeso',          color: '#854d0e', pct: 52 },
    { max: 35,       label: 'Obesidade grau I',   color: '#9a3412', pct: 68 },
    { max: 40,       label: 'Obesidade grau II',  color: '#991b1b', pct: 84 },
    { max: Infinity, label: 'Obesidade grau III', color: '#7f1d1d', pct: 95 },
  ];
  const found = classes.find(c => imc < c.max);
  document.getElementById('imc-num').textContent = imc.toFixed(1);
  document.getElementById('imc-num').style.color = found.color;
  document.getElementById('imc-class').textContent = found.label;
  const pct = Math.min(Math.max(((imc - 15) / 25) * 100, 2), 97);
  document.getElementById('imc-pointer').style.left = pct + '%';
  document.getElementById('imc-result').classList.remove('d-none');
}

function clearIMC() {
  document.getElementById('imc-altura').value = '';
  document.getElementById('imc-peso').value = '';
  document.getElementById('imc-result').classList.add('d-none');
}

// ---- TMB (Harris-Benedict) ----
function calcTMB() {
  const sexo    = document.getElementById('tmb-sexo').value;
  const idade   = parseFloat(document.getElementById('tmb-idade').value);
  const altura  = parseFloat(document.getElementById('tmb-altura').value);
  const peso    = parseFloat(document.getElementById('tmb-peso').value);
  const fator   = parseFloat(document.getElementById('tmb-atividade').value);
  if (!idade || !altura || !peso) {
    showToast('Preencha todos os campos.', 'warning');
    return;
  }
  const tmb = sexo === 'm'
    ? 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
    : 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
  const tdee = tmb * fator;
  document.getElementById('tmb-num').textContent  = Math.round(tmb) + ' kcal';
  document.getElementById('tdee-num').textContent = Math.round(tdee) + ' kcal';
  document.getElementById('g-perda').textContent  = Math.round(tdee - 500);
  document.getElementById('g-manter').textContent = Math.round(tdee);
  document.getElementById('g-ganho').textContent  = Math.round(tdee + 300);
  document.getElementById('tmb-result').classList.remove('d-none');
}

function clearTMB() {
  ['tmb-idade', 'tmb-altura', 'tmb-peso'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('tmb-sexo').value     = 'm';
  document.getElementById('tmb-atividade').value = '1.55';
  document.getElementById('tmb-result').classList.add('d-none');
}

// ---- FOOD SEARCH ----
let meal = [];
let searchResults = [];

function searchFoods() {
  const q = document.getElementById('food-search').value.trim().toLowerCase();
  const hint = document.getElementById('search-hint');
  const resultsEl = document.getElementById('search-results');

  if (!q) {
    resultsEl.innerHTML = '';
    hint.style.display = 'block';
    return;
  }
  hint.style.display = 'none';

  const results = FOODS.filter(f =>
    f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );
  searchResults = results;

  if (!results.length) {
    resultsEl.innerHTML = `<p class="text-muted small py-3">Nenhum alimento encontrado para "<strong>${q}</strong>". Tente: feijão, arroz, frango, atum...</p>`;
    return;
  }

  resultsEl.innerHTML = results.map((f, i) => `
    <div class="food-result-card">
      <div class="food-name">${f.name}</div>
      <div class="food-cat">${f.category} · valores por 100g</div>
      <div class="d-flex flex-wrap gap-1 mb-2">
        <span class="fbadge fbadge-cal">🔥 ${f.cal} kcal</span>
        <span class="fbadge fbadge-prot">💪 ${f.prot}g prot</span>
        <span class="fbadge fbadge-carb">⚡ ${f.carb}g carb</span>
        <span class="fbadge fbadge-fat">🫙 ${f.fat}g gord</span>
        <span class="fbadge fbadge-fib">🌿 ${f.fib}g fib</span>
      </div>
      <div class="food-qty-row">
        <label>Quantidade (g):</label>
        <input type="number" class="qty-input" id="qty-${i}" value="100" min="1" max="2000">
        <button class="btn nl-btn-primary btn-sm px-3" id="add-btn-${i}" onclick="addToMeal(${i})">+ Adicionar</button>
      </div>
      <button class="detail-toggle" onclick="toggleDetail(${i})">▼ Ver detalhes</button>
      <div class="food-details" id="det-${i}">
        <div class="fd-row"><span class="fd-lbl">Calorias</span><span class="fd-val">${f.cal} kcal</span></div>
        <div class="fd-row"><span class="fd-lbl">Proteínas</span><span class="fd-val">${f.prot}g</span></div>
        <div class="fd-row"><span class="fd-lbl">Carboidratos</span><span class="fd-val">${f.carb}g</span></div>
        <div class="fd-row"><span class="fd-lbl">Gorduras</span><span class="fd-val">${f.fat}g</span></div>
        <div class="fd-row"><span class="fd-lbl">Fibras</span><span class="fd-val">${f.fib}g</span></div>
        <div class="fd-row"><span class="fd-lbl">Sódio</span><span class="fd-val">${f.sod}mg</span></div>
      </div>
    </div>
  `).join('');
}

function toggleDetail(i) {
  const det = document.getElementById('det-' + i);
  const btn = det.previousElementSibling;
  det.classList.toggle('open');
  btn.textContent = det.classList.contains('open') ? '▲ Ocultar detalhes' : '▼ Ver detalhes';
}

function addToMeal(i) {
  const food = searchResults[i];
  const qty = parseFloat(document.getElementById('qty-' + i).value) || 100;
  const f = qty / 100;
  meal.push({
    name: food.name, qty,
    cal:  +(food.cal  * f).toFixed(1),
    prot: +(food.prot * f).toFixed(1),
    carb: +(food.carb * f).toFixed(1),
    fat:  +(food.fat  * f).toFixed(1),
    fib:  +(food.fib  * f).toFixed(1),
  });
  renderMeal();
  const btn = document.getElementById('add-btn-' + i);
  const orig = btn.textContent;
  btn.textContent = '✓ Adicionado!';
  btn.style.background = '#0A9B52';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1300);
}

function renderMeal() {
  const itemsEl = document.getElementById('meal-items');
  const countEl = document.getElementById('meal-count');
  countEl.textContent = meal.length + (meal.length === 1 ? ' item' : ' itens');

  if (!meal.length) {
    itemsEl.innerHTML = '<p class="text-muted small text-center py-3">Adicione alimentos à sua refeição</p>';
  } else {
    itemsEl.innerHTML = meal.map((m, i) => `
      <div class="meal-item-row">
        <div>
          <div class="mi-name">${m.name}</div>
          <div class="mi-sub">${m.qty}g · ${m.cal} kcal</div>
        </div>
        <button class="mi-remove" onclick="removeFromMeal(${i})" title="Remover">×</button>
      </div>
    `).join('');
  }

  const t = meal.reduce((a, m) => ({
    cal: a.cal + m.cal, prot: a.prot + m.prot,
    carb: a.carb + m.carb, fat: a.fat + m.fat, fib: a.fib + m.fib,
  }), { cal:0, prot:0, carb:0, fat:0, fib:0 });

  document.getElementById('total-kcal').textContent = t.cal.toFixed(1) + ' kcal';
  document.getElementById('t-prot').textContent = t.prot.toFixed(1) + 'g';
  document.getElementById('t-carb').textContent = t.carb.toFixed(1) + 'g';
  document.getElementById('t-fat').textContent  = t.fat.toFixed(1)  + 'g';
  document.getElementById('t-fib').textContent  = t.fib.toFixed(1)  + 'g';
}

function removeFromMeal(i) { meal.splice(i, 1); renderMeal(); }
function clearMeal() { meal = []; renderMeal(); }

// ---- RECEITAS ----
const CAT_LABELS = {
  cafe: '☕ Café da manhã', almoco: '🍽️ Almoço',
  jantar: '🌙 Jantar', lanche: '🥪 Lanche', sobremesa: '🍓 Sobremesa',
};

function getReceitas() {
  const s = localStorage.getItem('nutrilife_receitas');
  if (s) return JSON.parse(s);
  const seed = [
    { id:1, nome:"Bowl proteico de atum", categoria:"almoco", tempo:"15 min", porcoes:1, kcal:420,
      ingredientes:"1 lata de atum em água\n100g de arroz integral cozido\n50g de grão de bico cozido\n½ tomate picado\nFolhas de alface\n1 col. sopa de azeite\nSal, limão e ervas a gosto",
      modo:"1. Escorra o atum e tempere com limão, sal e ervas.\n2. Monte a bowl: coloque o arroz como base.\n3. Adicione o atum, grão de bico, tomate e alface.\n4. Regue com azeite e sirva.",
      autor:"Ana C.", data:"2025-05-01" },
    { id:2, nome:"Panqueca de aveia com banana", categoria:"cafe", tempo:"10 min", porcoes:2, kcal:280,
      ingredientes:"1 banana madura\n2 ovos\n4 col. sopa de aveia em flocos\n1 pitada de canela\n1 col. chá de mel",
      modo:"1. Amasse a banana com garfo até virar pasta.\n2. Adicione os ovos e misture bem.\n3. Acrescente aveia e canela.\n4. Cozinhe em frigideira antiaderente 2-3 min cada lado.\n5. Sirva com mel ou frutas.",
      autor:"Pedro M.", data:"2025-05-02" },
    { id:3, nome:"Salada de frango grelhado", categoria:"almoco", tempo:"25 min", porcoes:2, kcal:310,
      ingredientes:"200g de peito de frango\nFolhas verdes mistas\n1 tomate\n½ pepino\n1 cenoura ralada\n2 col. sopa de azeite\nSal, pimenta e limão",
      modo:"1. Tempere o frango com sal, pimenta e azeite.\n2. Grelhe por 6-7 min de cada lado.\n3. Deixe descansar 5 min e fatie.\n4. Monte a salada com os vegetais e o frango.\n5. Regue com azeite e limão.",
      autor:"Carla S.", data:"2025-05-03" },
  ];
  localStorage.setItem('nutrilife_receitas', JSON.stringify(seed));
  return seed;
}

function saveReceitas(r) { localStorage.setItem('nutrilife_receitas', JSON.stringify(r)); }

function renderReceitas() {
  const receitas = getReceitas();
  const q = (document.getElementById('rec-search')?.value || '').toLowerCase();
  const cat = document.getElementById('rec-cat')?.value || '';
  const listEl = document.getElementById('receitas-list');

  const filtered = receitas
    .filter(r => (!q || r.nome.toLowerCase().includes(q) || r.ingredientes.toLowerCase().includes(q)) && (!cat || r.categoria === cat))
    .reverse();

  if (!filtered.length) {
    listEl.innerHTML = `<div class="rec-empty"><div style="font-size:48px">🥗</div><p class="mt-2">Nenhuma receita encontrada.<br>Seja o primeiro a publicar!</p></div>`;
    return;
  }
  listEl.innerHTML = filtered.map(r => `
    <div class="rec-card">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
        <div class="rec-title">${r.nome}</div>
        <span class="rec-cat-badge">${CAT_LABELS[r.categoria] || r.categoria}</span>
      </div>
      <div class="rec-meta mb-2">
        ${r.tempo ? `<span>⏱️ ${r.tempo}</span>` : ''}
        ${r.porcoes ? `<span>🍽️ ${r.porcoes} porção(ões)</span>` : ''}
        ${r.autor ? `<span>👤 ${r.autor}</span>` : ''}
        <span>📅 ${fmtDate(r.data)}</span>
      </div>
      <span class="rec-section-lbl">Ingredientes</span>
      <div class="rec-ingredients">${r.ingredientes}</div>
      <span class="rec-section-lbl">Modo de preparo</span>
      <div class="rec-steps">${r.modo}</div>
      <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
        <small class="text-muted">Por ${r.autor || 'Anônimo'}</small>
        ${r.kcal ? `<span class="rec-kcal-badge">🔥 ~${r.kcal} kcal</span>` : ''}
      </div>
    </div>
  `).join('');
}

function filterReceitas() { renderReceitas(); }

function publicarReceita() {
  const nome         = document.getElementById('rec-nome').value.trim();
  const ingredientes = document.getElementById('rec-ingredientes').value.trim();
  const modo         = document.getElementById('rec-modo').value.trim();
  if (!nome || !ingredientes || !modo) {
    showToast('Preencha nome, ingredientes e modo de preparo.', 'warning');
    return;
  }
  const nova = {
    id: Date.now(),
    nome,
    categoria:    document.getElementById('rec-categoria').value,
    tempo:        document.getElementById('rec-tempo').value.trim(),
    porcoes:      parseInt(document.getElementById('rec-porcoes').value) || null,
    kcal:         parseInt(document.getElementById('rec-kcal').value) || null,
    ingredientes, modo,
    autor:        document.getElementById('rec-autor').value.trim() || 'Anônimo',
    data:         new Date().toISOString().split('T')[0],
  };
  const receitas = getReceitas();
  receitas.push(nova);
  saveReceitas(receitas);
  ['rec-nome','rec-tempo','rec-porcoes','rec-kcal','rec-ingredientes','rec-modo','rec-autor'].forEach(id => document.getElementById(id).value = '');
  const s = document.getElementById('rec-success');
  s.classList.remove('d-none');
  setTimeout(() => s.classList.add('d-none'), 3000);
  renderReceitas();
}

function fmtDate(d) {
  if (!d) return '';
  const [y,m,day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// ---- TOAST ----
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  const bg = type === 'warning' ? '#fef9c3' : '#e8f9ef';
  const color = type === 'warning' ? '#854d0e' : '#0a9b52';
  t.style.cssText = `background:${bg};color:${color};border-radius:10px;padding:12px 18px;font-size:14px;font-family:'DM Sans',sans-serif;font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,0.12);animation:nlFadeIn 0.2s ease;max-width:300px;`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => { renderMeal(); });
