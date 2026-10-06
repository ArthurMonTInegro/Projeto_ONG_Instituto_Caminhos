/* ==========================================================
   CONTRASTE: modo de alto contraste

   Liga e desliga a classe "alto-contraste" no <html>. As cores do
   modo ficam no CSS (seção 15 do style.css): fundo preto, texto
   branco e links/botões em amarelo.

   Quando o modo liga:
   1. A pessoa clica no botão "Alto contraste" (aria-pressed diz
      ao leitor de tela se ele está ligado ou desligado).
   2. Ou o sistema operacional pede mais contraste
      (prefers-contrast: more) e a pessoa ainda não escolheu nada
      no site.

   A escolha fica guardada no localStorage (js/armazenamento.js),
   para continuar valendo ao voltar ao site.

   Este arquivo é carregado no <head> SEM defer, logo depois do
   armazenamento.js: assim a classe entra antes de a página
   aparecer, e ela não "pisca" com as cores normais.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  const CLASSE = 'alto-contraste';
  const raiz = document.documentElement;
  const consultaDoSistema = window.matchMedia
    ? window.matchMedia('(prefers-contrast: more)')
    : null;

  function estaLigado() {
    return raiz.classList.contains(CLASSE);
  }

  // Liga ou desliga o modo e atualiza o botão (se ele já existir)
  function aplicar(ligar) {
    raiz.classList.toggle(CLASSE, ligar);

    const botao = document.querySelector('.contraste-toggle');
    if (botao) {
      botao.setAttribute('aria-pressed', ligar ? 'true' : 'false');
    }
  }

  // "alto", "normal" ou null (ainda não escolheu)
  function preferenciaSalva() {
    return Caminhos.armazenamento ? Caminhos.armazenamento.lerContraste() : null;
  }

  function sistemaPedeContraste() {
    return consultaDoSistema !== null && consultaDoSistema.matches;
  }

  // --- 1. Estado inicial: roda já no <head> ---
  const salvo = preferenciaSalva();
  aplicar(salvo === 'alto' || (salvo === null && sistemaPedeContraste()));

  // --- 2. Botão: ligado pelo main.js depois que a página carrega ---
  function iniciar() {
    const barra = document.querySelector('.barra-acessibilidade');
    const botao = document.querySelector('.contraste-toggle');

    if (!barra || !botao) {
      return;
    }

    // A barra começa com "hidden": sem JavaScript o botão não
    // funcionaria, então só aparece quando o JavaScript está ativo.
    barra.hidden = false;
    aplicar(estaLigado());

    botao.addEventListener('click', function () {
      const ligar = !estaLigado();
      aplicar(ligar);
      Caminhos.armazenamento.salvarContraste(ligar ? 'alto' : 'normal');
    });

    // Se a pessoa mudar o contraste do sistema com o site aberto,
    // o site acompanha (só enquanto ela não escolheu pelo botão).
    if (consultaDoSistema && consultaDoSistema.addEventListener) {
      consultaDoSistema.addEventListener('change', function () {
        if (preferenciaSalva() === null) {
          aplicar(sistemaPedeContraste());
        }
      });
    }
  }

  Caminhos.contraste = {
    iniciar: iniciar
  };
})(window.Caminhos = window.Caminhos || {});
