# 03 — Estado atual do site (pasta `simples/`)

Igual à branch `main` do GitHub (último commit: 21/10/2026, "Remove o guia de estilo da pasta simples/").
É **só HTML + CSS**, sem JavaScript e sem servidor. Abre com duplo clique ou com o Live Server do VSCode.

## Arquivos

| Arquivo | Linhas | O que tem hoje | O que falta para virar app |
| --- | --- | --- | --- |
| `index.html` | 26 | Menu + boas-vindas | Mostrar "Olá, nome" se estiver logado |
| `acervo.html` | 28 | Lista fixa: Material 1, 2, 3 | Ler os materiais do Firestore |
| `login.html` | 42 | Formulário de login (e-mail, senha) e de cadastro (nome, e-mail, senha) | Ligar no Firebase Authentication |
| `pesquisa.html` | 28 | Campo de busca + botão | Buscar no Firestore e mostrar resultados |
| `enviar.html` | 32 | Título, descrição, arquivo, botão | Salvar no Firestore (trocar "arquivo" por "link") e exigir login |
| `comentarios.html` | 33 | Campo de comentário + "Nenhum comentário ainda" | Salvar e listar comentários do Firestore |
| `style.css` | 84 | Variáveis de cor, menu, main centralizado, campos e botões | Classes para cartão de material, mensagens |

## Estrutura padrão de toda página

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome - Corvus Codex</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    <a href="index.html">Início</a>
    <a href="acervo.html">Acervo</a>
    <a href="login.html">Login e Cadastro</a>
    <a href="pesquisa.html">Pesquisa</a>
    <a href="enviar.html">Enviar material</a>
    <a href="comentarios.html">Comentários</a>
  </nav>
  <main>
    <h1>Nome</h1>
    ...
  </main>
</body>
</html>
```

## Pequenos ajustes conhecidos

- `index.html` usa `<p align="center">` (atributo antigo e estilo no HTML, contra a regra 5). Trocar por uma classe no CSS.
- Formulários não têm `name` nem `required` nos campos.
- `login.html` não tem `autocomplete` (`email`, `current-password`, `new-password`).
- Nenhuma página tem logo nem favicon ainda (estão em `referencia/`).
- O campo `<input type="file">` do `enviar.html` não vai funcionar sem Cloud Storage (plano pago). Ver o plano Firebase.
