# 05 — Plano: web app com Firebase

Objetivo: o mesmo site da pasta `simples/`, agora com **contas de verdade** e **dados salvos na nuvem**,
publicado num endereço `https://<projeto>.web.app`. Tudo em HTML, CSS e JS simples.

## Quais partes do Firebase usar

| Serviço | Para quê | Plano |
| --- | --- | --- |
| **Hosting** | Publicar o site | Gratuito (Spark) |
| **Authentication** (e-mail e senha) | Login e cadastro | Gratuito |
| **Cloud Firestore** | Guardar materiais e comentários | Gratuito (com limite diário) |
| ~~Cloud Storage~~ | Upload de arquivos | **Exige o plano pago Blaze** (desde out/2024). Não usar por enquanto |

Por isso, no `enviar.html` o material passa a ter um **link** (Google Drive, PDF na web etc.) em vez de upload.
Se o grupo quiser upload depois, conversamos sobre o Blaze.

## Como o Firebase entra no código (sem npm)

O SDK vem direto do CDN, num arquivo só de configuração:

```js
// js/firebase.js — liga o site ao projeto Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/VERSAO/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/VERSAO/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/VERSAO/firebase-firestore.js";

const firebaseConfig = {
  // colar aqui o que o console do Firebase mostra
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const banco = getFirestore(app);
```

Cada página importa o que precisa: `<script type="module" src="js/acervo.js"></script>`.
(Trocar `VERSAO` pela versão atual indicada na documentação do Firebase.)

Observação: `type="module"` não funciona com duplo clique no arquivo. Use o **Live Server** ou `firebase serve`/`firebase emulators:start`.

## Dados no Firestore (bem simples)

**Coleção `materiais`** (um documento por material):
```
titulo:      "Bancos de Dados sem Mistério"
autor:       "Rita Valadares"
tipo:        "Livro" | "Resumo" | "Anotação" | "Lista de exercícios" | ...
disciplina:  "Banco de Dados"
descricao:   "texto curto"
link:        "https://..."
tags:        ["sql", "modelagem"]
enviadoPor:  "Nome do usuário"
uid:         "<id do usuário no Authentication>"
criadoEm:    data (serverTimestamp)
```

**Coleção `comentarios`**:
```
materialId:  "<id do material>"   (ou vazio, se for comentário geral)
nome:        "Nome do usuário"
uid:         "<id do usuário>"
texto:       "O capítulo 7 me salvou na prova."
criadoEm:    data
```

Dados de teste fictícios prontos em `referencia/materiais-exemplo.json` (12 materiais + comentários).
Dá para fazer uma página escondida `popular-banco.html` que lê esse JSON e grava no Firestore uma vez.

**Pesquisa:** o Firestore não faz busca por "parte da palavra". Jeito simples de estudante:
baixar todos os materiais e filtrar no JS com `includes()` (comparando tudo em minúsculo e sem acento).
Para um acervo de faculdade isso é suficiente.

## Regras de segurança (primeira versão)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /materiais/{id} {
      allow read: if true;                                          // todo mundo vê
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid; // só logado cria, em nome próprio
      allow update, delete: if request.auth != null
                    && resource.data.uid == request.auth.uid;         // só o dono mexe
    }
    match /comentarios/{id} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}
```

## Ordem sugerida (um PR por etapa)

1. **Preparar** — ligar a pasta ao Git (ver `CLAUDE.md`), criar branch `feature/firebase-base`.
   Eu crio o projeto no console do Firebase (https://console.firebase.google.com) e passo o `firebaseConfig`.
   Instalar a Firebase CLI (`npm install -g firebase-tools` — é a única coisa com npm, e é ferramenta, não vai no site),
   `firebase login`, `firebase init hosting` apontando a pasta pública para `simples`.
2. **firebase.js** — arquivo de configuração acima + teste simples no console do navegador.
3. **Login e cadastro** (`login.html` + `js/login.js`) — `createUserWithEmailAndPassword` (salvar o nome com `updateProfile`),
   `signInWithEmailAndPassword`, mensagens de erro em português. No menu: mostrar "Sair" quando logado (`js/menu.js`).
4. **Enviar material** (`enviar.html` + `js/enviar.js`) — só logado; trocar campo arquivo por link; `addDoc`.
5. **Acervo** (`acervo.html` + `js/acervo.js`) — `getDocs`, montar cartões com `createElement` + `textContent`.
6. **Pesquisa** (`pesquisa.html` + `js/pesquisa.js`) — filtro no JS.
7. **Comentários** (`comentarios.html` + `js/comentarios.js`).
8. **Regras do Firestore** — publicar as regras acima e testar que um usuário deslogado não consegue gravar.
9. **Publicar** — `firebase deploy`, testar no celular, revisar acessibilidade (teclado, contraste, labels).

Depois de cada etapa: testar no navegador, commit pequeno, push, Pull Request.

## Estrutura de pastas esperada no fim

```
simples/
  index.html  acervo.html  login.html  pesquisa.html  enviar.html  comentarios.html
  style.css
  img/        (logo e favicon copiados de referencia/)
  js/
    firebase.js   menu.js
    login.js  acervo.js  pesquisa.js  enviar.js  comentarios.js
firebase.json   .firebaserc   firestore.rules
```
