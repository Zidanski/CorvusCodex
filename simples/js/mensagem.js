// Formulário "Mandar mensagem" que abre e fecha sozinho (elemento <details> do HTML).
// Usado nos cartões do Acervo/Pesquisa e no botão "Responder" dos Comentários.
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { auth, banco } from "./firebase.js";

// Cada caixa de texto precisa de um id diferente, para o <label for="..."> funcionar
let contador = 0;

export function criarFormularioMensagem(paraUid, paraNome, assunto, textoDoBotao) {
  contador = contador + 1;
  const idCampo = "texto-mensagem-" + contador;

  const caixa = document.createElement("details");
  caixa.className = "caixa-mensagem";

  const resumo = document.createElement("summary");
  resumo.textContent = textoDoBotao;
  caixa.appendChild(resumo);

  const formulario = document.createElement("form");
  caixa.appendChild(formulario);

  const rotulo = document.createElement("label");
  rotulo.htmlFor = idCampo;
  rotulo.textContent = "Mensagem para " + paraNome;
  formulario.appendChild(rotulo);

  const campo = document.createElement("textarea");
  campo.id = idCampo;
  campo.required = true;
  campo.maxLength = 1000;
  formulario.appendChild(campo);

  const botao = document.createElement("button");
  botao.type = "submit";
  botao.textContent = "Enviar mensagem";
  formulario.appendChild(botao);

  const aviso = document.createElement("p");
  aviso.className = "mensagem";
  aviso.setAttribute("role", "status");
  formulario.appendChild(aviso);

  async function enviarMensagem(evento) {
    evento.preventDefault();
    botao.disabled = true;
    try {
      await addDoc(collection(banco, "mensagens"), {
        paraUid: paraUid,
        paraNome: paraNome,
        deUid: auth.currentUser.uid,
        deNome: auth.currentUser.displayName,
        assunto: assunto,
        texto: campo.value.trim(),
        criadoEm: serverTimestamp()
      });
      aviso.className = "mensagem sucesso";
      aviso.textContent = "Mensagem enviada para " + paraNome + "!";
      formulario.reset();
    } catch (erro) {
      console.error(erro);
      aviso.className = "mensagem erro";
      aviso.textContent = "Não foi possível enviar a mensagem. Tente de novo.";
    }
    botao.disabled = false;
  }

  formulario.addEventListener("submit", enviarMensagem);
  return caixa;
}
