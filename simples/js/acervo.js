// Acervo: busca todos os materiais no Firestore e mostra em cartões.
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { banco } from "./firebase.js";
import { protegerPagina } from "./menu.js";
import { criarCartaoMaterial } from "./cartao.js";

async function carregarMateriais() {
  const aviso = document.getElementById("aviso");
  const lista = document.getElementById("lista-materiais");

  try {
    // Mais novos primeiro
    const consulta = query(collection(banco, "materiais"), orderBy("criadoEm", "desc"));
    const resultado = await getDocs(consulta);

    if (resultado.empty) {
      aviso.textContent = "Ainda não há materiais. Seja o primeiro a enviar!";
      return;
    }

    aviso.textContent = resultado.size + " material(is) no acervo.";
    resultado.forEach(function (documento) {
      lista.appendChild(criarCartaoMaterial(documento.id, documento.data()));
    });
  } catch (erro) {
    console.error(erro);
    aviso.textContent = "Não foi possível carregar o acervo. Tente recarregar a página.";
  }
}

protegerPagina(carregarMateriais);
