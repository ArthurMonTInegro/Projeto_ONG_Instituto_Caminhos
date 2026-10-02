/* ==========================================================
   INTERFACE (ui)

   Componentes de interface usados em várias partes do site:
   - link "Ir para o conteúdo"
   - anúncio para leitores de tela
   - alerta de feedback
   - toast (notificação)
   - modal de confirmação
   - inserção de HTML sanitizado (DOMPurify)
   ========================================================== */
(function (Caminhos) {
  'use strict';

  // Texto lido por leitores de tela quando a "página" muda
  function anunciar(texto) {
    const area = document.getElementById('anuncio-rota');
    if (area) {
      area.textContent = texto;
    }
  }

  /* --- Link "Ir para o conteúdo principal" ---
     Como o site usa "#/pagina" nos endereços, um link comum para
     "#conteudo" confundiria o roteador. Por isso o foco é movido
     pelo JavaScript. */
  function iniciarSkipLink() {
    const link = document.querySelector('.skip-link');
    const principal = document.getElementById('conteudo');

    if (!link || !principal) {
      return;
    }

    link.addEventListener('click', function (evento) {
      evento.preventDefault();
      principal.focus();
    });
  }

  /* --- Inserir HTML com segurança (biblioteca externa DOMPurify) ---
     O site monta as páginas como texto HTML (templates.js) e as coloca
     na tela com innerHTML. Antes disso, o DOMPurify (js/vendor/) remove
     qualquer código perigoso, como <script>, onerror="..." ou links
     "javascript:". É uma segunda proteção contra XSS, além da função
     esc() que já escapa os textos digitados pelo usuário.
     fetchpriority é liberado porque o DOMPurify ainda não o conhece
     (é a dica de prioridade da foto principal). Se a biblioteca não
     carregar, o site continua funcionando só com a proteção do esc(). */
  const CONFIG_DOMPURIFY = { ADD_ATTR: ['fetchpriority'] };

  function inserirHTML(elemento, html) {
    if (window.DOMPurify && window.DOMPurify.isSupported) {
      elemento.innerHTML = window.DOMPurify.sanitize(html, CONFIG_DOMPURIFY);
    } else {
      elemento.innerHTML = html;
    }
  }

  /* --- Alerta de feedback ---
     tipo: "sucesso" ou "erro" (classes .alerta-sucesso / .alerta-erro) */
  function mostrarFeedback(elemento, tipo, texto) {
    const rotulo = document.createElement('strong');
    rotulo.textContent = tipo === 'sucesso' ? 'Sucesso: ' : 'Atenção: ';

    elemento.className = 'alerta alerta-' + tipo;
    elemento.textContent = '';
    elemento.append(rotulo, texto);
  }

  function limparFeedback(elemento) {
    elemento.className = '';
    elemento.textContent = '';
  }

  /* --- Toast: notificação que some sozinha ---
     tipo: "sucesso", "erro" ou "info" */
  function removerToast(toast) {
    if (toast.parentNode) {
      toast.remove();
    }
  }

  function mostrarToast(texto, tipo) {
    const area = document.getElementById('area-toast');
    if (!area) {
      return;
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (tipo || 'sucesso');

    const mensagem = document.createElement('p');
    mensagem.textContent = texto;

    const botaoFechar = document.createElement('button');
    botaoFechar.type = 'button';
    botaoFechar.className = 'toast-fechar';
    botaoFechar.setAttribute('aria-label', 'Fechar notificação');
    botaoFechar.textContent = '\u00d7';
    botaoFechar.addEventListener('click', function () {
      removerToast(toast);
    });

    toast.append(mensagem, botaoFechar);
    area.appendChild(toast);

    setTimeout(function () {
      removerToast(toast);
    }, 6000);
  }

  /* --- Modal de confirmação ---
     Uso: Caminhos.ui.confirmar({ titulo, texto, confirmarTexto, cancelarTexto })
          .then(function (confirmou) { ... });
     Devolve uma "promessa": quando a pessoa escolhe, o .then recebe
     true (confirmou) ou false (cancelou, apertou Esc ou clicou fora). */
  function confirmar(opcoes) {
    const modal = document.getElementById('modal');

    // Navegador antigo sem <dialog>: usa a janela simples do navegador
    if (!modal || typeof modal.showModal !== 'function') {
      return Promise.resolve(window.confirm(opcoes.texto));
    }

    const botaoConfirmar = document.getElementById('modal-confirmar');
    const botaoCancelar = document.getElementById('modal-cancelar');

    document.getElementById('modal-titulo').textContent = opcoes.titulo;
    document.getElementById('modal-texto').textContent = opcoes.texto;
    botaoConfirmar.textContent = opcoes.confirmarTexto || 'Confirmar';
    botaoCancelar.textContent = opcoes.cancelarTexto || 'Cancelar';

    return new Promise(function (resolver) {
      function aoConfirmar() {
        modal.close('confirmado');
      }

      function aoCancelar() {
        modal.close('cancelado');
      }

      // Clicar no fundo escuro cancela. evento.detail conta os cliques
      // seguidos: em um clique duplo no botão "Enviar", o 1º clique abre
      // o modal e o 2º cairia no fundo (detail = 2) e o fecharia na hora.
      // Por isso só um clique simples (detail 1) no fundo cancela.
      function aoClicarNoFundo(evento) {
        if (evento.target === modal && evento.detail <= 1) {
          modal.close('cancelado');
        }
      }

      function aoFechar() {
        botaoConfirmar.removeEventListener('click', aoConfirmar);
        botaoCancelar.removeEventListener('click', aoCancelar);
        modal.removeEventListener('click', aoClicarNoFundo);
        resolver(modal.returnValue === 'confirmado');
      }

      botaoConfirmar.addEventListener('click', aoConfirmar);
      botaoCancelar.addEventListener('click', aoCancelar);
      modal.addEventListener('click', aoClicarNoFundo);
      modal.addEventListener('close', aoFechar, { once: true });

      modal.returnValue = '';
      modal.showModal(); // abre o modal e prende o foco dentro dele
    });
  }

  Caminhos.ui = {
    anunciar: anunciar,
    inserirHTML: inserirHTML,
    iniciarSkipLink: iniciarSkipLink,
    mostrarFeedback: mostrarFeedback,
    limparFeedback: limparFeedback,
    mostrarToast: mostrarToast,
    confirmar: confirmar
  };
})(window.Caminhos = window.Caminhos || {});
