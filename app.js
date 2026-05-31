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

  if (!q) { 
    container.innerHTML = `<p class="text-muted text-center py-4">Digite algo acima para pesquisar...</p>`; 
    return; 
  }

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
        <span class="nl-food-kcal flex-shrink-0">
          <span id="kcal-val-${f.id}" data-base="${f.cal}">${f.cal}</span> kcal
        </span>
      </div>
      <div class="nl-add-row">
        <label class="nl-label mb-0" style="white-space:nowrap">Qtd (g):</label>
        <input type="number" class="form-control nl-input nl-qty-input" id="qty-${f.id}"
          value="100" min="1" max="2000" style="width:90px; flex-shrink:0" oninput="atualizarNutrientesDinamico(${f.id})">
        <button class="btn btn-sm btn-outline-secondary py-1" onclick="toggleDetails(${f.id})">
          <i class="bi bi-info-circle"></i> Detalhes
        </button>  
        <button class="btn nl-btn-add flex-grow-1 flex-sm-grow-0" onclick="addToMeal(${f.id})">
          <i class="bi bi-plus-circle me-1"></i>Adicionar à refeição
        </button>
      </div>
      <div id="details-${f.id}" class="nl-food-details row g-2 mt-2 pt-2 border-top small text-muted">
      <div class="col-6 col-sm-3">
        <span class="nl-macro-tag nl-prot-tag d-block text-center text-sm-start">
          💪 Prot: <span id="prot-val-${f.id}" data-base="${f.prot}">${f.prot}</span>g
        </span>
      </div>
      <div class="col-6 col-sm-3">
        <span class="nl-macro-tag nl-carb-tag d-block text-center text-sm-start">
          ⚡ Carb: <span id="carb-val-${f.id}" data-base="${f.carb}">${f.carb}</span>g
        </span>
      </div>
      <div class="col-6 col-sm-3">
        <span class="nl-macro-tag nl-fat-tag d-block text-center text-sm-start">
          🫙 Gord: <span id="fat-val-${f.id}" data-base="${f.fat}">${f.fat}</span>g
        </span>
      </div>
      <div class="col-6 col-sm-3">
        <span class="nl-macro-tag nl-fib-tag d-block text-center text-sm-start">
          🌿 Fib: <span id="fib-val-${f.id}" data-base="${f.fib}">${f.fib}</span>g
        </span>
      </div>
    </div>
  </div>
  `).join('');
}

function toggleDetails(id) {
    const detailsDiv = document.getElementById(`details-${id}`);
      if (detailsDiv) {
        detailsDiv.classList.toggle('show');
      }    
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
  meal = []; // Esvazia o array de alimentos
  renderMeal(); // Certifique-se que esta função redesenha a tela toda
  
  // Força a atualização manual dos campos de texto se eles não estiverem vinculados ao estado
  document.getElementById('total-kcal').innerText = '0 kcal';
  document.getElementById('t-prot').innerText = '0g';
  document.getElementById('t-carb').innerText = '0g';
  document.getElementById('t-fat').innerText = '0g';
  document.getElementById('t-fib').innerText = '0g';
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const toastEl = document.getElementById('meuToast');
    const toastMsg = document.getElementById('toast-mensagem');
    
    // Define a cor baseada no tipo (bootstrap classes)
    toastEl.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toastMsg.textContent = mensagem;

    // Inicializa e mostra o Toast
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

function salvarRefeicaoNaRotina() {
  const diaSelecionado = document.getElementById('select-dia-semana').value;
  const selectCategoria = document.getElementById('select-categoria-refeicao');
  const categoriaSelecionada = selectCategoria.value;

  if (!meal || meal.length === 0) {
        mostrarNotificacao("Adicione pelo menos um alimento antes de salvar!", "warning");
        return; // Interrompe a execução aqui
    }

  if (!diaSelecionado || !categoriaSelecionada) {
    mostrarNotificacao("Por favor, selecione o Dia da Semana e o Tipo de Refeição antes de salvar.", "warning");
    return;
  }

  if (!diaSelecionado) {
    mostrarNotificacao("Por favor, selecione o Dia da Semana antes de salvar.", "warning");
    return;
  }

  if (!categoriaSelecionada) {
    mostrarNotificacao("Por favor, selecione o Tipo de Refeição antes de salvar.", "warning");
    return;
  }

  let rotinaSemanal = JSON.parse(localStorage.getItem('nl-rotina-semanal')) || {};

  // 1º Nível: Garante a existência do dia (ex: "Segunda-feira")
  if (!rotinaSemanal[diaSelecionado]) {
    rotinaSemanal[diaSelecionado] = {};
  }

  // 2º Nível: Garante a existência da categoria mãe (ex: "almoco")
  if (!rotinaSemanal[diaSelecionado][categoriaSelecionada]) {
    rotinaSemanal[diaSelecionado][categoriaSelecionada] = {};
  }

  // 3º Nível: Descoberta dinâmica do número da sub-refeição
  // Se for a primeira, vira "almoco 1". Se já tiver uma, vira "almoco 2", e assim por diante.
  const subExistentes = Object.keys(rotinaSemanal[diaSelecionado][categoriaSelecionada]);
  const proximoNumero = subExistentes.length + 1;
  const chaveSubRefeicao = `${categoriaSelecionada}_${proximoNumero}`;

  // Injeta os dados da sub-refeição mantendo o histórico
  rotinaSemanal[diaSelecionado][categoriaSelecionada][chaveSubRefeicao] = {
    nomeExibicao: `${selectCategoria.options[selectCategoria.selectedIndex].text} ${proximoNumero}`,
    alimentos: [...meal],
    totalKcal: Math.round(meal.reduce((total, item) => total + (item.cal || 0), 0))
  };

  localStorage.setItem('nl-rotina-semanal', JSON.stringify(rotinaSemanal));

  mostrarNotificacao(`Sucesso! Salva como "${selectCategoria.options[selectCategoria.selectedIndex].text} ${proximoNumero}" na ${diaSelecionado}.`, "success");
  
  
  clearMeal();

  document.getElementById('select-dia-semana').selectedIndex = 0;
  selectCategoria.selectedIndex = 0;

  // Atualiza a tela se o container estiver presente
  const container = document.getElementById('semana-refeicoes-container');
  if (container) {
    renderizarRotinaSemanal();
  }
}

function atualizarNutrientesDinamico(idAlimento) {
  const inputQuantidade = document.getElementById(`qty-${idAlimento}`);
  if (!inputQuantidade) return;

  // Força o valor mínimo a ser 0 se o usuário apagar tudo no input
  const quantidadeAtual = parseFloat(inputQuantidade.value) || 0;

  // Lista todos os elementos que precisam mudar
  const macros = ['kcal', 'prot', 'carb', 'fat', 'fib'];

  macros.forEach(macro => {
    const elementoValor = document.getElementById(`${macro}-val-${idAlimento}`);
    if (!elementoValor) return;

    // Se o data-base sumir por algum motivo, ele pega o texto atual do HTML como fallback
    let valorBase100g = parseFloat(elementoValor.getAttribute('data-base'));
    if (isNaN(valorBase100g)) {
      valorBase100g = parseFloat(elementoValor.textContent) || 0;
      // Salva de volta para não perder a referência na próxima digitação
      elementoValor.setAttribute('data-base', valorBase100g);
    }

    // Regra de três: (Valor para 100g * Quantidade atual) / 100
    const valorProporcional = (valorBase100g * quantidadeAtual) / 100;

    // Exibição amigável dos números
    if (valorProporcional === 0) {
      elementoValor.textContent = "0";
    } else if (valorProporcional % 1 === 0) {
      elementoValor.textContent = valorProporcional.toFixed(0);
    } else {
      elementoValor.textContent = valorProporcional.toFixed(1);
    }
  });
}
// ==========================================================================
// MÓDULO: ROTINA SEMANAL DE REFEIÇÕES (NutriLife)
// ==========================================================================

const diasSemana = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", 
  "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

const categoriasRefeicao = [
  { id: "cafe", nome: "Café da Manhã", icone: "bi-cup-hot", cor: "text-success" },
  { id: "lanche", nome: "Lanche", icone: "bi-apple", cor: "text-warning" },
  { id: "almoco", nome: "Almoço", icone: "bi-sun", cor: "text-success" },
  { id: "janta", nome: "Jantar", icone: "bi-moon-stars", cor: "text-info" }
];

function renderizarRotinaSemanal() {
  const container = document.getElementById('semana-refeicoes-container');
  if (!container) return;

  const dadosSemana = JSON.parse(localStorage.getItem('nl-rotina-semanal')) || {};
  container.innerHTML = ''; 

  const diasDaSemana = [
    "Segunda-feira", "Terça-feira", "Quarta-feira", 
    "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
  ];

  // Adicionamos a propriedade "nome" para forçar um título limpo sem números
  const mapaIcones = {
    'cafe': { icone: 'bi-cup-hot', cor: 'text-success', nome: 'Café da Manhã' },
    'lanche': { icone: 'bi-apple', cor: 'text-warning', nome: 'Lanche' },
    'almoco': { icone: 'bi-sun', cor: 'text-success', nome: 'Almoço' },
    'janta': { icone: 'bi-moon-stars', cor: 'text-info', nome: 'Jantar' }
  };

  diasDaSemana.forEach((dia, indexDia) => {
    const categoriasDoDia = dadosSemana[dia] || {};
    let htmlSubRefeicoes = '';

    // 1º Nível: Extrair todas as refeições do dia para um Array para podermos ordenar
    let refeicoesDoDia = [];
    for (const categoriaMae in categoriasDoDia) {
      const subRefeicoes = categoriasDoDia[categoriaMae] || {};
      for (const idSub in subRefeicoes) {
        const dadosSub = subRefeicoes[idSub] || {};
        if (dadosSub.alimentos && dadosSub.alimentos.length > 0) {
          refeicoesDoDia.push({
            categoriaMae,
            idSub,
            ...dadosSub
          });
        }
      }
    }

    // 2º Nível: Ordenar as refeições pela hora (se não tiver hora, joga pro final '23:59')
    refeicoesDoDia.sort((a, b) => {
      const horaA = a.hora || '23:59';
      const horaB = b.hora || '23:59';
      return horaA.localeCompare(horaB);
    });

    // 3º Nível: Montar o HTML das refeições
    refeicoesDoDia.forEach((refeicao, indexSub) => {
      let totalProt = 0, totalCarb = 0, totalFat = 0, totalFib = 0;

      const htmlAlimentos = refeicao.alimentos.map(f => {
        totalProt += Number(f.prot) || 0;
        totalCarb += Number(f.carb) || 0;
        totalFat  += Number(f.fat) || 0;
        totalFib  += Number(f.fib) || 0;

        return `
          <div class="d-flex justify-content-between align-items-center py-1 border-bottom border-translucent fs-7">
            <span>${f.name} <small class="text-muted">(${f.qty}g)</small></span>
            <span class="badge bg-light text-dark fw-normal">${Number(f.cal).toFixed(1)} kcal</span>
          </div>
        `;
      }).join('');

      const idColapso = `collapse-${indexDia}-${indexSub}`;
      const idColapsoNutri = `collapse-nutri-${indexDia}-${indexSub}`; 
      
      // Resgata os dados visuais limpos do mapa (ex: "Almoço" em vez de "Almoço 1")
      const infoVisual = mapaIcones[refeicao.categoriaMae] || { icone: 'bi-egg-fried', cor: 'text-secondary', nome: refeicao.categoriaMae };

      htmlSubRefeicoes += `
        <div class="sub-refeicao-item mb-3 ps-2 border-start border-2 border-success">
          <div class="d-flex justify-content-between align-items-start py-1">
            
            <div class="d-flex flex-column gap-1">
              <span class="fw-bold text-uppercase fs-8 text-muted tracking-wide">
                <i class="bi ${infoVisual.icone} ${infoVisual.cor} me-1"></i>${infoVisual.nome}
              </span>
              
              <div class="d-flex align-items-center gap-2 mt-1">
                <span class="badge bg-success-subtle text-success fs-8">${refeicao.totalKcal || 0} kcal</span>
                
                <div class="d-flex align-items-center text-muted">
                  <i class="bi bi-clock fs-8 me-1"></i>
                  <input type="text" class="form-control form-control-sm border-0 bg-transparent text-muted p-0 shadow-none text-center" 
                         style="width: 45px; font-size: 0.75rem;" 
                         value="${refeicao.hora || ''}" 
                         placeholder="--:--"
                         maxlength="5"
                         oninput="mascaraHora(this)"
                         onchange="atualizarHoraRefeicao('${dia}', '${refeicao.categoriaMae}', '${refeicao.idSub}', this.value)" 
                         title="Definir horário (HH:MM)">
                </div>
              </div>
            </div>
            
            <div class="d-flex-wrap align-items-center gap-2 mt-1">
              <button class="btn btn-link btn-sm p-0 text-decoration-none fs-7" 
                      type="button" data-bs-toggle="collapse" data-bs-target="#${idColapso}" aria-expanded="false">
                Detalhes <i class="bi bi-chevron-down fs-8"></i>
              </button>
              <button class="btn btn-link btn-sm p-0 text-danger ms-auto" 
                      onclick="excluirRefeicao('${dia}', '${refeicao.categoriaMae}', '${refeicao.idSub}')" title="Excluir refeição">
                <i class="bi bi-trash fs-6"></i>
              </button>
            </div>

          </div>
          
          <div class="collapse mt-1 p-2 bg-transparent rounded" id="${idColapso}">
            ${htmlAlimentos}
            
            <div class="mt-2 pt-2 border-top border-translucent text-center">
              <button class="btn btn-sm nl-btn-primary w-100 fs-8 text-muted" type="button" data-bs-toggle="collapse" data-bs-target="#${idColapsoNutri}">
                <i class="bi bi-bar-chart me-1"></i> Detalhes nutricionais
              </button>
              <div class="collapse mt-2" id="${idColapsoNutri}">
                <div class="d-flex flex-wrap gap-1 justify-content-center">
                  <span class="nl-macro-tag nl-prot-tag d-block text-center text-sm-start fs-8 px-2 py-1">💪 Prot: ${totalProt.toFixed(1)}g</span>
                  <span class="nl-macro-tag nl-carb-tag d-block text-center text-sm-start fs-8 px-2 py-1">⚡ Carb: ${totalCarb.toFixed(1)}g</span>
                  <span class="nl-macro-tag nl-fat-tag d-block text-center text-sm-start fs-8 px-2 py-1">🫙 Gord: ${totalFat.toFixed(1)}g</span>
                  <span class="nl-macro-tag nl-fib-tag d-block text-center text-sm-start fs-8 px-2 py-1">🌿 Fib: ${totalFib.toFixed(1)}g</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    });

    const corpoCardHtml = htmlSubRefeicoes ? `<div class="categoria-mae-box">${htmlSubRefeicoes}</div>` : `
      <div class="text-center py-4 text-muted">
        <i class="bi bi-calendar-x d-block fs-4 mb-2 opacity-50"></i>
        <p class="m-0 fs-7">Nenhuma refeição planejada.</p>
      </div>
    `;

    const cardDiaHtml = `
      <div class="col-12 col-md-4 col-lg-3 mb-4">
        <div class="card nl-card shadow-sm h-100">
          <div class="card-header bg-transparent border-0 pt-3 pb-0">
            <h5 class="card-title fw-bold m-0 text-success">${dia}</h5>
          </div>
          <div class="card-body">
            ${corpoCardHtml}
          </div>
        </div>
      </div>
    `;

    container.innerHTML += cardDiaHtml;
  });
}

function exportarRotinaParaPDF() {
  const dadosSemana = JSON.parse(localStorage.getItem('nl-rotina-semanal')) || {};
  
  if (Object.keys(dadosSemana).length === 0) {
    mostrarNotificacao("Não há dados de refeições para exportar!", "warning");
    return;
  }

  const diasDaSemana = [
    "Segunda-feira", "Terça-feira", "Quarta-feira", 
    "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
  ];

  let conteudoHTML = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2D3748; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 2px solid #2F855A; padding-bottom: 15px; margin-bottom: 30px;">
        <h1 style="color: #2F855A; margin: 0 0 5px 0; font-size: 26px; font-weight: bold;">NutriLife</h1>
        <p style="color: #718096; margin: 0; font-size: 14px; text-transform: uppercase; tracking-wide: 1px;">Planejamento de Rotina Semanal</p>
      </div>
  `;

  let temDados = false;

  diasDaSemana.forEach(dia => {
    const categoriasDoDia = dadosSemana[dia] || {};
    
    let temAlimentoNoDia = false;
    for (const cat in categoriasDoDia) {
      for (const sub in categoriasDoDia[cat]) {
        if (categoriasDoDia[cat][sub].alimentos && categoriasDoDia[cat][sub].alimentos.length > 0) {
          temAlimentoNoDia = true;
          temDados = true;
        }
      }
    }

    if (temAlimentoNoDia) {
      conteudoHTML += `
        <div style="margin-bottom: 25px; page-break-inside: avoid;">
          <h2 style="color: #2F855A; font-size: 18px; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; margin-bottom: 12px;">${dia}</h2>
      `;

      for (const categoriaMae in categoriasDoDia) {
        const subRefeicoes = categoriasDoDia[categoriaMae] || {};

        for (const idSub in subRefeicoes) {
          const dadosSub = subRefeicoes[idSub] || {};
          const alimentos = dadosSub.alimentos || [];

          if (alimentos.length === 0) continue;

          // Calcula os macros totais...
          let totalProt = 0, totalCarb = 0, totalFat = 0, totalFib = 0;
          const stringAlimentos = alimentos.map(alimento => {
            totalProt += Number(alimento.prot) || 0;
            totalCarb += Number(alimento.carb) || 0;
            totalFat  += Number(alimento.fat) || 0;
            totalFib  += Number(alimento.fib) || 0;
            return `${alimento.name} (${alimento.qty}g)`;
          }).join(', ');

          // Captura a hora salva (ou define um valor padrão caso esteja vazia)
          const horario = dadosSub.hora ? dadosSub.hora : '--:--';

          // Bloco HTML atualizado com a inclusão da hora
          conteudoHTML += `
            <div style="margin-bottom: 15px; padding-left: 10px;">
              <div style="display: flex; align-items: baseline;">
                <strong style="font-size: 14px; color: #4A5568;">${dadosSub.nomeExibicao || categoriaMae}</strong> 
                <span style="font-size: 12px; color: #4d4d4d; margin-left: 8px; font-weight: bold;">
                  🕒 ${horario}
                </span>
                <span style="font-size: 12px; color: #3e3f41; margin-left: 8px;">(${dadosSub.totalKcal || 0} kcal)</span>
              </div>
              
              <p style="margin: 3px 0 0 0; font-size: 14px; color: 4d4d4d; line-height: 1.4;">${stringAlimentos}</p>
              
              <div style="margin-top: 6px; font-size: 11px; color: 4d4d4d; background-color: #F7FAFC; padding: 4px 8px; border-radius: 4px; display: inline-block;">
                <strong>Valores Totais:</strong> 
                Prot: ${totalProt.toFixed(1)}g | Carb: ${totalCarb.toFixed(1)}g | Gord: ${totalFat.toFixed(1)}g | Fib: ${totalFib.toFixed(1)}g
              </div>
            </div>
          `;
        }
      }

      conteudoHTML += `</div>`;
    }
  });

  conteudoHTML += `
      <div style="margin-top: 40px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px;">
        <small style="color: #4d4d4d; font-size: 11px;">Documento gerado automaticamente pelo NutriLife.</small>
      </div>
    </div>
  `;

  if (!temDados) {
    mostrarNotificacao("Não há Refeições adicionadas para exportar.", "warning");
    return;
  }

  const configuracoes = {
    margin:       [20, 20, 20, 20],
    filename:     'NutriLife_Plano_Alimentar.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true,
      backgroundColor: '#FFFFFF'
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf()
    .set(configuracoes)
    .from(conteudoHTML)
    .save()
    .catch(erro => {
      console.error("Erro na geração do PDF: ", erro);
      mostrarNotificacao("Ocorreu um erro ao gerar o seu PDF. Verifique o console!", "danger");
    });
}

// CORREÇÃO DA INICIALIZAÇÃO ÚNICA:
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM totalmente carregado. Iniciando renderização da rotina...");
  
  // Chama o nome REAL e correto da função
  renderizarRotinaSemanal();
  
  const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  const iconEl = document.querySelector('#btn-dark-mode i');
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (iconEl) iconEl.className = 'bi bi-sun-fill';
  } else {
    document.body.classList.remove('dark-mode');
    if (iconEl) iconEl.className = 'bi bi-moon-fill';
  }
});

// Função para atualizar a hora direto do card
function atualizarHoraRefeicao(dia, categoriaMae, idSub, novaHora) {
  const dadosSemana = JSON.parse(localStorage.getItem('nl-rotina-semanal')) || {};
  
  if (dadosSemana[dia] && dadosSemana[dia][categoriaMae] && dadosSemana[dia][categoriaMae][idSub]) {
    // Atualiza a hora no objeto
    dadosSemana[dia][categoriaMae][idSub].hora = novaHora;
    
    // Salva no LocalStorage e renderiza de novo (para a refeição mudar de posição instantaneamente)
    localStorage.setItem('nl-rotina-semanal', JSON.stringify(dadosSemana));
    renderizarRotinaSemanal();
  }
}
function mascaraHora(campo) {
  // Remove tudo que não for número e limita a 4 caracteres no máximo
  let valor = campo.value.replace(/\D/g, '').substring(0, 4);

  if (valor.length > 0) {
    // 1. Valida a parte das horas (primeiros 2 dígitos)
    let horas = valor.substring(0, 2);
    if (horas.length === 2 && parseInt(horas) > 23) {
      horas = '23'; // Trava no máximo em 23h
    } else if (horas.length === 1 && parseInt(horas) > 2) {
      horas = '0' + horas; // Se digitar de 3 a 9 no 1º dígito, assume que é 03 a 09
    }

    // 2. Valida a parte dos minutos (últimos 2 dígitos)
    let minutos = valor.substring(2, 4);
    if (minutos.length === 2 && parseInt(minutos) > 59) {
      minutos = '59'; // Trava no máximo em 59m
    } else if (minutos.length === 1 && parseInt(minutos) > 5) {
      minutos = '0' + minutos; // Se digitar de 6 a 9 no 1º dígito dos minutos, assume 06 a 09
    }

    // 3. Remonta o valor final com os dois pontos
    if (valor.length > 2) {
      valor = horas + ':' + minutos;
    } else {
      valor = horas;
    }
  }

  campo.value = valor;
}

// Função para excluir uma refeição específica
let dadosParaExcluir = {};

function excluirRefeicao(dia, categoriaMae, idSub) {
  // Armazena os dados
  dadosParaExcluir = { dia, categoriaMae, idSub };
  
  // Atualiza o texto e abre o modal
  document.getElementById('modalMensagem').textContent = `Tem certeza que deseja excluir esta refeição de ${dia}?`;
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
  modal.show();

  document.getElementById('btnConfirmarExclusao').addEventListener('click', function() {
  const { dia, categoriaMae, idSub } = dadosParaExcluir;
  
  const dadosSemana = JSON.parse(localStorage.getItem('nl-rotina-semanal')) || {};
  
  if (dadosSemana[dia] && dadosSemana[dia][categoriaMae]) {
    delete dadosSemana[dia][categoriaMae][idSub];
    if (Object.keys(dadosSemana[dia][categoriaMae]).length === 0) {
      delete dadosSemana[dia][categoriaMae];
    }
    localStorage.setItem('nl-rotina-semanal', JSON.stringify(dadosSemana));
    renderizarRotinaSemanal();
    
    // Fecha o modal e mostra a notificação de sucesso
    bootstrap.Modal.getInstance(document.getElementById('modalConfirmacao')).hide();
    mostrarNotificacao("Refeição excluída com sucesso!", "success");
  }
});
}

// Evento disparado quando clica no botão "Sim, excluir" dentro do modal



/* ---------- CALCULADORA IMC ---------- */

function calcIMC() {
  const h = parseFloat(document.getElementById('imc-altura')?.value);
  const w = parseFloat(document.getElementById('imc-peso')?.value);
  if (!w) { mostrarNotificacao("Preencha algum valor de peso!", "warning"); return; } 
  if (!h) { mostrarNotificacao("Preencha algum valor de altura!", "warning"); return; } 
  if (h < 100 || h > 270 ) { mostrarNotificacao("Preencha a altura com valores válidos!", "warning"); return; } 
  if (w < 29 || w > 673) { mostrarNotificacao("Preencha o peso com valores válidos!", "warning"); return; } 

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

  if (!idade || !altura || !peso) { mostrarNotificacao("Preencha todos os campos.", "warning"); return; } 
  if (!peso) { mostrarNotificacao("Preencha algum valor de peso!", "warning"); return; } 
  if (!altura) { mostrarNotificacao("Preencha algum valor de altura!", "warning"); return; } 
  if (!idade) { mostrarNotificacao("Preencha algum valor de idade!", "warning"); return; } 
  if (altura < 100 || altura > 270 ) { mostrarNotificacao("Preencha a altura com valores válidos!", "warning"); return; } 
  if (peso < 29 || peso > 673) { mostrarNotificacao("Preencha o peso com valores válidos!", "warning"); return; } 
  if (idade <=0 || idade >=150) { mostrarNotificacao("Preencha a idade com valores válidos.", "warning"); return; } 
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

/* ---------- DARK MODE LOGIC ---------- */

function initDarkMode() {
  const savedTheme = localStorage.getItem('nl-theme');
  const body = document.body;
  const html = document.documentElement; // Captura a tag html para o Bootstrap
  const btn = document.getElementById('btn-dark-mode');

  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    html.setAttribute('data-bs-theme', 'dark'); // Força o Bootstrap a entrar em Dark Mode
    if (btn) btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    body.classList.remove('dark-mode');
    html.setAttribute('data-bs-theme', 'light'); // Força o Bootstrap a entrar em Light Mode
    if (btn) btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
}

function toggleDarkMode() {
  const body = document.body;
  const html = document.documentElement; // Captura a tag html para o Bootstrap
  const btn = document.getElementById('btn-dark-mode');
  
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('nl-theme', 'dark');
    html.setAttribute('data-bs-theme', 'dark'); // Atualiza o Bootstrap para Dark
    if (btn) btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    localStorage.setItem('nl-theme', 'light');
    html.setAttribute('data-bs-theme', 'light'); // Atualiza o Bootstrap para Light
    if (btn) btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
}
