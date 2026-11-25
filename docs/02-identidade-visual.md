# 02 — Identidade visual

Decisão mais recente do grupo (out/2026): **paleta toda em azul, só tema claro por enquanto**,
fontes no estilo "Anthropic" (versões gratuitas). Valem os valores do `simples/style.css`.

> Uma versão antiga (branches `feature/...`) usava azul + verde + marrom, tema escuro e as fontes
> Merriweather/Atkinson. **Isso foi substituído.** Não use, a não ser que eu peça.

## Logo

- Corvo geométrico pousado num livro aberto.
- Arquivos em `referencia/logo/`:
  - `corvo.svg` (colorido), `corvo-mono.svg` (uma cor), `corvo-branco.svg` (para fundo escuro)
  - `logo-horizontal.svg` (corvo + nome, para o cabeçalho), `logo-vertical.svg`, `simbolo-app.svg`
- Favicons em `referencia/favicon/`.
- Não redesenhe nem invente outro logo.

## Cores (as que estão no `style.css` hoje)

| Variável | Cor | Uso |
| --- | --- | --- |
| `--azul` | `#1F5A93` | links, botões |
| `--azul-escuro` | `#0D2741` | títulos, menu, botão em hover |
| `--azul-claro` | `#EEF5FB` | fundos de destaque, tags |
| `--fundo` | `#F4F8FB` | fundo da página |
| `--texto` | `#0F1E2E` | texto normal |
| `--cinza` | `#4A5B6E` | texto suave (datas, legendas) |
| `--borda` | `#CBD6E0` | bordas de campos e cartões |

Cores extras já aprovadas no CSS geral do grupo (crie a variável quando precisar):

| Variável | Cor | Uso |
| --- | --- | --- |
| `--branco` | `#FFFFFF` | cartões, cabeçalho |
| `--verde` | `#1E7A4F` | mensagem de sucesso |
| `--vermelho` | `#B42318` | mensagem de erro |

Todas passam no contraste WCAG AA (4,5:1 para texto) nas combinações acima.

## Fontes

- **Títulos (h1, h2, h3):** Source Serif 4 (serifada, ar de livro). Reserva: Georgia.
- **Texto:** DM Sans. Reserva: "Segoe UI", Arial.
- Código (se precisar): JetBrains Mono.
- Hoje entram pelo Google Fonts no topo do `style.css`.
- Tamanho base 16px; tamanhos em `rem` (1rem = 16px); `line-height: 1.6`.

Escala sugerida: `h1` 2.5rem · `h2` 1.75rem · `h3` 1.25rem · texto 1rem.

## Espaços, cantos e sombra (do CSS geral do grupo)

```css
--espaco-p:  0.5rem;  /* 8px  */
--espaco-m:  1rem;    /* 16px */
--espaco-g:  2rem;    /* 32px */
--espaco-gg: 4rem;    /* 64px */
--raio:   10px;
--sombra: 0 2px 8px rgba(13, 39, 65, 0.08);
```

Hoje o `style.css` usa px soltos (`padding: 15px 20px`, `border-radius: 5px`). Pode trocar pelas
variáveis aos poucos, sem mudar o visual de forma brusca.

## Estética

Biblioteca acadêmica moderna: sóbria, limpa e acolhedora. Bastante espaço em branco, cantos levemente
arredondados, sombras suaves. Menu azul-escuro no topo, conteúdo centralizado (máx. 800px).

## Acessibilidade (checklist)

- `<html lang="pt-BR">` e `<title>` real em toda página ("Acervo - Corvus Codex").
- Todo `input` com `<label for="...">`.
- Foco visível em tudo que é clicável (`:focus-visible { outline: 3px solid var(--azul); }`).
- Botões são `<button>`, links são `<a>`. Nada de `div` clicável.
- Imagens com `alt`. O logo: `alt="Corvus Codex"`.
- Mensagens de erro/sucesso em texto (não só por cor), de preferência num elemento com `role="status"`.
- Funciona só com teclado (Tab, Enter).
- Área de clique de pelo menos 44px de altura nos botões no celular.
