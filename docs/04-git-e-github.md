# 04 — Git e GitHub (guia do grupo)

Repositório: https://github.com/Zidanski/CorvusCodex — dono: Zidanski.

> Atenção (24/11/2026): o repositório está **público** (qualquer um consegue ver e clonar).
> Antes ele era privado. Se o grupo quiser privado de novo: Settings → General → Danger Zone → Change visibility.
> Seja como for, **nunca** coloque senha ou chave secreta no código.

## 1. Adicionar os amigos (dono, uma vez)

1. https://github.com/Zidanski/CorvusCodex/settings/access → **Add people**
2. Digite o usuário do GitHub do amigo e confirme.
3. O amigo clica em **Accept invitation** no e-mail/notificação.

## 2. Preparar a máquina (uma vez por pessoa)

- Git: https://git-scm.com/downloads (no Windows, deixe marcado o *Git Credential Manager*)
- VSCode: https://code.visualstudio.com + extensão **Live Server**

```
git config --global user.name "Seu Nome"
git config --global user.email "seu-email-do-github@exemplo.com"

cd C:\Users\SEU_USUARIO\Documents
git clone https://github.com/Zidanski/CorvusCodex.git
cd CorvusCodex
code .
```

## 3. Fluxo do dia a dia

Regra de ouro: **ninguém mexe direto na `main`**.

```
git checkout main            # volta para a main
git pull                     # pega o que os outros fizeram
git checkout -b feature/x    # cria sua branch (minúsculo, sem acento)
... edita ...
git add .                    # marca tudo que mudou
git commit -m "mensagem"     # salva localmente
git push -u origin feature/x # manda pro GitHub
→ abre Pull Request no site → amigo revisa e aprova → Merge → Delete branch
git checkout main && git pull
```

Nomes de branch: `feature/login-firebase`, `fix/link-pesquisa`, `style/menu-nav`.
Commits pequenos e frequentes.

## 4. Problemas comuns

**Branch desatualizada:**
```
git checkout main && git pull
git checkout feature/x
git merge main
```
Se der *CONFLICT*: o VSCode mostra *Accept Current / Incoming / Both*. Escolha, salve, `git add .`, `git commit`, `git push`.

**Commit na main sem querer:**
```
git checkout -b feature/x
git checkout main
git reset --hard origin/main
```

**Ver o que mudou:** `git status` e `git diff`.

No VSCode, o ícone *Source Control* (Ctrl+Shift+G) faz tudo isso pela interface.

## 5. Proteger a main (dono, uma vez)

https://github.com/Zidanski/CorvusCodex/settings/rules → New branch ruleset → nome `protege main`,
Active, Include default branch, marcar **Require a pull request before merging** e **Block force pushes**.
