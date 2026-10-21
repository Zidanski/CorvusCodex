// Página de um material (material.html?id=3): mostra os detalhes e a área de comentários.

(function () {
  var id = new URLSearchParams(location.search).get('id');
  var titulo = document.getElementById('m-titulo');
  var detalhes = document.getElementById('m-detalhes');
  var caixaErro = document.getElementById('m-erro');
  var listaComentarios = document.getElementById('lista-comentarios');
  var tituloComentarios = document.getElementById('titulo-comentarios');
  var formulario = document.getElementById('form-comentario');
  var totalComentarios = 0;

  function mostrarErro(mensagem) {
    titulo.textContent = 'Material não encontrado';
    document.title = 'Material não encontrado — Corvus Codex';
    caixaErro.textContent = '⚠ ' + mensagem;
    caixaErro.hidden = false;
  }

  function atualizarTituloComentarios() {
    tituloComentarios.textContent = 'Comentários (' + totalComentarios + ')';
    var vazio = listaComentarios.querySelector('.lista-vazia');
    if (totalComentarios > 0 && vazio) vazio.remove();
  }

  function criarComentario(comentario) {
    var item = Corvus.criar('li', 'comentario');
    var artigo = Corvus.criar('article');
    var cabecalho = Corvus.criar('p', 'comentario-autor');
    cabecalho.appendChild(Corvus.criar('strong', '', comentario.nome));
    cabecalho.appendChild(document.createTextNode(' · '));
    cabecalho.appendChild(Corvus.criarData(comentario.criadoEm));
    artigo.appendChild(cabecalho);
    artigo.appendChild(Corvus.criar('p', 'comentario-texto', comentario.texto));
    item.appendChild(artigo);
    return item;
  }

  function mostrarMaterial(m) {
    document.title = m.titulo + ' — Corvus Codex';
    titulo.textContent = m.titulo;
    document.getElementById('m-tipo').textContent = m.tipo + ' · ' + m.disciplina;
    document.getElementById('m-autor').textContent = 'por ' + m.autor + (m.ano ? ' (' + m.ano + ')' : '');
    document.getElementById('m-descricao').textContent = m.descricao;

    // Cada linha do resumo vira um parágrafo
    var conteudo = document.getElementById('m-conteudo');
    m.conteudo.split('\n').filter(Boolean).forEach(function (linha) {
      conteudo.appendChild(Corvus.criar('p', '', linha));
    });
    conteudo.hidden = !m.conteudo;

    if (m.link) {
      var paragrafoLink = document.getElementById('m-link');
      var link = Corvus.criar('a', 'link-externo', 'Abrir o material (abre em outra aba)');
      link.href = m.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      paragrafoLink.appendChild(link);
      paragrafoLink.hidden = false;
    }

    if (m.tags.length) document.getElementById('m-tags').appendChild(Corvus.criarTags(m.tags));

    var enviado = document.getElementById('m-enviado');
    enviado.textContent = 'Enviado por ' + m.enviadoPor + ' em ';
    enviado.appendChild(Corvus.criarData(m.criadoEm));

    totalComentarios = m.comentarios.length;
    if (!totalComentarios) {
      listaComentarios.appendChild(Corvus.criar('li', 'lista-vazia', 'Ainda não há comentários. Seja a primeira pessoa a comentar!'));
    }
    m.comentarios.forEach(function (c) { listaComentarios.appendChild(criarComentario(c)); });
    atualizarTituloComentarios();

    detalhes.hidden = false;
  }

  if (!id) {
    mostrarErro('Nenhum material foi escolhido. Volte ao acervo e clique em um material.');
    return;
  }

  Corvus.api('/api/materiais/' + encodeURIComponent(id))
    .then(mostrarMaterial)
    .catch(function (erro) { mostrarErro(erro.message); });

  // O formulario.js já conferiu os campos; aqui só enviamos para o servidor
  formulario.addEventListener('formulario-valido', function () {
    var botao = formulario.querySelector('button[type="submit"]');
    botao.disabled = true;

    Corvus.enviarJSON('/api/materiais/' + encodeURIComponent(id) + '/comentarios', {
      nome: formulario.nome.value,
      texto: formulario.texto.value,
    })
      .then(function (comentario) {
        listaComentarios.appendChild(criarComentario(comentario));
        totalComentarios++;
        atualizarTituloComentarios();
        formulario.texto.value = '';
        CorvusFormularios.avisar(formulario, 'sucesso', '✓ Comentário publicado! Ele já aparece na lista acima.');
      })
      .catch(function (erro) {
        CorvusFormularios.avisar(formulario, 'erro', '⚠ ' + erro.message);
      })
      .then(function () { botao.disabled = false; });
  });
})();
