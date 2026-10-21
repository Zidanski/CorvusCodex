// Página Pesquisa: o formulário manda o termo no endereço (pesquisa.html?q=sql)
// e este arquivo lê esse termo e mostra os resultados.

(function () {
  var campo = document.getElementById('busca');
  var secao = document.getElementById('resultados');
  var contagem = document.getElementById('contagem');
  var lista = document.getElementById('lista');

  var termo = (new URLSearchParams(location.search).get('q') || '').trim();
  if (!termo) return;

  campo.value = termo;
  secao.hidden = false;
  contagem.textContent = 'Pesquisando…';

  Corvus.api('/api/materiais?q=' + encodeURIComponent(termo))
    .then(function (materiais) {
      contagem.textContent = materiais.length
        ? Corvus.plural(materiais.length, 'resultado', 'resultados') + ' para "' + termo + '".'
        : 'Nenhum resultado para "' + termo + '".';
      Corvus.mostrarMateriais(lista, materiais, 'h3',
        'Tente uma palavra mais curta, confira a ortografia ou veja tudo no Acervo.');
    })
    .catch(function (erro) {
      contagem.textContent = '⚠ ' + erro.message;
    });
})();
