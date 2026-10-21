// Página Comentários: mostra os comentários mais recentes de todo o acervo.

(function () {
  var lista = document.getElementById('lista-comentarios');

  Corvus.api('/api/comentarios')
    .then(function (comentarios) {
      lista.replaceChildren();
      if (!comentarios.length) {
        lista.appendChild(Corvus.criar('li', 'lista-vazia', 'Ainda não há comentários no acervo.'));
        return;
      }
      comentarios.forEach(function (c) {
        var item = Corvus.criar('li', 'comentario');
        var artigo = Corvus.criar('article');

        var cabecalho = Corvus.criar('p', 'comentario-autor');
        cabecalho.appendChild(Corvus.criar('strong', '', c.nome));
        cabecalho.appendChild(document.createTextNode(' comentou em '));
        var link = Corvus.criar('a', '', c.materialTitulo);
        link.href = 'material.html?id=' + c.materialId;
        cabecalho.appendChild(link);
        cabecalho.appendChild(document.createTextNode(' · '));
        cabecalho.appendChild(Corvus.criarData(c.criadoEm));

        artigo.appendChild(cabecalho);
        artigo.appendChild(Corvus.criar('p', 'comentario-texto', c.texto));
        item.appendChild(artigo);
        lista.appendChild(item);
      });
    })
    .catch(function (erro) {
      lista.replaceChildren(Corvus.criar('li', 'lista-vazia', '⚠ ' + erro.message));
    });
})();
