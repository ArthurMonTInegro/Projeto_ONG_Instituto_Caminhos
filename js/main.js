/* ==========================================================
   MAIN: ponto de partida do site

   Este é o último arquivo carregado. Ele só "liga" os módulos:

   armazenamento.js  -> localStorage
   ui.js             -> menu, alertas, toast e modal
   templates.js      -> dados e HTML das páginas
   formulario.js     -> formulário de cadastro
   projetos.js       -> filtro de projetos
   router.js         -> navegação (SPA)
   ========================================================== */
document.documentElement.classList.add('js');

Caminhos.ui.iniciarMenuMobile();
Caminhos.ui.iniciarSkipLink();
Caminhos.router.iniciar();
