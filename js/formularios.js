// Validação dos formulários com mensagens em TEXTO (não só cor vermelha).
// Funciona em qualquer <form data-validar>. Cada campo pode ter:
//   required            → não pode ficar vazio
//   type="email"        → precisa ser um e-mail válido
//   data-igual-a="id"   → precisa ser igual a outro campo (ex.: confirmar senha)
// data-demo no <form>: ainda não existe servidor de contas, então só mostra uma mensagem de sucesso.

(function () {
  function nomeDoCampo(campo) {
    var rotulo = document.querySelector('label[for="' + campo.id + '"]');
    return rotulo ? rotulo.textContent.trim() : 'este campo';
  }

  function encontrarErro(campo) {
    var valor = campo.value.trim();

    if (campo.required && valor === '') {
      return 'Preencha o campo "' + nomeDoCampo(campo) + '".';
    }
    if (campo.type === 'email' && valor !== '' && !campo.checkValidity()) {
      return 'Digite um e-mail válido, como nome@exemplo.com.';
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

    if (!mensagem) {
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
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
    campo.setAttribute('aria-describedby', idErro);
  }

  function avisar(formulario, tipo, texto) {
    var aviso = formulario.querySelector('.aviso-formulario');
    if (!aviso) return;
    aviso.className = 'aviso-formulario ' + tipo;
    aviso.textContent = texto;
  }

  document.querySelectorAll('form[data-validar]').forEach(function (formulario) {
    // Desliga os balõezinhos padrão do navegador: usamos as nossas mensagens em texto
    formulario.noValidate = true;

    formulario.addEventListener('submit', function (evento) {
      var campos = formulario.querySelectorAll('input');
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

      if (formulario.hasAttribute('data-demo')) {
        evento.preventDefault();
        avisar(formulario, 'sucesso', '✓ Tudo certo! (Demonstração: as contas ainda não estão ligadas a um servidor.)');
      }
    });

    formulario.addEventListener('reset', function () {
      formulario.querySelectorAll('input').forEach(function (campo) {
        mostrarErro(campo, '');
      });
      avisar(formulario, '', '');
    });
  });
})();
