// LOGB Animal Personality Quiz - consolidated script

const questions = [
    "In group work, you naturally…",
    "How do you usually solve problems?",
    "Which social setting feels most comfortable to you?",
    "Your friend cries during lunch. You…",
    "Which work style fits you best?",
    "When you start something new, you mostly care about…"
];

const options = [
    ["Take the lead", "Procrastinate and get distracted", "Organize details", "Support others"],
    ["Make a quick decision", "Talk it out with others", "Research details first", "Stay calm and help others feel safe"],
    ["Being in charge", "Big social events", "Small organized group", "One close friend at a time"],
    ["Give solutions immediately", "Make jokes to cheer them up", "Ask gentle questions to understand fully", "Sit with them quietly"],
    ["Fast and decisive", "Creative and flexible", "Organized and detailed", "Steady and supportive"],
    ["Getting it done", "Enjoying it", "Doing it correctly", "Feeling comfortable"]
];

const animals = ["Lion", "Otter", "Beaver", "Golden Retriever"];
const animalKeys = ["lion","otter","beaver","golden"];

const profiles = {
    lion: {
        title: "Lion — The Leader",
        summary: "Lions are confident, decisive, independent, and naturally take charge. They solve problems quickly and seek new challenges.",
        strengths: [
            "Decisive","Goal-oriented","Achievement driven","Efficient","Competitive","Productive",
            "Independent","Risk-taker","Takes initiative","Persistent","Enjoys challenges","Fast-acting","Results-focused"
        ],
        weaknesses: [
            "Impatient","Blunt","Poor listener","Impulsive","Demanding","May prioritize tasks over people",
            "Can be insensitive","May overpower quieter people","Dislikes inactivity","Gets bored with routine"
        ]
    },
    otter: {
        title: "Otter — The Social Motivator",
        summary: "Otters are enthusiastic, expressive, outgoing, and highly social. They enjoy connecting with others and inspiring people.",
        strengths: [
            "Enthusiastic","Optimistic","Expressive","Good communicator","Emotional","Inspirational",
            "Outgoing","Dramatic","Fun-loving","Relationship-focused"
        ],
        weaknesses: [
            "Unrealistic","Not detail-oriented","Disorganized","Impulsive","Reactive","Talks too much",
            "Listens to feelings more than logic","Can attack verbally when pressured"
        ]
    },
    beaver: {
        title: "Beaver — The Analyst",
        summary: "Careful and methodical, Beavers prefer structure and accuracy. They excel at planning and handling complex details.",
        strengths: ["Organized","Detail-oriented","Reliable","Thorough"],
        weaknesses: ["Can be rigid","Overly cautious","Slow to adapt","Perfectionist"]
    },
    golden: {
        title: "Golden Retriever — The Supporter",
        summary: "Golden Retrievers are loyal, patient, empathetic, and dependable. They value harmony and prioritize relationships.",
        strengths: [
            "Patient","Stable","Empathetic","Compassionate","Sensitive to others","Loyal",
            "Dependable","Supportive","Good listener","Team-oriented","Agreeable"
        ],
        weaknesses: [
            "Indecisive","Avoids confrontation","Slow to act","Overly accommodating","May sacrifice results for harmony",
            "Holds grudges","Fears change"
        ]
    }
};

function generateResult(key) {
    const p = profiles[key];
    if (!p) return null;
    return {
        title: p.title,
        overview: p.summary,
        strengths: p.strengths,
        weaknesses: p.weaknesses
    };
}

// state
let userAnswers = Array(questions.length).fill(null);
let currentQuestionIndex = 0;

// DOM refs (script is loaded at end of body)
const quizContainer = document.getElementById('quiz-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const startBtn = document.getElementById('start-quiz');
const resultSection = document.getElementById('result-section');

function updateProgress() {
    const pct = Math.round((currentQuestionIndex / questions.length) * 100);
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

function renderAnswers() {
    answerOptions.innerHTML = '';
    options[currentQuestionIndex].forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'answer-btn';
        btn.setAttribute('data-choice', String(i));
        btn.innerHTML = `<strong>${opt}</strong>`;
        btn.addEventListener('click', () => selectAnswer(i, btn));
        answerOptions.appendChild(btn);
    });

    // restore previous selection
    const prev = userAnswers[currentQuestionIndex];
    if (prev !== null) {
        const btn = answerOptions.querySelector(`button[data-choice="${prev}"]`);
        if (btn) btn.classList.add('selected');
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

function selectAnswer(choice, button) {
    Array.from(answerOptions.querySelectorAll('button')).forEach(b => b.classList.remove('selected'));
    button.classList.add('selected');
    userAnswers[currentQuestionIndex] = choice;
    nextBtn.disabled = false;
}

function showQuestion() {
    questionText.innerHTML = `<strong>${questions[currentQuestionIndex]}</strong>`;
    renderAnswers();
    updateProgress();

    if (currentQuestionIndex === 0) {
        backBtn.disabled = true;
        backBtn.setAttribute('aria-hidden', 'true');
    } else {
        backBtn.disabled = false;
        backBtn.removeAttribute('aria-hidden');
    }

    quizContainer.style.display = 'block';
    resultSection.style.display = 'none';
}

function computeScores() {
    const counts = [0, 0, 0, 0];
    userAnswers.forEach(a => {
        if (a !== null && a >= 0 && a < counts.length) counts[a]++;
    });
    return counts;
}

function showResult() {
    const counts = computeScores();
    let best = 0;
    for (let i = 1; i < counts.length; i++) {
        if (counts[i] > counts[best]) best = i;
    }
    const key = animalKeys[best];
    const result = generateResult(key);
    if (!result) return;

    quizContainer.style.display = 'none';
    resultSection.style.display = 'block';

    // image map for animal cards
    const imageMap = {
        lion: 'img/Personality-Animal-answer-Lion_3.jpg',
        otter: 'img/Personality-Animal-answer-otter_2.jpg',
        beaver: 'img/Personality-Animal-answer-Beaver_2.jpg',
        golden: 'img/Personality-Animal-answer-Golden_2.jpg'
    };

    // build animal cards bar (highlight dominant)
    const animalsHtml = animalKeys.map((k, idx) => {
        const name = animals[idx];
        const img = imageMap[k] || '';
        const dominantClass = (k === key) ? 'dominant' : '';
        return `
            <div class="result-animal-card ${dominantClass}">
                <img src="${img}" alt="${name}">
                <div class="animal-name">${name}</div>
            </div>
        `;
    }).join('');

    resultSection.innerHTML = `
        <div class="result-card">
            <h2>You are a ${result.title}</h2>
            <p><strong>${result.overview}</strong></p>

            <div class="result-animals">${animalsHtml}</div>

            <div class="result-columns">
                <div>
                    <h3>Strengths</h3>
                    <ul>${result.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div>
                    <h3>Weaknesses</h3>
                    <ul>${result.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
                </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px">
                <button id="retake-btn" class="btn secondary">Retake Quiz</button>
                <button id="backhome-btn" class="btn">Back to Home</button>
            </div>
        </div>
    `;

    const retake = document.getElementById('retake-btn');
    if (retake) retake.addEventListener('click', restart);
    const backhome = document.getElementById('backhome-btn');
    if (backhome) backhome.addEventListener('click', backToHome);
}

function backToHome() {
    // Reset state and show the hero/home view
    userAnswers = Array(questions.length).fill(null);
    currentQuestionIndex = 0;
    if (nextBtn) nextBtn.disabled = true;
    const hero = document.getElementById('hero');
    const legend = document.getElementById('legend');
    if (hero) hero.style.display = 'block';
    if (legend) legend.style.display = 'block';
    if (quizContainer) quizContainer.style.display = 'none';
    if (resultSection) resultSection.style.display = 'none';
    if (hero) hero.scrollIntoView({behavior: 'smooth'});
}

function nextHandler() {
    if (userAnswers[currentQuestionIndex] === null) return;
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

function backHandler() {
    if (currentQuestionIndex === 0) return;
    currentQuestionIndex--;
    showQuestion();
}

function restart() {
    userAnswers = Array(questions.length).fill(null);
    currentQuestionIndex = 0;
    nextBtn.disabled = true;
    const hero = document.getElementById('hero');
    const legend = document.getElementById('legend');
    if (hero) hero.style.display = 'none';
    if (legend) legend.style.display = 'none';
    showQuestion();
    quizContainer.scrollIntoView({behavior: 'smooth'});
}

if (startBtn) startBtn.addEventListener('click', () => {
    const hero = document.getElementById('hero');
    const legend = document.getElementById('legend');
    if (hero) hero.style.display = 'none';
    if (legend) legend.style.display = 'none';
    quizContainer.style.display = 'block';
    showQuestion();
    quizContainer.scrollIntoView({behavior: 'smooth'});
});

if (backBtn) backBtn.addEventListener('click', backHandler);
if (nextBtn) nextBtn.addEventListener('click', nextHandler);

if (quizContainer) quizContainer.style.display = 'none';
if (resultSection) resultSection.style.display = 'none';
updateProgress();