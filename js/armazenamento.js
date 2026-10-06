/* ==========================================================
   ARMAZENAMENTO (localStorage)

   Esta é a "área de funcionalidade" responsável por guardar e
   recuperar dados no navegador. Nenhum outro arquivo mexe no
   localStorage diretamente: todos passam por aqui.

   O que é guardado (sempre só neste navegador):
   - cadastros: primeiro nome, forma de ajudar e data
   - rascunho: nome, e-mail, forma de ajudar e mensagem
   - filtro: o último filtro escolhido em Projetos
   - contraste: se a pessoa ligou ou desligou o alto contraste

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

  // Os dados do localStorage podem ter sido alterados à mão (ou por
  // outra versão do site). Por isso nunca confiamos neles: só passam
  // itens com o formato esperado, e os textos são limitados em tamanho.
  const LIMITE_CADASTROS = 50;
  const LIMITE_TEXTO = 80;

  function textoSeguro(valor) {
    return typeof valor === 'string' ? valor.slice(0, LIMITE_TEXTO) : '';
  }

  function cadastroValido(item) {
    return item !== null && typeof item === 'object' &&
      typeof item.primeiroNome === 'string' && item.primeiroNome.trim() !== '' &&
      typeof item.ajuda === 'string' && typeof item.data === 'string' &&
      !Number.isNaN(Date.parse(item.data));
  }

  // --- Cadastros ---
  function listarCadastros() {
    const lista = ler('cadastros', []);
    if (!Array.isArray(lista)) {
      return [];
    }
    return lista.filter(cadastroValido).slice(-LIMITE_CADASTROS).map(function (item) {
      return {
        primeiroNome: textoSeguro(item.primeiroNome),
        ajuda: textoSeguro(item.ajuda),
        data: item.data
      };
    });
  }

  function adicionarCadastro(cadastro) {
    const lista = listarCadastros();
    lista.push(cadastro);
    return salvar('cadastros', lista.slice(-LIMITE_CADASTROS));
  }

  function limparCadastros() {
    remover('cadastros');
  }

  // --- Rascunho do formulário ---
  function lerRascunho() {
    const rascunho = ler('rascunho', null);
    if (!rascunho || typeof rascunho !== 'object' || Array.isArray(rascunho)) {
      return null;
    }
    // só os quatro campos permitidos, e só se forem texto
    const limpo = {};
    ['nome', 'email', 'ajuda', 'mensagem'].forEach(function (campo) {
      if (typeof rascunho[campo] === 'string') {
        limpo[campo] = rascunho[campo].slice(0, 2000);
      }
    });
    return limpo;
  }

  function salvarRascunho(rascunho) {
    return salvar('rascunho', rascunho);
  }

  function limparRascunho() {
    remover('rascunho');
  }

  // --- Filtro da página Projetos ---
  function lerFiltro() {
    const filtro = ler('filtro-projetos', 'todos');
    return typeof filtro === 'string' ? filtro : 'todos';
  }

  function salvarFiltro(categoria) {
    return salvar('filtro-projetos', categoria);
  }

  // --- Modo de alto contraste ---
  // Guarda "alto" ou "normal". Qualquer outro valor é ignorado
  // (devolve null = a pessoa ainda não escolheu).
  function lerContraste() {
    const valor = ler('contraste', null);
    return valor === 'alto' || valor === 'normal' ? valor : null;
  }

  function salvarContraste(valor) {
    return salvar('contraste', valor === 'alto' ? 'alto' : 'normal');
  }

  Caminhos.armazenamento = {
    listarCadastros: listarCadastros,
    adicionarCadastro: adicionarCadastro,
    limparCadastros: limparCadastros,
    lerRascunho: lerRascunho,
    salvarRascunho: salvarRascunho,
    limparRascunho: limparRascunho,
    lerFiltro: lerFiltro,
    salvarFiltro: salvarFiltro,
    lerContraste: lerContraste,
    salvarContraste: salvarContraste
  };
})(window.Caminhos = window.Caminhos || {});
