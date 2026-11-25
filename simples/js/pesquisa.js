// Pesquisa: o Firestore não busca "parte de uma palavra".
// Então baixamos todos os materiais uma vez e filtramos aqui no JavaScript.
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { banco } from "./firebase.js";
import { protegerPagina } from "./menu.js";
import { criarCartaoMaterial } from "./cartao.js";

const formulario = document.getElementById("formulario-busca");
const campoBusca = document.getElementById("busca");
const botaoPesquisar = document.getElementById("botao-pesquisar");
const aviso = document.getElementById("aviso");
const lista = document.getElementById("lista-resultados");

let todosMateriais = [];

async function carregarMateriais() {
  try {
    const resultado = await getDocs(collection(banco, "materiais"));
    resultado.forEach(function (documento) {
      todosMateriais.push({ id: documento.id, dados: documento.data() });
    });
    aviso.textContent = "Digite o que procura e clique em Pesquisar.";
    botaoPesquisar.disabled = false;
  } catch (erro) {
    console.error(erro);
    aviso.textContent = "Não foi possível carregar os materiais. Tente recarregar a página.";
  }
}

// Deixa em minúsculo e sem acento, para "logica" achar "Lógica".
// normalize("NFD") separa a letra do acento, e o replace apaga os acentos.
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function pesquisar(evento) {
  evento.preventDefault();
  const termo = normalizar(campoBusca.value.trim());
  lista.textContent = "";

  let encontrados = 0;
  for (let i = 0; i < todosMateriais.length; i++) {
    const material = todosMateriais[i].dados;
    let textoDoMaterial = material.titulo + " " + material.autor + " " + material.disciplina + " " + material.tipo + " " + material.descricao;
    if (material.tags) {
      textoDoMaterial = textoDoMaterial + " " + material.tags.join(" ");
    }

    if (normalizar(textoDoMaterial).includes(termo)) {
      lista.appendChild(criarCartaoMaterial(todosMateriais[i].id, material));
      encontrados = encontrados + 1;
    }
  }

  if (encontrados === 0) {
    aviso.textContent = "Nenhum material encontrado para \"" + campoBusca.value + "\".";
  } else {
    aviso.textContent = encontrados + " resultado(s) para \"" + campoBusca.value + "\".";
  }
}

formulario.addEventListener("submit", pesquisar);
protegerPagina(carregarMateriais);
