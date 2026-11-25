// Monta o cartão de um material. Usado no Acervo e na Pesquisa.
// Tudo que o usuário digitou entra com textContent (nunca innerHTML), por segurança.
import { auth } from "./firebase.js";
import { criarFormularioMensagem } from "./mensagem.js";

export function criarCartaoMaterial(id, material) {
  const cartao = document.createElement("li");
  cartao.className = "cartao-material";

  // Capa: a imagem do material ou, se não tiver, a capa padrão
  const capa = document.createElement("img");
  capa.className = "capa";
  capa.alt = "Capa de " + material.titulo;
  if (linkSeguro(material.capa)) {
    capa.src = material.capa;
  } else {
    capa.src = "img/capa-padrao.svg";
  }
  // Se a imagem de fora não carregar, usa a capa padrão
  capa.addEventListener("error", function () {
    capa.src = "img/capa-padrao.svg";
  });
  cartao.appendChild(capa);

  // O resto do cartão fica numa div ao lado da capa
  const conteudo = document.createElement("div");
  conteudo.className = "cartao-conteudo";
  cartao.appendChild(conteudo);

  const titulo = document.createElement("h2");
  titulo.textContent = material.titulo;
  conteudo.appendChild(titulo);

  const detalhes = document.createElement("p");
  detalhes.className = "detalhes";
  detalhes.textContent = material.tipo + " · " + material.disciplina + " · " + material.autor;
  conteudo.appendChild(detalhes);

  const descricao = document.createElement("p");
  descricao.textContent = material.descricao;
  conteudo.appendChild(descricao);

  // Tags, cada uma numa "etiqueta"
  if (material.tags && material.tags.length > 0) {
    const listaTags = document.createElement("ul");
    listaTags.className = "tags";
    for (let i = 0; i < material.tags.length; i++) {
      const tag = document.createElement("li");
      tag.textContent = material.tags[i];
      listaTags.appendChild(tag);
    }
    conteudo.appendChild(listaTags);
  }

  const enviadoPor = document.createElement("p");
  enviadoPor.className = "detalhes";
  enviadoPor.textContent = "Enviado por " + material.enviadoPor;
  conteudo.appendChild(enviadoPor);

  // Só vira link se começar com http:// ou https:// (evita links perigosos como "javascript:")
  if (linkSeguro(material.link)) {
    const abrir = document.createElement("a");
    abrir.href = material.link;
    abrir.target = "_blank";
    abrir.rel = "noopener";
    abrir.textContent = "Abrir material";
    conteudo.appendChild(abrir);
  }

  const comentar = document.createElement("a");
  comentar.href = "comentarios.html?id=" + id;
  comentar.textContent = "Ver comentários";
  conteudo.appendChild(comentar);

  // Mandar mensagem para quem enviou (só aparece no material dos outros)
  const usuario = auth.currentUser;
  if (usuario && material.uid && material.uid !== usuario.uid) {
    const textoBotao = "Mandar mensagem para " + material.enviadoPor;
    conteudo.appendChild(criarFormularioMensagem(material.uid, material.enviadoPor, material.titulo, textoBotao));
  }

  return cartao;
}

function linkSeguro(link) {
  if (!link) {
    return false;
  }
  return link.startsWith("https://") || link.startsWith("http://");
}
