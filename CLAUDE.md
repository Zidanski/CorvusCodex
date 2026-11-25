# CORVUS CODEX — instruções para o Claude Code

Leia este arquivo inteiro antes de qualquer tarefa. Os detalhes estão na pasta `docs/`.

## Quem sou eu e como me ajudar

- Sou o Zidanski, estudante de Ciência da Computação (Centro Universitário Dom Helder, BH).
- Este é um **projeto de faculdade em grupo**. Somos iniciantes.
- **Explique cada passo em português simples** enquanto trabalha. Quero entender, não só receber o código.
- Antes de mudar layout, estrutura de pastas ou nomes de arquivos, **pergunte**.

## O que é o projeto

Corvus Codex é uma **biblioteca colaborativa de estudos**: estudantes enviam, pesquisam e comentam
materiais (livros, resumos, anotações). Uma "Wikipédia/Brainly mais leve". Detalhes: `docs/01-projeto.md`.

## O objetivo agora

Transformar o site estático da pasta `simples/` num **web app com Firebase**
(Hosting + Authentication + Firestore). Plano passo a passo: `docs/05-plano-firebase.md`.

## REGRA Nº 1: CÓDIGO DE ESTUDANTE

O código tem que parecer feito por um aluno do começo do curso. Simples, legível, sem truques.

**Pode usar:**
- HTML, CSS e JavaScript puros. Um arquivo `.js` por página, com o mesmo nome da página (`acervo.html` → `js/acervo.js`).
- `document.getElementById`, `addEventListener`, `if/else`, `for`, funções com nome (`function carregarMateriais() {}`).
- `async/await` nas chamadas do Firebase (explique o que é na primeira vez).
- `<script type="module">` só porque o Firebase pelo CDN exige. Explique o porquê.
- Nomes de variáveis, funções, ids e classes **em português**, minúsculo, com hífen no CSS (`.cartao-material`) e camelCase no JS (`listaMateriais`).
- Comentários curtos em português explicando o que cada bloco faz.

**Não use:**
- Frameworks ou bibliotecas (React, Vue, Bootstrap, Tailwind, jQuery...).
- npm, bundlers, Vite, Webpack, TypeScript. O Firebase entra pelo **CDN** (`https://www.gstatic.com/firebasejs/...`). Confira a versão mais recente na documentação oficial.
- Classes JS, `reduce`, encadeamentos longos de `.map().filter()`, operador ternário aninhado, regex complicada.
- CSS com `!important`, seletores muito compridos, animações elaboradas.
- Mais código do que o necessário. Se der para fazer em 10 linhas claras, não faça em 40.

## Regras do CSS (as 7 regras do grupo)

1. Cor só pela variável (`color: var(--azul);`, nunca `#1F5A93` solto).
2. Espaço só pela variável quando existir (`var(--espaco-m)`).
3. Tamanho de texto em `rem`.
4. Classes em português, minúsculo, com hífen.
5. Estilo só no arquivo `.css`. Nada de `style="..."` nem `align="center"` no HTML.
6. Nunca tire o contorno de foco (`outline: none`).
7. Antes de criar classe nova, veja se uma que já existe resolve.

Eu (Zidanski) quero escrever boa parte do CSS **à mão**. Mantenha o `style.css` curto e organizado.
Identidade visual completa: `docs/02-identidade-visual.md`.

## Regras de segurança (sempre)

- Texto digitado por usuário entra na página com `textContent`, **nunca** `innerHTML`.
- Nada de senha, chave privada ou conta de serviço no código. O `firebaseConfig` do app web pode ir
  no código (não é segredo), mas quem protege os dados são as **regras do Firestore**: escreva regras de verdade,
  nunca deixe `allow read, write: if true` em produção.
- Não usar Cloud Storage (upload de arquivos) sem me perguntar: ele exige o plano pago Blaze. Por enquanto, material = link + texto.

## Git e GitHub

- Repositório: https://github.com/Zidanski/CorvusCodex (branch principal: `main`).
- **Ninguém commita direto na `main`.** Cada tarefa numa branch (`feature/...`, `fix/...`, `style/...`) e entra por Pull Request.
- Commits pequenos, mensagem em português no presente ("Cria página de login com Firebase").
- Passo a passo completo: `docs/04-git-e-github.md`.

**Primeira vez nesta pasta:** ela foi montada a partir da `main`, mas pode ainda não estar ligada ao Git.
Rode `git status`. Se der "not a git repository", ligue assim (e me explique):
```
git init
git remote add origin https://github.com/Zidanski/CorvusCodex.git
git fetch origin
git checkout -b main --track origin/main   # se reclamar de arquivos existentes, use: git reset origin/main
git checkout -b feature/firebase
```
Os arquivos novos (`CLAUDE.md`, `docs/`, `referencia/`) vão no primeiro PR.

## Mapa da pasta

| Caminho | O que é |
| --- | --- |
| `simples/` | O site atual, pronto, igual à `main` do GitHub (6 páginas + `style.css`) |
| `docs/01-projeto.md` | Proposta, equipe, disciplinas e prazos |
| `docs/02-identidade-visual.md` | Logo, cores, fontes, acessibilidade |
| `docs/03-estado-atual.md` | O que cada página faz hoje e o que falta |
| `docs/04-git-e-github.md` | Guia de colaboração do grupo |
| `docs/05-plano-firebase.md` | Plano do web app com Firebase |
| `docs/06-historico.md` | O que já foi feito antes, branches antigas e decisões |
| `referencia/logo/`, `referencia/favicon/` | Logo do corvo e favicons (SVG/PNG) |
| `referencia/materiais-exemplo.json` | 12 materiais e comentários **fictícios** para popular o Firestore |
