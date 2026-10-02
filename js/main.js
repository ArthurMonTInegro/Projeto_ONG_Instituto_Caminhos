/* ==========================================================
   MAIN: ponto de partida do site

   Este é o último arquivo carregado. Ele só "liga" os módulos:

   armazenamento.js  -> localStorage
   ui.js             -> alertas, toast, modal e skip-link
   imagens.js        -> registro das ilustrações (arquivo, alt, tamanho)
   navegacao.js      -> menu hambúrguer e submenu
   templates.js      -> dados e HTML das páginas
   formulario.js     -> formulário de cadastro
   projetos.js       -> filtro de projetos
   router.js         -> navegação (SPA)
   ========================================================== */
document.documentElement.classList.add('js');

Caminhos.navegacao.iniciar();
Caminhos.ui.iniciarSkipLink();
Caminhos.router.iniciar();