/* ==========================================================
   NAVEGAÇÃO (menu principal)

   Cuida de dois comportamentos:

   1. MENU HAMBÚRGUER (telas pequenas e tablets em retrato)
      O botão "Menu" abre e fecha a lista de links.

   2. SUBMENU "Como ajudar" (dropdown)
      O item tem um link (vai para a página) e um botão ao lado
      (abre a lista de seções: voluntariado, doações...).
      É o padrão "disclosure": um botão com aria-expanded que
      mostra ou esconde uma lista de links.

   Teclado:
   - Tab / Shift+Tab: percorre links, botões e itens do submenu
   - Enter ou Espaço no botão: abre/fecha o submenu
   - Esc: fecha o submenu (e devolve o foco ao botão); se não
     houver submenu aberto, fecha o menu hambúrguer
   - Tab para fora do submenu: ele fecha sozinho (só no desktop)

   Mouse e toque:
   - Clique/toque no botão: abre/fecha
   - Mouse sobre o item (desktop): abre; clicar no botão "fixa"
     o submenu aberto
   - Clicar fora: fecha

   O ponto de quebra entre "hambúrguer" e "menu horizontal" é
   definido só no CSS. O JavaScript pergunta ao CSS: se o botão
   "Menu" está visível, estamos no modo celular/tablet.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  function iniciar() {
    const botaoMenu = document.querySelector('.nav-toggle');
    const menu = document.getElementById('menu-principal');
    const cabecalho = document.querySelector('.site-header');

    if (!botaoMenu || !menu || !cabecalho) {
      return;
    }

    // Cada item com submenu vira um "grupo" com seus três elementos
    const grupos = Array.from(menu.querySelectorAll('.tem-submenu')).map(function (item) {
      return {
        item: item,
        botao: item.querySelector('.submenu-toggle'),
        submenu: item.querySelector('.submenu'),
        abertoPorHover: false
      };
    });

    // O CSS decide: se o botão "Menu" aparece, estamos no modo hambúrguer
    function emModoHamburguer() {
      return window.getComputedStyle(botaoMenu).display !== 'none';
    }

    /* --- Submenus --- */
    function submenuEstaAberto(grupo) {
      return grupo.botao.getAttribute('aria-expanded') === 'true';
    }

    function abrirSubmenu(grupo) {
      grupos.forEach(function (outro) {
        if (outro !== grupo) {
          fecharSubmenu(outro);
        }
      });
      grupo.submenu.hidden = false;
      grupo.botao.setAttribute('aria-expanded', 'true');
    }

    function fecharSubmenu(grupo) {
      grupo.submenu.hidden = true;
      grupo.botao.setAttribute('aria-expanded', 'false');
      grupo.abertoPorHover = false;
    }

    function fecharTodosOsSubmenus() {
      grupos.forEach(fecharSubmenu);
    }

    /* --- Menu hambúrguer --- */
    function abrirMenu() {
      menu.classList.add('aberto');
      botaoMenu.setAttribute('aria-expanded', 'true');
      botaoMenu.textContent = 'Fechar';
    }

    function fecharMenu() {
      menu.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.textContent = 'Menu';
      fecharTodosOsSubmenus();
    }

    botaoMenu.addEventListener('click', function () {
      if (menu.classList.contains('aberto')) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });

    // Escolher uma página (link) fecha o menu e os submenus
    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) {
        fecharMenu();
      }
    });

    /* --- Eventos de cada submenu --- */
    grupos.forEach(function (grupo) {
      // Clique, Enter e Espaço (um <button> já responde aos três)
      grupo.botao.addEventListener('click', function () {
        if (grupo.abertoPorHover) {
          grupo.abertoPorHover = false; // clicar "fixa" o submenu aberto
          return;
        }
        if (submenuEstaAberto(grupo)) {
          fecharSubmenu(grupo);
        } else {
          abrirSubmenu(grupo);
        }
      });

      // Desktop: o mouse sobre o item abre o submenu.
      // (pointerType evita que o toque dispare o "hover".)
      grupo.item.addEventListener('pointerenter', function (evento) {
        if (evento.pointerType === 'mouse' && !emModoHamburguer() && !submenuEstaAberto(grupo)) {
          abrirSubmenu(grupo);
          grupo.abertoPorHover = true;
        }
      });

      grupo.item.addEventListener('pointerleave', function (evento) {
        if (evento.pointerType === 'mouse' && grupo.abertoPorHover) {
          fecharSubmenu(grupo);
        }
      });

      // Desktop: quando o foco do teclado sai do item, o submenu fecha.
      // (relatedTarget é o elemento que recebeu o foco.)
      grupo.item.addEventListener('focusout', function (evento) {
        const proximo = evento.relatedTarget;
        if (!emModoHamburguer() && proximo && !grupo.item.contains(proximo)) {
          fecharSubmenu(grupo);
        }
      });
    });

    /* --- Teclado: Esc --- */
    document.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Escape') {
        return;
      }

      // 1º Esc: fecha o submenu aberto (se o foco estava dentro dele,
      // devolve o foco ao botão para a pessoa não se perder)
      const grupoAberto = grupos.find(submenuEstaAberto);
      if (grupoAberto) {
        const focoDentro = grupoAberto.item.contains(document.activeElement);
        fecharSubmenu(grupoAberto);
        if (focoDentro) {
          grupoAberto.botao.focus();
        }
        return;
      }

      // 2º Esc: fecha o menu hambúrguer
      if (menu.classList.contains('aberto')) {
        fecharMenu();
        botaoMenu.focus();
      }
    });

    /* --- Clique fora --- */
    document.addEventListener('click', function (evento) {
      // Desktop: clicar fora de um submenu aberto fecha
      grupos.forEach(function (grupo) {
        if (submenuEstaAberto(grupo) && !grupo.item.contains(evento.target)) {
          fecharSubmenu(grupo);
        }
      });

      // Celular/tablet: clicar fora do cabeçalho fecha o menu
      if (menu.classList.contains('aberto') && !cabecalho.contains(evento.target)) {
        fecharMenu();
      }
    });

    /* --- Mudou o tamanho da tela (ex.: girar o aparelho) --- */
    let modoAnterior = emModoHamburguer();
    window.addEventListener('resize', function () {
      const modoAtual = emModoHamburguer();
      if (modoAtual !== modoAnterior) {
        fecharMenu(); // volta ao estado inicial ao trocar de modo
        modoAnterior = modoAtual;
      }
    });
  }

  Caminhos.navegacao = {
    iniciar: iniciar
  };
})(window.Caminhos = window.Caminhos || {});
