const numberOfQuestions = 5;

const apiURL = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=9&difficulty=easy&type=multiple`;


const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
var data = {};

// async function getData() {
    
//     return data;
// }
async function startQuiz() {
    const response = await fetch(apiURL);
    data = await response.json();
    console.log(data);   
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "NEXT";
    showQuestion();
}
function showQuestion() {
    resetState();
    let currentQuestion = data.results[currentQuestionIndex];
    let questionNumber = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNumber + ". " + currentQuestion.question;
    
    let options = currentQuestion.incorrect_answers;
    options.push(currentQuestion.correct_answer);
    let randomOptions = shuffle(options);

    randomOptions.forEach(option => {
        const li = document.createElement("li");
        li.innerHTML = option;
        li.classList.add("btn");
        answerButtons.appendChild(li);
        if (option === currentQuestion.correct_answer) {
            li.dataset.correct = "true";
        }
        li.addEventListener("click", selectAnswer);
    });
}
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    }
    else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
            
        }
        button.classList.add("disabled");
        
    });
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < numberOfQuestions) {
        handleNextButton();
    }
    else {
        startQuiz();
    }
});

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < numberOfQuestions) {
        showQuestion();
    }
    else {
        showScore();
    }
}
function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${numberOfQuestions}!`;
    nextButton.innerHTML = "PLAY AGAIN";
    nextButton.style.display = "block";
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}
startQuiz();


function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

