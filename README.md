# Instituto Caminhos - Projeto Front-End

Projeto prático da disciplina de **Desenvolvimento Front-End Para Web** (Cruzeiro do Sul Virtual), desenvolvido durante o Bacharelado em Ciência da Computação.

> O Instituto Caminhos é uma **ONG fictícia**, criada apenas para fins acadêmicos. Nomes, e-mail, telefone e campanhas são demonstrativos. Não existem contas, pontos de coleta ou dados reais.

## Sobre o projeto

O **Instituto Caminhos** atua no apoio social e comunitário, conectando voluntários, doadores e pessoas em situação de vulnerabilidade. Por meio de campanhas de arrecadação, voluntariado e distribuição de doações, a organização busca transformar solidariedade em ações concretas dentro da comunidade.

O nome "Caminhos" representa a ideia central do projeto: cada pessoa pode contribuir de uma maneira diferente e, assim, ajudar a construir um caminho para uma realidade melhor.

## Objetivo

Construir um site institucional completo, acessível e responsivo, que demonstre de forma integrada os quatro conteúdos da disciplina:

| Etapa | Conteúdo | Como aparece no projeto |
|-------|----------|-------------------------|
| 1 | Fundamentos da Web e estrutura de interfaces | HTML5 semântico, 6 páginas, navegação, formulário estruturado |
| 2 | CSS3 | Identidade visual, variáveis, Flexbox, Grid, transições, media queries |
| 3 | Programação para interfaces web | Menu mobile, máscaras, validação com feedback, filtro de projetos |
| 4 | Versionamento, deploy e infraestrutura | Git, GitHub e GitHub Pages |

## Páginas

- `index.html`: página inicial (hero, resumo da ONG, principais ações, formas de participar, missão, visão e valores)
- `sobre.html`: história, significado do nome, como atuamos, missão, visão e valores
- `projetos.html`: projetos da ONG, com filtro por tema
- `como-ajudar.html`: voluntariado, doações, apoio a projetos e divulgação
- `cadastro.html`: formulário "Seja voluntário", com máscaras e validação (CPF, CEP, e-mail, telefone)
- `contato.html`: canais de contato e dúvidas frequentes

## Tecnologias utilizadas

- **HTML5**: elementos semânticos (`header`, `nav`, `main`, `section`, `article`, `footer`), formulários com `fieldset`, `legend`, `label`, `pattern` e `required`
- **CSS3**: variáveis CSS, Flexbox, Grid, transições, estados `hover` e `focus-visible`, media queries e `prefers-reduced-motion`
- **JavaScript (puro)**: manipulação do DOM, eventos e validação de formulário, sem bibliotecas ou frameworks
- **Git e GitHub**: controle de versão e hospedagem do código
- **GitHub Pages**: publicação do site

## Estrutura do projeto

```
Projeto_ONG_Instituto_Caminhos/
├── index.html
├── sobre.html
├── projetos.html
├── como-ajudar.html
├── cadastro.html
├── contato.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── img/
│   └── fachada-instituto.png
└── README.md
```

## Componentes de feedback

Grupo de componentes reutilizáveis, estilizados na paleta do Instituto (seção 13 do `css/style.css`). Servem de base para futuras páginas ou para a integração com um back-end.

| Componente | Classes e uso | Onde aparece |
|------------|---------------|--------------|
| Badge | `<span class="badge badge-educacao">Educação</span>`. Variações: `badge-educacao`, `badge-comunidade`, `badge-participacao`, `badge-doacoes` | Cartões de `index.html` e `projetos.html` |
| Alerta | `<div class="alerta alerta-info" role="note">...</div>`. Variações: `alerta-info`, `alerta-sucesso`, `alerta-aviso`, `alerta-erro` | Avisos em `cadastro.html`, `como-ajudar.html` e `contato.html`; resultado do formulário |
| Toast | No JavaScript: `mostrarToast("texto", "sucesso")` ou `mostrarToast("texto", "erro")`. Precisa de `<div class="toast-area" id="area-toast" aria-live="polite"></div>` na página | Após confirmar o cadastro |
| Modal | Elemento `<dialog>` aberto com `showModal()`. Fecha com Esc, com o botão "Revisar dados" ou clicando no fundo | Confirmação do cadastro em `cadastro.html` |

Boas práticas aplicadas: cada alerta tem um rótulo em texto (Informação, Aviso, Sucesso, Atenção), então o significado não depende só da cor; o toast é anunciado por leitores de tela (`aria-live`) e tem botão para fechar; o modal prende o foco dentro dele e devolve o foco ao botão que o abriu.

## Acessibilidade

- Link "Ir para o conteúdo principal" no topo de todas as páginas
- Um único `<h1>` por página e hierarquia de títulos
- Textos alternativos nas imagens
- Campos de formulário ligados aos seus `label`
- Mensagens de erro associadas aos campos (`aria-describedby`, `aria-invalid`)
- Foco de teclado visível e navegação completa por teclado
- O site continua utilizável se o JavaScript não carregar

## Como executar localmente

**Opção 1: abrir direto no navegador**

1. Baixe ou clone o repositório.
2. Dê dois cliques em `index.html`.

**Opção 2: Visual Studio Code com Live Server (recomendado)**

1. Abra a pasta do projeto no VS Code (`Arquivo > Abrir Pasta`).
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

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

## Versionamento

O código é versionado com Git e hospedado em um repositório público no GitHub:
https://github.com/ArthurMonTInegro/Projeto_ONG_Instituto_Caminhos

O desenvolvimento seguiu as quatro etapas da disciplina: estrutura HTML, folha de estilos (CSS), interatividade (JavaScript) e documentação com deploy (README).

## Créditos

- **Imagem da fachada** (`img/fachada-instituto.png`): material utilizado neste projeto acadêmico, ilustrando a ONG fictícia.
- **Fontes**: fontes do próprio sistema do usuário (Georgia para títulos e `system-ui` para textos). Nenhuma fonte externa é carregada.
- **Textos**: escritos para este projeto. Não há dados reais de impacto, voluntários ou beneficiários.

## Autor

Projeto desenvolvido por [ArthurMonTInegro](https://github.com/ArthurMonTInegro) como atividade acadêmica.