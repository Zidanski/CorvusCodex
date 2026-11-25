// Página inicial: cumprimenta a pessoa pelo nome.
import { protegerPagina } from "./menu.js";

function mostrarBoasVindas(usuario) {
  document.getElementById("boas-vindas").textContent = "Olá, " + usuario.displayName + "! Bem-vindo ao Corvus Codex.";
}

protegerPagina(mostrarBoasVindas);
