# 🛡️ EducaSegura — Proteção contra Golpes Digitais

> *"O elo mais fraco da cadeia de segurança é o elemento humano." — Kevin Mitnick*

Site educativo desenvolvido como projeto da disciplina de Desenvolvimento Web, com foco em conscientização sobre golpes digitais, acessibilidade avançada e interatividade no DOM.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Interatividade no DOM](#interatividade-no-dom)
- [Acessibilidade](#acessibilidade)
- [Como Executar](#como-executar)
- [Autoras](#autoras)

---

## Sobre o Projeto

O **EducaSegura** é uma landing page educativa que ensina usuários a identificar e se proteger de golpes digitais comuns, como Phishing, Engenharia Social e Golpes de WhatsApp. O projeto foi construído com foco em **acessibilidade (WCAG)**, **responsividade** e **interatividade DOM**.

---

## Funcionalidades

- **Hero Section** com chamada para ação
- **Seção explicativa** sobre o que são golpes digitais
- **Cards interativos** com dicas ao passar o mouse (hover)
- **Quiz interativo** com 5 perguntas, barra de progresso e confetti ao completar
- **Pesquisa de notícias** com filtro em tempo real por título
- **Modo Leitura Focada** que oculta elementos não essenciais
- **Painel de acessibilidade flutuante** com múltiplas opções
- **Design responsivo** para mobile e desktop

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica da página |
| CSS3 | Estilos, animações e variáveis CSS |
| JavaScript (ES6+) | Interatividade e lógica |
| [Tailwind CSS](https://tailwindcss.com/) | Classes utilitárias de estilo |
| [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter) | Tipografia |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | Efeito de confetti no quiz |

---

## Estrutura de Arquivos

```
educasegura/
├── index.html          # Estrutura principal da página
├── styles.css          # Estilos globais, temas e acessibilidade
├── script.js           # Quiz, menu mobile, scroll suave e acessibilidade avançada
├── interatividade.js   # Módulo de interatividade DOM (Aula 13)
└── imgs/
    └── hero-image.jpg  # Imagem do hero (opcional)
```

---

## Interatividade no DOM

Implementada no arquivo `interatividade.js`, com três funcionalidades principais:

### ① Evento de Mouse — `mouseenter` / `mouseleave`
**Seção:** Principais Ataques (`#tipos`)

Ao passar o mouse sobre um card de fraude, o JavaScript:
1. Aplica a cor de fundo definida no atributo `data-cor` do elemento
2. Injeta dinamicamente um `<p class="card-dica">` com o texto do atributo `data-extra`
3. Ao sair, remove a cor e deleta o parágrafo do DOM

> Utiliza `mouseenter`/`mouseleave` em vez de `mouseover`/`mouseout` para evitar propagação aos elementos filhos (sem efeito de pisca-pisca).

### ② Evento de Teclado — `keyup`
**Seção:** Notícias (`#noticias`)

A cada tecla solta no campo de pesquisa, o JavaScript:
1. Lê e normaliza o valor digitado (case-insensitive)
2. Percorre todos os `.noticia-card` e compara o texto do `<h5>` com o termo buscado
3. Oculta (`display: none`) os cards sem correspondência e exibe os demais
4. Mostra a mensagem `#sem-resultado` caso nenhum card passe no filtro

### ③ Manipulação de Estilo Dinâmica — `classList.toggle`
**Botão:** Modo Leitura Focada (`#btn-leitura-focada`)

Ao clicar no botão do footer, o JavaScript alterna a classe `leitura-focada` no `<body>`, o que:
1. Oculta a navbar, hero e seções de conteúdo não essenciais (via CSS)
2. Mantém visível apenas a seção de Notícias para leitura sem distrações
3. Atualiza `aria-pressed` e o texto do botão para refletir o estado ativo/inativo

---

## Acessibilidade

O projeto implementa um conjunto robusto de funcionalidades de acessibilidade em conformidade com as diretrizes **WCAG 2.1**:

| Recurso | Descrição |
|---|---|
| **Skip Link** | Link "Pular para o conteúdo principal" visível ao focar via teclado |
| **ARIA Live Region** | Anuncia mudanças de estado para leitores de tela |
| **Controle de fonte** | Aumentar / diminuir / restaurar o tamanho do texto (12px–24px) |
| **Modo Escuro** | Alterna entre tema claro e escuro |
| **Alto Contraste** | 3 níveis: preto/branco, amarelo/preto e ciano/preto |
| **Filtros de Daltonismo** | Deuteranopia, Protanopia e Tritanopia |
| **Espaçamento de texto** | Aumenta letter-spacing, word-spacing e line-height |
| **Reduzir Animações** | Desativa transições e animações |
| **Audiodescrição (TTS)** | Lê em voz alta o conteúdo ao focar ou passar o mouse |
| **Atalhos de teclado** | Navegação e controles via `Alt + tecla` |
| **Painel flutuante** | Botão ♿ fixo no canto inferior direito da tela |

### Atalhos de Teclado

| Atalho | Ação |
|---|---|
| `Alt + 0` | Voltar ao topo |
| `Alt + 1` | Ir ao conteúdo principal |
| `Alt + 2` | Ir para Tipos de Fraudes |
| `Alt + 3` | Ir para o Quiz |
| `Alt + 4` | Ir para Notícias |
| `Alt + T` | Alternar tema escuro/claro |
| `Alt + C` | Alternar alto contraste |
| `Alt + A` | Alternar audiodescrição |
| `Alt + M` | Alternar redução de animações |
| `Alt + +` | Aumentar fonte |
| `Alt + -` | Diminuir fonte |
| `Alt + H` | Exibir lista de atalhos |
| `Alt + P` | Abrir/fechar painel de acessibilidade |

---

## Como Executar

Não há dependências de build. Basta abrir o arquivo diretamente no navegador:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/educasegura.git

# Acesse a pasta
cd educasegura

# Abra no navegador
open index.html
# ou arraste o arquivo index.html para o navegador
```

> Para melhor experiência com fontes do Google, recomenda-se conexão com a internet.

---

## Autoras

Desenvolvido como projeto acadêmico de Desenvolvimento Web.

| Autora | GitHub |
|---|---|
| Ana Helena Buery | [@helencloudbuer](https://github.com/helencloudbuer) |
| Letícia Franca | [@LeticiaPFranca](https://github.com/LeticiaPFranca) |

---


