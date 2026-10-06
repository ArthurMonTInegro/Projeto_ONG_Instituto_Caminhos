/* ==========================================================
   MAIN: ponto de partida do site

   Este é o último arquivo carregado. Ele só "liga" os módulos.
   Os dois primeiros rodam antes, no <head> (sem defer):

   armazenamento.js  -> localStorage
   contraste.js      -> modo de alto contraste (aplicado antes da página aparecer)

   Os outros rodam na ordem abaixo (com defer):

   vendor/purify.min.js -> biblioteca externa DOMPurify (segurança)
   ui.js             -> alertas, toast, modal e skip-link
   imagens.js        -> registro das ilustrações (arquivo, alt, tamanho)
   navegacao.js      -> menu hambúrguer e submenu
   templates.js      -> dados e HTML das páginas
   formulario.js     -> formulário de cadastro
   projetos.js       -> filtro de projetos
   router.js         -> navegação (SPA)
   ========================================================== */
document.documentElement.classList.add('js');

Caminhos.contraste.iniciar();
Caminhos.navegacao.iniciar();
Caminhos.ui.iniciarSkipLink();
Caminhos.router.iniciar();