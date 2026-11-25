// Página de login: só um botão "Entrar com Google".
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { auth, provedorGoogle } from "./firebase.js";

const botaoGoogle = document.getElementById("botao-google");
const mensagem = document.getElementById("mensagem");

// Se a pessoa já está logada (ou acabou de entrar), vai para o início.
onAuthStateChanged(auth, function (usuario) {
  if (usuario) {
    window.location.href = "index.html";
  }
});

// async/await: "espere a resposta do Google antes de continuar", sem travar a página.
async function entrarComGoogle() {
  mensagem.textContent = "Abrindo a janela do Google...";
  try {
    await signInWithPopup(auth, provedorGoogle);
  } catch (erro) {
    mensagem.textContent = traduzirErro(erro.code);
  }
}

// O Firebase devolve o erro em inglês (um "código"). Aqui viramos para português.
function traduzirErro(codigo) {
  if (codigo === "auth/popup-closed-by-user" || codigo === "auth/cancelled-popup-request") {
    return "A janela do Google foi fechada antes de terminar. Tente de novo.";
  }
  if (codigo === "auth/popup-blocked") {
    return "O navegador bloqueou a janela do Google. Permita pop-ups para este site e tente de novo.";
  }
  if (codigo === "auth/operation-not-allowed") {
    return "O login com Google ainda não foi ativado no console do Firebase.";
  }
  if (codigo === "auth/unauthorized-domain") {
    return "Este endereço não está autorizado no Firebase (Authentication > Configurações > Domínios).";
  }
  return "Não foi possível entrar. Tente de novo.";
}

botaoGoogle.addEventListener("click", entrarComGoogle);
