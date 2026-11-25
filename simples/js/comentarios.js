// Comentários: de um material (comentarios.html?id=...) ou gerais (sem id).
import { collection, addDoc, getDocs, getDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { auth, banco } from "./firebase.js";
import { protegerPagina } from "./menu.js";
import { criarFormularioMensagem } from "./mensagem.js";

const formulario = document.getElementById("formulario-comentario");
const campoComentario = document.getElementById("comentario");
const botaoComentar = document.getElementById("botao-comentar");
const mensagem = document.getElementById("mensagem");
const lista = document.getElementById("lista-comentarios");

// Lê o ?id= do endereço. Se não tiver, são comentários gerais (materialId vazio).
const parametros = new URLSearchParams(window.location.search);
let materialId = parametros.get("id");
if (materialId === null) {
  materialId = "";
}

// Mostra o título do material que está sendo comentado
async function mostrarMaterial() {
  if (materialId === "") {
    return;
  }
  const sobre = document.getElementById("sobre");
  const documento = await getDoc(doc(banco, "materiais", materialId));
  if (documento.exists()) {
    sobre.textContent = "Comentários sobre: " + documento.data().titulo;
  } else {
    sobre.textContent = "Material não encontrado.";
  }
}

async function carregarComentarios() {
  try {
    const consulta = query(collection(banco, "comentarios"), where("materialId", "==", materialId));
    const resultado = await getDocs(consulta);

    const comentarios = [];
    resultado.forEach(function (documento) {
      comentarios.push(documento.data());
    });

    // Mais novos primeiro
    comentarios.sort(function (a, b) {
      return b.criadoEm.toMillis() - a.criadoEm.toMillis();
    });

    lista.textContent = "";
    if (comentarios.length === 0) {
      const vazio = document.createElement("li");
      vazio.textContent = "Nenhum comentário ainda. Seja o primeiro!";
      lista.appendChild(vazio);
      return;
    }

    for (let i = 0; i < comentarios.length; i++) {
      lista.appendChild(criarItemComentario(comentarios[i]));
    }
  } catch (erro) {
    console.error(erro);
    lista.textContent = "";
    const falha = document.createElement("li");
    falha.textContent = "Não foi possível carregar os comentários.";
    lista.appendChild(falha);
  }
}

function criarItemComentario(comentario) {
  const item = document.createElement("li");

  const autor = document.createElement("strong");
  autor.textContent = comentario.nome;
  item.appendChild(autor);

  const data = document.createElement("span");
  data.className = "detalhes";
  data.textContent = " em " + comentario.criadoEm.toDate().toLocaleDateString("pt-BR");
  item.appendChild(data);

  const texto = document.createElement("p");
  texto.textContent = comentario.texto;
  item.appendChild(texto);

  return item;
}

// Mensagens que outros usuários mandaram para mim (pelo Acervo ou respondendo)
async function carregarMensagens(usuario) {
  const listaMensagens = document.getElementById("lista-mensagens");
  try {
    const consulta = query(collection(banco, "mensagens"), where("paraUid", "==", usuario.uid));
    const resultado = await getDocs(consulta);

    const mensagens = [];
    resultado.forEach(function (documento) {
      mensagens.push(documento.data());
    });

    // Mais novas primeiro
    mensagens.sort(function (a, b) {
      return b.criadoEm.toMillis() - a.criadoEm.toMillis();
    });

    listaMensagens.textContent = "";
    if (mensagens.length === 0) {
      const vazio = document.createElement("li");
      vazio.textContent = "Você ainda não recebeu mensagens.";
      listaMensagens.appendChild(vazio);
      return;
    }

    for (let i = 0; i < mensagens.length; i++) {
      listaMensagens.appendChild(criarItemMensagem(mensagens[i]));
    }
  } catch (erro) {
    console.error(erro);
    listaMensagens.textContent = "";
    const falha = document.createElement("li");
    falha.textContent = "Não foi possível carregar as mensagens.";
    listaMensagens.appendChild(falha);
  }
}

function criarItemMensagem(mensagemRecebida) {
  const item = document.createElement("li");

  const autor = document.createElement("strong");
  autor.textContent = mensagemRecebida.deNome;
  item.appendChild(autor);

  const data = document.createElement("span");
  data.className = "detalhes";
  data.textContent = " em " + mensagemRecebida.criadoEm.toDate().toLocaleDateString("pt-BR");
  item.appendChild(data);

  const assunto = document.createElement("p");
  assunto.className = "detalhes";
  assunto.textContent = "Sobre: " + mensagemRecebida.assunto;
  item.appendChild(assunto);

  const texto = document.createElement("p");
  texto.textContent = mensagemRecebida.texto;
  item.appendChild(texto);

  // Botão para responder direto para quem mandou
  item.appendChild(criarFormularioMensagem(mensagemRecebida.deUid, mensagemRecebida.deNome, mensagemRecebida.assunto, "Responder"));

  return item;
}

async function enviarComentario(evento) {
  evento.preventDefault();
  const usuario = auth.currentUser;

  botaoComentar.disabled = true;
  try {
    await addDoc(collection(banco, "comentarios"), {
      materialId: materialId,
      nome: usuario.displayName,
      uid: usuario.uid,
      texto: campoComentario.value.trim(),
      criadoEm: serverTimestamp()
    });
    mensagem.className = "mensagem sucesso";
    mensagem.textContent = "Comentário publicado!";
    formulario.reset();
    await carregarComentarios();
  } catch (erro) {
    console.error(erro);
    mensagem.className = "mensagem erro";
    mensagem.textContent = "Não foi possível publicar o comentário. Tente de novo.";
  }
  botaoComentar.disabled = false;
}

function iniciarPagina(usuario) {
  mostrarMaterial();
  carregarComentarios();
  carregarMensagens(usuario);
  formulario.addEventListener("submit", enviarComentario);
}

protegerPagina(iniciarPagina);
