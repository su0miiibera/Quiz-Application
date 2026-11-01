let username =
    localStorage.getItem("username");

let subject =
    localStorage.getItem("subject");

let score =
    Number(localStorage.getItem("score"));

let total =
    Number(localStorage.getItem("total"));


let percentage =
    Math.round((score / total) * 100);


// Grade

let grade;

if (percentage >= 90) {
    grade = "A+";
}
else if (percentage >= 80) {
    grade = "A";
}
else if (percentage >= 70) {
    grade = "B";
}
else if (percentage >= 60) {
    grade = "C";
}
else if (percentage >= 50) {
    grade = "D";
}
else {
    grade = "F";
}


// Subject formatting

let subjectName =
    subject.replaceAll("_", " ");

subjectName =
    subjectName
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase()
            + word.slice(1)
        )
        .join(" ");


// Display Certificate

document.getElementById(
    "certificate-name"
).innerText = username;


document.getElementById(
    "certificate-subject"
).innerText = subjectName;


document.getElementById(
    "certificate-percentage"
).innerText = percentage + "%";


document.getElementById(
    "certificate-grade"
).innerText = grade;


// Date

let today = new Date();

let formattedDate =
    today.toLocaleDateString();

document.getElementById(
    "certificate-date"
).innerText = formattedDate;


// Print

function printCertificate() {

    window.print();

}


// Download

function downloadCertificate() {

    window.print();

}


// Back

function backToResult() {

    window.location.href = "result.html";

}