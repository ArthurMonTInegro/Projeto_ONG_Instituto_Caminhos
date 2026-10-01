/* ==========================================================
   PROJETOS: filtro por tema

   Os botões e os cartões já vêm prontos do template. Aqui só
   cuidamos do clique: esconder os cartões de outros temas e
   lembrar (no localStorage) o último filtro escolhido.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  function iniciar(container) {
    const areaDosBotoes = container.querySelector('#filtros-projetos');
    const lista = container.querySelector('#lista-projetos');
    const status = container.querySelector('#status-filtro');

    if (!areaDosBotoes || !lista || !status) {
      return;
    }

    const botoes = areaDosBotoes.querySelectorAll('button');
    const projetos = lista.querySelectorAll('.projeto');
    const filtrosValidos = Array.from(botoes).map(function (botao) {
      return botao.dataset.filtro;
    });

    function aplicarFiltro(categoria, guardar) {
      let visiveis = 0;

      projetos.forEach(function (projeto) {
        const deveAparecer = categoria === 'todos' || projeto.dataset.categoria === categoria;
        projeto.hidden = !deveAparecer;
        if (deveAparecer) {
          visiveis++;
        }
      });

      botoes.forEach(function (botao) {
        botao.setAttribute('aria-pressed', botao.dataset.filtro === categoria ? 'true' : 'false');
      });

      status.textContent = 'Mostrando ' + visiveis + ' de ' + projetos.length + ' projetos.';

      if (guardar) {
        Caminhos.armazenamento.salvarFiltro(categoria);
      }
    }

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        aplicarFiltro(botao.dataset.filtro, true);
      });
    });

    // Estado inicial: o último filtro escolhido (ou "todos")
    const salvo = Caminhos.armazenamento.lerFiltro();
    aplicarFiltro(filtrosValidos.includes(salvo) ? salvo : 'todos', false);
  }

  Caminhos.projetos = {
    iniciar: iniciar
  };
})(window.Caminhos = window.Caminhos || {});
