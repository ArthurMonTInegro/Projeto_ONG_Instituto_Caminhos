/* ==========================================================
   TEMPLATES DINÂMICOS

   Aqui ficam os DADOS do site (projetos, formas de participar)
   e os TEMPLATES: funções que montam o HTML de cada "página"
   (visão) usando template literals (textos entre crases `...`).

   Como funciona:
   - Os dados ficam em listas (arrays) no início do arquivo.
   - Pequenos componentes (badge, alerta, cartão) são funções
     reaproveitadas em várias visões.
   - Cada visão devolve o HTML da página; o roteador (router.js)
     é quem coloca esse HTML na tela.

   Este arquivo só monta HTML. Ele não reage a cliques.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  /* ----------------------------------------------------------
     DADOS
     ---------------------------------------------------------- */
  const CATEGORIAS = {
    educacao: 'Educação',
    comunidade: 'Comunidade',
    participacao: 'Participação',
    doacoes: 'Doações'
  };

  const PROJETOS = [
    {
      categoria: 'educacao',
      titulo: 'Caminhos para a Educação',
      imagem: 'educacao',
      resumo: 'Aproximamos pessoas de iniciativas educacionais, incentivando o acesso ao conhecimento e apoiando atividades de aprendizagem na comunidade.',
      descricao: 'Aproximamos pessoas de iniciativas educacionais, incentivando o acesso ao conhecimento e apoiando atividades de aprendizagem na comunidade.'
    },
    {
      categoria: 'comunidade',
      titulo: 'Conexão Comunitária',
      imagem: 'conexao-comunitaria',
      resumo: 'Criamos pontes entre voluntários e ações sociais existentes, valorizando a colaboração para fortalecer o impacto local.',
      descricao: 'Criamos pontes entre voluntários e ações sociais existentes, valorizando a colaboração e a mobilização comunitária para fortalecer o impacto local.'
    },
    {
      categoria: 'participacao',
      titulo: 'Oportunidades em Rede',
      imagem: 'oportunidades-rede',
      resumo: 'Divulgamos oportunidades de participação social, para que cada pessoa encontre a melhor forma de contribuir.',
      descricao: 'Divulgamos oportunidades de participação social, facilitando o acesso à informação para que cada pessoa encontre a melhor forma de contribuir, seja com voluntariado, apoio a projetos ou doações.'
    },
    {
      categoria: 'doacoes',
      titulo: 'Campanhas de Arrecadação',
      imagem: 'campanha-arrecadacao',
      resumo: 'Organizamos campanhas para reunir doações e apoiar as ações do Instituto.',
      descricao: 'Organizamos campanhas para reunir doações e apoiar as ações do Instituto, com informações claras sobre o que está sendo arrecadado.'
    },
    {
      categoria: 'doacoes',
      titulo: 'Distribuição de Doações',
      imagem: 'distribuicao-doacoes',
      resumo: 'Buscamos levar as doações arrecadadas a quem mais precisa.',
      descricao: 'Buscamos levar as doações arrecadadas a pessoas e comunidades que precisam de apoio, de forma organizada e transparente.'
    }
  ];

  const FORMAS_DE_PARTICIPAR = [
    {
      titulo: 'Voluntariado',
      texto: 'Doe um pouco do seu tempo e das suas habilidades em ações na comunidade.',
      link: '#/cadastro',
      rotulo: 'Quero ser voluntário'
    },
    {
      titulo: 'Doações',
      texto: 'Contribua com campanhas de arrecadação que abastecem as ações do Instituto.',
      link: '#/como-ajudar/doacoes',
      rotulo: 'Saiba como doar'
    },
    {
      titulo: 'Apoio a projetos',
      texto: 'Ajude a manter e ampliar as iniciativas que já existem.',
      link: '#/como-ajudar/apoio',
      rotulo: 'Saiba como apoiar'
    },
    {
      titulo: 'Comunicação',
      texto: 'Divulgue as ações e leve a mensagem do Instituto para mais pessoas.',
      link: '#/como-ajudar/divulgacao',
      rotulo: 'Saiba como divulgar'
    }
  ];

  /* ----------------------------------------------------------
     COMPONENTES (pedaços de HTML reaproveitados)
     ---------------------------------------------------------- */

  // Protege o HTML: textos que vêm do usuário nunca devem ser
  // colocados na página sem passar por aqui.
  function esc(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function badge(categoria) {
    return `<span class="badge badge-${categoria}">${CATEGORIAS[categoria]}</span>`;
  }

  function alerta(tipo, rotulo, texto) {
    return `<div class="alerta alerta-${tipo}" role="note">
          <p><strong>${rotulo}:</strong> ${texto}</p>
        </div>`;
  }

  // opcoes.resumo: usa o texto curto (página inicial)
  // opcoes.numero: coloca "1. ", "2. "... antes do título (página Projetos)
  function cartaoProjeto(projeto, opcoes) {
    const configuracao = opcoes || {};
    const texto = configuracao.resumo ? projeto.resumo : projeto.descricao;
    const titulo = configuracao.numero ? `${configuracao.numero}. ${projeto.titulo}` : projeto.titulo;

    return `<article class="cartao projeto" data-categoria="${projeto.categoria}">
            ${Caminhos.imagens.html(projeto.imagem, 'cartao-img')}
            ${badge(projeto.categoria)}
            <h3>${esc(titulo)}</h3>
            <p>${esc(texto)}</p>
          </article>`;
  }

  function cartaoParticipacao(forma) {
    return `<article class="cartao">
            <h3>${forma.titulo}</h3>
            <p>${forma.texto}</p>
            <a href="${forma.link}">${forma.rotulo}</a>
          </article>`;
  }

  // Seção com texto de um lado e ilustração do outro.
  // Em telas estreitas a imagem fica embaixo do texto (ver CSS, seção 15).
  // opcoes.invertida: coloca a imagem à esquerda em telas largas.
  function textoComImagem(conteudo, chaveDaImagem, opcoes) {
    const configuracao = opcoes || {};
    const classe = configuracao.invertida ? 'com-imagem com-imagem-invertida' : 'com-imagem';
    return `<div class="${classe}">
          <div class="com-imagem-texto">
            ${conteudo}
          </div>
          <figure class="com-imagem-figura">
            ${Caminhos.imagens.html(chaveDaImagem)}
          </figure>
        </div>`;
  }

  function cabecalhoPagina(titulo, texto) {
    return `<section class="cabecalho-pagina" aria-labelledby="titulo-pagina">
      <div class="container">
        <h1 id="titulo-pagina">${titulo}</h1>
        <p>${texto}</p>
      </div>
    </section>`;
  }

  function chamadaFinal(titulo, texto, rotuloBotao, destino) {
    return `<section class="secao chamada-final" aria-labelledby="titulo-chamada">
      <div class="container">
        <h2 id="titulo-chamada">${titulo}</h2>
        <p>${texto}</p>
        <a class="btn btn-primario" href="${destino}">${rotuloBotao}</a>
      </div>
    </section>`;
  }

  // Lista de cadastros guardados no localStorage (usada em Seja voluntário)
  function painelCadastros(cadastros) {
    if (cadastros.length === 0) {
      return `<p>Nenhum cadastro foi salvo neste navegador ainda.</p>`;
    }

    const itens = cadastros.map(function (cadastro) {
      const data = new Date(cadastro.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      return `<li><strong>${esc(cadastro.primeiroNome)}</strong>, ${esc(cadastro.ajuda).toLowerCase()} (${esc(data)})</li>`;
    }).join('');

    return `<p>Cadastros salvos neste navegador: <strong>${cadastros.length}</strong></p>
        <ul class="lista-cadastros">${itens}</ul>
        <button type="button" class="btn-contorno" id="limpar-cadastros">Limpar cadastros salvos</button>`;
  }

  /* ----------------------------------------------------------
     VISÕES (cada "página" do site)
     ---------------------------------------------------------- */
  function visaoInicio() {
    const acoes = PROJETOS.slice(0, 3).map(function (projeto) {
      return cartaoProjeto(projeto, { resumo: true });
    }).join('\n          ');

    const formas = FORMAS_DE_PARTICIPAR.map(cartaoParticipacao).join('\n          ');

    return `
    <section class="hero" aria-labelledby="titulo-pagina">
      <div class="container hero-inner">
        <div>
          <h1 id="titulo-pagina">Cada pessoa pode abrir um caminho para uma realidade melhor</h1>
          <p>O Instituto Caminhos transforma solidariedade em ações concretas dentro da comunidade. Aproximamos quem quer ajudar de quem precisa de apoio.</p>
          <div class="botoes">
            <a class="btn btn-primario" href="#/cadastro">Seja voluntário</a>
            <a class="btn btn-secundario" href="#/projetos">Conheça nossas ações</a>
          </div>
        </div>
        <figure class="hero-imagem">
          <!-- WebP leve (60 KB / 150 KB) para navegadores modernos; o PNG original
               fica como alternativa. Sem loading="lazy": é a imagem principal. -->
          <picture>
            <source type="image/webp" srcset="${Caminhos.imagens.url('img/fachada-instituto-768.webp')} 768w, ${Caminhos.imagens.url('img/fachada-instituto-1536.webp')} 1536w" sizes="(max-width: 63.9375rem) min(100vw, 36rem), 40vw">
            <img src="${Caminhos.imagens.url('img/fachada-instituto.png')}" width="1536" height="1024" fetchpriority="high" decoding="async" alt="Fachada do prédio do Instituto Caminhos com voluntários sorrindo e segurando caixas de doações">
          </picture>
        </figure>
      </div>
    </section>

    <section class="secao" aria-labelledby="titulo-quem-somos">
      <div class="container">
        <h2 id="titulo-quem-somos">Quem somos</h2>
        <p>O Instituto Caminhos funciona como um ponto de conexão entre pessoas que desejam fazer a diferença e as causas que precisam de apoio. Atuamos por meio de campanhas de arrecadação, voluntariado e distribuição de doações, com educação, engajamento comunitário e suporte a projetos sociais.</p>
        <p>O nome reflete a nossa ideia central: cada pessoa contribui de uma maneira diferente, e todas essas formas juntas ajudam a construir um caminho melhor.</p>
        <p><a href="#/sobre">Conheça a história do Instituto</a></p>
      </div>
    </section>

    <section class="secao secao-destaque" aria-labelledby="titulo-acoes">
      <div class="container">
        <h2 id="titulo-acoes">Principais ações</h2>
        <div class="grade">
          ${acoes}
        </div>
        <p><a href="#/projetos">Veja todos os projetos</a></p>
      </div>
    </section>

    <section class="secao" aria-labelledby="titulo-participar">
      <div class="container">
        <h2 id="titulo-participar">Formas de participar</h2>
        <p>Você não precisa fazer tudo. Escolha a forma que combina com o seu tempo e com o que você sabe fazer.</p>
        <div class="grade grade-4">
          ${formas}
        </div>
      </div>
    </section>

    <section class="secao secao-destaque" aria-labelledby="titulo-institucional">
      <div class="container">
        <h2 id="titulo-institucional">Informações institucionais</h2>
        <div class="grade">
          <article class="cartao">
            <h3>Missão</h3>
            <p>Transformar solidariedade em ações concretas, conectando voluntários, doadores e pessoas em situação de vulnerabilidade.</p>
          </article>
          <article class="cartao">
            <h3>Visão</h3>
            <p>Uma comunidade em que ajudar seja simples, acessível e aberto a todos.</p>
          </article>
          <article class="cartao">
            <h3>Valores</h3>
            <p>Acolhimento, solidariedade, confiança, participação comunitária, esperança e transparência.</p>
          </article>
        </div>
      </div>
    </section>

    ${chamadaFinal('Vamos construir esse caminho juntos?', 'Faça seu cadastro e diga como gostaria de ajudar.', 'Fazer meu cadastro', '#/cadastro')}`;
  }

  function visaoSobre() {
    return `
    ${cabecalhoPagina('Sobre o Instituto Caminhos', 'Uma organização criada para transformar vontade de ajudar em ação concreta.')}

    <section class="secao" aria-labelledby="titulo-historia">
      <div class="container">
        ${textoComImagem(`<h2 id="titulo-historia">Nossa história</h2>
            <p>O Instituto Caminhos surgiu com o propósito de transformar solidariedade em ações concretas dentro da comunidade. Muita gente quer ajudar, mas não sabe por onde começar. Muitas comunidades precisam de apoio, mas nem sempre encontram quem possa oferecê-lo.</p>
            <p>Nosso papel é aproximar esses dois lados: pessoas dispostas a ajudar e comunidades que precisam de apoio.</p>
            <p><small>O Instituto Caminhos é uma organização fictícia, criada para um projeto acadêmico de desenvolvimento front-end.</small></p>`, 'comunidade-reunida')}
      </div>
    </section>

    <section class="secao secao-destaque" aria-labelledby="titulo-nome">
      <div class="container">
        ${textoComImagem(`<h2 id="titulo-nome">Por que &ldquo;Caminhos&rdquo;?</h2>
            <p>O nome representa a ideia de que cada pessoa pode contribuir de uma maneira diferente. Quem doa, quem oferece tempo, quem divulga e quem organiza ajuda a construir, cada um a seu modo, um caminho para uma realidade melhor.</p>`, 'caminho-esperanca', { invertida: true })}
      </div>
    </section>

    <section class="secao" aria-labelledby="titulo-atuacao">
      <div class="container">
        <h2 id="titulo-atuacao">Como atuamos</h2>
        <div class="grade">
          <article class="cartao">
            <h3>Campanhas de arrecadação</h3>
            <p>Organizamos campanhas para reunir doações que apoiem as ações do Instituto.</p>
          </article>
          <article class="cartao">
            <h3>Voluntariado</h3>
            <p>Reunimos pessoas dispostas a dedicar tempo e habilidades a ações na comunidade.</p>
          </article>
          <article class="cartao">
            <h3>Distribuição de doações</h3>
            <p>Buscamos levar as doações arrecadadas a quem mais precisa, de forma organizada.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="secao secao-destaque" aria-labelledby="titulo-valores">
      <div class="container">
        <h2 id="titulo-valores">Missão, visão e valores</h2>
        <div class="grade">
          <article class="cartao">
            <h3>Missão</h3>
            <p>Transformar solidariedade em ações concretas, conectando voluntários, doadores e pessoas em situação de vulnerabilidade.</p>
          </article>
          <article class="cartao">
            <h3>Visão</h3>
            <p>Uma comunidade em que ajudar seja simples, acessível e aberto a todos.</p>
          </article>
          <article class="cartao">
            <h3>Valores</h3>
            <ul>
              <li>Acolhimento</li>
              <li>Solidariedade</li>
              <li>Confiança</li>
              <li>Participação comunitária</li>
              <li>Esperança</li>
              <li>Transparência</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="secao" aria-labelledby="titulo-transparencia">
      <div class="container">
        <h2 id="titulo-transparencia">Compromisso com a transparência</h2>
        <p>Acreditamos que confiança se constrói com clareza. Por isso, o Instituto se propõe a explicar de forma simples o que faz, como as ações funcionam e como cada pessoa pode participar.</p>
        <p><a href="#/como-ajudar">Veja como participar</a></p>
      </div>
    </section>`;
  }

  function visaoProjetos() {
    const cartoes = PROJETOS.map(function (projeto, indice) {
      return cartaoProjeto(projeto, { numero: indice + 1 });
    }).join('\n          ');

    const botoesDoFiltro = ['todos'].concat(Object.keys(CATEGORIAS)).map(function (categoria) {
      const rotulo = categoria === 'todos' ? 'Todos' : CATEGORIAS[categoria];
      return `<button type="button" class="filtro-btn" data-filtro="${categoria}" aria-pressed="false">${rotulo}</button>`;
    }).join('\n          ');

    return `
    ${cabecalhoPagina('Nossos projetos', 'Conheça as nossas iniciativas e descubra como o Instituto Caminhos atua para conectar pessoas e transformar a sociedade.')}

    <section class="secao" aria-labelledby="titulo-lista">
      <div class="container">
        <h2 id="titulo-lista">Ações do Instituto</h2>

        <div class="filtros" id="filtros-projetos" role="group" aria-label="Filtrar projetos por tema">
          ${botoesDoFiltro}
        </div>
        <p class="status-filtro" id="status-filtro" role="status"></p>

        <div class="grade" id="lista-projetos">
          ${cartoes}
        </div>
      </div>
    </section>

    ${chamadaFinal('Quer participar de algum projeto?', 'Diga como gostaria de ajudar e faça parte do Instituto.', 'Seja voluntário', '#/cadastro')}`;
  }

  function visaoComoAjudar() {
    return `
    ${cabecalhoPagina('Como ajudar', 'Existem várias formas de contribuir. Escolha a que combina com você.')}

    <section class="secao" id="voluntariado" aria-labelledby="titulo-voluntariado">
      <div class="container">
        ${textoComImagem(`<h2 id="titulo-voluntariado">Seja voluntário</h2>
            <p>Você pode oferecer parte do seu tempo e das suas habilidades em ações na comunidade. Não é preciso experiência prévia: o mais importante é a vontade de participar.</p>
            <p><a class="btn btn-primario" href="#/cadastro">Fazer meu cadastro</a></p>`, 'voluntariado-equipe')}
      </div>
    </section>

    <section class="secao secao-destaque" id="doacoes" aria-labelledby="titulo-doacoes">
      <div class="container">
        <h2 id="titulo-doacoes">Faça uma doação</h2>
        <p>As campanhas de arrecadação reúnem itens e recursos que abastecem as ações do Instituto. Cada campanha deve informar com clareza o que está sendo arrecadado e para quê.</p>
        ${alerta('aviso', 'Aviso', 'o Instituto Caminhos é um projeto acadêmico fictício. Não existem contas, chaves de pagamento ou pontos de coleta reais.')}
      </div>
    </section>

    <section class="secao" id="apoio" aria-labelledby="titulo-apoio">
      <div class="container">
        <h2 id="titulo-apoio">Apoie um projeto</h2>
        <p>Você também pode ajudar a manter e ampliar iniciativas que já existem, como as ações de educação e de conexão comunitária.</p>
        <p><a href="#/projetos">Conheça os projetos</a></p>
      </div>
    </section>

    <section class="secao secao-destaque" id="divulgacao" aria-labelledby="titulo-divulgacao">
      <div class="container">
        ${textoComImagem(`<h2 id="titulo-divulgacao">Ajude a divulgar</h2>
            <p>Compartilhar informação também é uma forma de ajudar. Falar sobre as ações do Instituto com amigos, familiares e colegas ajuda a ampliar o alcance das campanhas e a encontrar novos voluntários.</p>`, 'divulgacao', { invertida: true })}
      </div>
    </section>

    ${chamadaFinal('Ficou com alguma dúvida?', 'Fale com a gente pela página de contato.', 'Ir para contato', '#/contato')}`;
  }

  function visaoCadastro() {
    return `
    ${cabecalhoPagina('Faça parte do Instituto Caminhos', 'Se deseja contribuir com o nosso propósito, preencha os seus dados abaixo e indique como gostaria de participar.')}

    <section class="secao" aria-labelledby="titulo-formulario">
      <div class="container layout-cadastro">
        <div class="cadastro-formulario">
        <h2 id="titulo-formulario">Formulário de cadastro</h2>
        <p>Campos com <span aria-hidden="true">*</span><span class="sr-only">asterisco</span> são obrigatórios.</p>
        ${alerta('info', 'Informação', 'este é um projeto acadêmico e nada é enviado a um servidor. Para demonstração, o navegador guarda um rascunho do formulário e um resumo dos cadastros confirmados. CPF, CEP e telefone nunca são guardados.')}

        <form id="form-cadastro" novalidate>
          <fieldset>
            <legend>Seus dados</legend>

            <div class="campo">
              <label for="nome">Nome completo *</label>
              <input type="text" id="nome" name="nome" placeholder="Digite o seu nome" autocomplete="name" required>
            </div>

            <div class="campo">
              <label for="cpf">CPF *</label>
              <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" inputmode="numeric" pattern="[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}" title="Use o formato 000.000.000-00" aria-describedby="ajuda-cpf" required>
              <small id="ajuda-cpf">Formato: 000.000.000-00. O sistema confere os dígitos verificadores; nada é enviado a servidor.</small>
            </div>

            <div class="campo">
              <label for="cep">CEP *</label>
              <input type="text" id="cep" name="cep" placeholder="00000-000" inputmode="numeric" pattern="[0-9]{5}-[0-9]{3}" title="Use o formato 00000-000" autocomplete="postal-code" aria-describedby="ajuda-cep" required>
              <small id="ajuda-cep">Formato: 00000-000</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>Como falar com você</legend>

            <div class="campo">
              <label for="email">E-mail *</label>
              <input type="email" id="email" name="email" placeholder="Digite o seu e-mail" autocomplete="email" required>
            </div>

            <div class="campo">
              <label for="telefone">Telefone *</label>
              <input type="tel" id="telefone" name="telefone" placeholder="00 00000-0000" inputmode="numeric" pattern="[0-9]{2} [0-9]{4,5}-[0-9]{4}" title="Use DDD e número, como 00 00000-0000 ou 00 0000-0000" autocomplete="tel" aria-describedby="ajuda-telefone" required>
              <small id="ajuda-telefone">Formato: DDD e número, como 00 00000-0000 (celular) ou 00 0000-0000 (fixo)</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>Como você quer participar</legend>

            <div class="campo">
              <label for="ajuda">Como gostaria de ajudar? *</label>
              <select id="ajuda" name="ajuda" required>
                <option value="">Selecione uma opção</option>
                <option value="voluntariado">Voluntariado</option>
                <option value="apoio-projetos">Apoio a projetos</option>
                <option value="comunicacao">Comunicação</option>
                <option value="doacoes">Doações</option>
              </select>
            </div>

            <div class="campo">
              <label for="mensagem">Quer contar mais? (opcional)</label>
              <textarea id="mensagem" name="mensagem" rows="4" placeholder="Conte um pouco sobre você e sobre como gostaria de contribuir"></textarea>
            </div>
          </fieldset>

          <p id="feedback-formulario" role="status" aria-live="polite"></p>

          <button type="submit">Enviar cadastro</button>
        </form>
        </div>
        <figure class="cadastro-figura">
          ${Caminhos.imagens.html('acolhimento')}
        </figure>
      </div>
    </section>

    <section class="secao secao-destaque" aria-labelledby="titulo-salvos">
      <div class="container container-estreito">
        <h2 id="titulo-salvos">Cadastros salvos neste navegador</h2>
        <div id="painel-cadastros"></div>
      </div>
    </section>`;
  }

  function visaoContato() {
    return `
    ${cabecalhoPagina('Contato', 'Tem dúvidas, sugestões ou quer conhecer melhor o Instituto? Fale com a gente.')}

    <section class="secao" aria-labelledby="titulo-canais">
      <div class="container">
        <h2 id="titulo-canais">Canais de contato</h2>
        <ul class="lista-contato">
          <li><strong>E-mail:</strong> <a href="mailto:contato@institutocaminhos.org.br">contato@institutocaminhos.org.br</a></li>
          <li><strong>Telefone:</strong> <a href="tel:+5511999990000">(11) 99999-0000</a></li>
        </ul>
        ${alerta('info', 'Informação', 'estes contatos são fictícios, criados para fins acadêmicos. Nenhuma mensagem enviada será recebida.')}
      </div>
    </section>

    <section class="secao secao-destaque" aria-labelledby="titulo-duvidas">
      <div class="container">
        <h2 id="titulo-duvidas">Dúvidas frequentes</h2>
        <details>
          <summary>Preciso ter experiência para ser voluntário?</summary>
          <p>Não. O mais importante é a vontade de participar. Cada pessoa pode contribuir de uma maneira diferente.</p>
        </details>
        <details>
          <summary>Posso ajudar sem doar dinheiro?</summary>
          <p>Sim. Você pode oferecer seu tempo, apoiar projetos ou ajudar a divulgar as ações do Instituto.</p>
        </details>
        <details>
          <summary>Como faço para participar?</summary>
          <p>Preencha o formulário na página <a href="#/cadastro">Seja voluntário</a> e escolha como gostaria de ajudar.</p>
        </details>
      </div>
    </section>`;
  }

  function visaoNaoEncontrada() {
    return `
    ${cabecalhoPagina('Página não encontrada', 'O endereço que você abriu não existe no site do Instituto Caminhos.')}

    <section class="secao" aria-labelledby="titulo-voltar">
      <div class="container">
        <h2 id="titulo-voltar">Vamos voltar ao caminho?</h2>
        <p>Use o menu no topo da página ou volte para o início.</p>
        <p><a class="btn btn-primario" href="#/">Ir para o início</a></p>
      </div>
    </section>`;
  }

  /* ----------------------------------------------------------
     REGISTRO DAS VISÕES
     A chave é o nome da rota: "#/sobre" usa a visão "sobre".
     ---------------------------------------------------------- */
  const visoes = {
    inicio: {
      titulo: 'Instituto Caminhos | Solidariedade em ação',
      descricao: 'Instituto Caminhos: uma ONG fictícia que transforma solidariedade em ações concretas, conectando voluntários, doadores e comunidades.',
      html: visaoInicio
    },
    sobre: {
      titulo: 'Sobre | Instituto Caminhos',
      descricao: 'Conheça a história, a missão, a visão e os valores do Instituto Caminhos e entenda por que o nome é "Caminhos".',
      html: visaoSobre
    },
    projetos: {
      titulo: 'Projetos | Instituto Caminhos',
      descricao: 'Conheça as ações do Instituto Caminhos: educação, conexão comunitária, oportunidades em rede, campanhas de arrecadação e distribuição de doações.',
      html: visaoProjetos
    },
    'como-ajudar': {
      titulo: 'Como ajudar | Instituto Caminhos',
      descricao: 'Veja como participar: seja voluntário, faça uma doação, apoie um projeto ou ajude a divulgar as ações do Instituto Caminhos.',
      html: visaoComoAjudar
    },
    cadastro: {
      titulo: 'Seja voluntário | Instituto Caminhos',
      descricao: 'Preencha o cadastro de voluntário do Instituto Caminhos e diga como gostaria de ajudar. Projeto acadêmico: nada é enviado a um servidor.',
      html: visaoCadastro
    },
    contato: {
      titulo: 'Contato | Instituto Caminhos',
      descricao: 'Canais de contato (fictícios) e dúvidas frequentes sobre como participar do Instituto Caminhos.',
      html: visaoContato
    },
    naoEncontrada: {
      titulo: 'Página não encontrada | Instituto Caminhos',
      descricao: 'A página que você procurou não existe no site do Instituto Caminhos. Volte ao início e continue explorando.',
      html: visaoNaoEncontrada
    }
  };

  Caminhos.templates = {
    visoes: visoes,
    categorias: CATEGORIAS,
    painelCadastros: painelCadastros
  };
})(window.Caminhos = window.Caminhos || {});
