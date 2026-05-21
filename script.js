/* ================================================
   SCRIPT.JS — EducaSegura
   Quiz + Smooth Scroll + Mobile Menu + Acessibilidade
   ================================================ */

// ── SMOOTH SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── MOBILE MENU ───────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        // CORREÇÃO: lógica invertida — toggle retorna true se a classe FOI ADICIONADA (hidden)
        // Portanto isOpen = true quando a classe hidden NÃO está presente (menu visível)
        mobileMenu.classList.toggle('hidden');
        const isOpen = !mobileMenu.classList.contains('hidden');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha ao clicar em link do menu mobile
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ── QUIZ ──────────────────────────────────────────
const questions = [
    {
        q: "Você recebe um e-mail do 'Suporte Netflix' dizendo que sua conta será suspensa e pede para clicar num link. O que você olha primeiro?",
        options: [
            { text: "A logomarca da Netflix", correct: false },
            { text: "O endereço real do remetente (ex: @gmail.com vs @netflix.com)", correct: true },
            { text: "As cores do e-mail", correct: false }
        ]
    },
    {
        q: "Um amigo te envia um link no WhatsApp dizendo: 'Olha essa promoção do Boticário!'. Qual o passo mais seguro?",
        options: [
            { text: "Clicar e ver se é verdade", correct: false },
            { text: "Ignorar e avisar o amigo que ele pode ter sido hackeado", correct: true },
            { text: "Cadastrar meu CPF para ganhar o brinde", correct: false }
        ]
    },
    {
        q: "O que caracteriza uma senha forte?",
        options: [
            { text: "Nome do meu pet + ano de nascimento", correct: false },
            { text: "Sequências numéricas (123456)", correct: false },
            { text: "Mistura de letras (MAI/min), números e símbolos", correct: true }
        ]
    },
    {
        q: "Qual atitude ajuda a evitar golpes?",
        options: [
            { text: "Clicar rápido", correct: false },
            { text: "Compartilhar dados pessoais", correct: false },
            { text: "Desconfiar de urgência e ofertas boas demais", correct: true }
        ]
    },
    {
        q: "Um 'amigo' te manda mensagem pedindo dinheiro urgente pelo WhatsApp. Qual a atitude correta?",
        options: [
            { text: "Ignorar", correct: false },
            { text: "Transferir para ajudar rápido", correct: false },
            { text: "Ligar para o amigo ou confirmar por outro meio", correct: true }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
// CORREÇÃO: flag para evitar cliques duplos enquanto uma resposta está sendo processada
let answerLocked = false;

function loadQuestion() {
    answerLocked = false;
    const q = questions[currentQuestionIndex];
    document.getElementById('question-number').innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    document.getElementById('question-text').innerText = q.q;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt.text;
        btn.className = 'quiz-btn';
        btn.setAttribute('aria-label', `Opção ${idx + 1}: ${opt.text}`);
        // CORREÇÃO: usa referência à função para evitar problemas de escopo
        btn.addEventListener('click', () => handleAnswer(opt.correct));
        container.appendChild(btn);
    });

    const progress = (currentQuestionIndex / questions.length) * 100;
    const progressBar = document.getElementById('quiz-progress');
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
}

function handleAnswer(isCorrect) {
    // CORREÇÃO: impede cliques múltiplos antes da próxima pergunta carregar
    if (answerLocked) return;
    answerLocked = true;

    // Desabilita todos os botões de opção após a resposta
    const btns = document.querySelectorAll('.quiz-btn');
    btns.forEach(btn => { btn.disabled = true; });

    if (isCorrect) {
        score++;
        const card = document.getElementById('quiz-card');
        card.classList.add('correct-flash');
        setTimeout(() => card.classList.remove('correct-flash'), 500);
    }

    // Pequeno delay para dar feedback visual antes de avançar
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 350);
}

function showResult() {
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');

    const progressBar = document.getElementById('quiz-progress');
    progressBar.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', 100);

    document.getElementById('result-text').innerText = `Você acertou ${score} de ${questions.length} questões.`;

    if (score === questions.length) {
        document.getElementById('result-title').innerText = "Mestre da Segurança! 🛡️";
        // CORREÇÃO: verifica typeof corretamente — confetti vem do CDN como variável global
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8F797E', '#FFC2B5', '#646C8F']
            });
        }
    } else if (score >= Math.ceil(questions.length / 2)) {
        document.getElementById('result-title').innerText = "Bom trabalho! 👍";
    } else {
        document.getElementById('result-title').innerText = "Continue Praticando! 📚";
    }
}

// CORREÇÃO: exposto no escopo global via window para o onclick do HTML funcionar
window.resetQuiz = function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answerLocked = false;
    document.getElementById('question-container').classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    loadQuestion();
};

// CORREÇÃO: usa DOMContentLoaded em vez de window.onload para não conflitar
// com o módulo de acessibilidade que também usa DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadQuestion);


/* ================================================
   ACCESSIBILITY.JS — acessibilidade avançada
   ================================================ */
(function () {
    "use strict";

    // 1. SKIP LINK
    function injectSkipLink() {
        // CORREÇÃO: evita injetar duplicado se já existir
        if (document.querySelector('.skip-link')) return;
        const skip = document.createElement("a");
        skip.href = "#conteudo-principal";
        skip.className = "skip-link";
        skip.textContent = "Pular para o conteúdo principal (Alt+1)";
        document.body.insertBefore(skip, document.body.firstChild);
    }

    // 2. ARIA LIVE REGION
    let announcer;
    function injectAnnouncer() {
        if (document.getElementById('a11y-announcer')) {
            announcer = document.getElementById('a11y-announcer');
            return;
        }
        announcer = document.createElement("div");
        announcer.id = "a11y-announcer";
        announcer.setAttribute("aria-live", "polite");
        announcer.setAttribute("aria-atomic", "true");
        announcer.setAttribute("role", "status");
        document.body.appendChild(announcer);
    }

    function announce(msg, priority) {
        if (!announcer) return;
        priority = priority || "polite";
        announcer.setAttribute("aria-live", priority);
        announcer.textContent = "";
        requestAnimationFrame(function() { announcer.textContent = msg; });
    }

    // 3. AUDIODESCRIÇÃO
    let ttsEnabled = false;

    function speak(text) {
        if (!ttsEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = "pt-BR";
        utt.rate = 0.95;
        utt.pitch = 1;
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(function(v) { return v.lang.startsWith("pt"); });
        if (ptVoice) utt.voice = ptVoice;
        window.speechSynthesis.speak(utt);
    }

    function toggleTTS() {
        ttsEnabled = !ttsEnabled;
        if (!ttsEnabled) window.speechSynthesis.cancel();
        const btn = document.getElementById("a11y-tts-btn");
        if (btn) btn.classList.toggle("active", ttsEnabled);
        announce(ttsEnabled ? "Audiodescrição ativada" : "Audiodescrição desativada");
        if (ttsEnabled) speak("Audiodescrição ativada. Passe o mouse ou foque nos elementos para ouvir a descrição.");
        try { localStorage.setItem("a11y-tts", ttsEnabled ? "1" : "0"); } catch(e) {}
    }

    function attachTTSListeners() {
        const selectors = ["h1","h2","h3","h4","h5","p","a","button",".card-hover",".noticia-card","#question-text",".quiz-btn","#result-title","#result-text"];
        document.querySelectorAll(selectors.join(",")).forEach(function(el) {
            if (el.dataset.ttsAttached) return;
            el.dataset.ttsAttached = "1";
            const readEl = function() {
                if (!ttsEnabled) return;
                const text = el.getAttribute("aria-label") || el.getAttribute("title") || el.innerText || "";
                if (text.trim()) speak(text.trim().substring(0, 300));
            };
            el.addEventListener("mouseenter", readEl);
            el.addEventListener("focus", readEl);
        });
    }

    // 4. CONTROLE DE FONTE
    const FONT_MIN = 12, FONT_MAX = 24;
    let fontSize = 16;
    try { fontSize = parseInt(localStorage.getItem("fontSize") || "16", 10); } catch(e) {}

    function applyFontSize() {
        document.documentElement.style.fontSize = fontSize + "px";
        const display = document.getElementById("a11y-font-display");
        if (display) display.textContent = fontSize + "px";
        try { localStorage.setItem("fontSize", fontSize); } catch(e) {}
    }

    function increaseFontSize() {
        if (fontSize < FONT_MAX) { fontSize++; applyFontSize(); announce("Tamanho da fonte: " + fontSize + " pixels"); }
    }

    function decreaseFontSize() {
        if (fontSize > FONT_MIN) { fontSize--; applyFontSize(); announce("Tamanho da fonte: " + fontSize + " pixels"); }
    }

    function resetFontSize() {
        fontSize = 16; applyFontSize(); announce("Tamanho da fonte restaurado para padrão");
    }

    // 5. TEMA DARK / LIGHT
    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch(e) {}
        const btn = document.getElementById("a11y-theme-btn");
        if (btn) {
            btn.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro";
            btn.classList.toggle("active", isDark);
        }
        ["themeToggle","themeToggleMobile"].forEach(function(id) {
            const navBtn = document.getElementById(id);
            if (navBtn) navBtn.textContent = isDark ? "☀️" : "🌙";
        });
        announce(isDark ? "Modo escuro ativado" : "Modo claro ativado");
        if (ttsEnabled) speak(isDark ? "Modo escuro ativado" : "Modo claro ativado");
    }

    // 6. ALTO CONTRASTE — 3 níveis
    const highContrastModes  = ["", "high-contrast", "high-contrast-2", "high-contrast-3"];
    const highContrastLabels = [
        "Desativado",
        "Nível 1 — preto e branco",
        "Nível 2 — amarelo sobre preto",
        "Nível 3 — ciano sobre preto"
    ];
    let highContrastIndex = 0;

    function cycleHighContrast() {
        // remove classe atual
        if (highContrastModes[highContrastIndex]) document.body.classList.remove(highContrastModes[highContrastIndex]);
        highContrastIndex = (highContrastIndex + 1) % highContrastModes.length;
        // aplica nova classe
        if (highContrastModes[highContrastIndex]) document.body.classList.add(highContrastModes[highContrastIndex]);
        const btn = document.getElementById("a11y-hc-btn");
        if (btn) {
            btn.classList.toggle("active", highContrastIndex > 0);
            btn.title = "Contraste: " + highContrastLabels[highContrastIndex];
            btn.textContent = highContrastIndex > 0
                ? "◑ Contraste " + highContrastIndex + "/3"
                : "◑ Alto Contraste";
        }
        try { localStorage.setItem("a11y-hc", highContrastIndex); } catch(e) {}
        announce("Alto contraste: " + highContrastLabels[highContrastIndex]);
        if (ttsEnabled) speak("Alto contraste: " + highContrastLabels[highContrastIndex]);
    }

    // mantém toggleHighContrast como alias para compatibilidade com Alt+C
    function toggleHighContrast() { cycleHighContrast(); }

    // 7. MODO DALTÔNICO
    const colorblindModes  = ["", "colorblind-deuteranopia", "colorblind-protanopia", "colorblind-tritanopia"];
    const colorblindLabels = [
        "Nenhum",
        "Deuteranopia — azul/laranja (déficit verde)",
        "Protanopia — azul/ouro (déficit vermelho)",
        "Tritanopia — ciano/magenta (déficit azul)"
    ];
    let colorblindIndex = 0;

    function cycleColorblind() {
        if (colorblindModes[colorblindIndex]) document.body.classList.remove(colorblindModes[colorblindIndex]);
        colorblindIndex = (colorblindIndex + 1) % colorblindModes.length;
        if (colorblindModes[colorblindIndex]) document.body.classList.add(colorblindModes[colorblindIndex]);
        const btn = document.getElementById("a11y-cb-btn");
        if (btn) {
            btn.classList.toggle("active", colorblindIndex > 0);
            const shortLabels = ["Nenhum", "Deuteranopia", "Protanopia", "Tritanopia"];
            btn.title = "Modo: " + colorblindLabels[colorblindIndex];
            btn.textContent = colorblindIndex > 0
                ? "👁 " + shortLabels[colorblindIndex] + " (" + colorblindIndex + "/3)"
                : "👁 Daltonismo";
        }
        try { localStorage.setItem("a11y-cb", colorblindIndex); } catch(e) {}
        announce("Filtro de daltonismo: " + colorblindLabels[colorblindIndex]);
        if (ttsEnabled) speak("Filtro de daltonismo: " + colorblindLabels[colorblindIndex]);
    }

    // 8. ESPAÇAMENTO DE TEXTO
    function toggleTextSpacing() {
        document.body.classList.toggle("text-spacing");
        const isOn = document.body.classList.contains("text-spacing");
        try { localStorage.setItem("a11y-spacing", isOn ? "1" : "0"); } catch(e) {}
        const btn = document.getElementById("a11y-spacing-btn");
        if (btn) btn.classList.toggle("active", isOn);
        announce(isOn ? "Espaçamento de texto aumentado" : "Espaçamento de texto normal");
    }

    // 9. REDUZIR ANIMAÇÕES
    function toggleReduceMotion() {
        document.body.classList.toggle("reduce-motion");
        const isOn = document.body.classList.contains("reduce-motion");
        try { localStorage.setItem("a11y-motion", isOn ? "1" : "0"); } catch(e) {}
        const btn = document.getElementById("a11y-motion-btn");
        if (btn) btn.classList.toggle("active", isOn);
        announce(isOn ? "Animações reduzidas" : "Animações normais");
    }

    // 10. ATALHOS DE TECLADO
    const shortcuts = {
        "Alt+1": { action: function() { skipTo("conteudo-principal"); }, desc: "Ir ao conteúdo principal" },
        "Alt+2": { action: function() { skipTo("tipos"); },              desc: "Ir para Tipos de Fraudes" },
        "Alt+3": { action: function() { skipTo("quiz"); },               desc: "Ir para o Quiz" },
        "Alt+4": { action: function() { skipTo("noticias"); },           desc: "Ir para Notícias" },
        "Alt+0": { action: function() { skipTo("inicio"); },             desc: "Voltar ao topo" },
        "Alt+t": { action: toggleTheme,        desc: "Alternar tema escuro/claro" },
        "Alt+c": { action: toggleHighContrast, desc: "Alternar alto contraste" },
        "Alt+a": { action: toggleTTS,          desc: "Alternar audiodescrição" },
        "Alt+m": { action: toggleReduceMotion, desc: "Alternar animações" },
        "Alt++": { action: increaseFontSize,   desc: "Aumentar fonte" },
        "Alt+-": { action: decreaseFontSize,   desc: "Diminuir fonte" },
        "Alt+h": { action: showShortcutHelp,   desc: "Exibir lista de atalhos" },
        "Alt+p": { action: toggleA11yPanel,    desc: "Abrir/fechar painel de acessibilidade" }
    };

    function skipTo(id) {
        const target = document.getElementById(id);
        if (!target) return;
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: false });
        target.scrollIntoView({ behavior: "smooth" });
        announce("Navegando para: " + id);
    }

    document.addEventListener("keydown", function(e) {
        // CORREÇÃO: normaliza a tecla para minúsculo para os atalhos de letra (Alt+t, Alt+c, etc.)
        const keyChar = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const key = (e.altKey ? "Alt+" : "") + keyChar;
        const shortcut = shortcuts[key];
        if (shortcut) { e.preventDefault(); shortcut.action(); }
        if (e.key === "Escape") {
            const menu = document.getElementById("a11y-menu");
            if (menu && menu.classList.contains("open")) {
                menu.classList.remove("open");
                const toggleBtn = document.getElementById("a11y-toggle-btn");
                if (toggleBtn) toggleBtn.focus();
            }
        }
    });

    // 11. MODAL DE ATALHOS
    function showShortcutHelp() {
        const existing = document.getElementById("a11y-shortcut-modal");
        if (existing) { existing.remove(); return; }
        const isDark = document.body.classList.contains("dark-mode");
        const modal = document.createElement("div");
        modal.id = "a11y-shortcut-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-label", "Lista de atalhos de teclado");
        modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;";
        const inner = document.createElement("div");
        inner.style.cssText = "background:" + (isDark ? "#172840" : "#fff") + ";color:" + (isDark ? "#f0f6fb" : "#111") + ";border-radius:12px;padding:28px;max-width:480px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.4);";
        let rows = '<h2 style="margin-top:0;font-size:1.2rem">⌨️ Atalhos de Teclado</h2><table style="width:100%;border-collapse:collapse">';
        Object.entries(shortcuts).forEach(function(entry) {
            const key = entry[0], val = entry[1];
            rows += '<tr style="border-bottom:1px solid #ccc"><td style="padding:6px 4px"><kbd style="background:#e8e8e8;border:1px solid #999;border-radius:4px;padding:2px 6px;font-family:monospace;font-size:0.8rem;color:#000">' + key + '</kbd></td><td style="padding:6px 4px;font-size:0.9rem">' + val.desc + '</td></tr>';
        });
        rows += '</table>';
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Fechar (Esc)";
        closeBtn.style.cssText = "margin-top:16px;padding:8px 20px;background:#252d5c;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.9rem;";
        closeBtn.addEventListener("click", function() { modal.remove(); });
        inner.innerHTML = rows;
        inner.appendChild(closeBtn);
        modal.appendChild(inner);
        document.body.appendChild(modal);
        setTimeout(function() { closeBtn.focus(); }, 50);
        modal.addEventListener("keydown", function(e) { if (e.key === "Escape") modal.remove(); });
        modal.addEventListener("click", function(e) { if (e.target === modal) modal.remove(); });
        announce("Lista de atalhos aberta. Pressione Escape para fechar.");
    }

    // 12. PAINEL FLUTUANTE
    function injectA11yPanel() {
        // CORREÇÃO: evita injetar painel duplicado
        if (document.getElementById('a11y-panel')) return;
        const panel = document.createElement("div");
        panel.id = "a11y-panel";
        panel.setAttribute("role", "complementary");
        panel.setAttribute("aria-label", "Painel de acessibilidade");
        panel.innerHTML = [
            '<div id="a11y-menu" role="dialog" aria-label="Opções de acessibilidade" aria-modal="false">',
                '<h6>🔤 Tamanho da fonte</h6>',
                '<div class="a11y-font-row">',
                    '<button class="a11y-btn" id="a11y-font-dec" aria-label="Diminuir fonte" title="Alt+-">A−</button>',
                    '<span id="a11y-font-display" aria-live="polite" aria-label="Tamanho atual da fonte">' + fontSize + 'px</span>',
                    '<button class="a11y-btn" id="a11y-font-inc" aria-label="Aumentar fonte" title="Alt++">A+</button>',
                    '<button class="a11y-btn" id="a11y-font-reset" aria-label="Restaurar fonte padrão">↺</button>',
                '</div>',
                '<h6>🎨 Aparência</h6>',
                '<button class="a11y-btn" id="a11y-theme-btn" title="Alt+T">🌙 Modo Escuro</button>',
                '<button class="a11y-btn" id="a11y-hc-btn" title="Alt+C">◑ Alto Contraste</button>',
                '<button class="a11y-btn" id="a11y-cb-btn">👁 Daltonismo</button>',
                '<h6>📖 Leitura</h6>',
                '<button class="a11y-btn" id="a11y-spacing-btn">↔ Espaçamento</button>',
                '<button class="a11y-btn" id="a11y-motion-btn" title="Alt+M">⏸ Reduzir Animações</button>',
                '<h6>🔊 Audiodescrição</h6>',
                '<button class="a11y-btn" id="a11y-tts-btn" title="Alt+A">🔊 Audiodescrição</button>',
                '<h6>⌨️ Navegação</h6>',
                '<button class="a11y-btn" id="a11y-help-btn" title="Alt+H">❓ Ver Atalhos</button>',
            '</div>',
            '<button id="a11y-toggle-btn" aria-label="Abrir painel de acessibilidade" aria-expanded="false" aria-controls="a11y-menu" title="Acessibilidade (Alt+P)">♿</button>'
        ].join('');
        document.body.appendChild(panel);

        document.getElementById("a11y-font-inc").addEventListener("click", increaseFontSize);
        document.getElementById("a11y-font-dec").addEventListener("click", decreaseFontSize);
        document.getElementById("a11y-font-reset").addEventListener("click", resetFontSize);
        document.getElementById("a11y-theme-btn").addEventListener("click", toggleTheme);
        document.getElementById("a11y-hc-btn").addEventListener("click", toggleHighContrast);
        document.getElementById("a11y-cb-btn").addEventListener("click", cycleColorblind);
        document.getElementById("a11y-spacing-btn").addEventListener("click", toggleTextSpacing);
        document.getElementById("a11y-motion-btn").addEventListener("click", toggleReduceMotion);
        document.getElementById("a11y-tts-btn").addEventListener("click", toggleTTS);
        document.getElementById("a11y-help-btn").addEventListener("click", showShortcutHelp);
        document.getElementById("a11y-toggle-btn").addEventListener("click", toggleA11yPanel);
    }

    function toggleA11yPanel() {
        const menu   = document.getElementById("a11y-menu");
        const btn    = document.getElementById("a11y-toggle-btn");
        if (!menu) return;
        const isOpen = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) {
            announce("Painel de acessibilidade aberto");
            setTimeout(function() {
                const firstBtn = menu.querySelector("button");
                if (firstBtn) firstBtn.focus();
            }, 100);
        } else {
            announce("Painel de acessibilidade fechado");
        }
    }

    // Fecha painel ao clicar fora
    document.addEventListener("click", function(e) {
        const panel = document.getElementById("a11y-panel");
        if (panel && !panel.contains(e.target)) {
            const menu = document.getElementById("a11y-menu");
            if (menu) menu.classList.remove("open");
        }
    });

    // 13. PATCH QUIZ (anuncia respostas)
    // CORREÇÃO: aguarda mais tempo para garantir que o quiz já foi inicializado
    function patchQuizAria() {
        const origHandle = window.handleAnswer;
        if (typeof origHandle === "function") {
            window.handleAnswer = function(isCorrect) {
                origHandle(isCorrect);
                const msg = isCorrect ? "Resposta correta!" : "Resposta incorreta. Tente a próxima.";
                announce(msg, "assertive");
                if (ttsEnabled) speak(msg);
            };
        }
        const origLoad = window.loadQuestion;
        if (typeof origLoad === "function") {
            window.loadQuestion = function() {
                origLoad();
                setTimeout(function() {
                    const qText = document.getElementById("question-text");
                    if (qText && qText.innerText) {
                        announce(qText.innerText);
                        if (ttsEnabled) speak(qText.innerText);
                    }
                }, 150);
            };
        }
    }

    // 14. RESTAURAR PREFERÊNCIAS
    function restorePreferences() {
        try {
            if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");

            // alto contraste: agora guarda o índice (0-3)
            const hcIdx = parseInt(localStorage.getItem("a11y-hc") || "0", 10);
            if (hcIdx > 0 && highContrastModes[hcIdx]) {
                highContrastIndex = hcIdx;
                document.body.classList.add(highContrastModes[hcIdx]);
            }

            if (localStorage.getItem("a11y-tts") === "1") ttsEnabled = true;
            applyFontSize();
            const cbIdx = parseInt(localStorage.getItem("a11y-cb") || "0", 10);
            if (cbIdx > 0 && colorblindModes[cbIdx]) {
                colorblindIndex = cbIdx;
                document.body.classList.add(colorblindModes[cbIdx]);
            }
            if (localStorage.getItem("a11y-spacing") === "1") document.body.classList.add("text-spacing");
            if (localStorage.getItem("a11y-motion") === "1" ||
                window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                document.body.classList.add("reduce-motion");
            }
        } catch(e) {
            // localStorage pode estar bloqueado em alguns contextos — ignora silenciosamente
        }
    }

    // 15. SINCRONIZA BOTÕES LEGADOS (navbar desktop e mobile)
    function syncLegacyNavButtons() {
        ["themeToggle","themeToggleMobile"].forEach(function(id) {
            const btn = document.getElementById(id);
            if (btn) {
                // CORREÇÃO: clona e reanexa para remover listeners antigos antes de adicionar novos
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                document.getElementById(id).addEventListener("click", toggleTheme);
            }
        });
        ["fontIncrease","fontIncreaseMobile"].forEach(function(id) {
            const btn = document.getElementById(id);
            if (btn) {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                document.getElementById(id).addEventListener("click", increaseFontSize);
            }
        });
        ["fontDecrease","fontDecreaseMobile"].forEach(function(id) {
            const btn = document.getElementById(id);
            if (btn) {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                document.getElementById(id).addEventListener("click", decreaseFontSize);
            }
        });
    }

    // INICIALIZAÇÃO
    function init() {
        injectSkipLink();
        injectAnnouncer();
        restorePreferences();
        injectA11yPanel();
        syncLegacyNavButtons();

        if (window.speechSynthesis) {
            window.speechSynthesis.addEventListener("voiceschanged", function() {});
        }

        // CORREÇÃO: aumentado para 800ms para garantir que o quiz já inicializou
        setTimeout(patchQuizAria, 800);
        attachTTSListeners();

        // Sincroniza estado visual dos botões do painel com as preferências restauradas
        const isDark = document.body.classList.contains("dark-mode");
        const themeBtn = document.getElementById("a11y-theme-btn");
        if (themeBtn) {
            themeBtn.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro";
            themeBtn.classList.toggle("active", isDark);
        }
        document.getElementById("a11y-hc-btn")?.classList.toggle("active", highContrastIndex > 0);
        document.getElementById("a11y-tts-btn")?.classList.toggle("active", ttsEnabled);
        document.getElementById("a11y-spacing-btn")?.classList.toggle("active", document.body.classList.contains("text-spacing"));
        document.getElementById("a11y-motion-btn")?.classList.toggle("active", document.body.classList.contains("reduce-motion"));

        // Atualiza ícone dos botões de tema na navbar
        ["themeToggle","themeToggleMobile"].forEach(function(id) {
            const navBtn = document.getElementById(id);
            if (navBtn) navBtn.textContent = isDark ? "☀️" : "🌙";
        });

        console.log(
            "%c♿ EducaSegura Acessibilidade Carregada\n%cAlt+H para ver todos os atalhos",
            "color:#0a4f6a;font-weight:bold;font-size:14px",
            "color:#444;font-size:12px"
        );
    }

    // CORREÇÃO: usa DOMContentLoaded consistentemente, com fallback para documento já carregado
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();