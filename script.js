var container = document.querySelector('.container');
var questionBox = document.querySelector('.question');
var choicesBox = document.querySelector('.choices');
var nextBtn = document.querySelector('.nextBtn');
var scoreCard = document.querySelector('.scoreCard');
var alert = document.querySelector('.alert');
var startBtn = document.querySelector('.startBtn');
var timer = document.querySelector('.timer');
var tick = document.querySelector('.tick');


// Make an array of objects that stores question, choices of question and answer
var quiz = [
    {
        question: "Q. What is JavaScript?",
        choices: ["JavaScript is a scripting language used to make the website interactive", " JavaScript is an assembly language used to make the website interactive", "JavaScript is a compiled language used to make the website interactive","None of the mentioned"],
        answer: "JavaScript is a scripting language used to make the website interactive"
    },
    {
        question: "Q. Which of the following methods is used to access HTML elements using Javascript?",
        choices: ["getElementbyId()", "getElementsByClassName()", "Both A and B", "None of the above"],
        answer: "Both A and B"
    },
    {
        question: "Q. Which of the following is not a CSS box model property?",
        choices: ["margin", "padding", "border-radius", "border-collapse"],
        answer: "border-collapse"
    },
    {
        question: "Q. Which of the following is not a valid way to declare a function in JavaScript?",
        choices: ["function myFunction() {}", " let myFunction = function() {};", "myFunction: function() {}", "const myFunction = () => {};"],
        answer: "myFunction: function() {}"
    },
    {
        question: "Q. Which of the following is not a JavaScript data type?",
        choices: ["string", "boolean", "object", "float"],
        answer: "float"
    },
    {
        question: "Q. Which symbol is used separate JavaScript statements?",
        choices: ["Comma (,)", "Colon (:)", "Hyphen (_)", "Semicolon (;)"],
        answer: "Semicolon (;)"
    },
    {
        question: "Q. JavaScript ignores?",
        choices: ["newlines", "tabs", "spaces", "All of the above"],
        answer: "All of the above"
    },    
    {
        question: "Q. What is the purpose of the this keyword in JavaScript?",
        choices: ["It refers to the current function.", "It refers to the current object.", "It refers to the parent object.", " It is used for comments."],
        answer: "It refers to the current object."
    }
];

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
    displayAlert("You have completed this quiz!");
    nextBtn.textContent = "Play Again";
    quizOver = true;
    timer.style.display = "none";
    if (tickImage) {
        tickImage.style.display = "block";
    }

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