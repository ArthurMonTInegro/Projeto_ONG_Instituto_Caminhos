# Instituto Caminhos - Projeto Front-End

Projeto prático da disciplina de **Desenvolvimento Front-End Para Web** (Cruzeiro do Sul Virtual), desenvolvido durante o Bacharelado em Ciência da Computação.

> O Instituto Caminhos é uma **ONG fictícia**, criada apenas para fins acadêmicos. Nomes, e-mail, telefone e campanhas são demonstrativos. Não existem contas, pontos de coleta ou dados reais.

## Sobre o projeto

O **Instituto Caminhos** atua no apoio social e comunitário, conectando voluntários, doadores e pessoas em situação de vulnerabilidade. Por meio de campanhas de arrecadação, voluntariado e distribuição de doações, a organização busca transformar solidariedade em ações concretas dentro da comunidade.

O nome "Caminhos" representa a ideia central do projeto: cada pessoa pode contribuir de uma maneira diferente e, assim, ajudar a construir um caminho para uma realidade melhor.

## Objetivo

Construir um site institucional completo, acessível e responsivo, que demonstre de forma integrada os conteúdos da disciplina:

| Conteúdo | Como aparece no projeto |
|----------|-------------------------|
| Fundamentos da Web e estrutura de interfaces | HTML5 semântico, navegação clara, formulário estruturado |
| CSS3 | Identidade visual, variáveis, Flexbox, Grid, transições, 5 breakpoints |
| Programação para interfaces web | **SPA** com roteador e templates dinâmicos, validação, `localStorage`, código modularizado |
| Versionamento, deploy e infraestrutura | Git, GitHub e GitHub Pages |

## Como o site funciona (SPA)

O site é uma **Single Page Application (SPA)**: existe uma única página do site (`html/index.html`) e o JavaScript troca o conteúdo da tela sem recarregar a página. O `index.html` da raiz é só a **página de entrada**: o GitHub Pages abre esse arquivo quando alguém acessa o endereço do projeto, e ele encaminha para `html/index.html`, mantendo a rota (`index.html#/sobre` vira `html/index.html#/sobre`).

1. O menu usa endereços com `#`, como `#/sobre`.
2. Quando o endereço muda, o **roteador** (`js/router.js`) descobre qual página foi pedida.
3. Os **templates** (`js/templates.js`) montam o HTML da página, usando listas de dados e pequenos componentes reaproveitados (badge, alerta, cartão).
4. O roteador coloca o resultado dentro de `<div id="app">`, atualiza o título da aba e o item ativo do menu, e liga o código da página (formulário, filtro).

| Endereço | Página |
|----------|--------|
| `#/` | Início |
| `#/sobre` | Sobre o Instituto |
| `#/projetos` | Projetos, com filtro por tema |
| `#/como-ajudar` | Formas de ajudar (aceita `#/como-ajudar/doacoes`, `/apoio`, `/divulgacao`, `/voluntariado`) |
| `#/cadastro` | Seja voluntário (formulário) |
| `#/contato` | Contato e dúvidas frequentes |
| qualquer outro | Página não encontrada |

Os botões Voltar e Avançar do navegador funcionam normalmente. Como os endereços usam `#`, o site funciona no GitHub Pages sem nenhuma configuração extra.

## Estrutura do projeto

```
Projeto_ONG_Instituto_Caminhos/
├── index.html            (entrada: encaminha para html/index.html)
├── html/
│   └── index.html        (o site: cabeçalho, rodapé, área #app, modal e toast)
├── css/
│   └── style.css
├── js/
│   ├── armazenamento.js  (localStorage)
│   ├── ui.js             (alerta, toast, modal, skip-link)
│   ├── imagens.js        (registro das ilustrações: arquivo, alt, tamanho)
│   ├── navegacao.js      (menu hambúrguer e submenu acessível)
│   ├── templates.js      (dados e HTML das páginas)
│   ├── formulario.js     (máscaras, validação, cadastro)
│   ├── projetos.js       (filtro de projetos)
│   ├── router.js         (navegação SPA)
│   └── main.js           (inicialização)
├── img/
│   ├── fachada-instituto.png        (original, usado como alternativa)
│   ├── fachada-instituto-768.webp   (hero, versão leve)
│   ├── fachada-instituto-1536.webp  (hero, versão grande)
│   └── ilustracoes/                 (10 ilustrações SVG + favicon.svg)
├── docs/
│   └── prompts-imagens.md           (prompts para gerar versões fotográficas)
└── README.md
```

Cada arquivo JavaScript cuida de **uma área de funcionalidade**. Eles se comunicam por um único objeto global, `Caminhos` (por exemplo, `Caminhos.ui.mostrarToast(...)`), e são carregados em ordem pelo `html/index.html` (`armazenamento`, `ui`, `imagens`, `navegacao`, `templates`, `formulario`, `projetos`, `router`, `main`). Foram escritos sem `import`/`export`, para o site também funcionar abrindo o `index.html` direto no navegador.

### Caminhos relativos (pasta `html/`)

Caminhos relativos são resolvidos a partir do **arquivo que os usa**:

| Onde está a referência | Exemplo | Resolvido a partir de |
|---|---|---|
| `html/index.html` (`<link>`, `<script>`, favicon) | `../css/style.css`, `../js/main.js` | a pasta `html/` → sobe uma pasta com `../` |
| JavaScript que monta `<img>` (`js/imagens.js`, `js/templates.js`) | `../img/ilustracoes/educacao.svg` | a **página aberta** (`html/index.html`), não o arquivo `.js`. Por isso há uma constante `RAIZ = '../'` em `js/imagens.js` |
| `css/style.css` (`url(...)`) | não há nenhum `url()` hoje | se houver, conta a partir de `css/` |
| `index.html` da raiz | `html/index.html`, `img/ilustracoes/favicon.svg` | a raiz |

Nenhum caminho começa com `/`: assim o site funciona tanto na raiz de um domínio quanto em um subdiretório como `https://arthurmontinegro.github.io/Projeto_ONG_Instituto_Caminhos/`. Os links entre "páginas" usam rotas com `#` (`#/sobre`), que não dependem de pastas.

## Responsividade e breakpoints

O CSS segue a abordagem **desktop primeiro**: as regras base descrevem a tela de notebook, e blocos `@media` ajustam o layout para telas menores (`max-width`) e para telas grandes (`min-width`). Todos os breakpoints ficam juntos, **no final** do `css/style.css` (seção 14), de propósito: assim eles sobrescrevem as regras base de todos os componentes. Os valores estão em `rem` (1rem = 16px em media queries).

### Os 5 breakpoints

| Nome | Regra | Largura | Dispositivos | O que muda |
|------|-------|---------|--------------|------------|
| BP1 | `max-width: 30rem` | até 480px | celulares pequenos | Margens laterais menores (`--gutter: 1.5rem`), marca do site e botão "Menu" menores (cabem na mesma linha em 320px), cartões com menos preenchimento, botão "Enviar cadastro" em largura total, botões do modal empilhados, toast em largura total |
| BP2 | `max-width: 40rem` | até 640px | celulares grandes e em paisagem | Grades em **1 coluna**, rodapé em 1 coluna, texto-base de 1rem, menos espaço vertical nas seções, botões do hero em largura total, imagem do hero mais baixa, formulário com menos preenchimento |
| BP3 | `max-width: 60rem` | até 960px | tablets em retrato | **Menu hambúrguer** (e submenu em sanfona), hero em 1 coluna, rodapé em 2 colunas |
| BP4 | `max-width: 64rem` | até 1024px | tablets em paisagem | Grades em **2 colunas**, menos espaço entre texto e imagem do hero |
| BP5 | `min-width: 90rem` | a partir de 1440px | telas grandes | Conteúdo mais largo (`--largura: 72rem`) e margens maiores, textos e espaçamentos 12,5% maiores (`font-size: 112.5%` no `html`) |

Existe ainda uma regra que **não depende da largura**: em dispositivos de toque (`hover: none` e `pointer: coarse`), links do menu e botão do submenu têm no mínimo 44px de altura. Ela não conta como breakpoint.

### Como grids e cards se comportam

| Faixa de largura | `.grade` (cartões em 3) | `.grade-4` (formas de participar) | Hero | Rodapé | Menu |
|------------------|-------------------------|-----------------------------------|------|--------|------|
| até 480px | 1 coluna | 1 coluna | 1 coluna | 1 coluna | hambúrguer |
| 481 a 640px | 1 coluna | 1 coluna | 1 coluna | 1 coluna | hambúrguer |
| 641 a 960px | 2 colunas | 2 colunas | 1 coluna | 2 colunas | hambúrguer |
| 961 a 1024px | 2 colunas | 2 colunas | 2 colunas | 3 colunas | horizontal com dropdown |
| 1025 a 1439px | 3 colunas | 4 colunas | 2 colunas | 3 colunas | horizontal com dropdown |
| 1440px ou mais | 3 colunas | 4 colunas | 2 colunas | 3 colunas | horizontal com dropdown |

Detalhes: as grades usam `repeat(N, minmax(0, 1fr))`, que impede um texto longo de estourar a coluna. Em 2 colunas, um número ímpar de cartões deixa o último sozinho na linha (por exemplo, o 5º projeto). No rodapé em 2 colunas, o texto institucional ocupa a primeira linha inteira.

### Critérios usados para definir os pontos de quebra

- **BP3 (960px)** foi definido por **medição**: o menu horizontal precisa de cerca de 890px de conteúdo (marca + 6 itens, incluindo o botão do submenu), ou seja, cerca de 925px de tela. Abaixo disso o menu quebrava em duas linhas, então o ponto de quebra ficou em 960px, com folga.
- **BP2 (640px)**: abaixo disso, 2 colunas deixariam cada cartão com menos de 300px de largura, com linhas de texto muito curtas. 640px também é a largura típica de um celular em paisagem.
- **BP1 (480px)**: celulares de 320 a 480px são onde as margens, a marca e os botões precisam ficar mais compactos. Em 320px, antes do ajuste, a marca e o botão "Menu" não cabiam na mesma linha.
- **BP4 (1024px)**: acompanha a largura de tablets em paisagem. Com 4 cartões lado a lado, cada um fica com cerca de 230px; as duas grades mudam juntas para manter a página consistente.
- **BP5 (1440px)**: até aqui o conteúdo parava em 1088px, deixando grandes áreas vazias nas laterais. A partir de 1440px o container e a fonte crescem.
- Os tamanhos das grades e do menu foram conferidos em 22 larguras (de 320px a 2560px), incluindo os valores de cada borda (por exemplo, 960px e 961px).

## Navegação acessível

O menu principal (`html/index.html`, estilos na seção 5 e na seção 14 do CSS, comportamento em `js/navegacao.js`) funciona de duas formas:

| Tela | Comportamento |
|------|---------------|
| **Até 960px** (BP3) | Botão **Menu / Fechar** abre e fecha a lista de links, que aparece em coluna. O submenu "Como ajudar" vira uma sanfona dentro da lista. |
| **Acima de 960px** | Menu horizontal. O submenu "Como ajudar" aparece como **dropdown** abaixo do item. |

O único dropdown do site é **Como ajudar**, porque essa página tem 4 seções reais (Voluntariado, Doações, Apoio a projetos e Divulgação), que já eram usadas como links na página inicial. Os demais itens não têm subpáginas e por isso continuam como links simples.

O item "Como ajudar" tem **dois controles**: o link (abre a página) e um botão com uma seta (abre o submenu). Assim, quem usa teclado ou leitor de tela consegue tanto navegar até a página quanto abrir a lista.

**Teclado**

| Tecla | Ação |
|-------|------|
| `Tab` / `Shift+Tab` | Percorre links, botões e, com o submenu aberto, os itens dele |
| `Enter` ou `Espaço` no botão | Abre e fecha o submenu (ou o menu hambúrguer) |
| `Esc` | Fecha o submenu e devolve o foco ao botão. Se não houver submenu aberto, fecha o menu hambúrguer |
| `Tab` para fora do submenu | Fecha o submenu (somente no menu horizontal) |

**Mouse e toque**

- Clique ou toque no botão abre e fecha o submenu.
- No menu horizontal, passar o mouse sobre o item abre o submenu; clicar no botão **fixa** o submenu aberto. Uma área invisível sobre o espaço entre o item e a lista impede que ela feche enquanto o mouse atravessa o espaço. O toque nunca dispara o "hover".
- Clicar fora fecha o submenu e, na versão hambúrguer, fecha o menu.
- Escolher uma página fecha o menu e o submenu.
- Ao mudar o tamanho da tela de forma que o modo do menu muda, o menu volta ao estado inicial.

**Atributos ARIA**

- O botão do submenu tem `aria-expanded` (`true`/`false`), `aria-controls` (aponta para o `id` da lista) e `aria-label`.
- A lista do submenu usa o atributo `hidden`, então fica fora da árvore de acessibilidade enquanto está fechada.
- O botão "Menu" também usa `aria-expanded` e `aria-controls`.
- O item da página atual tem `aria-current="page"`.
- **`aria-haspopup` não é usado** de propósito: esse atributo anuncia um widget de "menu" (`role="menu"`), que exige navegação por setas. O padrão adotado aqui é o de **navegação por revelação** (disclosure): um botão que mostra e esconde uma lista de links comuns, que é o recomendado para menus de site.
- O foco visível vem da regra global `:focus-visible`.

O JavaScript não repete o breakpoint do CSS: para saber se está no modo hambúrguer, ele pergunta ao navegador se o botão "Menu" está visível. Assim há uma única fonte de verdade, o CSS.

## Formulário de cadastro: regras de validação

- **Nome**: pelo menos duas palavras, só letras, espaço, apóstrofo, ponto e hífen.
- **CPF**: formato `000.000.000-00` **e** dígitos verificadores corretos (sequências como 111.111.111-11 são recusadas). Para testar use `529.982.247-25`.
- **CEP**: formato `00000-000` (só o formato é conferido).
- **E-mail**: precisa de domínio com ponto (`nome@dominio.com`).
- **Telefone**: celular `00 00000-0000` ou fixo `00 0000-0000`; a máscara se ajusta ao digitar.

## Como testar manualmente

1. **Largura:** abra o site e redimensione a janela (ou use F12 e o ícone de dispositivos) em 320, 480, 640, 768, 960, 961, 1024, 1025, 1440 e 1920px. Confira a tabela de colunas acima e que não aparece rolagem lateral.
2. **Teclado:** sem usar o mouse, aperte `Tab` a partir do topo da página. Confira o contorno de foco, abra o submenu com `Enter` e `Espaço`, percorra os itens com `Tab` e feche com `Esc`.
3. **Menu hambúrguer:** em até 960px, abra o menu, abra "Como ajudar" pelo botão da seta, aperte `Esc` duas vezes (a primeira fecha o submenu, a segunda fecha o menu) e clique fora para fechar.
4. **Toque:** em um celular ou no emulador do navegador, toque no botão do submenu e em um item.
5. **Recursos preservados:** "Ir para o conteúdo principal" (primeiro `Tab`), formulário com modal de confirmação, alerta de sucesso e toast, filtro de projetos e animações reduzidas (ative "reduzir movimento" no sistema operacional).

6. **Caminhos:** abra o F12 > aba Network, recarregue e confira que nenhum arquivo aparece em vermelho (404). Teste também abrindo `index.html#/projetos` na raiz: deve cair em `html/index.html#/projetos`.

O repositório não inclui testes automatizados; a validação é manual e feita com as ferramentas do navegador.

## Imagens e ilustrações

| Tipo | Arquivos | Como é usado |
|------|----------|--------------|
| Foto da fachada (hero da página inicial) | `fachada-instituto.png` (original, 2,3 MB), `-768.webp` (59 KB), `-1536.webp` (150 KB) | `<picture>` com `srcset`: navegadores modernos baixam só o WebP; o PNG é a alternativa. `width`/`height` informados, sem `loading="lazy"` e com `fetchpriority="high"` |
| Ilustrações SVG | `img/ilustracoes/*.svg` (10 arquivos) | Criadas para este projeto (desenho vetorial, 2 a 5 KB cada). Registradas em `js/imagens.js` com alt, `width`/`height` e `loading="lazy"` |
| Favicon | `img/ilustracoes/favicon.svg` | Símbolo simples de caminho e sol, **não** é o logotipo oficial |

As ilustrações são **conceituais**: não representam ações, pessoas ou locais reais. Cada uma aparece em uma única página; a exceção são as miniaturas de três projetos, que se repetem de propósito nos cartões "Principais ações" da página inicial (mesmo projeto, mesma imagem).

| Arquivo | Página | Seção |
|---|---|---|
| `fachada-instituto-*.webp` / `.png` | Início | Hero |
| `educacao.svg`, `conexao-comunitaria.svg`, `oportunidades-rede.svg` | Projetos (e Início) | Cartões dos projetos |
| `campanha-arrecadacao.svg`, `distribuicao-doacoes.svg` | Projetos | Cartões dos projetos |
| `comunidade-reunida.svg` | Sobre | Nossa história |
| `caminho-esperanca.svg` | Sobre | Por que "Caminhos"? |
| `voluntariado-equipe.svg` | Como ajudar | Seja voluntário |
| `divulgacao.svg` | Como ajudar | Ajude a divulgar |
| `acolhimento.svg` | Seja voluntário | Ao lado do formulário | O texto essencial nunca fica dentro de imagens. A foto da fachada é a imagem original do projeto e foi mantida. Para versões fotográficas no futuro, veja `docs/prompts-imagens.md`.

## SEO e segurança

- `<title>` e `<meta name="description">` mudam a cada rota (o JavaScript troca os textos definidos em `templates.js`); há tags Open Graph para prévia de links.
- `<meta>` de Content-Security-Policy restringe o site a recursos do próprio domínio.
- Dados do `localStorage` são validados ao ler (formato, tamanho e quantidade) e escapados ao exibir.
- Limitação conhecida: por ser SPA com `#`, buscadores indexam apenas a página inicial, e as tags Open Graph do HTML inicial são as da página inicial.

## Armazenamento local (localStorage)

Todo acesso ao `localStorage` está em `js/armazenamento.js`. O que é guardado, **somente no navegador da própria pessoa**:

| Chave | Conteúdo | Quando |
|-------|----------|--------|
| `caminhos:rascunho` | nome, e-mail, forma de ajudar e mensagem | enquanto a pessoa preenche o formulário; apagado ao confirmar |
| `caminhos:cadastros` | primeiro nome, forma de ajudar e data | quando o cadastro é confirmado |
| `caminhos:filtro-projetos` | último filtro escolhido | ao clicar em um filtro |

**CPF, CEP e telefone nunca são guardados.** Ao ler, só itens no formato esperado são aceitos (máx. 50 cadastros). Nada é enviado a servidores. A página "Seja voluntário" tem um botão para apagar os cadastros salvos. Se o navegador bloquear o `localStorage`, o site continua funcionando normalmente.

## Componentes de feedback

Grupo de componentes reutilizáveis, estilizados na paleta do Instituto (seção 13 do `css/style.css`).

| Componente | Uso | Onde aparece |
|------------|-----|--------------|
| Badge | `<span class="badge badge-educacao">Educação</span>`. Variações: `badge-educacao`, `badge-comunidade`, `badge-participacao`, `badge-doacoes` | Cartões de projetos |
| Alerta | `<div class="alerta alerta-info" role="note">...</div>`. Variações: `alerta-info`, `alerta-sucesso`, `alerta-aviso`, `alerta-erro` | Avisos de projeto fictício; resultado do formulário |
| Toast | `Caminhos.ui.mostrarToast("texto", "sucesso")`. Tipos: `sucesso`, `erro`, `info` | Cadastro confirmado, rascunho recuperado |
| Modal | `Caminhos.ui.confirmar({ titulo, texto, confirmarTexto, cancelarTexto }).then(function (confirmou) { ... })`, baseado no elemento `<dialog>` | Confirmação do cadastro e limpeza dos cadastros salvos |

## Tecnologias utilizadas

- **HTML5**: elementos semânticos, formulário com `fieldset`, `legend`, `label`, `pattern` e `required`, e o elemento `<dialog>`
- **CSS3**: variáveis CSS, Flexbox, Grid, transições, `@keyframes`, estados `hover` e `focus-visible`, 5 breakpoints com media queries (`max-width` e `min-width`), `hover`/`pointer` para toque e `prefers-reduced-motion`
- **JavaScript puro** (sem bibliotecas ou frameworks): DOM, eventos, template literals, `hashchange`, `localStorage` e Promises
- **Git e GitHub**: controle de versão e hospedagem do código
- **GitHub Pages**: publicação do site

## Acessibilidade

- Link "Ir para o conteúdo principal" no topo da página
- Um único `<h1>` por "página" e hierarquia de títulos
- A cada troca de página: o título da aba muda, o foco vai para o conteúdo novo e um aviso é lido por leitores de tela (`aria-live`)
- Item ativo do menu marcado com `aria-current="page"`
- Textos alternativos nas imagens e campos ligados aos seus `label`
- Mensagens de erro associadas aos campos (`aria-describedby`, `aria-invalid`)
- Modal com foco preso, fechamento por Esc e retorno do foco
- Menu e submenu operáveis só pelo teclado (veja a seção Navegação acessível)
- Alvos de toque de pelo menos 44px em dispositivos de toque
- Foco de teclado visível e animações reduzidas para quem prefere
- Textos vindos do `localStorage` são escapados antes de aparecerem na tela

Limitação conhecida de toda SPA: sem JavaScript, o conteúdo não aparece. O site mostra uma mensagem pedindo para ativar o JavaScript.

## Como executar localmente

**Opção 1: abrir direto no navegador**

1. Baixe ou clone o repositório.
2. Dê dois cliques em `index.html` (raiz) ou em `html/index.html`.

**Opção 2: Visual Studio Code com Live Server (recomendado)**

1. Abra a pasta do projeto no VS Code (`Arquivo > Abrir Pasta`).
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `index.html` (raiz) e escolha **Open with Live Server**. O navegador é encaminhado para `html/index.html`.

Para clonar o repositório:

```bash
git clone https://github.com/ArthurMonTInegro/Projeto_ONG_Instituto_Caminhos.git
cd Projeto_ONG_Instituto_Caminhos
```

## Deploy (GitHub Pages)

O site usa apenas caminhos relativos e não precisa de etapa de build. Para publicar:

1. No GitHub, abra o repositório e vá em **Settings > Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`, e clique em **Save**.
4. Aguarde alguns minutos. O endereço esperado é:

**https://arthurmontinegro.github.io/Projeto_ONG_Instituto_Caminhos/**

> Atenção: o GitHub Pages diferencia maiúsculas de minúsculas nos nomes de arquivos. Os nomes neste projeto estão todos em minúsculas.

> **O `index.html` da raiz é obrigatório.** Com a publicação a partir de `/ (root)`, o GitHub Pages procura `index.html` na raiz do repositório. Sem ele, o endereço do projeto mostra erro 404. Esse arquivo apenas encaminha para `html/index.html`.

## Versionamento

O código é versionado com Git e hospedado em um repositório público no GitHub:
https://github.com/ArthurMonTInegro/Projeto_ONG_Instituto_Caminhos

A versão anterior do site, com uma página HTML para cada seção (`sobre.html`, `projetos.html`, `como-ajudar.html`, `cadastro.html`, `contato.html` e `js/script.js`), continua no histórico do Git (por exemplo, no commit `5c946fd`). A versão atual é a SPA em `html/index.html`, que já tem todas essas páginas como rotas; por isso esses arquivos antigos foram removidos. Para recuperar um deles: `git checkout 5c946fd -- sobre.html`.

## Créditos

- **Imagem da fachada** (`img/fachada-instituto.png` e versões `.webp`): material utilizado neste projeto acadêmico, ilustrando a ONG fictícia. Versões WebP geradas a partir do original.
- **Ilustrações** (`img/ilustracoes/`): desenhos vetoriais criados para este projeto, sem fonte externa.
- **Fontes**: fontes do próprio sistema do usuário (Georgia para títulos e `system-ui` para textos). Nenhuma fonte externa é carregada.
- **Textos**: escritos para este projeto. Não há dados reais de impacto, voluntários ou beneficiários.

## Autor

Projeto desenvolvido por [ArthurMonTInegro](https://github.com/ArthurMonTInegro) como atividade acadêmica.