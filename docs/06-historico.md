# 06 — Histórico do projeto (o que já foi feito)

Para contexto. **O que vale hoje é a `main` (pasta `simples/`).**

## Linha do tempo

| Data | O que aconteceu |
| --- | --- |
| set/2026 | Apresentação em baixa fidelidade. Primeiras páginas: `landing.html`, `login.html`, `cadastro.html`, `pesquisa.html` |
| 16/09/2026 | Repositório no GitHub + guia de colaboração (branch + PR) |
| out/2026 | Branch `feature/localhost-e-identidade`: servidor Express (`npm start`), `tokens.css`, tema claro/escuro, acessibilidade, README |
| out/2026 | Branch `feature/acervo-e-materiais`: API fictícia em Node (materiais, comentários), páginas Acervo, Material, Enviar, Comentários, 404 |
| 21/10/2026 | Identidade nova: logo do corvo sobre livro, paleta só azul, Source Serif 4 + DM Sans, 47 ícones, guia de estilo e um CSS geral simples com as "7 regras do grupo" |
| 21/10/2026 | **Decisão:** a `main` fica só com a versão simples (`simples/`, HTML + um `style.css`). Assets, fontes e ícones pesados saíram |
| 22/10/2026 | As telas das duas versões foram exportadas para o Figma (SVG editável) |
| 24/11/2026 | Esta pasta com toda a documentação, para começar o web app com Firebase |

## Branches no GitHub

| Branch | O que tem | Usar? |
| --- | --- | --- |
| `main` | Versão simples (6 páginas, `style.css`) | **Sim, é a base** |
| `feature/acervo-e-materiais` | Versão "completa" com Node/Express, API fictícia, 10 páginas, paleta azul/verde/marrom, tema escuro, e também logo/ícones/fontes em `simples/assets` | Só como referência (ideias de páginas, dados de exemplo, logo) |
| `feature/localhost-e-identidade` | Primeira versão do servidor Express e do tema | Não (substituída) |

Para olhar um arquivo antigo sem trocar de branch:
```
git show origin/feature/acervo-e-materiais:acervo.html
```

## Decisões que continuam valendo

- Código simples de estudante; quero escrever o CSS à mão.
- Paleta azul, tema claro (escuro fica para depois).
- Acessibilidade é pilar do projeto.
- Texto de usuário sempre com `textContent`.
- Dados de exemplo são **fictícios** (livros, autores e estudantes inventados).
- O Express/Node da versão completa **não** será usado: o Firebase faz o papel do servidor.
