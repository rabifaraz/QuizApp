var firebaseConfig = {
  apiKey: "AIzaSyCqTXiRBEnMHZGEu14uE_57sslvcwdlV_I",
  authDomain: "a7layout-7ed56.firebaseapp.com",
  databaseURL: "https://a7layout-7ed56-default-rtdb.firebaseio.com",
  projectId: "a7layout-7ed56",
  storageBucket: "a7layout-7ed56.appspot.com",
  messagingSenderId: "1059789910437",
  appId: "1:1059789910437:web:017aa189a695f215a6b84c"
};

var app = firebase.initializeApp(firebaseConfig);


var container = document.querySelector('.container');
var questionBox = document.querySelector('.question');
var choicesBox = document.querySelector('.choices');
var nextBtn = document.querySelector('.nextBtn');
var scoreCard = document.querySelector('.scoreCard');
var percentageCard = document.querySelector('.percentageCard');
var alert = document.querySelector('.alert');
var startBtn = document.querySelector('.startBtn');
var timer = document.querySelector('.timer');
// var tick = document.querySelector('.tick');

var quiz;

firebase.database().ref('questions').once('value',function(data){
    quiz = Object.values(data.val()).map(val => ({
        question: val.question,
        choices: val.choices,
        answer: val.choices[val.answer]
    }));
})
// Making Variables
let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;
let timeLeft = 59;
let timerID = null;

// Arrow Function to Show Questions
function showQuestions() {
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;

    choicesBox.textContent = "";
    let selectedChoiceIndex = -1;
    for (let i = 0; i < questionDetails.choices.length; i++) {
        const currentChoice = questionDetails.choices[i];
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = currentChoice;
        choiceDiv.classList.add('choice');
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener('click', () => {
            if (selectedChoiceIndex !== -1) {
                // Clear the selection from other choices
                document.querySelectorAll('.choice')[selectedChoiceIndex].classList.remove('selected');
            }

            choiceDiv.classList.add('selected');
            selectedChoiceIndex = i;
        });
    }

    if(currentQuestionIndex < quiz.length){
        startTimer();
    }
}

// Function to check answers
function checkAnswer() {
    const selectedChoice = document.querySelector('.choice.selected');
    if (selectedChoice.textContent === quiz[currentQuestionIndex].answer) {
        score++;
    }
    timeLeft = 59;
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
        showQuestions();
    } else {
        stopTimer();
        showScore();
    }
}

// Function to show score
function showScore() {
    questionBox.textContent = "";
    choicesBox.textContent = "";
    scoreCard.textContent = `You Scored ${score} out of ${quiz.length}!`;
    percentageCard.textContent = `Percentage: ${(score * 100) / quiz.length}%`;
    displayAlert("You have completed this quiz!");
    nextBtn.textContent = "Play Again";
    quizOver = true;
    timer.style.display = "none";
    // if (tickImage) {
    //     tickImage.style.display = "block";
    // }

}

// Function to Show Alert
function displayAlert(msg) {
    alert.style.display = "block";
    alert.textContent = msg;
    setTimeout(()=>{
        alert.style.display = "none";
    }, 2000);
}

// Function to Start Timer
function startTimer() {
    clearInterval(timerID); // Check for any exist timers
    timer.textContent = timeLeft;

    function countDown() {
        
        if (timeLeft === 0) {
            stopTimer();
            currentQuestionIndex++;
            if (currentQuestionIndex < quiz.length) {
                timeLeft = 59; // Reset the timer
                showQuestions();
                startTimer(); // Restart the timer
            } else {
                showScore();
            }
        }else{
            timeLeft--;
            timer.textContent = timeLeft;
        }
    }
    timerID = setInterval(countDown, 1000);
}

// Function to Stop Timer
function stopTimer() {
    clearInterval(timerID);
}

// Function to shuffle question
function shuffleQuestions() {
    for(let i=quiz.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [quiz[i], quiz[j]] = [quiz[j], quiz[i]];
    }
    currentQuestionIndex = 0;
    showQuestions();
}

// Function to Start Quiz
function startQuiz() {
    timeLeft = 59;
    timer.style.display = "flex";
    shuffleQuestions();
}

// Adding Event Listener to Start Button
startBtn.addEventListener('click', ()=>{
    startBtn.style.display = "none";
    container.style.display = "block";
    startQuiz();
});

nextBtn.addEventListener('click', () => {
    const selectedChoice = document.querySelector('.choice.selected');
    if (!selectedChoice && nextBtn.textContent === "Next") {
        // alert("Select your answer");
        displayAlert("Select your answer first");
        return;
    }
    if (quizOver) {
        nextBtn.textContent = "Next";
        scoreCard.textContent = "";
        currentQuestionIndex = 0;
        quizOver = false;
        score = 0;
        startQuiz();
    }
    else {
        checkAnswer();
    }
});