/* ============================================
   NutriLife — app.js (Revisado)
   ============================================ */

// ---- PERSISTÊNCIA DA REFEIÇÃO (Melhoria de UX) ----
// Salva e carrega a refeição para não perder dados ao navegar entre páginas HTML
let meal = JSON.parse(localStorage.getItem('nutrilife_meal')) || [];

function saveMealToStorage() {
    localStorage.setItem('nutrilife_meal', JSON.stringify(meal));
}

// ---- CALC TABS (Calculadoras) ----
function switchTab(id, el) {
    const tabs = document.querySelectorAll('.nl-tab-pane');
    const btns = document.querySelectorAll('.nl-tab');
    if(!tabs.length) return; // Segurança caso não esteja na página de calcs

    tabs.forEach(p => p.classList.remove('active'));
    btns.forEach(t => t.classList.remove('active'));
    
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
        { max: 18.5, label: 'Abaixo do peso', color: '#1e40af' },
        { max: 25,   label: 'Peso normal ✓',  color: '#166534' },
        { max: 30,   label: 'Sobrepeso',      color: '#854d0e' },
        { max: 35,   label: 'Obesidade grau I', color: '#9a3412' },
        { max: 40,   label: 'Obesidade grau II', color: '#991b1b' },
        { max: Infinity, label: 'Obesidade grau III', color: '#7f1d1d' },
    ];

    const found = classes.find(c => imc < c.max);
    const resDiv = document.getElementById('imc-result');
    
    document.getElementById('imc-num').textContent = imc.toFixed(1);
    document.getElementById('imc-num').style.color = found.color;
    document.getElementById('imc-class').textContent = found.label;

    const pct = Math.min(Math.max(((imc - 15) / 25) * 100, 2), 97);
    document.getElementById('imc-pointer').style.left = pct + '%';
    resDiv.classList.remove('d-none');
}

function clearIMC() {
    document.getElementById('imc-altura').value = '';
    document.getElementById('imc-peso').value = '';
    document.getElementById('imc-result').classList.add('d-none');
}

// ---- TMB (Harris-Benedict) ----
function calcTMB() {
    const sexo = document.getElementById('tmb-sexo').value;
    const idade = parseFloat(document.getElementById('tmb-idade').value);
    const altura = parseFloat(document.getElementById('tmb-altura').value);
    const peso = parseFloat(document.getElementById('tmb-peso').value);
    const fator = parseFloat(document.getElementById('tmb-atividade').value);

    if (!idade || !altura || !peso) {
        showToast('Preencha todos os campos.', 'warning');
        return;
    }

    const tmb = sexo === 'm'
        ? 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
        : 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);

    const tdee = tmb * fator;
    
    document.getElementById('tmb-num').textContent = Math.round(tmb) + ' kcal';
    document.getElementById('tdee-num').textContent = Math.round(tdee) + ' kcal';
    document.getElementById('g-perda').textContent = Math.round(tdee - 500);
    document.getElementById('g-manter').textContent = Math.round(tdee);
    document.getElementById('g-ganho').textContent = Math.round(tdee + 300);
    document.getElementById('tmb-result').classList.remove('d-none');
}

// ---- FOOD SEARCH & MEAL ----
let searchResults = [];

function searchFoods() {
    const q = document.getElementById('food-search').value.trim().toLowerCase();
    const hint = document.getElementById('search-hint');
    const resultsEl = document.getElementById('search-results');

    if (!q) {
        resultsEl.innerHTML = '';
        if(hint) hint.style.display = 'block';
        return;
    }
    if(hint) hint.style.display = 'none';

    // FOODS vem do seu arquivo data.js
    const results = FOODS.filter(f =>
        f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
    searchResults = results;

    if (!results.length) {
        resultsEl.innerHTML = `<p class="text-muted small py-3">Nenhum alimento encontrado para "<strong>${q}</strong>".</p>`;
        return;
    }

    resultsEl.innerHTML = results.map((f, i) => `
        <div class="food-result-card">
            <div class="food-name">${f.name}</div>
            <div class="food-cat">${f.category} · 100g</div>
            <div class="food-qty-row">
                <input type="number" class="qty-input" id="qty-${i}" value="100" min="1">
                <button class="btn nl-btn-primary btn-sm" id="add-btn-${i}" onclick="addToMeal(${i})">+ Adicionar</button>
            </div>
            <button class="detail-toggle" onclick="toggleDetail(${i})">▼ Detalhes</button>
            <div class="food-details" id="det-${i}">
                <p>Calorias: ${f.cal} | Prot: ${f.prot}g | Carb: ${f.carb}g | Gord: ${f.fat}g</p>
            </div>
        </div>
    `).join('');
}

function toggleDetail(i) {
    const det = document.getElementById('det-' + i);
    det.classList.toggle('open');
}

function addToMeal(i) {
    const food = searchResults[i];
    const qty = parseFloat(document.getElementById('qty-' + i).value) || 100;
    const f = qty / 100;

    meal.push({
        name: food.name, qty,
        cal: +(food.cal * f).toFixed(1),
        prot: +(food.prot * f).toFixed(1),
        carb: +(food.carb * f).toFixed(1),
        fat: +(food.fat * f).toFixed(1),
        fib: +(food.fib * f).toFixed(1),
    });

    saveMealToStorage();
    renderMeal();
    
    const btn = document.getElementById('add-btn-' + i);
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = '+ Adicionar'; }, 1000);
}

function renderMeal() {
    const itemsEl = document.getElementById('meal-items');
    const countEl = document.getElementById('meal-count');
    if (!itemsEl) return; // Sai se não estiver na página de nutrição

    if(countEl) countEl.textContent = meal.length + (meal.length === 1 ? ' item' : ' itens');

    if (!meal.length) {
        itemsEl.innerHTML = '<p class="text-muted small text-center py-3">Refeição vazia</p>';
    } else {
        itemsEl.innerHTML = meal.map((m, i) => `
            <div class="meal-item-row d-flex justify-content-between">
                <div><strong>${m.name}</strong><br><small>${m.qty}g - ${m.cal}kcal</small></div>
                <button class="btn btn-sm text-danger" onclick="removeFromMeal(${i})">×</button>
            </div>
        `).join('');
    }

    const t = meal.reduce((a, m) => ({
        cal: a.cal + m.cal, prot: a.prot + m.prot,
        carb: a.carb + m.carb, fat: a.fat + m.fat, fib: a.fib + m.fib,
    }), { cal:0, prot:0, carb:0, fat:0, fib:0 });

    const totalKcalEl = document.getElementById('total-kcal');
    if(totalKcalEl) totalKcalEl.textContent = t.cal.toFixed(1) + ' kcal';
    
    // Atualiza badges de macro se existirem na tela
    if(document.getElementById('t-prot')) {
        document.getElementById('t-prot').textContent = t.prot.toFixed(1) + 'g';
        document.getElementById('t-carb').textContent = t.carb.toFixed(1) + 'g';
        document.getElementById('t-fat').textContent = t.fat.toFixed(1) + 'g';
        document.getElementById('t-fib').textContent = t.fib.toFixed(1) + 'g';
    }
}

function removeFromMeal(i) { 
    meal.splice(i, 1); 
    saveMealToStorage();
    renderMeal(); 
}

function clearMeal() { 
    meal = []; 
    saveMealToStorage();
    renderMeal(); 
}

// ---- RECEITAS ----
function renderReceitas() {
    const listEl = document.getElementById('receitas-list');
    if(!listEl) return;

    const receitas = JSON.parse(localStorage.getItem('nutrilife_receitas')) || [];
    // ... (lógica de renderização simplificada para brevidade, mantendo seu padrão)
}

// ---- TOAST (Notificações) ----
function showToast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.style.cssText = `background:${type === 'warning' ? '#fef9c3' : '#e8f9ef'}; color:#333; padding:12px; border-radius:8px; shadow: 0 2px 10px rgba(0,0,0,0.1)`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => { 
    renderMeal(); 
    // Se estiver na página de receitas, renderiza automaticamente
    if(document.getElementById('receitas-list')) renderReceitas();
});