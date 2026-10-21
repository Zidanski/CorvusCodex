# Corvus Codex

## O que é o Corvus Codex

Uma biblioteca colaborativa de estudos: estudantes guardam, compartilham e consultam as anotações e os materiais uns dos outros. A ideia é ser uma espécie de "Wikipédia/Brainly mais leve", simples, rápida e acolhedora.

"Corvus" é corvo em latim (o corvo simboliza inteligência e memória) e "Codex" é o livro antigo, o manuscrito.

Projeto da disciplina de Ciência da Computação — Centro Universitário Dom Helder (Belo Horizonte).

**Equipe:** Zidanski Kaniski, Pedro Paulo, Othon Braga, Moises Airã e Pedro Augusto.

---

## Como rodar localmente

Você só precisa ter o [Node.js](https://nodejs.org) (versão LTS) e o Git instalados.

```bash
git clone https://github.com/Zidanski/CorvusCodex.git
cd CorvusCodex
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador.

- `npm install` baixa as dependências (o Express). Só precisa rodar na primeira vez ou quando o `package.json` mudar.
- `npm start` liga o servidor. Para desligar, aperte `Ctrl + C` no terminal.
- `npm run dev` faz o mesmo, mas reinicia sozinho quando você muda o `server.js`.
  (Mudou um HTML ou CSS? É só recarregar a página com F5.)

Lembrete: **ninguém commita direto na `main`**. Cada tarefa vai numa branch e entra por Pull Request:

```bash
git checkout main
git pull
git checkout -b feature/nome-da-tarefa
```

> ⚠ O Acervo, a Pesquisa, o envio e os comentários **precisam do `npm start`**. Se você abrir o HTML direto (duplo clique ou Live Server), essas páginas mostram "Não foi possível falar com o servidor".

### As páginas

| Página | O que faz |
| --- | --- |
| `landing.html` | Página inicial (abre em `/`) |
| `acervo.html` | Lista todos os materiais, com filtros por tipo e disciplina |
| `pesquisa.html` | Procura por palavra (no título, autor, disciplina, etiquetas e resumo). Acentos não importam: "calculo" acha "Cálculo" |
| `material.html?id=3` | Detalhes de um material e a área de comentários |
| `enviar.html` | Formulário para enviar um material novo |
| `comentarios.html` | Os comentários mais recentes de todo o acervo |
| `login.html`, `cadastro.html` | Ainda são demonstração: não existem contas de verdade |
| `404.html` | Página de "não encontrada" |

### Onde fica cada coisa

| Arquivo / pasta | Para que serve |
| --- | --- |
| `css/tokens.css` | **Todas** as cores, fontes e espaçamentos |
| `css/estilo.css` | Estilo do site (usa as variáveis do tokens.css) |
| `js/tema.js` | Botão de tema claro/escuro |
| `js/formularios.js` | Mensagens de erro dos formulários |
| `js/materiais.js` | Funções comuns: falar com a API e montar os cartões |
| `js/acervo.js`, `js/pesquisa.js`, ... | O script de cada página (mesmo nome da página) |
| `server.js` | Servidor local (Express) e a API |
| `data/materiais-exemplo.json` | Os dados de exemplo (**fictícios**) |
| `data/banco.json` | Os dados que o site grava enquanto você testa (criado sozinho, **não vai para o Git**) |

### Os dados (livros fictícios)

Os 12 materiais e 8 comentários que aparecem no site são **inventados**: livros, autores e estudantes não existem. Eles ficam em `data/materiais-exemplo.json`.

Na primeira vez que você roda `npm start`, o servidor copia esse arquivo para `data/banco.json`. Tudo o que você enviar ou comentar vai para o `banco.json`, que fica só no seu computador. Assim os testes de um colega não bagunçam os do outro.

Quer voltar aos dados de exemplo? Desligue o servidor (`Ctrl + C`) e rode:

```bash
npm run resetar-dados
```

Quer acrescentar um material de exemplo para todo o grupo? Edite o `data/materiais-exemplo.json`, rode `npm run resetar-dados` e mande no seu PR.

### A API (para quem for mexer no JavaScript)

As páginas conversam com o servidor por estes endereços:

| Método | Endereço | O que faz |
| --- | --- | --- |
| GET | `/api/materiais?q=&tipo=&disciplina=` | Lista ou pesquisa materiais |
| GET | `/api/materiais/3` | Um material, com os comentários |
| POST | `/api/materiais` | Cria um material |
| POST | `/api/materiais/3/comentarios` | Comenta no material 3 |
| GET | `/api/comentarios` | Comentários mais recentes |
| GET | `/api/opcoes` | Listas de tipos e disciplinas |

Duas regras de segurança que o código já segue (continuem seguindo):
- O servidor confere todos os dados de novo, mesmo que a página já tenha conferido.
- Texto que veio de um usuário entra na página com `textContent`, **nunca** com `innerHTML`. Assim, se alguém escrever `<script>` num comentário, aparece como texto e não vira código.

---

## Identidade visual

### Paleta

| Papel | Variável | Tema claro | Tema escuro |
| --- | --- | --- | --- |
| Fundo | `--cor-fundo` | `#F2FBFC` | `#0E1C2B` |
| Superfície (cartões, campos) | `--cor-superficie` | `#FFFFFF` | `#16283A` |
| Texto | `--cor-texto` | `#14212B` | `#E8F1F5` |
| **Azul**: principal (links, botões) | `--cor-primaria` | `#1F5F8B` | `#6FB3E0` |
| **Verde**: destaque e sucesso | `--cor-destaque` | `#2E7D5B` | `#6CCB9C` |
| **Marrom**: apoio (bordas, detalhes, rodapé) | `--cor-apoio` | `#7A5230` | `#C49A6C` |
| Borda decorativa | `--cor-borda` | `#D6E4E8` | `#2A3F55` |
| Borda de campos | `--cor-borda-campo` | `#6B7F8C` | `#7D93A6` |
| Erro | `--cor-erro` | `#B3261E` | `#FF9B8F` |
| Cabeçalho | `--cor-cabecalho` | `#1F5F8B` | `#13324D` |

### Fontes

- **Títulos:** Merriweather (serifada, dá o ar de livro).
- **Texto:** Atkinson Hyperlegible (feita para pessoas com baixa visão).
- Tamanho base de 16px, sempre em `rem` (1rem = 16px), e altura de linha de 1.6.

### Regra de ouro: use sempre as variáveis, nunca cor fixa

Os tokens ficam em `css/tokens.css`. Nos outros CSS, escreva assim:

```css
/* ✅ certo */
.cartao { color: var(--cor-texto); background: var(--cor-superficie); }

/* ❌ errado: não muda no tema escuro e foge da paleta */
.cartao { color: #333; background: white; }
```

Precisa de uma cor que não existe? Crie a variável no `tokens.css` (nos **dois** temas), confira o contraste e só depois use.

### Página nova? Copie este `<head>`

```html
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nome da Página — Corvus Codex</title>
    <link rel="stylesheet" href="css/tokens.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Merriweather:wght@400;700&display=swap">
    <link rel="stylesheet" href="css/estilo.css">
    <script src="js/tema.js"></script>
</head>
```

E copie o `<body>` de uma página existente (link de pular, cabeçalho com o botão de tema, `<main id="conteudo">` e rodapé).

---

## Acessibilidade

Acessibilidade é um pilar do projeto. Antes de abrir um PR com uma página nova, confira:

- [ ] `<html lang="pt-BR">` e um `<title>` real (`Página — Corvus Codex`).
- [ ] Estrutura com `<header>`, `<nav>`, `<main id="conteudo">` e `<footer>`.
- [ ] **Um único `<h1>`** por página e títulos em ordem (h1 → h2 → h3, sem pular).
- [ ] Link "Pular para o conteúdo" no topo.
- [ ] Botão "Alternar tema claro/escuro" no cabeçalho.
- [ ] Contraste mínimo de **4.5:1** para texto normal e **3:1** para texto grande, ícones e bordas de campos, **nos dois temas**. Teste em https://webaim.org/resources/contrastchecker/
- [ ] Foco visível em tudo que é clicável. **Nunca** use `outline: none` sem colocar outro destaque no lugar.
- [ ] Dá para usar a página inteira **só com o teclado** (Tab, Shift+Tab, Enter, Esc).
- [ ] Toda imagem tem `alt` descritivo (o corvo do logo usa `alt="Corvus Codex"`). Imagem só de enfeite usa `alt=""`.
- [ ] Todo campo de formulário tem um `<label for="id-do-campo">` ligado a ele.
- [ ] Mensagens de erro em **texto**, não só em cor vermelha (use `<form data-validar>` com o `js/formularios.js`).
- [ ] A cor nunca é a única forma de passar informação (use também texto, ícone ou sublinhado).
- [ ] Animações respeitam `prefers-reduced-motion` (o `estilo.css` já faz isso).
- [ ] Botões e links com área de toque de pelo menos **44×44px** (use `var(--tamanho-toque)`).
- [ ] Funciona no celular com **360px** de largura, sem rolagem para os lados (no navegador: F12 → ícone de celular).
