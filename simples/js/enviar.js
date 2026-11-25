// Enviar material: salva um documento novo na coleção "materiais" do Firestore.
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { auth, banco } from "./firebase.js";
import { protegerPagina } from "./menu.js";

const formulario = document.getElementById("formulario-envio");
const botaoEnviar = document.getElementById("botao-enviar");
const mensagem = document.getElementById("mensagem");

// Transforma "SQL, modelagem , " em ["sql", "modelagem"]
function separarTags(texto) {
  const tags = [];
  const partes = texto.split(",");
  for (let i = 0; i < partes.length; i++) {
    const tag = partes[i].trim().toLowerCase();
    if (tag !== "") {
      tags.push(tag);
    }
  }
  return tags;
}

async function enviarMaterial(evento) {
  evento.preventDefault(); // não deixa a página recarregar
  const usuario = auth.currentUser;

  botaoEnviar.disabled = true;
  mensagem.className = "mensagem";
  mensagem.textContent = "Enviando...";

  try {
    await addDoc(collection(banco, "materiais"), {
      titulo: document.getElementById("titulo").value.trim(),
      autor: document.getElementById("autor").value.trim(),
      tipo: document.getElementById("tipo").value,
      disciplina: document.getElementById("disciplina").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      link: document.getElementById("link").value.trim(),
      capa: document.getElementById("capa").value.trim(),
      tags: separarTags(document.getElementById("tags").value),
      enviadoPor: usuario.displayName,
      uid: usuario.uid,
      criadoEm: serverTimestamp() // a data vem do servidor do Firebase
    });
    mensagem.className = "mensagem sucesso";
    mensagem.textContent = "Material enviado! Ele já aparece no Acervo.";
    formulario.reset();
  } catch (erro) {
    console.error(erro);
    mensagem.className = "mensagem erro";
    mensagem.textContent = "Não foi possível enviar. Confira os campos e tente de novo.";
  }

  botaoEnviar.disabled = false;
}

// Só liga o formulário depois de saber quem está logado
function prepararFormulario() {
  formulario.addEventListener("submit", enviarMaterial);
}

protegerPagina(prepararFormulario);
