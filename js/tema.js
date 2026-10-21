// Botão de alternar tema claro/escuro.
// Este arquivo é carregado no <head>, para aplicar o tema salvo antes da página aparecer
// (assim a tela não "pisca" no tema errado).

(function () {
  var CHAVE = 'corvus-tema';
  var raiz = document.documentElement;
  var sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  // localStorage pode falhar (aba anônima, cookies bloqueados), por isso o try/catch
  function lerTemaSalvo() {
    try {
      return localStorage.getItem(CHAVE);
    } catch (erro) {
      return null;
    }
  }

  function salvarTema(tema) {
    try {
      localStorage.setItem(CHAVE, tema);
    } catch (erro) {
      // Sem localStorage: o tema vale só até fechar a página
    }
  }

  // Tema que está valendo agora: o escolhido pelo usuário ou o do sistema
  function temaAtual() {
    return raiz.getAttribute('data-theme') || (sistemaEscuro.matches ? 'dark' : 'light');
  }

  function atualizarBotao(botao) {
    var escuro = temaAtual() === 'dark';
    botao.setAttribute('aria-pressed', escuro ? 'true' : 'false');
    botao.querySelector('[aria-hidden]').textContent = escuro ? '☀' : '☾';
    botao.title = escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
  }

  var salvo = lerTemaSalvo();
  if (salvo === 'light' || salvo === 'dark') {
    raiz.setAttribute('data-theme', salvo);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var botao = document.querySelector('.botao-tema');
    if (!botao) return;

    atualizarBotao(botao);

    botao.addEventListener('click', function () {
      var novo = temaAtual() === 'dark' ? 'light' : 'dark';
      raiz.setAttribute('data-theme', novo);
      salvarTema(novo);
      atualizarBotao(botao);
    });

    // Se o usuário nunca escolheu e o sistema mudar de tema, o ícone acompanha
    sistemaEscuro.addEventListener('change', function () {
      atualizarBotao(botao);
    });
  });
})();
