// Coloca livros gratuitos de exemplo no Firestore, para o Acervo não ficar vazio.
// Todos os links são de livros em domínio público ou com licença livre.
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { auth, banco } from "./firebase.js";
import { protegerPagina } from "./menu.js";

const botaoPopular = document.getElementById("botao-popular");
const mensagem = document.getElementById("mensagem");

// Capas da Open Library (biblioteca aberta do Internet Archive)
const capas = "https://covers.openlibrary.org/b/id/";

const livros = [
  {
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    disciplina: "Literatura",
    descricao: "Bentinho conta a sua história com Capitu e deixa a grande dúvida: houve traição ou não?",
    link: "https://pt.wikisource.org/wiki/Dom_Casmurro",
    capa: capas + "647501-M.jpg",
    tags: ["romance", "realismo", "domínio público"]
  },
  {
    titulo: "Memórias Póstumas de Brás Cubas",
    autor: "Machado de Assis",
    disciplina: "Literatura",
    descricao: "Um defunto autor narra a própria vida com ironia. Marco do Realismo no Brasil.",
    link: "https://pt.wikisource.org/wiki/Mem%C3%B3rias_P%C3%B3stumas_de_Br%C3%A1s_Cubas",
    capa: capas + "123152-M.jpg",
    tags: ["romance", "realismo", "domínio público"]
  },
  {
    titulo: "O Cortiço",
    autor: "Aluísio Azevedo",
    disciplina: "Literatura",
    descricao: "A vida num cortiço do Rio de Janeiro no século XIX. Principal obra do Naturalismo brasileiro.",
    link: "https://pt.wikisource.org/wiki/O_Corti%C3%A7o",
    capa: capas + "8176059-M.jpg",
    tags: ["romance", "naturalismo", "domínio público"]
  },
  {
    titulo: "Iracema",
    autor: "José de Alencar",
    disciplina: "Literatura",
    descricao: "A lenda da virgem dos lábios de mel e a origem do Ceará. Clássico do Romantismo indianista.",
    link: "https://pt.wikisource.org/wiki/Iracema",
    capa: capas + "2664651-M.jpg",
    tags: ["romance", "romantismo", "domínio público"]
  },
  {
    titulo: "Os Lusíadas",
    autor: "Luís de Camões",
    disciplina: "Literatura",
    descricao: "Poema épico sobre a viagem de Vasco da Gama às Índias, em dez cantos.",
    link: "https://pt.wikisource.org/wiki/Os_Lus%C3%ADadas",
    capa: capas + "5943496-M.jpg",
    tags: ["poesia", "épico", "domínio público"]
  },
  {
    titulo: "A Moreninha",
    autor: "Joaquim Manuel de Macedo",
    disciplina: "Literatura",
    descricao: "Uma aposta entre estudantes numa ilha vira história de amor. Primeiro romance urbano do Brasil.",
    link: "https://pt.wikisource.org/wiki/A_Moreninha",
    capa: capas + "15203760-M.jpg",
    tags: ["romance", "romantismo", "domínio público"]
  },
  {
    titulo: "Pense em Python",
    autor: "Allen B. Downey",
    disciplina: "Algoritmos e Programação",
    descricao: "Tradução livre do Think Python. Ensina a programar do zero, com exercícios em cada capítulo.",
    link: "https://penseallen.github.io/PensePython2e/",
    capa: capas + "7363360-M.jpg",
    tags: ["python", "iniciantes", "licença livre"]
  },
  {
    titulo: "Pro Git (em português)",
    autor: "Scott Chacon e Ben Straub",
    disciplina: "Engenharia de Software",
    descricao: "O livro oficial do Git: commits, branches, merge e GitHub, explicados passo a passo.",
    link: "https://git-scm.com/book/pt-br/v2",
    capa: capas + "7892827-M.jpg",
    tags: ["git", "github", "licença livre"]
  },
  {
    titulo: "Eloquent JavaScript",
    autor: "Marijn Haverbeke",
    disciplina: "Desenvolvimento Web",
    descricao: "JavaScript moderno, do básico ao navegador, com exercícios que rodam na própria página.",
    link: "https://eloquentjavascript.net/",
    capa: capas + "7082166-M.jpg",
    tags: ["javascript", "web", "licença livre"]
  },
  {
    titulo: "Structure and Interpretation of Computer Programs",
    autor: "Harold Abelson e Gerald Jay Sussman",
    disciplina: "Paradigmas de Programação",
    descricao: "O clássico do MIT sobre abstração, recursão e como pensar como programador.",
    link: "https://web.mit.edu/6.001/6.037/sicp.pdf",
    capa: capas + "149338-M.jpg",
    tags: ["scheme", "recursão", "licença livre"]
  },
  {
    titulo: "Operating Systems: Three Easy Pieces",
    autor: "Remzi e Andrea Arpaci-Dusseau",
    disciplina: "Sistemas Operacionais",
    descricao: "Processos, memória e arquivos explicados de forma leve. Capítulos gratuitos em PDF.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    capa: "",
    tags: ["processos", "memória", "gratuito"]
  },
  {
    titulo: "Open Data Structures",
    autor: "Pat Morin",
    disciplina: "Estruturas de Dados",
    descricao: "Listas, filas, árvores e tabelas hash, com código e análise de cada estrutura.",
    link: "https://opendatastructures.org/",
    capa: "",
    tags: ["listas", "árvores", "licença livre"]
  }
];

async function popularBanco() {
  const usuario = auth.currentUser;
  botaoPopular.disabled = true;
  mensagem.textContent = "Conferindo se os livros já estão no banco...";

  try {
    // Para não duplicar: os livros de exemplo têm o campo exemplo = true
    const jaExistem = await getDocs(query(collection(banco, "materiais"), where("exemplo", "==", true)));
    if (!jaExistem.empty) {
      mensagem.textContent = "Os livros de exemplo já estão no banco. Nada foi feito.";
      return;
    }

    for (let i = 0; i < livros.length; i++) {
      mensagem.textContent = "Adicionando " + (i + 1) + " de " + livros.length + "...";
      await addDoc(collection(banco, "materiais"), {
        titulo: livros[i].titulo,
        autor: livros[i].autor,
        tipo: "Livro",
        disciplina: livros[i].disciplina,
        descricao: livros[i].descricao,
        link: livros[i].link,
        capa: livros[i].capa,
        tags: livros[i].tags,
        enviadoPor: usuario.displayName,
        uid: usuario.uid,
        exemplo: true,
        criadoEm: serverTimestamp()
      });
    }
    mensagem.className = "mensagem sucesso";
    mensagem.textContent = "Pronto! " + livros.length + " livros adicionados. Veja no Acervo.";
  } catch (erro) {
    console.error(erro);
    mensagem.className = "mensagem erro";
    mensagem.textContent = "Deu erro ao adicionar. Veja o console (F12).";
    botaoPopular.disabled = false;
  }
}

function prepararBotao() {
  botaoPopular.disabled = false;
  botaoPopular.addEventListener("click", popularBanco);
}

protegerPagina(prepararBotao);
