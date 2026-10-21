// Página Enviar material: preenche as listas de tipo e disciplina e envia o formulário para o servidor.

(function () {
  var formulario = document.getElementById('form-material');

  Corvus.api('/api/opcoes')
    .then(function (opcoes) {
      Corvus.preencherSelect(document.getElementById('tipo'), opcoes.tipos);
      Corvus.preencherSelect(document.getElementById('disciplina'), opcoes.disciplinas);
    })
    .catch(function (erro) {
      CorvusFormularios.avisar(formulario, 'erro', '⚠ ' + erro.message);
    });

  // O formulario.js já conferiu os campos; aqui só enviamos para o servidor
  formulario.addEventListener('formulario-valido', function () {
    var botao = formulario.querySelector('button[type="submit"]');
    botao.disabled = true;

    // Junta todos os campos num objeto: { titulo: '...', autor: '...', ... }
    var dados = Object.fromEntries(new FormData(formulario));

    Corvus.enviarJSON('/api/materiais', dados)
      .then(function (material) {
        formulario.reset();
        var aviso = formulario.querySelector('.aviso-formulario');
        CorvusFormularios.avisar(formulario, 'sucesso', '✓ Material enviado! ');
        var link = Corvus.criar('a', '', 'Ver "' + material.titulo + '" no acervo');
        link.href = 'material.html?id=' + material.id;
        aviso.appendChild(link);
        aviso.scrollIntoView({ block: 'center' });
        link.focus();
      })
      .catch(function (erro) {
        CorvusFormularios.avisar(formulario, 'erro', '⚠ ' + erro.message);
      })
      .then(function () { botao.disabled = false; });
  });
})();
