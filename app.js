let category = "dev"

function getJoke() {
    randomFact();
}

function animal() {
    category = "animal";
    randomFact();
}

function career() {
    category = "career";
    randomFact();
}

function celebrity() {
    category = "celebrity";
    randomFact();
}

function dev() {
    category = "dev";
    randomFact();
}

function explicit() {
    category = "explicit";
    randomFact();
}

function fashion() {
    category = "fashion";
    randomFact();
}

function food() {
    category = "food";
    randomFact();
}

function history() {
    category = "history";
    randomFact();
}

function money() {
    category = "money";
    randomFact();
}

function movie() {
    category = "movie";
    randomFact();
}

function music() {
    category = "music";
    randomFact();
}

function political() {
    category = "political";
    randomFact();
}

function religion() {
category = "religion";
    randomFact();
}

function science() {
    category = "science";
    randomFact();
}

function sport() {
    category = "sport";
    randomFact();
}

function travel() {
    category = "travel";
    randomFact();
}


function randomFact() {
    // We call the Web Service via AJAX
    var xmlhttp = new XMLHttpRequest();
    var url = "https://api.chucknorris.io/jokes/random?category=" + category;
    console.log(url);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            // We parse the JSON response
            parseJson(json);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function parseJson(json) {
    var fact = "<b>" + json["value"] + "</b>";
    document.getElementById("data").innerHTML = fact;
}

// Finally we add a click event listener on the logo of Chuck Norris
// to load a new random fact when the user will click on it
document.getElementById("logo").addEventListener("click", function () {
    randomFact();
});

randomFact();