/* ==========================================================
   ROTEADOR (navegação de página única - SPA)

   Em uma SPA existe um único arquivo HTML (index.html). Quando
   a pessoa clica em um link como <a href="#/sobre">, o endereço
   muda só depois do "#" e o navegador NÃO recarrega a página.
   O roteador percebe a mudança (evento "hashchange"), escolhe a
   visão certa, monta o HTML com o template e coloca dentro de
   <div id="app">.

   Endereços:
   #/              -> início
   #/sobre         -> página Sobre
   #/como-ajudar/doacoes -> página Como ajudar, rolando até "doacoes"
   #/qualquer-coisa -> página "não encontrada"
   ========================================================== */
(function (Caminhos) {
  'use strict';

  let primeiraRenderizacao = true;

  // Código extra que cada página precisa rodar depois de aparecer
  const INICIADORES = {
    projetos: Caminhos.projetos.iniciar,
    cadastro: Caminhos.formulario.iniciar
  };

  // Lê o endereço atual e separa em página e seção
  function lerRota() {
    const texto = window.location.hash.replace(/^#\/?/, '');
    const partes = texto.split('/');
    return {
      pagina: partes[0] || 'inicio',
      secao: partes[1] || ''
    };
  }

  // Marca no menu a página atual (aria-current="page")
  function marcarMenu(pagina) {
    document.querySelectorAll('[data-rota]').forEach(function (link) {
      if (link.dataset.rota === pagina) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Atualiza as <meta> de descrição para a "página" atual. (Em uma SPA
  // com "#", o HTML inicial é sempre o mesmo; por isso o JavaScript
  // troca esses textos a cada rota.)
  function atualizarMeta(visao) {
    const descricao = document.querySelector('meta[name="description"]');
    const ogTitulo = document.querySelector('meta[property="og:title"]');
    const ogDescricao = document.querySelector('meta[property="og:description"]');

    if (descricao && visao.descricao) {
      descricao.setAttribute('content', visao.descricao);
    }
    if (ogTitulo) {
      ogTitulo.setAttribute('content', visao.titulo);
    }
    if (ogDescricao && visao.descricao) {
      ogDescricao.setAttribute('content', visao.descricao);
    }
  }

  function renderizar() {
    const app = document.getElementById('app');
    const rota = lerRota();
    const visoes = Caminhos.templates.visoes;
    const existe = Object.prototype.hasOwnProperty.call(visoes, rota.pagina) && rota.pagina !== 'naoEncontrada';
    const chave = existe ? rota.pagina : 'naoEncontrada';
    const visao = visoes[chave];

    // 1. Monta a página com o template
    Caminhos.ui.inserirHTML(app, visao.html()); // limpa com DOMPurify e injeta
    app.classList.remove('pagina-entrada');
    void app.offsetWidth; // reinicia a animação de entrada
    app.classList.add('pagina-entrada');

    // 2. Atualiza título da aba, descrição (meta) e menu
    document.title = visao.titulo;
    atualizarMeta(visao);
    marcarMenu(existe ? rota.pagina : '');

    // 3. Liga os comportamentos da página (formulário, filtro...)
    if (INICIADORES[chave]) {
      INICIADORES[chave](app);
    }

    // 4. Rola até a seção pedida no endereço ou volta ao topo
    const alvo = rota.secao ? document.getElementById(rota.secao) : null;
    // ("instant" faz a rolagem ser imediata, pois é uma página nova)
    if (alvo && app.contains(alvo)) {
      alvo.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 5. Acessibilidade: depois de navegar, leva o foco ao conteúdo
    //    novo e avisa leitores de tela. (No primeiro carregamento,
    //    não roubamos o foco.)
    if (!primeiraRenderizacao) {
      const foco = alvo && app.contains(alvo) ? alvo : app.querySelector('h1');
      if (foco) {
        foco.setAttribute('tabindex', '-1');
        foco.focus({ preventScroll: true });
      }
      Caminhos.ui.anunciar('Página carregada: ' + visao.titulo.split(' | ')[0]);
    }
    primeiraRenderizacao = false;
  }

  function iniciar() {
    window.addEventListener('hashchange', renderizar);
    renderizar();
  }

  Caminhos.router = {
    iniciar: iniciar
  };
})(window.Caminhos = window.Caminhos || {});
