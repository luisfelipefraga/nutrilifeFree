# 🥗 NutriLife

Plataforma de nutrição com busca de alimentos, calculadoras de saúde e receitas da comunidade.

---

## 📁 Estrutura do projeto

```
nutrilife/
├── index.html   → todas as páginas (SPA)
├── style.css    → customizações sobre Bootstrap 5
├── data.js      → base de 55 alimentos
├── app.js       → lógica (calculadoras, busca, receitas)
└── README.md    → este arquivo
```

---

## 🚀 Como publicar do zero (sem Git instalado)

### PASSO 1 — Instalar o Git

Baixe em: https://git-scm.com/download/win
→ Instale com as opções padrão (Next, Next, Finish)
→ Abra o **Git Bash** (aparece no menu iniciar após instalar)

---

### PASSO 2 — Configurar seu nome no Git (só uma vez)

Abra o **Git Bash** e cole:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

### PASSO 3 — Criar conta no GitHub

Acesse https://github.com e crie uma conta gratuita.

---

### PASSO 4 — Criar o repositório no GitHub

1. Clique em **"New repository"** (botão verde ou símbolo +)
2. Nome: `nutrilife`
3. Deixe como **Public**
4. **NÃO marque** "Add a README file"
5. Clique em **"Create repository"**
6. Copie a URL que aparece — será algo como:
   `https://github.com/SEU_USUARIO/nutrilife.git`

---

### PASSO 5 — Inicializar o projeto localmente

No **Git Bash**, navegue até a pasta do projeto:

```bash
cd /caminho/para/sua/pasta/nutrilife
# Exemplo Windows: cd /c/Users/SeuNome/Downloads/nutrilife
```

Depois rode estes comandos **um por um**:

```bash
git init
git add .
git commit -m "Primeiro commit - NutriLife MVP"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/nutrilife.git
git push -u origin main
```

> ⚠️ Substitua `SEU_USUARIO` pelo seu usuário do GitHub.
> Na primeira vez, o GitHub vai pedir login/senha ou um token.

---

### PASSO 6 — Ativar o GitHub Pages

1. No repositório do GitHub, clique em **Settings**
2. No menu lateral, clique em **Pages**
3. Em *Source*, selecione **Deploy from a branch**
4. Em *Branch*, escolha **main** e pasta **/ (root)**
5. Clique em **Save**
6. Aguarde ~2 minutos

✅ Seu site estará em:
`https://SEU_USUARIO.github.io/nutrilife`

---

## 🔄 Como atualizar o site depois de editar arquivos

Sempre que fizer mudanças nos arquivos, rode no **Git Bash** dentro da pasta:

```bash
git add .
git commit -m "descrição do que mudou"
git push
```

O GitHub Pages atualiza automaticamente em ~1 minuto.

---

## 🌟 Funcionalidades

| Página | O que faz |
|---|---|
| **Home** | Apresentação + seção educativa sobre calorias e emagrecimento |
| **Nutrição** | Busca em 55 alimentos, macros detalhados, montagem de refeição |
| **Calculadoras** | IMC com barra visual + TMB/Harris-Benedict com metas por objetivo |
| **Receitas** | Publicar e listar receitas da comunidade (salvas no navegador) |

## 🛠️ Tecnologias

- HTML5 + CSS3 + JavaScript puro
- Bootstrap 5.3 (CDN) + Bootstrap Icons
- Google Fonts: Sora + DM Sans
- Dados persistidos via localStorage (sem backend)
