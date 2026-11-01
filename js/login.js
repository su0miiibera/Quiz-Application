function startQuiz() {

    let username =
        document.getElementById("username").value.trim();

    let studentCode =
        document.getElementById("studentCode").value.trim();

    let subject =
        document.getElementById("topic").value.trim();

    let questionCount =
        Number(
            document.getElementById("question-count").value
        );


    if (username === "") {

        alert("Please enter your name.");
        return;

    }


    if (studentCode === "") {

        alert("Please enter your student code.");
        return;

    }


    /* Student Code Format */

    let codePattern =
        /^BWU\/MCA\/26\/\d{3}$/;


    if (!codePattern.test(studentCode)) {

        alert(
            "Invalid Student Code.\n\n" +
            "Use this format: BWU/MCA/26/001"
        );

        return;

    }


    if (subject === "") {

        alert("Please enter your topic.");
        return;

    }


    if (
        questionCount < 6 ||
        questionCount > 100
    ) {

        alert(
            "Please choose between 6 and 100 questions."
        );

        return;

    }


    localStorage.setItem(
        "username",
        username
    );

    localStorage.setItem(
        "studentCode",
        studentCode
    );

    localStorage.setItem(
        "subject",
        subject
    );

    localStorage.setItem(
        "questionCount",
        questionCount
    );


    window.location.href =
        "quiz.html";

}