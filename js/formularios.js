// Validação dos formulários com mensagens em TEXTO (não só cor vermelha).
// Funciona em qualquer <form data-validar>. Cada campo (input, select ou textarea) pode ter:
//   required            → não pode ficar vazio
//   type="email"        → precisa ser um e-mail válido
//   type="url"          → precisa ser um link (https://...)
//   type="number" + min/max → precisa ser um número dentro do limite
//   data-igual-a="id"   → precisa ser igual a outro campo (ex.: confirmar senha)
// No <form>:
//   data-demo → ainda não existe servidor de contas, então só mostra uma mensagem de sucesso
//   data-api  → a página cuida do envio: o formulário dispara o evento "formulario-valido"

(function () {
  function nomeDoCampo(campo) {
    var rotulo = document.querySelector('label[for="' + campo.id + '"]');
    // Pega só o texto principal do rótulo, sem o "(opcional)"
    return rotulo ? rotulo.childNodes[0].textContent.trim() : 'este campo';
  }

  function encontrarErro(campo) {
    var valor = campo.value.trim();

    if (campo.required && valor === '') {
      return (campo.tagName === 'SELECT' ? 'Escolha uma opção em "' : 'Preencha o campo "') + nomeDoCampo(campo) + '".';
    }
    if (valor === '') return '';

    if (campo.type === 'email' && !campo.checkValidity()) {
      return 'Digite um e-mail válido, como nome@exemplo.com.';
    }
    if (campo.type === 'url' && !/^https?:\/\/\S+\.\S+/i.test(valor)) {
      return 'Digite um link completo, começando com https://';
    }
    if (campo.type === 'number' && !campo.checkValidity()) {
      return 'Digite um número entre ' + campo.min + ' e ' + campo.max + '.';
    }
    if (campo.dataset.igualA) {
      var outro = document.getElementById(campo.dataset.igualA);
      if (outro && campo.value !== outro.value) {
        return 'As senhas não são iguais. Digite a mesma senha nos dois campos.';
      }
    }
    return '';
  }

  function mostrarErro(campo, mensagem) {
    var idErro = 'erro-' + campo.id;
    var elemento = document.getElementById(idErro);

    // Guarda a dica original do campo (aria-describedby) para não perder ao mostrar o erro
    if (campo.dataset.dica === undefined) {
      campo.dataset.dica = campo.getAttribute('aria-describedby') || '';
    }

    if (!mensagem) {
      campo.removeAttribute('aria-invalid');
      if (campo.dataset.dica) campo.setAttribute('aria-describedby', campo.dataset.dica);
      else campo.removeAttribute('aria-describedby');
      if (elemento) elemento.remove();
      return;
    }

    if (!elemento) {
      elemento = document.createElement('p');
      elemento.id = idErro;
      elemento.className = 'mensagem-erro';
      campo.insertAdjacentElement('afterend', elemento);
    }
    elemento.textContent = '⚠ Erro: ' + mensagem;
    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', (idErro + ' ' + campo.dataset.dica).trim());
  }

  // Mostra um aviso no topo do formulário. tipo: "erro", "sucesso" ou "" (apaga)
  function avisar(formulario, tipo, texto) {
    var aviso = formulario.querySelector('.aviso-formulario');
    if (!aviso) return;
    aviso.className = 'aviso-formulario ' + tipo;
    aviso.textContent = texto;
  }

  // As páginas podem usar: CorvusFormularios.avisar(formulario, 'sucesso', 'Enviado!')
  window.CorvusFormularios = { avisar: avisar };

  document.querySelectorAll('form[data-validar]').forEach(function (formulario) {
    // Desliga os balõezinhos padrão do navegador: usamos as nossas mensagens em texto
    formulario.noValidate = true;

    formulario.addEventListener('submit', function (evento) {
      var campos = formulario.querySelectorAll('input, select, textarea');
      var primeiroComErro = null;
      var totalDeErros = 0;

      campos.forEach(function (campo) {
        var mensagem = encontrarErro(campo);
        mostrarErro(campo, mensagem);
        if (mensagem) {
          totalDeErros++;
          if (!primeiroComErro) primeiroComErro = campo;
        }
      });

      if (primeiroComErro) {
        evento.preventDefault();
        avisar(formulario, 'erro', '⚠ ' + (totalDeErros === 1
          ? 'Há 1 campo para corrigir.'
          : 'Há ' + totalDeErros + ' campos para corrigir.'));
        primeiroComErro.focus();
        return;
      }

      avisar(formulario, '', '');

      if (formulario.hasAttribute('data-api')) {
        evento.preventDefault();
        formulario.dispatchEvent(new CustomEvent('formulario-valido'));
      } else if (formulario.hasAttribute('data-demo')) {
        evento.preventDefault();
        avisar(formulario, 'sucesso', '✓ Tudo certo! (Demonstração: as contas ainda não estão ligadas a um servidor.)');
      }
    });

    formulario.addEventListener('reset', function () {
      formulario.querySelectorAll('input, select, textarea').forEach(function (campo) {
        mostrarErro(campo, '');
      });
      avisar(formulario, '', '');
    });
  });
})();
