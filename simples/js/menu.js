// Parte comum de todas as páginas (menos o login): exige login e cuida do botão "Sair".
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { auth } from "./firebase.js";

// Cada página chama protegerPagina(suaFuncao).
// Se a pessoa entrou com o Google, mostra o nome no menu e roda suaFuncao.
// Se não entrou, manda para o login.
export function protegerPagina(quandoEntrar) {
  onAuthStateChanged(auth, function (usuario) {
    if (usuario) {
      document.getElementById("nome-usuario").textContent = usuario.displayName;
      quandoEntrar(usuario);
    } else {
      window.location.href = "login.html";
    }
  });
}

// Botão "Sair": desconecta. O onAuthStateChanged acima percebe e leva para o login.
const botaoSair = document.getElementById("botao-sair");
botaoSair.addEventListener("click", function () {
  signOut(auth);
});
