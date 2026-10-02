/* ==========================================================
   FORMULÁRIO DE CADASTRO

   Cuida de tudo que acontece na página "Seja voluntário":
   1. Máscaras de CPF, CEP e telefone
   2. Validação com mensagens ao lado de cada campo
   3. Confirmação em modal, alerta de sucesso e toast
   4. Rascunho e lista de cadastros no localStorage

   A função iniciar() é chamada pelo roteador toda vez que a
   página de cadastro aparece na tela.
   ========================================================== */
(function (Caminhos) {
  'use strict';

  /* ----------------------------------------------------------
     1. MÁSCARAS
     Cada função recebe só os números (ex.: "12345678900").
     ---------------------------------------------------------- */
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

  // Aceita celular (11 dígitos: 00 00000-0000) e fixo (10 dígitos: 00 0000-0000).
  // Com até 10 dígitos o hífen vem depois do 6º; no 11º dígito o texto se
  // reorganiza para o formato de celular.
  function formatarTelefone(numeros) {
    const digitos = numeros.slice(0, 11);
    let texto = digitos.slice(0, 2);
    if (digitos.length > 2) {
      const tamanhoDoPrefixo = digitos.length > 10 ? 5 : 4;
      texto += ' ' + digitos.slice(2, 2 + tamanhoDoPrefixo);
      if (digitos.length > 2 + tamanhoDoPrefixo) {
        texto += '-' + digitos.slice(2 + tamanhoDoPrefixo);
      }
    }
    return texto;
  }

  function aplicarMascara(formulario, idDoCampo, funcaoDeFormato) {
    const campo = formulario.querySelector('#' + idDoCampo);
    if (!campo) {
      return;
    }
    campo.addEventListener('input', function () {
      const somenteNumeros = campo.value.replace(/\D/g, '');
      campo.value = funcaoDeFormato(somenteNumeros);
    });
  }

  /* ----------------------------------------------------------
     2. VALIDAÇÃO
     ---------------------------------------------------------- */
  const MENSAGENS = {
    nome: {
      vazio: 'Digite o seu nome completo.',
      formato: 'Digite nome e sobrenome, só com letras.'
    },
    cpf: {
      vazio: 'Digite o seu CPF.',
      formato: 'Use o formato 000.000.000-00.',
      invalido: 'Este CPF não é válido. Confira os números digitados.'
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
      formato: 'Use DDD e número: 00 00000-0000 (celular) ou 00 0000-0000 (fixo).'
    },
    ajuda: {
      vazio: 'Escolha como gostaria de ajudar.',
      formato: 'Escolha uma das opções da lista.'
    }
  };

  // Confere os dois dígitos verificadores do CPF (algoritmo oficial).
  // Recebe só números. Recusa também sequências como 111.111.111-11,
  // que passam na conta mas não existem.
  function cpfEhValido(numeros) {
    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
      return false;
    }

    function calcularDigito(quantidade) {
      let soma = 0;
      for (let i = 0; i < quantidade; i++) {
        soma += Number(numeros[i]) * (quantidade + 1 - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    }

    return calcularDigito(9) === Number(numeros[9]) && calcularDigito(10) === Number(numeros[10]);
  }

  // O type="email" do navegador aceita "a@b" (sem ponto). Aqui exigimos
  // um domínio com ponto e sem espaços: nome@dominio.com
  function emailEhValido(texto) {
    return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(texto);
  }

  // Devolve o texto do erro do campo, ou '' se estiver tudo certo
  function obterErro(campo) {
    const valor = campo.value.trim();
    const mensagens = MENSAGENS[campo.name];

    if (valor === '') {
      return mensagens.vazio;
    }
    if (campo.name === 'nome') {
      const palavras = valor.split(/\s+/);
      // pelo menos duas palavras e só letras, espaços, apóstrofo, ponto e hífen
      if (palavras.length < 2 || !/^[\p{L}][\p{L}' .-]*$/u.test(valor)) {
        return mensagens.formato;
      }
    }
    if (!campo.validity.valid) {
      return mensagens.formato;
    }
    if (campo.name === 'email' && !emailEhValido(valor)) {
      return mensagens.formato;
    }
    if (campo.name === 'cpf' && !cpfEhValido(valor.replace(/\D/g, ''))) {
      return mensagens.invalido;
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
      campo.dataset.ajuda = campo.getAttribute('aria-describedby') || '';
    }

    aviso.textContent = texto;
    area.classList.remove('campo-valido');
    area.classList.add('campo-invalido');
    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', (campo.dataset.ajuda + ' ' + aviso.id).trim());
  }

  // Campo conferido e correto: borda verde e um "✓" no rótulo (CSS).
  // Só aparece depois que a pessoa tenta enviar, para não "aprovar"
  // campos que ela ainda nem preencheu.
  function marcarValido(campo) {
    campo.closest('.campo').classList.add('campo-valido');
  }

  // Confere um campo e mostra o resultado (erro ou válido)
  function validarCampo(campo) {
    const erro = obterErro(campo);
    if (erro) {
      mostrarErro(campo, erro);
    } else {
      limparErro(campo);
      marcarValido(campo);
    }
    campo.dataset.validado = 'sim';
    return erro;
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

  /* ----------------------------------------------------------
     4. RASCUNHO (localStorage)
     Só estes campos são guardados. CPF, CEP e telefone, não.
     ---------------------------------------------------------- */
  const CAMPOS_DO_RASCUNHO = ['nome', 'email', 'ajuda', 'mensagem'];

  function salvarRascunho(formulario) {
    const rascunho = {};
    let temConteudo = false;

    CAMPOS_DO_RASCUNHO.forEach(function (nome) {
      const valor = formulario.elements[nome].value;
      rascunho[nome] = valor;
      if (valor.trim() !== '') {
        temConteudo = true;
      }
    });

    if (temConteudo) {
      Caminhos.armazenamento.salvarRascunho(rascunho);
    } else {
      Caminhos.armazenamento.limparRascunho();
    }
  }

  // Devolve true se havia um rascunho para recuperar
  function restaurarRascunho(formulario) {
    const rascunho = Caminhos.armazenamento.lerRascunho();
    if (!rascunho) {
      return false;
    }

    let recuperou = false;
    CAMPOS_DO_RASCUNHO.forEach(function (nome) {
      const campo = formulario.elements[nome];
      if (typeof rascunho[nome] === 'string' && rascunho[nome] !== '') {
        campo.value = rascunho[nome];
        recuperou = recuperou || campo.value !== '';
      }
    });
    return recuperou;
  }

  /* ----------------------------------------------------------
     INICIALIZAÇÃO DA PÁGINA
     ---------------------------------------------------------- */
  function iniciar(container) {
    const formulario = container.querySelector('#form-cadastro');
    const feedback = container.querySelector('#feedback-formulario');
    const painel = container.querySelector('#painel-cadastros');

    if (!formulario || !feedback || !painel) {
      return;
    }

    const campos = formulario.querySelectorAll('[required]');

    aplicarMascara(formulario, 'cpf', formatarCPF);
    aplicarMascara(formulario, 'cep', formatarCEP);
    aplicarMascara(formulario, 'telefone', formatarTelefone);

    // Lista de cadastros salvos (e o botão de limpar)
    function atualizarPainel() {
      painel.innerHTML = Caminhos.templates.painelCadastros(Caminhos.armazenamento.listarCadastros());

      const botaoLimpar = painel.querySelector('#limpar-cadastros');
      if (botaoLimpar) {
        botaoLimpar.addEventListener('click', function () {
          Caminhos.ui.confirmar({
            titulo: 'Limpar cadastros salvos',
            texto: 'Isso apaga os cadastros guardados neste navegador. Deseja continuar?',
            confirmarTexto: 'Apagar',
            cancelarTexto: 'Manter'
          }).then(function (confirmou) {
            if (confirmou) {
              Caminhos.armazenamento.limparCadastros();
              atualizarPainel();
              Caminhos.ui.mostrarToast('Cadastros salvos foram apagados.', 'info');
            }
          });
        });
      }
    }

    atualizarPainel();

    // Recupera o que a pessoa já tinha digitado
    if (restaurarRascunho(formulario)) {
      Caminhos.ui.mostrarToast('Recuperamos o rascunho do seu cadastro.', 'info');
    }

    // Guarda o rascunho enquanto a pessoa digita
    formulario.addEventListener('input', function () {
      salvarRascunho(formulario);
    });
    formulario.addEventListener('change', function () {
      salvarRascunho(formulario);
    });

    // Depois da primeira tentativa de envio, cada campo é conferido de
    // novo enquanto a pessoa digita: o erro some (e o "✓" aparece) assim
    // que o valor fica correto.
    campos.forEach(function (campo) {
      campo.addEventListener('input', function () {
        if (campo.dataset.validado === 'sim') {
          validarCampo(campo);
        }
      });
    });

    const botaoEnviar = formulario.querySelector('button[type="submit"]');

    // Volta os campos ao estado inicial (sem verde nem vermelho)
    function limparMarcas() {
      campos.forEach(function (campo) {
        limparErro(campo);
        campo.closest('.campo').classList.remove('campo-valido');
        delete campo.dataset.validado;
      });
    }

    // Etapa final: roda depois que a pessoa confirma no modal
    function concluirCadastro(primeiroNome, formaDeAjudar) {
      const salvou = Caminhos.armazenamento.adicionarCadastro({
        primeiroNome: primeiroNome,
        ajuda: formaDeAjudar,
        data: new Date().toISOString()
      });

      Caminhos.armazenamento.limparRascunho();
      formulario.reset();
      limparMarcas();

      let texto = 'Obrigado, ' + primeiroNome + '! Seu cadastro foi preenchido corretamente. ' +
        'Como este é um projeto acadêmico, nada foi enviado a um servidor.';
      if (!salvou) {
        texto += ' Seu navegador não permitiu guardar o resumo do cadastro.';
      }

      Caminhos.ui.mostrarFeedback(feedback, 'sucesso', texto);
      Caminhos.ui.mostrarToast('Cadastro confirmado, ' + primeiroNome + '!', 'sucesso');
      atualizarPainel();
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault(); // impede a página de recarregar
      Caminhos.ui.limparFeedback(feedback);

      let totalDeErros = 0;
      let primeiroCampoComErro = null;

      campos.forEach(function (campo) {
        if (validarCampo(campo)) {
          totalDeErros++;
          if (!primeiroCampoComErro) {
            primeiroCampoComErro = campo;
          }
        }
      });

      if (totalDeErros > 0) {
        const palavra = totalDeErros === 1 ? 'campo precisa' : 'campos precisam';
        Caminhos.ui.mostrarFeedback(feedback, 'erro', totalDeErros + ' ' + palavra + ' de correção. Veja as mensagens abaixo de cada campo.');
        primeiroCampoComErro.focus();
        return;
      }

      const primeiroNome = formulario.elements.nome.value.trim().split(/\s+/)[0];
      const seletor = formulario.elements.ajuda;
      const formaDeAjudar = seletor.options[seletor.selectedIndex].textContent;

      // Enquanto a confirmação está aberta, o botão fica desabilitado:
      // impede um segundo envio do mesmo cadastro.
      botaoEnviar.disabled = true;

      Caminhos.ui.confirmar({
        titulo: 'Confirmar cadastro',
        texto: 'Você está prestes a confirmar o cadastro de ' + primeiroNome +
          ', com interesse em: ' + formaDeAjudar.toLowerCase() + '. Deseja confirmar?',
        confirmarTexto: 'Confirmar',
        cancelarTexto: 'Revisar dados'
      }).then(function (confirmou) {
        // Ao fechar, o navegador tenta devolver o foco ao botão, mas ele
        // ainda estava desabilitado (e botão desabilitado não recebe foco).
        // Por isso reabilitamos e devolvemos o foco aqui, para quem usa
        // teclado continuar do mesmo lugar.
        botaoEnviar.disabled = false;
        botaoEnviar.focus({ preventScroll: true });
        if (confirmou) {
          concluirCadastro(primeiroNome, formaDeAjudar);
        }
      });
    });
  }

  Caminhos.formulario = {
    iniciar: iniciar,
    // expostas para poderem ser testadas isoladamente
    cpfEhValido: cpfEhValido,
    emailEhValido: emailEhValido,
    formatarTelefone: formatarTelefone
  };
})(window.Caminhos = window.Caminhos || {});
