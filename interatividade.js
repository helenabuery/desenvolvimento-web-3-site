/* ============================================================
   INTERATIVIDADE.JS — EducaSegura | Aula 13: Interatividade no DOM
   Autor: gerado com base nos arquivos do projeto EducaSegura
   ============================================================

   RESUMO DOS REQUISITOS ATENDIDOS
   ──────────────────────────────────────────────────────────
   ① Evento de Mouse   → mouseover / mouseout nos cards de Tipos de Fraudes
   ② Evento de Teclado → keyup no campo de pesquisa de Notícias
   ③ Manipulação de Estilo Dinâmica → botão "Modo Leitura Focada"
   ──────────────────────────────────────────────────────────
   Cada bloco é comentado explicando:
     • qual evento DOM está sendo escutado (addEventListener)
     • como o JavaScript manipula o DOM (conteúdo e/ou estilo)
============================================================ */


/* ============================================================
   ① EVENTO DE MOUSE — mouseenter / mouseleave
   Seção: "Principais Ataques" (#tipos)
   ──────────────────────────────────────────────────────────
   POR QUE mouseenter/mouseleave e NÃO mouseover/mouseout?
   ──────────────────────────────────────────────────────────
   "mouseover" e "mouseout" propagam (bubble) pelos elementos
   filhos: ao mover o cursor do emoji para o <h4>, o browser
   dispara um "mouseout" no card e imediatamente um "mouseover"
   de volta — causando pisca-pisca da dica e da cor de fundo.

   "mouseenter" e "mouseleave" NÃO propagam: disparam apenas
   quando o ponteiro cruza a borda REAL do elemento registrado,
   ignorando completamente os filhos internos. São a escolha
   correta sempre que o alvo contém elementos filhos.

   COMO FUNCIONA:
   • Seleciona todos os .card-hover com o atributo [data-extra].
   • Para cada card, registra dois listeners:
       – "mouseenter": ponteiro entra na área do card.
       – "mouseleave": ponteiro sai da área do card.

   MANIPULAÇÃO DO DOM em mouseenter:
   1. Lê data-cor e aplica via element.style.backgroundColor.
   2. Cria <p class="card-dica"> com o texto de data-extra
      e o insere no card via appendChild.

   MANIPULAÇÃO DO DOM em mouseleave:
   1. Limpa backgroundColor (CSS original reassume).
   2. Remove o <p class="card-dica"> via removeChild.
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // Seleciona todos os cards que têm o atributo data-extra definido no HTML
    const cardsComDica = document.querySelectorAll('.card-hover[data-extra]');

    cardsComDica.forEach(function (card) {

        /* ── MOUSEENTER: ponteiro cruza a borda do card ──────── */
        // Não propaga para filhos → sem pisca-pisca
        card.addEventListener('mouseenter', function () {

            // 1. Aplica cor de fundo definida em data-cor
            card.style.backgroundColor = card.getAttribute('data-cor');
            card.style.transition       = 'background-color 0.3s ease';

            // 2. Injeta a dica apenas se ainda não existir no DOM
            if (!card.querySelector('.card-dica')) {
                const dica        = document.createElement('p');
                dica.className    = 'card-dica';
                dica.textContent  = card.getAttribute('data-extra');

                dica.style.marginTop    = '12px';
                dica.style.fontSize     = '0.82rem';
                dica.style.color        = '#0a4f6a';
                dica.style.fontWeight   = '500';
                dica.style.background   = 'rgba(255,255,255,0.75)';
                dica.style.borderLeft   = '3px solid #0d5278';
                dica.style.padding      = '8px 10px';
                dica.style.borderRadius = '6px';
                dica.style.lineHeight   = '1.4';
                dica.style.animation    = 'fadeInDica 0.25s ease';

                card.appendChild(dica);
            }
        });

        /* ── MOUSELEAVE: ponteiro sai da borda do card ───────── */
        // Também não propaga → só dispara ao sair de verdade
        card.addEventListener('mouseleave', function () {

            // 1. Remove cor de fundo → CSS original reassume
            card.style.backgroundColor = '';

            // 2. Remove a dica do DOM se existir
            const dica = card.querySelector('.card-dica');
            if (dica) {
                card.removeChild(dica);
            }
        });
    });


    /* ==========================================================
       ② EVENTO DE TECLADO — keyup
       Seção: "Notícias" (#noticias)
       ────────────────────────────────────────────────────────
       COMO FUNCIONA:
       • Escuta o evento "keyup" no campo <input id="pesquisa-noticias">.
         "keyup" dispara APÓS a tecla ser solta, garantindo que
         input.value já contém o caractere recém digitado.

       MANIPULAÇÃO DO DOM:
       1. Lê o valor digitado (termo) e converte para minúsculas
          para uma comparação case-insensitive.
       2. Percorre cada .noticia-card e acessa o texto do <h5>
          (título da notícia) via querySelector + textContent.
       3. Se o título NÃO contém o termo, define element.style.display
          = 'none' — oculta o card sem removê-lo do DOM.
       4. Se contém, define element.style.display = 'block' — reexibe.
       5. Conta quantos cards ficaram visíveis; se zero, exibe a
          mensagem #sem-resultado e injeta o termo buscado no <span>.
    ========================================================== */

    const campoPesquisa  = document.getElementById('pesquisa-noticias');
    const mensagemVazia  = document.getElementById('sem-resultado');
    const termoBuscado   = document.getElementById('termo-buscado');
    const listaCards     = document.querySelectorAll('#lista-noticias .noticia-card');

    if (campoPesquisa) {

        // Evento "keyup": disparado toda vez que uma tecla é SOLTA
        campoPesquisa.addEventListener('keyup', function () {

            // Lê e normaliza o valor do campo de busca
            const termo = campoPesquisa.value.trim().toLowerCase();

            let cardsVisiveis = 0; // contador de cards que passaram no filtro

            listaCards.forEach(function (card) {

                // Seleciona o <h5> que contém o título da notícia
                const titulo = card.querySelector('h5');
                const textoTitulo = titulo ? titulo.textContent.toLowerCase() : '';

                if (textoTitulo.includes(termo)) {
                    // Título corresponde ao termo → exibe o card
                    card.style.display = 'block';
                    cardsVisiveis++;
                } else {
                    // Título NÃO corresponde → oculta o card
                    card.style.display = 'none';
                }
            });

            // Exibe ou oculta a mensagem "Nenhuma notícia encontrada"
            if (cardsVisiveis === 0 && termo !== '') {
                termoBuscado.textContent = campoPesquisa.value.trim(); // insere o termo no <span>
                mensagemVazia.classList.remove('hidden');  // manipula classList para exibir
            } else {
                mensagemVazia.classList.add('hidden');     // oculta a mensagem
            }

            // Se o campo estiver vazio, garante que todos os cards reapareçam
            if (termo === '') {
                listaCards.forEach(function (card) {
                    card.style.display = 'block';
                });
            }
        });
    }


    /* ==========================================================
       ③ MANIPULAÇÃO DE ESTILO DINÂMICA — classList.toggle
       Botão: "Modo Leitura Focada" (#btn-leitura-focada)
       ────────────────────────────────────────────────────────
       COMO FUNCIONA:
       • Escuta o evento "click" no botão #btn-leitura-focada.
       • A cada clique, usa classList.toggle('leitura-focada')
         no <body> para alternar o modo.

       MANIPULAÇÃO DO DOM quando leitura-focada está ATIVA:
       1. A classe CSS .leitura-focada (definida em styles.css)
          oculta a <nav> e outros elementos não essenciais.
       2. A seção de conteúdo principal (#conteudo-principal)
          tem seu espaçamento aumentado via classList.toggle
          de uma segunda classe: .leitura-conteudo.
       3. O atributo aria-pressed do botão é atualizado para
          informar leitores de tela sobre o estado atual.
       4. O texto do botão é alterado via textContent para
          dar feedback visual imediato ao usuário.

       MANIPULAÇÃO DO DOM quando leitura-focada está DESATIVA:
       • Tudo é revertido: a classe é removida do body e do
         conteúdo, o botão volta ao texto original.
    ========================================================== */

    const btnLeitura        = document.getElementById('btn-leitura-focada');
    const conteudoPrincipal = document.getElementById('conteudo-principal');

    if (btnLeitura) {

        btnLeitura.addEventListener('click', function () {

            // classList.toggle retorna true se a classe FOI ADICIONADA (modo ativado)
            const modoAtivo = document.body.classList.toggle('leitura-focada');

            // Também alterna a classe de espaçamento no bloco de conteúdo principal
            if (conteudoPrincipal) {
                conteudoPrincipal.classList.toggle('leitura-conteudo');
            }

            // Atualiza aria-pressed para acessibilidade (leitores de tela)
            btnLeitura.setAttribute('aria-pressed', String(modoAtivo));

            // Altera o texto do botão para refletir o estado atual
            if (modoAtivo) {
                btnLeitura.textContent = '✖ Sair do Modo Leitura';
                btnLeitura.style.background    = '#fef3c7'; // destaque visual quando ativo
                btnLeitura.style.color         = '#92400e';
                btnLeitura.style.borderColor   = '#f59e0b';
            } else {
                btnLeitura.textContent         = '📖 Modo Leitura Focada';
                btnLeitura.style.background    = ''; // restaura estilos originais
                btnLeitura.style.color         = '';
                btnLeitura.style.borderColor   = '';
            }
        });
    }

}); // fim do DOMContentLoaded