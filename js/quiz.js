let questions = [];

let currentQuestion = 0;

let answers = [];

let username =
    localStorage.getItem("username");

let subject =
    localStorage.getItem("subject");


/* =========================
   QUIZ API
========================= */

const API_KEY =
    "qa_sk_5c1563b44338ca025acbec52498cd672954191c7";


/* =========================
   QUIZ TIMER
========================= */

let totalTime = 150;

let timer;


/* =========================
   WELCOME
========================= */

document.getElementById("welcome").innerText =
    "Hello, " + username + "!";


/* =========================
   SUBJECT MAPPING
========================= */

function getCategory(topic) {

    let value =
        topic.trim().toLowerCase();

    if (value === "python")
        return "Python";

    if (value === "java")
        return "Java";

    if (value === "javascript" ||
        value === "js")
        return "JavaScript";

    if (value === "c++" ||
        value === "cpp")
        return "C++";

    if (value === "sql")
        return "SQL Queries";

    if (value === "mysql")
        return "MySQL";

    if (value === "mongodb")
        return "MongoDB";

    if (value === "react")
        return "React";

    if (value === "node.js" ||
        value === "nodejs")
        return "Node.js";

    if (value === "css")
        return "CSS";

    if (value === "html")
        return "Web Development";

    if (value === "programming")
        return "Programming";

    if (value === "dbms")
        return "Database Design";

    if (value === "database")
        return "Database";

    if (value === "data science")
        return "Data Science";

    if (value === "ai" ||
        value === "artificial intelligence")
        return "Data Science";

    return topic.trim();

}


/* =========================
   LOAD QUIZ
========================= */

async function loadQuiz() {

    try {

        let questionCount =
            Number(
                localStorage.getItem(
                    "questionCount"
                )
            ) || 10;


        if (questionCount < 6)
            questionCount = 6;


        if (questionCount > 100)
            questionCount = 100;


        let category =
            getCategory(subject);


        questions = [];


        /* =========================
           FETCH QUESTIONS
        ========================= */

        let offset = 0;


        while (
            questions.length < questionCount
        ) {

            let remaining =
                questionCount -
                questions.length;


            let limit =
                Math.min(
                    remaining,
                    50
                );


            let url =
                "https://quizapi.io/api/v1/questions" +
                "?category=" +
                encodeURIComponent(category) +
                "&type=MULTIPLE_CHOICE" +
                "&limit=" +
                limit +
                "&offset=" +
                offset +
                "&random=true";


            let response =
                await fetch(
                    url,
                    {
                        headers: {
                            "Authorization":
                                "Bearer " +
                                API_KEY,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "API request failed: " +
                    response.status
                );

            }


            let result =
                await response.json();


            if (
                !result.data ||
                result.data.length === 0
            ) {

                break;

            }


            questions =
                questions.concat(
                    result.data
                );


            offset +=
                result.data.length;


            if (
                result.data.length < limit
            ) {

                break;

            }

        }


        /* =========================
           CHECK QUESTIONS
        ========================= */

        if (
            questions.length === 0
        ) {

            throw new Error(
                "No questions found for " +
                subject
            );

        }


        /* Remove duplicate questions */

        let uniqueQuestions =
            [];

        let questionTexts =
            new Set();


        questions.forEach(
            question => {

                if (
                    !questionTexts.has(
                        question.text
                    )
                ) {

                    questionTexts.add(
                        question.text
                    );

                    uniqueQuestions.push(
                        question
                    );

                }

            }
        );


        questions =
            uniqueQuestions.slice(
                0,
                questionCount
            );


        /* =========================
           ANSWERS ARRAY
        ========================= */

        answers =
            new Array(
                questions.length
            ).fill(null);


        /* =========================
           TIMER
        ========================= */

        totalTime =
            questions.length * 15;


        createQuestionNumbers();

        showQuestion();

        startTimer();

    }


    catch (error) {

        console.log(error);

        document.getElementById(
            "question"
        ).innerText =
            "Unable to load questions.";

        alert(
            "Unable to load questions for " +
            subject +
            "."
        );

    }

}


/* =========================
   QUESTION NUMBERS
========================= */

function createQuestionNumbers() {

    let container =
        document.getElementById(
            "question-numbers"
        );


    container.innerHTML = "";


    questions.forEach(
        (question, index) => {

            let button =
                document.createElement(
                    "button"
                );


            button.className =
                "question-number-btn";


            button.innerText =
                index + 1;


            button.addEventListener(
                "click",
                function () {

                    goToQuestion(index);

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    let question =
        questions[currentQuestion];


    document.getElementById(
        "question-number"
    ).innerText =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;


    document.getElementById(
        "question"
    ).innerText =
        question.text;


    /* =========================
       GET ANSWERS
    ========================= */

    let options =
        question.answers
        .filter(
            answer =>
                answer.text !== null
        );


    /* Random options */

    options.sort(
        () =>
            Math.random() - 0.5
    );


    let optionsContainer =
        document.getElementById(
            "options"
        );


    optionsContainer.innerHTML =
        "";


    options.forEach(
        option => {

            let button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.innerText =
                option.text;


            button.addEventListener(
                "click",
                function () {

                    selectAnswer(
                        button,
                        option.text
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    /* =========================
       SHOW SAVED ANSWER
    ========================= */

    if (
        answers[currentQuestion] !==
        null
    ) {

        let savedAnswer =
            answers[currentQuestion];


        let buttons =
            document.querySelectorAll(
                ".option"
            );


        buttons.forEach(
            button => {

                if (
                    button.innerText ===
                    savedAnswer
                ) {

                    button.classList.add(
                        "selected"
                    );

                }

            }
        );

    }


    updateQuestionNumbers();


    /* Previous button */

    document.getElementById(
        "previous-btn"
    ).disabled =
        currentQuestion === 0;

}


/* =========================
   SELECT ANSWER
========================= */

function selectAnswer(
    button,
    answer
) {

    let buttons =
        document.querySelectorAll(
            ".option"
        );


    buttons.forEach(
        btn => {

            btn.classList.remove(
                "selected"
            );

        }
    );


    button.classList.add(
        "selected"
    );


    answers[currentQuestion] =
        answer;


    updateQuestionNumbers();

}


/* =========================
   QUESTION NAVIGATOR
========================= */

function updateQuestionNumbers() {

    let buttons =
        document.querySelectorAll(
            ".question-number-btn"
        );


    buttons.forEach(
        (button, index) => {

            button.classList.remove(
                "current"
            );

            button.classList.remove(
                "answered"
            );


            if (
                index ===
                currentQuestion
            ) {

                button.classList.add(
                    "current"
                );

            }


            if (
                answers[index] !== null
            ) {

                button.classList.add(
                    "answered"
                );

            }

        }
    );

}


/* =========================
   GO TO QUESTION
========================= */

function goToQuestion(index) {

    currentQuestion =
        index;

    showQuestion();

}


/* =========================
   SAVE ANSWER
========================= */

function saveAnswer() {

    if (
        answers[currentQuestion] ===
        null
    ) {

        alert(
            "Please select an answer first."
        );

        return;

    }


    localStorage.setItem(
        "quizAnswers",
        JSON.stringify(
            answers
        )
    );


    alert(
        "Answer saved successfully!"
    );

}


/* =========================
   NEXT
========================= */

function nextQuestion() {

    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();

    }

    else {

        finishQuiz();

    }

}


/* =========================
   PREVIOUS
========================= */

function previousQuestion() {

    if (
        currentQuestion > 0
    ) {

        currentQuestion--;

        showQuestion();

    }

}


/* =========================
   TIMER
========================= */

function startTimer() {

    updateTimer();


    timer =
        setInterval(
            function () {

                totalTime--;

                updateTimer();


                if (
                    totalTime <= 0
                ) {

                    clearInterval(
                        timer
                    );


                    alert(
                        "Time is over!"
                    );


                    finishQuiz();

                }

            },
            1000
        );

}


/* =========================
   DISPLAY TIMER
========================= */

function updateTimer() {

    let minutes =
        Math.floor(
            totalTime / 60
        );


    let seconds =
        totalTime % 60;


    let displayMinutes =
        String(minutes)
        .padStart(
            2,
            "0"
        );


    let displaySeconds =
        String(seconds)
        .padStart(
            2,
            "0"
        );


    document.getElementById(
        "timer"
    ).innerText =
        displayMinutes +
        ":" +
        displaySeconds;

}


/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {

    clearInterval(
        timer
    );


    let score = 0;


    questions.forEach(
        (question, index) => {

            let correctAnswer =
                question.answers.find(
                    answer =>
                        answer.isCorrect ===
                        true
                );


            if (
                answers[index] ===
                correctAnswer.text
            ) {

                score++;

            }

        }
    );


    localStorage.setItem(
        "score",
        score
    );


    localStorage.setItem(
        "total",
        questions.length
    );


    window.location.href =
        "result.html";

}


/* =========================
   START
========================= */

loadQuiz();