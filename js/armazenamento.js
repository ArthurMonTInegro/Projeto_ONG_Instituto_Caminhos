/* ==========================================================
   ARMAZENAMENTO (localStorage)

   Esta é a "área de funcionalidade" responsável por guardar e
   recuperar dados no navegador. Nenhum outro arquivo mexe no
   localStorage diretamente: todos passam por aqui.

   O que é guardado (sempre só neste navegador):
   - cadastros: primeiro nome, forma de ajudar e data
   - rascunho: nome, e-mail, forma de ajudar e mensagem
   - filtro: o último filtro escolhido em Projetos

   CPF, CEP e telefone NUNCA são guardados.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  const PREFIXO = 'caminhos:'; // evita misturar com dados de outros sites/projetos

  // --- Funções genéricas ---
  // Todas usam try/catch: o localStorage pode estar bloqueado
  // (navegação privada, por exemplo) e o site não pode quebrar por isso.
  function ler(chave, valorPadrao) {
    try {
      const texto = localStorage.getItem(PREFIXO + chave);
      return texto === null ? valorPadrao : JSON.parse(texto);
    } catch (erro) {
      return valorPadrao;
    }
  }

  function salvar(chave, valor) {
    try {
      localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      return false;
    }
  }

  function remover(chave) {
    try {
      localStorage.removeItem(PREFIXO + chave);
    } catch (erro) {
      // sem ação: se não deu para apagar, não há o que fazer
    }
  }

  // --- Cadastros ---
  function listarCadastros() {
    const lista = ler('cadastros', []);
    return Array.isArray(lista) ? lista : [];
  }

  function adicionarCadastro(cadastro) {
    const lista = listarCadastros();
    lista.push(cadastro);
    return salvar('cadastros', lista);
  }

  function limparCadastros() {
    remover('cadastros');
  }

  // --- Rascunho do formulário ---
  function lerRascunho() {
    const rascunho = ler('rascunho', null);
    return rascunho && typeof rascunho === 'object' ? rascunho : null;
  }

  function salvarRascunho(rascunho) {
    return salvar('rascunho', rascunho);
  }

  function limparRascunho() {
    remover('rascunho');
  }

  // --- Filtro da página Projetos ---
  function lerFiltro() {
    return ler('filtro-projetos', 'todos');
  }

  function salvarFiltro(categoria) {
    return salvar('filtro-projetos', categoria);
  }

  Caminhos.armazenamento = {
    listarCadastros: listarCadastros,
    adicionarCadastro: adicionarCadastro,
    limparCadastros: limparCadastros,
    lerRascunho: lerRascunho,
    salvarRascunho: salvarRascunho,
    limparRascunho: limparRascunho,
    lerFiltro: lerFiltro,
    salvarFiltro: salvarFiltro
  };
})(window.Caminhos = window.Caminhos || {});
