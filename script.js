// --- DADOS DO QUIZ (INALTERADO) ---
const questions = [
    {
        question: "O câncer de próstata é o mais comum entre os homens. Qual a importância do diagnóstico precoce?",
        options: [
            { text: "Eleva a chance de cura para mais de 90%", isCorrect: true },
            { text: "Apenas serve para confirmar os sintomas já existentes", isCorrect: false },
            { text: "Aumenta a necessidade de cirurgia imediata", isCorrect: false },
            { text: "Permite adiar o tratamento por anos", isCorrect: false }
        ],
        bluebotPhrase: "Pronto para o Check-up? Otimize seu conhecimento!"
    },
    {
        question: "Qual exame de rotina é fundamental para o diagnóstico precoce do câncer de próstata, além do exame de sangue PSA?",
        options: [
            { text: "Ultrassom da vesícula biliar", isCorrect: false },
            { text: "Teste ergométrico", isCorrect: false },
            { text: "Exame de toque retal", isCorrect: true },
            { text: "Colonoscopia anual", isCorrect: false }
        ],
        bluebotPhrase: "Seu 'Hardware' está em dia? Vamos rodar o próximo teste!"
    },
    {
        question: "A partir de qual idade, em geral, a maioria dos homens deve iniciar a rotina de exames preventivos da próstata, conforme recomendação padrão?",
        options: [
            { text: "Aos 30 anos", isCorrect: false },
            { text: "Aos 60 anos", isCorrect: false },
            { text: "Aos 40 anos (para alto risco) ou 50 anos (geral)", isCorrect: true },
            { text: "Aos 70 anos", isCorrect: false }
        ],
        bluebotPhrase: "Qual a idade mínima para o 'Upgrade' preventivo? Responda!"
    },
    {
        question: "Muitos homens evitam o check-up por preconceito. Qual o lema que melhor combate essa barreira no Novembro Azul?",
        options: [
            { text: "O homem que se cuida é um 'Top Performer' e quebra o tabu.", isCorrect: true },
            { text: "O cuidado com a saúde só é necessário após os sintomas.", isCorrect: false },
            { text: "O preconceito é um 'bug' insolúvel.", isCorrect: false },
            { text: "Consultar um médico anualmente é perda de tempo.", isCorrect: false }
        ],
        bluebotPhrase: "Quebre o 'bug' do tabu! Qual a atitude do verdadeiro 'Player'?"
    },
    {
        question: "Qual destes fatores é considerado um risco maior para o desenvolvimento do câncer de próstata?",
        options: [
            { text: "Ser fisicamente ativo", isCorrect: false },
            { text: "Histórico familiar (pai ou irmãos com câncer de próstata)", isCorrect: true },
            { text: "Consumo elevado de água", isCorrect: false },
            { text: "Dormir 8 horas por noite", isCorrect: false }
        ],
        bluebotPhrase: "Analisando o código genético... Qual o fator de risco?"
    },
    {
        question: "Além do câncer de próstata, o que o check-up regular de saúde masculina ajuda a prevenir ou diagnosticar precocemente?",
        options: [
            { text: "Apenas resfriados leves", isCorrect: false },
            { text: "Doenças cardiovasculares, diabetes e hipertensão", isCorrect: true },
            { text: "Apenas problemas de visão", isCorrect: false },
            { text: "Somente o desgaste das articulações", isCorrect: false }
        ],
        bluebotPhrase: "O 'Upgrade' é completo! O que mais otimizamos com o Check-up?"
    }
];

// --- ELEMENTOS DO DOM ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const finalScreen = document.getElementById('final-screen');
const startButton = document.getElementById('start-game-btn');
const restartButton = document.getElementById('restart-game-btn');
const questionText = document.getElementById('question-text');
const bluebotPhrase = document.getElementById('bluebot-phrase');
const answerButtonsDiv = document.getElementById('answer-buttons');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const finalScoreDisplay = document.getElementById('final-score-display');
const finalTitle = document.getElementById('final-title');
const finalMessage = document.getElementById('final-message');
const feedbackMessage = document.getElementById('feedback-message');
const quizBluebotImg = document.getElementById('quiz-bluebot-img');
const finalBluebotImg = document.getElementById('final-bluebot');
const volumeSlider = document.getElementById('volume-slider'); // NOVO ELEMENTO


// --- REFERÊNCIAS DE ÁUDIO ---
const audioClick = document.getElementById('audio-click');
const audioCorrect = document.getElementById('audio-correct');
const audioWrong = document.getElementById('audio-wrong');
const audioBackground = document.getElementById('audio-background'); // RENOMEADO para BG Music (Loop)


// --- VARIÁVEIS DE ESTADO ---
let currentQuestionIndex = 0;
let score = 0;
const DEFAULT_BG_VOLUME = 0.5; // Define o volume inicial da música de fundo

const BLUEBOT_IMAGES = {
    IDLE: 'bluebot_assets/bluebot_idle.png',
    HAPPY: 'bluebot_assets/bluebot_happy.png',
    SAD: 'bluebot_assets/bluebot_sad.png'
};

// --- FUNÇÕES DE UTILIDADE GERAL ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- CONTROLE DE SOM ---

/**
 * Toca um elemento de áudio do DOM (sons de feedback: clique, acerto, erro).
 * Garante que o som seja tocado do início.
 * @param {HTMLAudioElement} audioElement - O elemento <audio> a ser tocado.
 */
function playAudio(audioElement) {
    if (audioElement) {
        // Pausa e reseta para garantir que o som seja tocado do início e não seja cortado.
        audioElement.pause();
        audioElement.currentTime = 0; 
        // Define o volume dos sons de feedback para um valor alto (volume total)
        audioElement.volume = 1.0; 
        audioElement.play().catch(e => {
             // console.warn("Falha ao tocar áudio:", audioElement.id, e);
        });
    }
}

/**
 * Controla a reprodução da música de fundo (audioBackground).
 * @param {boolean} shouldPlay - Se deve tocar (true) ou pausar (false).
 */
function toggleBackgroundMusic(shouldPlay) {
    if (shouldPlay) {
        // Tenta tocar a música, definindo volume com o valor do slider
        audioBackground.volume = parseFloat(volumeSlider.value);
        audioBackground.play().catch(e => {
            // console.warn("Falha ao iniciar música de fundo:", e);
            // Em navegadores modernos, a reprodução automática pode falhar se não houver interação prévia.
        });
    } else {
        audioBackground.pause();
        audioBackground.currentTime = 0; // Reseta a música
    }
}

/**
 * Lida com a mudança de valor do slider de volume.
 */
function handleVolumeChange() {
    // Define o volume do áudio de fundo (start_game_sound)
    audioBackground.volume = parseFloat(volumeSlider.value);
    // Salva o volume no armazenamento local para manter a preferência
    localStorage.setItem('gameVolume', volumeSlider.value);
}


// --- LÓGICA DO JOGO ---

/**
 * Define a imagem do Bluebot no quiz e a animação.
 * @param {string} state - 'idle', 'happy', 'sad'
 */
function setBluebotState(state) {
    quizBluebotImg.src = BLUEBOT_IMAGES[state.toUpperCase()];
    quizBluebotImg.classList.remove('bluebot-shake', 'bluebot-bounce', 'floating');

    if (state === 'idle') {
        quizBluebotImg.classList.add('floating'); 
    } else if (state === 'happy') {
        quizBluebotImg.classList.add('bluebot-bounce');
    } else if (state === 'sad') {
        quizBluebotImg.classList.add('bluebot-shake');
    }
}

/**
 * Prepara e exibe a pergunta atual.
 */
function showQuestion() {
    setBluebotState('idle'); 

    const q = questions[currentQuestionIndex];
    questionText.textContent = q.question;
    bluebotPhrase.textContent = q.bluebotPhrase;
    questionCounter.textContent = `QUESTÃO ${currentQuestionIndex + 1}/6`;
    scoreDisplay.textContent = `SCORE: ${score}`;

    answerButtonsDiv.innerHTML = '';
    const shuffledOptions = shuffleArray([...q.options]);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('answer-button');
        button.dataset.correct = option.isCorrect;
        
        button.addEventListener('click', (e) => {
            // Toca o som de clique
            playAudio(audioClick); 

            if (!e.target.disabled) {
                 handleAnswer(button, option.isCorrect);
            }
        });
        answerButtonsDiv.appendChild(button);
    });

    feedbackMessage.classList.remove('show-feedback', 'feedback-success', 'feedback-error');
}

/**
 * Lida com a resposta do jogador.
 */
function handleAnswer(selectedButton, isCorrect) {
    // Desabilita todos os botões
    Array.from(answerButtonsDiv.children).forEach(button => button.disabled = true);

    const correctButton = Array.from(answerButtonsDiv.children).find(btn => btn.dataset.correct === 'true');

    if (isCorrect) {
        score++;
        selectedButton.classList.add('correct');
        playAudio(audioCorrect); // Toca som de acerto
        feedbackMessage.textContent = "Upgrade Concluído! Você está com a performance máxima.";
        feedbackMessage.classList.add('show-feedback', 'feedback-success');
        setBluebotState('happy');
    } else {
        selectedButton.classList.add('wrong');
        correctButton.classList.add('correct'); 
        playAudio(audioWrong); // Toca som de erro (Corrigido)
        feedbackMessage.textContent = "Bug Encontrado. Hora do Debug e do aprendizado!";
        feedbackMessage.classList.add('show-feedback', 'feedback-error');
        setBluebotState('sad');
    }

    scoreDisplay.textContent = `SCORE: ${score}`;

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showFinalScreen();
        }
    }, 2000); 
}

/**
 * Exibe a tela final com base na pontuação.
 */
function showFinalScreen() {
    // Para a música de fundo ao sair do quiz
    toggleBackgroundMusic(false); 

    quizScreen.classList.remove('active');
    finalScreen.classList.add('active');
    
    finalScoreDisplay.textContent = score;

    let title, message, color, image;

    if (score >= 5) {
        title = "🚀 SUCESSO NO UPGRADE!";
        message = "Hardware 100% Otimizado! Você é um Top Performer no cuidado. Seu Check-up foi excelente!";
        color = 'var(--color-success)';
        image = BLUEBOT_IMAGES.HAPPY;
        playAudio(audioCorrect); // Toca som de vitória
    } else if (score >= 3) {
        title = "🔄 RECONFIGURAR E TENTAR";
        message = "Quase lá! Reconfigure sua estratégia e tente um novo Build. O conhecimento é a chave do Upgrade.";
        color = 'var(--color-primary-blue)';
        image = BLUEBOT_IMAGES.IDLE;
        // Não toca som específico para placar intermediário.
    } else {
        title = "⚠️ SISTEMA EM MODO DE SEGURANÇA";
        message = "Vamos rodar o diagnóstico de novo? O Check-up é essencial! Revise o material e otimize seu score.";
        color = 'var(--color-error)';
        image = BLUEBOT_IMAGES.SAD;
        playAudio(audioWrong); // Toca som de derrota
    }

    finalTitle.textContent = title;
    finalMessage.textContent = message;
    finalTitle.style.color = color;
    restartButton.style.backgroundColor = color;
    restartButton.textContent = title.includes('SUCESSO') ? 'JOGAR NOVAMENTE' : 'TENTAR NOVO DIAGNÓSTICO';
    finalBluebotImg.src = image;
}

/**
 * Inicia o jogo, resetando o estado.
 */
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    
    shuffleArray(questions);
    
    startScreen.classList.remove('active');
    finalScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    // Inicia a música de fundo (start_game_sound.mp3)
    toggleBackgroundMusic(true); 

    showQuestion();
}

// --- INICIALIZAÇÃO E EVENT LISTENERS ---

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Adiciona o listener para o controle de volume
volumeSlider.addEventListener('input', handleVolumeChange); 


document.addEventListener('DOMContentLoaded', () => {
    // 1. Tenta carregar o volume salvo
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume !== null) {
        volumeSlider.value = savedVolume;
    } else {
        volumeSlider.value = DEFAULT_BG_VOLUME;
    }
    
    // 2. Garante que o volume inicial seja aplicado ao elemento de áudio
    audioBackground.volume = parseFloat(volumeSlider.value);
    
    // 3. Pré-carrega os áudios, mas a música de fundo só toca após a primeira interação (startGame)
    audioClick.load();
    audioCorrect.load();
    audioWrong.load();
});