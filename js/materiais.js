// Funções usadas por várias páginas: falar com a API e montar os cartões de material.
//
// SEGURANÇA: tudo que veio de um usuário é colocado na página com textContent,
// nunca com innerHTML. Assim, se alguém escrever <script> num comentário,
// aparece como texto e não vira código.

var Corvus = (function () {
  // Busca dados na API. Se der erro, lança uma mensagem em português.
  function api(endereco, opcoes) {
    return fetch(endereco, opcoes)
      .catch(function () {
        throw new Error('Não foi possível falar com o servidor. Ele está ligado? (rode npm start)');
      })
      .then(function (resposta) {
        return resposta.json().catch(function () { return {}; }).then(function (dados) {
          if (!resposta.ok) throw new Error(dados.erro || 'Algo deu errado. Tente de novo.');
          return dados;
        });
      });
  }

  function enviarJSON(endereco, dados) {
    return api(endereco, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  }

  // Cria um elemento: criar('p', 'classe', 'texto')
  function criar(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined && texto !== null) el.textContent = texto;
    return el;
  }

  // Cria um <time> com a data em português, ex.: "4 de agosto de 2026"
  function criarData(iso) {
    var el = criar('time', '', new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }));
    el.dateTime = iso;
    return el;
  }

  function plural(numero, singular, varios) {
    return numero + ' ' + (numero === 1 ? singular : varios);
  }

  function criarTags(tags) {
    var lista = criar('ul', 'tags');
    lista.setAttribute('aria-label', 'Etiquetas');
    tags.forEach(function (tag) {
      lista.appendChild(criar('li', '', tag));
    });
    return lista;
  }

  // Monta um cartão de material. nivelTitulo: "h2" ou "h3", para manter a ordem dos títulos da página.
  function criarCartao(material, nivelTitulo) {
    var item = criar('li', 'cartao');
    var artigo = criar('article');

    artigo.appendChild(criar('p', 'cartao-tipo', material.tipo + ' · ' + material.disciplina));

    var titulo = criar(nivelTitulo || 'h2', 'cartao-titulo');
    var link = criar('a', '', material.titulo);
    link.href = 'material.html?id=' + material.id;
    titulo.appendChild(link);
    artigo.appendChild(titulo);

    artigo.appendChild(criar('p', 'cartao-autor', material.autor + (material.ano ? ' (' + material.ano + ')' : '')));
    artigo.appendChild(criar('p', 'cartao-descricao', material.descricao));
    if (material.tags.length) artigo.appendChild(criarTags(material.tags));

    var rodape = criar('p', 'cartao-rodape', 'Enviado por ' + material.enviadoPor + ' · ' +
      plural(material.totalComentarios || 0, 'comentário', 'comentários'));
    artigo.appendChild(rodape);

    item.appendChild(artigo);
    return item;
  }

  // Coloca uma lista de materiais dentro de um <ul>, ou uma mensagem se estiver vazia
  function mostrarMateriais(lista, materiais, nivelTitulo, mensagemVazia) {
    lista.replaceChildren();
    if (!materiais.length) {
      lista.appendChild(criar('li', 'lista-vazia', mensagemVazia));
      return;
    }
    materiais.forEach(function (material) {
      lista.appendChild(criarCartao(material, nivelTitulo));
    });
  }

  // Preenche um <select> com opções (a primeira opção, "Todas"/"Escolha", já fica no HTML)
  function preencherSelect(select, opcoes, selecionada) {
    opcoes.forEach(function (opcao) {
      var el = criar('option', '', opcao);
      el.value = opcao;
      if (opcao === selecionada) el.selected = true;
      select.appendChild(el);
    });
  }

  return {
    api: api,
    enviarJSON: enviarJSON,
    criar: criar,
    criarData: criarData,
    criarTags: criarTags,
    plural: plural,
    mostrarMateriais: mostrarMateriais,
    preencherSelect: preencherSelect,
  };
})();
