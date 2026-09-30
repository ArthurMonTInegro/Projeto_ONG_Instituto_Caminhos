/* ==========================================================
   INSTITUTO CAMINHOS - SCRIPTS (Etapa 3: JavaScript)

   Este arquivo é carregado por todas as páginas (com "defer",
   ou seja, só roda depois que o HTML foi lido). Cada
   funcionalidade fica em uma função e só age se encontrar os
   elementos dela na página.

   Funcionalidades:
   1. Menu mobile (botão abrir/fechar)
   2. Máscaras nos campos CPF, CEP e telefone
   3. Validação do formulário com mensagens de feedback
   4. Filtro de projetos por tema (página Projetos)
   ========================================================== */

// Avisa o CSS que o JavaScript está funcionando. Sem essa classe,
// o menu continua visível no celular (o site não depende do JS).
document.documentElement.classList.add('js');


/* ==========================================================
   1. MENU MOBILE
   ========================================================== */
function iniciarMenuMobile() {
  const botao = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu-principal');

  if (!botao || !menu) {
    return; // esta página não tem menu mobile
  }

  function abrirMenu() {
    menu.classList.add('aberto');
    botao.setAttribute('aria-expanded', 'true');
    botao.textContent = 'Fechar';
  }

  function fecharMenu() {
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.textContent = 'Menu';
  }

  botao.addEventListener('click', function () {
    if (menu.classList.contains('aberto')) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  // A tecla Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
      fecharMenu();
      botao.focus();
    }
  });

  // Se a tela ficar grande (ex.: girar o celular), volta ao estado inicial
  const telaGrande = window.matchMedia('(min-width: 40.01rem)');
  telaGrande.addEventListener('change', function (evento) {
    if (evento.matches) {
      fecharMenu();
    }
  });
}


/* ==========================================================
   2. MÁSCARAS DOS CAMPOS
   A máscara formata o texto enquanto a pessoa digita, no mesmo
   formato que o "pattern" do HTML espera.
   Cada função recebe só os números (ex.: "12345678900").
   ========================================================== */
function formatarCPF(numeros) {
  let texto = numeros.slice(0, 3);
  if (numeros.length > 3) texto += '.' + numeros.slice(3, 6);
  if (numeros.length > 6) texto += '.' + numeros.slice(6, 9);
  if (numeros.length > 9) texto += '-' + numeros.slice(9, 11);
  return texto;
}

function formatarCEP(numeros) {
  let texto = numeros.slice(0, 5);
  if (numeros.length > 5) texto += '-' + numeros.slice(5, 8);
  return texto;
}

function formatarTelefone(numeros) {
  let texto = numeros.slice(0, 2);
  if (numeros.length > 2) texto += ' ' + numeros.slice(2, 7);
  if (numeros.length > 7) texto += '-' + numeros.slice(7, 11);
  return texto;
}

function aplicarMascara(idDoCampo, funcaoDeFormato) {
  const campo = document.getElementById(idDoCampo);
  if (!campo) {
    return;
  }
  campo.addEventListener('input', function () {
    const somenteNumeros = campo.value.replace(/\D/g, ''); // remove tudo que não é número
    campo.value = funcaoDeFormato(somenteNumeros);
  });
}

function iniciarMascaras() {
  aplicarMascara('cpf', formatarCPF);
  aplicarMascara('cep', formatarCEP);
  aplicarMascara('telefone', formatarTelefone);
}


/* ==========================================================
   3. VALIDAÇÃO DO FORMULÁRIO
   Usamos a validação que o próprio navegador já faz
   (required, pattern, type="email") e trocamos as mensagens
   padrão por mensagens nossas, escritas ao lado de cada campo.
   ========================================================== */

// Mensagens por campo (a chave é o atributo "name" do campo)
const MENSAGENS = {
  nome: {
    vazio: 'Digite o seu nome completo.',
    formato: 'Digite nome e sobrenome.'
  },
  cpf: {
    vazio: 'Digite o seu CPF.',
    formato: 'Use o formato 000.000.000-00.'
  },
  cep: {
    vazio: 'Digite o seu CEP.',
    formato: 'Use o formato 00000-000.'
  },
  email: {
    vazio: 'Digite o seu e-mail.',
    formato: 'Digite um e-mail válido, como nome@exemplo.com.'
  },
  telefone: {
    vazio: 'Digite o seu telefone.',
    formato: 'Use o formato 00 00000-0000, com DDD.'
  },
  ajuda: {
    vazio: 'Escolha como gostaria de ajudar.',
    formato: 'Escolha uma das opções da lista.'
  }
};

// Devolve o texto do erro do campo, ou '' se estiver tudo certo
function obterErro(campo) {
  const valor = campo.value.trim();
  const mensagens = MENSAGENS[campo.name];

  if (valor === '') {
    return mensagens.vazio;
  }
  if (campo.name === 'nome' && valor.split(/\s+/).length < 2) {
    return mensagens.formato;
  }
  if (!campo.validity.valid) { // pattern ou e-mail fora do formato
    return mensagens.formato;
  }
  return '';
}

function mostrarErro(campo, texto) {
  const area = campo.closest('.campo');
  let aviso = area.querySelector('.erro');

  if (!aviso) {
    aviso = document.createElement('small');
    aviso.className = 'erro';
    aviso.id = 'erro-' + campo.id;
    area.appendChild(aviso);
    // guarda a dica de formato original para poder restaurá-la depois
    campo.dataset.ajuda = campo.getAttribute('aria-describedby') || '';
  }

  aviso.textContent = texto;
  area.classList.add('campo-invalido');
  campo.setAttribute('aria-invalid', 'true');
  campo.setAttribute('aria-describedby', (campo.dataset.ajuda + ' ' + aviso.id).trim());
}

function limparErro(campo) {
  const area = campo.closest('.campo');
  const aviso = area.querySelector('.erro');

  if (aviso) {
    aviso.remove();
    area.classList.remove('campo-invalido');
    campo.removeAttribute('aria-invalid');
    if (campo.dataset.ajuda) {
      campo.setAttribute('aria-describedby', campo.dataset.ajuda);
    } else {
      campo.removeAttribute('aria-describedby');
    }
  }
}

function mostrarFeedback(elemento, tipo, texto) {
  elemento.className = 'feedback feedback-' + tipo; // tipo: "sucesso" ou "erro"
  elemento.textContent = texto;
}

function iniciarFormulario() {
  const formulario = document.getElementById('form-cadastro');
  const feedback = document.getElementById('feedback-formulario');

  if (!formulario || !feedback) {
    return; // esta página não tem o formulário
  }

  // Desliga os balões padrão do navegador: quem mostra as mensagens somos nós
  formulario.noValidate = true;

  const campos = formulario.querySelectorAll('[required]');

  // Enquanto a pessoa corrige um campo com erro, revalida na hora
  campos.forEach(function (campo) {
    campo.addEventListener('input', function () {
      if (campo.getAttribute('aria-invalid') === 'true') {
        const erro = obterErro(campo);
        if (erro) {
          mostrarErro(campo, erro);
        } else {
          limparErro(campo);
        }
      }
    });
  });

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // impede a página de recarregar
    feedback.textContent = '';

    let totalDeErros = 0;
    let primeiroCampoComErro = null;

    campos.forEach(function (campo) {
      const erro = obterErro(campo);
      if (erro) {
        mostrarErro(campo, erro);
        totalDeErros++;
        if (!primeiroCampoComErro) {
          primeiroCampoComErro = campo;
        }
      } else {
        limparErro(campo);
      }
    });

    if (totalDeErros > 0) {
      const palavra = totalDeErros === 1 ? 'campo precisa' : 'campos precisam';
      mostrarFeedback(feedback, 'erro', totalDeErros + ' ' + palavra + ' de correção. Veja as mensagens abaixo de cada campo.');
      primeiroCampoComErro.focus();
      return;
    }

    const primeiroNome = document.getElementById('nome').value.trim().split(/\s+/)[0];
    mostrarFeedback(
      feedback,
      'sucesso',
      'Obrigado, ' + primeiroNome + '! Seu cadastro foi preenchido corretamente. ' +
      'Como este é um projeto acadêmico, nenhum dado foi enviado ou guardado.'
    );
    formulario.reset();
  });
}


/* ==========================================================
   4. FILTRO DE PROJETOS
   Os botões de filtro são criados aqui pelo JavaScript. Assim,
   se o JS não carregar, a página não fica com botões sem função.
   ========================================================== */
function iniciarFiltroProjetos() {
  const areaDosBotoes = document.getElementById('filtros-projetos');
  const lista = document.getElementById('lista-projetos');
  const status = document.getElementById('status-filtro');

  if (!areaDosBotoes || !lista || !status) {
    return; // esta página não tem filtro
  }

  const projetos = lista.querySelectorAll('.projeto');

  // [valor do data-categoria, texto do botão]
  const filtros = [
    ['todos', 'Todos'],
    ['educacao', 'Educação'],
    ['comunidade', 'Comunidade'],
    ['participacao', 'Participação'],
    ['doacoes', 'Doações']
  ];

  function aplicarFiltro(categoria) {
    let visiveis = 0;

    projetos.forEach(function (projeto) {
      const deveAparecer = categoria === 'todos' || projeto.dataset.categoria === categoria;
      projeto.hidden = !deveAparecer; // "hidden" esconde o elemento
      if (deveAparecer) {
        visiveis++;
      }
    });

    areaDosBotoes.querySelectorAll('button').forEach(function (botao) {
      botao.setAttribute('aria-pressed', botao.dataset.filtro === categoria ? 'true' : 'false');
    });

    status.textContent = 'Mostrando ' + visiveis + ' de ' + projetos.length + ' projetos.';
  }

  filtros.forEach(function (filtro) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'filtro-btn';
    botao.dataset.filtro = filtro[0];
    botao.textContent = filtro[1];
    botao.addEventListener('click', function () {
      aplicarFiltro(filtro[0]);
    });
    areaDosBotoes.appendChild(botao);
  });

  aplicarFiltro('todos'); // estado inicial
}


/* ==========================================================
   INICIALIZAÇÃO
   ========================================================== */
iniciarMenuMobile();
iniciarMascaras();
iniciarFormulario();
iniciarFiltroProjetos();
