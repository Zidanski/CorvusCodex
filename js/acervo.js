// Página Acervo: lista todos os materiais e filtra por tipo e disciplina.
// Os filtros ficam no endereço (ex.: acervo.html?disciplina=Cálculo), então dá para mandar o link para alguém.

(function () {
  var formulario = document.getElementById('filtros');
  var selectTipo = document.getElementById('filtro-tipo');
  var selectDisciplina = document.getElementById('filtro-disciplina');
  var contagem = document.getElementById('contagem');
  var lista = document.getElementById('lista');

  var parametros = new URLSearchParams(location.search);

  function carregar() {
    var filtros = new URLSearchParams();
    if (selectTipo.value) filtros.set('tipo', selectTipo.value);
    if (selectDisciplina.value) filtros.set('disciplina', selectDisciplina.value);

    // Atualiza o endereço da página sem recarregar
    history.replaceState(null, '', filtros.toString() ? '?' + filtros : location.pathname);

    Corvus.api('/api/materiais?' + filtros)
      .then(function (materiais) {
        contagem.textContent = Corvus.plural(materiais.length, 'material encontrado', 'materiais encontrados') + '.';
        Corvus.mostrarMateriais(lista, materiais, 'h2', 'Nenhum material com esses filtros. Tente outra combinação.');
      })
      .catch(function (erro) {
        contagem.textContent = '⚠ ' + erro.message;
        lista.replaceChildren();
      });
  }

  Corvus.api('/api/opcoes')
    .then(function (opcoes) {
      Corvus.preencherSelect(selectTipo, opcoes.tipos, parametros.get('tipo'));
      Corvus.preencherSelect(selectDisciplina, opcoes.disciplinas, parametros.get('disciplina'));
    })
    .catch(function () { /* sem opções, a lista abaixo mostra o erro */ })
    .then(carregar);

  selectTipo.addEventListener('change', carregar);
  selectDisciplina.addEventListener('change', carregar);
  formulario.addEventListener('submit', function (evento) { evento.preventDefault(); });
  // O "reset" limpa os selects; esperamos ele terminar para carregar de novo
  formulario.addEventListener('reset', function () { setTimeout(carregar, 0); });
})();
