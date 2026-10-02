/* ==========================================================
   IMAGENS (registro das ilustrações do site)

   Todas as ilustrações ficam listadas aqui, em um único lugar.
   Cada uma tem arquivo, texto alternativo (alt) e tamanho. Assim:
   - o alt de cada imagem é escrito uma vez só e fica consistente;
   - width/height são sempre informados (o navegador reserva o
     espaço antes de a imagem carregar e a página não "pula");
   - as imagens usam loading="lazy": só são baixadas quando a
     pessoa rola até perto delas.

   As ilustrações são arquivos SVG (desenho vetorial: leves e nítidos
   em qualquer tela). Foram criadas para este projeto acadêmico e
   são ilustrações conceituais, não fotografias de ações reais.
   A foto da fachada (hero da página inicial) é montada direto em
   templates.js, pois usa <picture> com versões otimizadas.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  /* CAMINHO ATÉ A RAIZ DO PROJETO
     Caminhos de imagem montados pelo JavaScript são resolvidos a partir
     da PÁGINA que está aberta (html/index.html), e não a partir deste
     arquivo .js. Como a página fica dentro de html/, é preciso subir
     uma pasta ("../") para chegar em img/. Se a página mudar de pasta,
     basta ajustar este valor. */
  const RAIZ = '../';
  const PASTA = RAIZ + 'img/ilustracoes/';

  // Monta o caminho de qualquer arquivo a partir da raiz do projeto.
  // Ex.: url('img/foto.webp') -> '../img/foto.webp'
  function url(caminhoNaRaiz) {
    return RAIZ + caminhoNaRaiz;
  }

  const IMAGENS = {
    educacao: {
      arquivo: 'educacao.svg',
      alt: 'Ilustração de duas pessoas lendo juntas um livro aberto, com uma lâmpada acesa e uma estante ao fundo'
    },
    'conexao-comunitaria': {
      arquivo: 'conexao-comunitaria.svg',
      alt: 'Ilustração de três pessoas sorrindo diante de casas, ligadas por linhas pontilhadas com corações'
    },
    'oportunidades-rede': {
      arquivo: 'oportunidades-rede.svg',
      alt: 'Ilustração de cinco pessoas ligadas por linhas a um círculo central com o símbolo de mais'
    },
    'campanha-arrecadacao': {
      arquivo: 'campanha-arrecadacao.svg',
      alt: 'Ilustração de uma caixa de doações com alimentos e um coração, entre duas pessoas sorrindo'
    },
    'distribuicao-doacoes': {
      arquivo: 'distribuicao-doacoes.svg',
      alt: 'Ilustração de duas pessoas diante de uma mesa com frutas e alimentos prontos para distribuição'
    },
    'voluntariado-equipe': {
      arquivo: 'voluntariado-equipe.svg',
      alt: 'Ilustração de cinco voluntários de camisa azul lado a lado, sob o sol'
    },
    'caminho-esperanca': {
      arquivo: 'caminho-esperanca.svg',
      alt: 'Ilustração de uma estrada sinuosa entre colinas verdes, com placas de direção, pessoas caminhando e o sol ao fundo'
    },
    'comunidade-reunida': {
      arquivo: 'comunidade-reunida.svg',
      alt: 'Ilustração de quatro pessoas sorrindo à mesma mesa, com canecas e alimentos, sob um varal de bandeirinhas coloridas'
    },
    acolhimento: {
      arquivo: 'acolhimento.svg',
      alt: 'Ilustração de duas pessoas conversando com simpatia, com um balão de coração e uma planta entre elas'
    },
    divulgacao: {
      arquivo: 'divulgacao.svg',
      alt: 'Ilustração de um megafone com balões de conversa que contêm um coração e uma estrela'
    }
  };

  // Todas as ilustrações têm proporção 3:2 (600 x 400)
  const LARGURA = 600;
  const ALTURA = 400;

  // Devolve o HTML de uma <img>. "classe" é opcional.
  function html(chave, classe) {
    const imagem = IMAGENS[chave];
    if (!imagem) {
      return ''; // chave desconhecida: não mostra nada em vez de quebrar a página
    }
    const atributoClasse = classe ? ` class="${classe}"` : '';
    return `<img${atributoClasse} src="${PASTA}${imagem.arquivo}" alt="${imagem.alt}" width="${LARGURA}" height="${ALTURA}" loading="lazy" decoding="async">`;
  }

  Caminhos.imagens = {
    html: html,
    url: url,
    lista: IMAGENS
  };
})(window.Caminhos = window.Caminhos || {});
