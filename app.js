/* ============================================================
   app.js — NutriLife (versão multi-página)
   Compatível com data.js: FOODS[{ id, name, cal, prot, carb, fat, fib, sod, category }]
   ============================================================ */

/* ---------- NUTRIÇÃO: busca e refeição ---------- */

let meal = [];

function searchFoods() {
  const q = (document.getElementById('food-search')?.value || '').toLowerCase().trim();
  const container = document.getElementById('search-results');
  if (!container) return;

  if (!q) { container.innerHTML = ''; return; }

  const results = FOODS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    (f.category && f.category.toLowerCase().includes(q))
  );

  if (results.length === 0) {
    container.innerHTML = `
      <div class="nl-empty-state text-center py-5">
        <div class="fs-1 mb-2">🔍</div>
        <p class="text-muted">Nenhum alimento encontrado para "<strong>${q}</strong>"</p>
      </div>`;
    return;
  }

  container.innerHTML = results.map(f => `
    <div class="nl-food-card p-3 rounded-3 mb-3">
      <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="nl-food-name">${f.name}</span>
          <span class="nl-food-cat">${f.category || ''}</span>
        </div>
        <span class="nl-food-kcal flex-shrink-0">${f.cal} kcal</span>
      </div>
      <div class="row g-2 mb-3">
        <div class="col-6 col-sm-3"><span class="nl-macro-tag nl-prot-tag">💪 Prot: ${f.prot}g</span></div>
        <div class="col-6 col-sm-3"><span class="nl-macro-tag nl-carb-tag">⚡ Carb: ${f.carb}g</span></div>
        <div class="col-6 col-sm-3"><span class="nl-macro-tag nl-fat-tag">🫙 Gord: ${f.fat}g</span></div>
        <div class="col-6 col-sm-3"><span class="nl-macro-tag nl-fib-tag">🌿 Fib: ${f.fib}g</span></div>
      </div>
      <div class="nl-add-row">
        <label class="nl-label mb-0" style="white-space:nowrap">Qtd (g):</label>
        <input type="number" class="form-control nl-input nl-qty-input" id="qty-${f.id}"
          value="100" min="1" max="2000" style="width:90px; flex-shrink:0">
        <button class="btn nl-btn-add flex-grow-1 flex-sm-grow-0" onclick="addToMeal(${f.id})">
          <i class="bi bi-plus-circle me-1"></i>Adicionar à refeição
        </button>
      </div>
      <div class="text-muted mt-1" style="font-size:11px">* valores por 100g</div>
    </div>
  `).join('');
}

function addToMeal(id) {
  const food = FOODS.find(f => f.id === id);
  if (!food) return;

  const qtyInput = document.getElementById(`qty-${id}`);
  const qty = parseFloat(qtyInput?.value || 100);
  if (isNaN(qty) || qty <= 0) return;

  const r = qty / 100;
  meal.push({
    uid:  Date.now(),
    name: food.name,
    qty,
    cal:  +(food.cal  * r).toFixed(1),
    prot: +(food.prot * r).toFixed(1),
    carb: +(food.carb * r).toFixed(1),
    fat:  +(food.fat  * r).toFixed(1),
    fib:  +(food.fib  * r).toFixed(1),
  });
  renderMeal();
}

function removeFromMeal(uid) {
  meal = meal.filter(i => i.uid !== uid);
  renderMeal();
}

function renderMeal() {
  const container = document.getElementById('meal-items');
  const countEl   = document.getElementById('meal-count');
  if (!container) return;

  if (countEl) countEl.textContent = `${meal.length} ${meal.length === 1 ? 'item' : 'itens'}`;

  if (meal.length === 0) {
    container.innerHTML = `<p class="text-muted small text-center py-3">Adicione alimentos à sua refeição</p>`;
  } else {
    container.innerHTML = meal.map(item => `
      <div class="nl-meal-item d-flex justify-content-between align-items-center py-2 border-bottom gap-2">
        <div class="flex-grow-1" style="min-width:0">
          <div class="nl-meal-item-name text-truncate">${item.name}</div>
          <div class="text-muted" style="font-size:12px">${item.qty}g · ${item.cal} kcal</div>
        </div>
        <button class="btn btn-sm nl-btn-remove flex-shrink-0" onclick="removeFromMeal(${item.uid})">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `).join('');
  }

  updateTotals();
}

function updateTotals() {
  const t = meal.reduce((acc, i) => {
    acc.cal  += i.cal;
    acc.prot += i.prot;
    acc.carb += i.carb;
    acc.fat  += i.fat;
    acc.fib  += i.fib;
    return acc;
  }, { cal: 0, prot: 0, carb: 0, fat: 0, fib: 0 });

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('total-kcal', `${t.cal.toFixed(1)} kcal`);
  set('t-prot', `${t.prot.toFixed(1)}g`);
  set('t-carb', `${t.carb.toFixed(1)}g`);
  set('t-fat',  `${t.fat.toFixed(1)}g`);
  set('t-fib',  `${t.fib.toFixed(1)}g`);
}

function clearMeal() {
  meal = [];
  renderMeal();
}

/* ---------- CALCULADORA IMC ---------- */

function calcIMC() {
  const h = parseFloat(document.getElementById('imc-altura')?.value);
  const w = parseFloat(document.getElementById('imc-peso')?.value);
  if (!h || !w || h < 100 || w < 30) { alert('Preencha altura e peso corretamente.'); return; }

  const imc = w / Math.pow(h / 100, 2);
  document.getElementById('imc-result')?.classList.remove('d-none');
  document.getElementById('imc-num').textContent = imc.toFixed(1);

  let cls = '', color = '';
  if      (imc < 18.5) { cls = 'Abaixo do peso';   color = '#3b82f6'; }
  else if (imc < 25)   { cls = 'Peso normal ✓';     color = '#22c55e'; }
  else if (imc < 30)   { cls = 'Sobrepeso';          color = '#eab308'; }
  else if (imc < 35)   { cls = 'Obesidade Grau I';   color = '#f97316'; }
  else if (imc < 40)   { cls = 'Obesidade Grau II';  color = '#ef4444'; }
  else                  { cls = 'Obesidade Grau III'; color = '#991b1b'; }

  const el = document.getElementById('imc-class');
  if (el) { el.textContent = cls; el.style.color = color; }

  const pct = Math.min(100, Math.max(0, ((imc - 15) / 25) * 100));
  const ptr = document.getElementById('imc-pointer');
  if (ptr) ptr.style.left = pct + '%';
}

function clearIMC() {
  ['imc-altura', 'imc-peso'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('imc-result')?.classList.add('d-none');
}

/* ---------- CALCULADORA TMB ---------- */

function calcTMB() {
  const sexo   = document.getElementById('tmb-sexo')?.value;
  const idade  = parseFloat(document.getElementById('tmb-idade')?.value);
  const altura = parseFloat(document.getElementById('tmb-altura')?.value);
  const peso   = parseFloat(document.getElementById('tmb-peso')?.value);
  const fator  = parseFloat(document.getElementById('tmb-atividade')?.value);

  if (!idade || !altura || !peso) { alert('Preencha todos os campos.'); return; }

  const tmb = sexo === 'm'
    ? 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
    : 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);

  const tdee = tmb * fator;
  document.getElementById('tmb-result')?.classList.remove('d-none');

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('tmb-num',  Math.round(tmb)        + ' kcal');
  set('tdee-num', Math.round(tdee)       + ' kcal');
  set('g-perda',  Math.round(tdee - 500) + ' kcal');
  set('g-manter', Math.round(tdee)       + ' kcal');
  set('g-ganho',  Math.round(tdee + 300) + ' kcal');
}

function clearTMB() {
  ['tmb-idade', 'tmb-altura', 'tmb-peso'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('tmb-result')?.classList.add('d-none');
}

/* ---------- TABS ---------- */

function switchTab(tab, btn) {
  document.querySelectorAll('.nl-tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nl-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab)?.classList.add('active');
  if (btn) btn.classList.add('active');
}

/* ---------- RECEITAS ---------- */

const STORAGE_KEY = 'nutrilife_receitas';

function loadReceitas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || getDefaultReceitas(); }
  catch { return getDefaultReceitas(); }
}

function saveReceitas(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getDefaultReceitas() {
  return [
    {
      id: 1, nome: 'Bowl Proteico de Frango', categoria: 'almoco',
      tempo: '25 min', porcoes: 2, kcal: 480, autor: 'NutriLife',
      ingredientes: '200g de frango grelhado\n1 xícara de arroz integral\nBrócolis cozido\nAzeite e limão',
      modo: '1. Grelhe o frango temperado com ervas.\n2. Cozinhe o arroz.\n3. Monte o bowl e regue com azeite e limão.'
    },
    {
      id: 2, nome: 'Vitamina de Banana com Aveia', categoria: 'cafe',
      tempo: '5 min', porcoes: 1, kcal: 320, autor: 'NutriLife',
      ingredientes: '1 banana\n200ml de leite desnatado\n3 col. de aveia\n1 col. de mel',
      modo: '1. Bata todos os ingredientes no liquidificador.\n2. Sirva gelado.'
    },
    {
      id: 3, nome: 'Salada de Atum com Grão-de-Bico', categoria: 'almoco',
      tempo: '10 min', porcoes: 1, kcal: 350, autor: 'NutriLife',
      ingredientes: '1 lata de atum\n1 xícara de grão-de-bico cozido\nTomate, pepino, cebola\nAzeite, limão, sal',
      modo: '1. Misture todos os ingredientes.\n2. Tempere e sirva.'
    }
  ];
}

function catLabel(cat) {
  return { cafe: '☕ Café da manhã', almoco: '🍽️ Almoço', jantar: '🌙 Jantar', lanche: '🥪 Lanche', sobremesa: '🍓 Sobremesa' }[cat] || cat;
}

function filterReceitas() {
  const q   = (document.getElementById('rec-search')?.value || '').toLowerCase();
  const cat = document.getElementById('rec-cat')?.value || '';
  renderReceitas(loadReceitas().filter(r =>
    (!q || r.nome.toLowerCase().includes(q)) && (!cat || r.categoria === cat)
  ));
}

function renderReceitas(list) {
  const container = document.getElementById('receitas-list');
  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="nl-empty-state text-center py-5">
        <div class="fs-1 mb-2">📭</div>
        <p class="text-muted">Nenhuma receita encontrada.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(r => `
    <div class="nl-food-card p-4 rounded-3 mb-3">
      <div class="d-flex justify-content-between align-items-start mb-1 gap-2 flex-wrap">
        <h5 class="nl-food-name mb-0">${r.nome}</h5>
        <span class="nl-food-cat">${catLabel(r.categoria)}</span>
      </div>
      <div class="d-flex flex-wrap gap-3 text-muted small mb-3">
        <span><i class="bi bi-clock me-1"></i>${r.tempo || '—'}</span>
        <span><i class="bi bi-people me-1"></i>${r.porcoes || '—'} porções</span>
        <span><i class="bi bi-fire me-1"></i>${r.kcal || '—'} kcal</span>
        <span><i class="bi bi-person me-1"></i>${r.autor || 'Anônimo'}</span>
      </div>
      <div class="row g-3">
        <div class="col-12 col-sm-6">
          <strong class="nl-label">Ingredientes</strong>
          <ul class="text-muted small mt-1 ps-3">
            ${(r.ingredientes || '').split('\n').map(l => `<li>${l}</li>`).join('')}
          </ul>
        </div>
        <div class="col-12 col-sm-6">
          <strong class="nl-label">Modo de preparo</strong>
          <ol class="text-muted small mt-1 ps-3">
            ${(r.modo || '').split('\n').map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('')}
          </ol>
        </div>
      </div>
    </div>
  `).join('');
}

function publicarReceita() {
  const nome         = document.getElementById('rec-nome')?.value.trim();
  const categoria    = document.getElementById('rec-categoria')?.value;
  const tempo        = document.getElementById('rec-tempo')?.value.trim();
  const porcoes      = document.getElementById('rec-porcoes')?.value;
  const kcal         = document.getElementById('rec-kcal')?.value;
  const ingredientes = document.getElementById('rec-ingredientes')?.value.trim();
  const modo         = document.getElementById('rec-modo')?.value.trim();
  const autor        = document.getElementById('rec-autor')?.value.trim();

  if (!nome || !ingredientes || !modo) {
    alert('Preencha os campos obrigatórios: Nome, Ingredientes e Modo de preparo.');
    return;
  }

  const receitas = loadReceitas();
  receitas.unshift({ id: Date.now(), nome, categoria, tempo, porcoes: parseInt(porcoes) || 1, kcal: parseInt(kcal) || 0, ingredientes, modo, autor: autor || 'Anônimo' });
  saveReceitas(receitas);

  ['rec-nome','rec-tempo','rec-porcoes','rec-kcal','rec-ingredientes','rec-modo','rec-autor']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  const msg = document.getElementById('rec-success');
  msg?.classList.remove('d-none');
  setTimeout(() => msg?.classList.add('d-none'), 3000);

  filterReceitas();
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('receitas-list')) filterReceitas();
});
