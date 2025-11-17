const questions = [
    "When working with others, what role do you naturally take?",
    "How do you usually solve problems?",
    "Which social setting feels most comfortable to you?",
    "When you’re under pressure, how do you usually react?",
    "Which work style fits you best?"
];

const options = [
    ["Lead the group", "Bring fun and energy", "Make a detailed plan", "Support the group quietly"],
    ["Make a quick decision", "Talk it out with others", "Research details first", "Stay calm and help others feel safe"],
    ["Being in charge", "Big social events", "Small organized group", "One close friend at a time"],
    ["Try to fix things right away", "Talk it out with people", "Think through every detail", "Stay calm and support the people around you"],
    ["Fast and decisive", "Creative and flexible", "Organized and detailed", "Steady and supportive"]
];

const animals = ["Lion", "Otter", "Beaver", "Golden Retriever"];
const descriptions = [
    "You are a Lion — confident, bold, and a natural leader.",
    "You are an Otter — energetic, social, and enthusiastic.",
    "You are a Beaver — thoughtful, organized, and detail-focused.",
    "You are a Golden Retriever — loyal, calm, and compassionate."
];

let scores = [0, 0, 0, 0];
let qIndex = 0;

function showQuestion() {
    const qBox = document.getElementById("question-box");
    const aBox = document.getElementById("answer-options");
    const progress = document.getElementById("progress");

    qBox.innerHTML = `<strong>${questions[qIndex]}</strong>`;

    aBox.innerHTML = options[qIndex]
        .map((opt, i) => `<button onclick="chooseAnswer(${i})">${opt}</button>`)
        .join("<br><br>");

    progress.textContent = `Question ${qIndex + 1} of ${questions.length}`;
}

function chooseAnswer(choice) {
    scores[choice]++;
    qIndex++;

    if (qIndex < questions.length) showQuestion();
    else showResult();
}

function showResult() {
    const best = calculateBestAnimal(scores);

    document.getElementById("quiz-container").style.display = "none";

    document.getElementById("result-section").innerHTML = `
        <h2>Your Result</h2>
        <p><strong>${animals[best]}</strong></p>
        <p>${descriptions[best]}</p>
        <button onclick="restart()">Retake Quiz</button>
    `;
}

function calculateBestAnimal(scoresList) {
    let maxScore = scoresList[0];
    let bestIndex = 0;

    for (let i = 1; i < scoresList.length; i++) {

        if (scoresList[i] > maxScore) {
            maxScore = scoresList[i];
            bestIndex = i;
        }
    }

    return bestIndex; 
}

function restart() {
    scores = [0, 0, 0, 0];
    qIndex = 0;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("result-section").innerHTML = "";
    showQuestion();
}

window.onload = showQuestion;
