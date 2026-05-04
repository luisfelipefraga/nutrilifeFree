// ===== NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-page="${id}"]`);
  if (btn) btn.classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'receitas') renderReceitas();
}

function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ===== TABS (Calculadoras) =====
function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  const tabs = document.querySelectorAll('.tab');
  const idx = id === 'imc' ? 0 : 1;
  tabs[idx].classList.add('active');
}

// ===== IMC CALCULATOR =====
function calcIMC() {
  const h = parseFloat(document.getElementById('imc-altura').value);
  const p = parseFloat(document.getElementById('imc-peso').value);
  const resultBox = document.getElementById('imc-result');
  const numEl = document.getElementById('imc-num');
  const classEl = document.getElementById('imc-class');
  const pointer = document.getElementById('imc-pointer');

  if (!h || !p || h < 100 || h > 250 || p < 30 || p > 300) {
    alert('Por favor, preencha altura e peso com valores válidos.');
    return;
  }

  const imc = p / Math.pow(h / 100, 2);
  numEl.textContent = imc.toFixed(1);
  resultBox.classList.remove('hidden');

  const classes = [
    { max: 18.5, label: 'Abaixo do peso', color: '#1e40af', pct: 5 },
    { max: 25,   label: 'Peso normal ✓',  color: '#166534', pct: 25 },
    { max: 30,   label: 'Sobrepeso',       color: '#854d0e', pct: 50 },
    { max: 35,   label: 'Obesidade grau I', color: '#9a3412', pct: 70 },
    { max: 40,   label: 'Obesidade grau II', color: '#991b1b', pct: 85 },
    { max: Infinity, label: 'Obesidade grau III', color: '#7f1d1d', pct: 95 }
  ];

  const found = classes.find(c => imc < c.max);
  classEl.textContent = found.label;
  numEl.style.color = found.color;

  // Position pointer on bar (map IMC 15–40 to 0–100%)
  const pct = Math.min(Math.max(((imc - 15) / (40 - 15)) * 100, 2), 98);
  pointer.style.left = pct + '%';
}

function clearIMC() {
  document.getElementById('imc-altura').value = '';
  document.getElementById('imc-peso').value = '';
  document.getElementById('imc-result').classList.add('hidden');
}

// ===== TMB CALCULATOR (Harris-Benedict) =====
function calcTMB() {
  const sexo = document.getElementById('tmb-sexo').value;
  const idade = parseFloat(document.getElementById('tmb-idade').value);
  const altura = parseFloat(document.getElementById('tmb-altura').value);
  const peso = parseFloat(document.getElementById('tmb-peso').value);
  const fator = parseFloat(document.getElementById('tmb-atividade').value);

  if (!idade || !altura || !peso) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  let tmb;
  if (sexo === 'm') {
    tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
  } else {
    tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
  }

  const tdee = tmb * fator;
  const perda = tdee - 500;
  const ganho = tdee + 300;

  document.getElementById('tmb-num').textContent = Math.round(tmb) + ' kcal';
  document.getElementById('tdee-num').textContent = Math.round(tdee) + ' kcal';
  document.getElementById('g-perda').textContent = Math.round(perda);
  document.getElementById('g-manter').textContent = Math.round(tdee);
  document.getElementById('g-ganho').textContent = Math.round(ganho);
  document.getElementById('tmb-result').classList.remove('hidden');
}

function clearTMB() {
  ['tmb-idade', 'tmb-altura', 'tmb-peso'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('tmb-sexo').value = 'm';
  document.getElementById('tmb-atividade').value = '1.55';
  document.getElementById('tmb-result').classList.add('hidden');
}

// ===== FOOD SEARCH =====
let meal = [];
let searchResults = [];

function searchFoods() {
  const query = document.getElementById('food-search').value.trim().toLowerCase();
  const hint = document.getElementById('search-hint');
  const resultsEl = document.getElementById('search-results');

  if (!query) {
    resultsEl.innerHTML = '';
    hint.style.display = 'block';
    return;
  }
  hint.style.display = 'none';

  // Search by name, category, or keywords
  const results = FOODS.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.category.toLowerCase().includes(query)
  );

  searchResults = results;

  if (!results.length) {
    resultsEl.innerHTML = `<div style="color:#9AA3B2;font-size:14px;padding:20px 0">Nenhum alimento encontrado para "<strong>${query}</strong>". Tente outra busca.</div>`;
    return;
  }

  resultsEl.innerHTML = results.map((f, i) => `
    <div class="food-result-card">
      <div class="food-name">${f.name}</div>
      <div class="food-cat">${f.category} · valores por 100g</div>
      <div class="food-badges">
        <span class="fbadge fbadge-cal">🔥 ${f.cal} kcal</span>
        <span class="fbadge fbadge-prot">💪 ${f.prot}g prot</span>
        <span class="fbadge fbadge-carb">⚡ ${f.carb}g carb</span>
        <span class="fbadge fbadge-fat">🫙 ${f.fat}g gord</span>
        <span class="fbadge fbadge-fib">🌿 ${f.fib}g fib</span>
      </div>
      <div class="food-qty-row">
        <label>Quantidade (g):</label>
        <input type="number" id="qty-${i}" value="100" min="1" max="2000" step="1">
        <button class="btn-primary" style="padding:8px 16px;font-size:13px" onclick="addToMeal(${i})">+ Adicionar</button>
      </div>
      <button class="detail-toggle" onclick="toggleDetail(${i})">▼ Ver tabela completa</button>
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
  btn.textContent = det.classList.contains('open') ? '▲ Ocultar detalhes' : '▼ Ver tabela completa';
}

function addToMeal(i) {
  const food = searchResults[i];
  const qty = parseFloat(document.getElementById('qty-' + i).value) || 100;
  const f = qty / 100;

  meal.push({
    name: food.name,
    qty: qty,
    cal: +(food.cal * f).toFixed(1),
    prot: +(food.prot * f).toFixed(1),
    carb: +(food.carb * f).toFixed(1),
    fat: +(food.fat * f).toFixed(1),
    fib: +(food.fib * f).toFixed(1),
  });
  renderMeal();

  // Visual feedback
  const btn = document.querySelectorAll('.food-result-card')[i].querySelector('.btn-primary');
  const orig = btn.textContent;
  btn.textContent = '✓ Adicionado!';
  btn.style.background = '#0f6e56';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1200);
}

function renderMeal() {
  const itemsEl = document.getElementById('meal-items');
  const countEl = document.getElementById('meal-count');

  countEl.textContent = meal.length + (meal.length === 1 ? ' item' : ' itens');

  if (!meal.length) {
    itemsEl.innerHTML = '<div class="meal-empty">Adicione alimentos à sua refeição</div>';
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

  const totals = meal.reduce((acc, m) => ({
    cal: acc.cal + m.cal,
    prot: acc.prot + m.prot,
    carb: acc.carb + m.carb,
    fat: acc.fat + m.fat,
    fib: acc.fib + m.fib,
  }), { cal: 0, prot: 0, carb: 0, fat: 0, fib: 0 });

  document.getElementById('total-kcal').textContent = totals.cal.toFixed(1) + ' kcal';
  document.getElementById('t-prot').textContent = totals.prot.toFixed(1) + 'g';
  document.getElementById('t-carb').textContent = totals.carb.toFixed(1) + 'g';
  document.getElementById('t-fat').textContent = totals.fat.toFixed(1) + 'g';
  document.getElementById('t-fib').textContent = totals.fib.toFixed(1) + 'g';
}

function removeFromMeal(i) {
  meal.splice(i, 1);
  renderMeal();
}

function clearMeal() {
  meal = [];
  renderMeal();
}

// ===== RECEITAS =====
const CAT_LABELS = {
  cafe: '☕ Café da manhã',
  almoco: '🍽️ Almoço',
  jantar: '🌙 Jantar',
  lanche: '🥪 Lanche',
  sobremesa: '🍓 Sobremesa',
};

// Seed with example recipes
function getSeedReceitas() {
  return [
    {
      id: 1,
      nome: "Bowl proteico de atum",
      categoria: "almoco",
      tempo: "15 min",
      porcoes: 1,
      kcal: 420,
      ingredientes: "1 lata de atum em água\n100g de arroz integral cozido\n50g de grão de bico cozido\n½ tomate picado\nFolhas de alface\n1 col. sopa de azeite\nSal, limão e ervas a gosto",
      modo: "1. Escorra o atum e tempere com limão, sal e ervas.\n2. Monte a bowl: coloque o arroz como base.\n3. Adicione o atum, grão de bico, tomate e alface.\n4. Regue com azeite e sirva frio ou em temperatura ambiente.",
      autor: "Ana C.",
      data: "2025-05-01"
    },
    {
      id: 2,
      nome: "Panqueca de aveia com banana",
      categoria: "cafe",
      tempo: "10 min",
      porcoes: 2,
      kcal: 280,
      ingredientes: "1 banana madura\n2 ovos\n4 col. sopa de aveia em flocos\n1 pitada de canela\n1 col. chá de mel (opcional)",
      modo: "1. Amasse a banana com um garfo até virar uma pasta.\n2. Adicione os ovos e misture bem.\n3. Acrescente a aveia e a canela, mexa até incorporar.\n4. Aqueça uma frigideira antiaderente em fogo médio.\n5. Despeje pequenas porções e cozinhe 2-3 min de cada lado.\n6. Sirva com mel ou frutas.",
      autor: "Pedro M.",
      data: "2025-05-02"
    },
    {
      id: 3,
      nome: "Salada de frango grelhado",
      categoria: "almoco",
      tempo: "25 min",
      porcoes: 2,
      kcal: 310,
      ingredientes: "200g de peito de frango\nFolhas verdes mistas (alface, rúcula)\n1 tomate\n½ pepino\n1 cenoura ralada\n2 col. sopa de azeite\nSal, pimenta e limão",
      modo: "1. Tempere o frango com sal, pimenta e um fio de azeite.\n2. Grelhe em frigideira por 6-7 min de cada lado.\n3. Deixe descansar 5 min e fatie.\n4. Monte a salada com os vegetais.\n5. Adicione o frango e regue com azeite e limão.",
      autor: "Carla S.",
      data: "2025-05-03"
    }
  ];
}

function loadReceitas() {
  const stored = localStorage.getItem('nutrilife_receitas');
  if (stored) return JSON.parse(stored);
  const seed = getSeedReceitas();
  localStorage.setItem('nutrilife_receitas', JSON.stringify(seed));
  return seed;
}

function saveReceitas(receitas) {
  localStorage.setItem('nutrilife_receitas', JSON.stringify(receitas));
}

function renderReceitas() {
  const receitas = loadReceitas();
  const search = (document.getElementById('rec-search')?.value || '').toLowerCase();
  const cat = document.getElementById('rec-cat')?.value || '';
  const listEl = document.getElementById('receitas-list');

  const filtered = receitas.filter(r => {
    const matchSearch = !search || r.nome.toLowerCase().includes(search) || r.ingredientes.toLowerCase().includes(search);
    const matchCat = !cat || r.categoria === cat;
    return matchSearch && matchCat;
  }).reverse();

  if (!filtered.length) {
    listEl.innerHTML = `<div class="rec-empty"><div class="empty-icon">🥗</div><p>Nenhuma receita encontrada.<br>Seja o primeiro a publicar!</p></div>`;
    return;
  }

  listEl.innerHTML = filtered.map(r => `
    <div class="rec-card">
      <div class="rec-card-header">
        <div class="rec-title">${r.nome}</div>
        <span class="rec-cat-badge">${CAT_LABELS[r.categoria] || r.categoria}</span>
      </div>
      <div class="rec-meta">
        ${r.tempo ? `<span>⏱️ ${r.tempo}</span>` : ''}
        ${r.porcoes ? `<span>🍽️ ${r.porcoes} porção(ões)</span>` : ''}
        ${r.autor ? `<span>👤 ${r.autor}</span>` : ''}
        <span>📅 ${formatDate(r.data)}</span>
      </div>
      <div class="rec-section-title">Ingredientes</div>
      <div class="rec-ingredients">${r.ingredientes.replace(/\n/g, '<br>')}</div>
      <div class="rec-section-title">Modo de preparo</div>
      <div class="rec-steps">${r.modo}</div>
      <div class="rec-footer">
        <span>Publicado por ${r.autor || 'Anônimo'}</span>
        ${r.kcal ? `<span class="rec-kcal-badge">🔥 ~${r.kcal} kcal</span>` : ''}
      </div>
    </div>
  `).join('');
}

function filterReceitas() {
  renderReceitas();
}

function publicarReceita() {
  const nome = document.getElementById('rec-nome').value.trim();
  const ingredientes = document.getElementById('rec-ingredientes').value.trim();
  const modo = document.getElementById('rec-modo').value.trim();

  if (!nome || !ingredientes || !modo) {
    alert('Por favor, preencha pelo menos nome, ingredientes e modo de preparo.');
    return;
  }

  const nova = {
    id: Date.now(),
    nome,
    categoria: document.getElementById('rec-categoria').value,
    tempo: document.getElementById('rec-tempo').value.trim(),
    porcoes: parseInt(document.getElementById('rec-porcoes').value) || null,
    kcal: parseInt(document.getElementById('rec-kcal').value) || null,
    ingredientes,
    modo,
    autor: document.getElementById('rec-autor').value.trim() || 'Anônimo',
    data: new Date().toISOString().split('T')[0],
  };

  const receitas = loadReceitas();
  receitas.push(nova);
  saveReceitas(receitas);

  // Clear form
  ['rec-nome', 'rec-tempo', 'rec-porcoes', 'rec-kcal', 'rec-ingredientes', 'rec-modo', 'rec-autor'].forEach(id => {
    document.getElementById(id).value = '';
  });

  const successEl = document.getElementById('rec-success');
  successEl.classList.remove('hidden');
  setTimeout(() => successEl.classList.add('hidden'), 3000);

  renderReceitas();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderMeal();
});
