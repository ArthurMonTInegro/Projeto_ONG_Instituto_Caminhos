/* ==========================================================
   INTERFACE (ui)

   Componentes de interface usados em várias partes do site:
   - link "Ir para o conteúdo"
   - anúncio para leitores de tela
   - alerta de feedback
   - toast (notificação)
   - modal de confirmação
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

      function aoClicarNoFundo(evento) {
        if (evento.target === modal) {
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
    iniciarSkipLink: iniciarSkipLink,
    mostrarFeedback: mostrarFeedback,
    limparFeedback: limparFeedback,
    mostrarToast: mostrarToast,
    confirmar: confirmar
  };
})(window.Caminhos = window.Caminhos || {});
