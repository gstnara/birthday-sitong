/* =========================================================
   SITONG.EXE
   FINAL INTERACTIVE SCRIPT
========================================================= */

let currentScene = 1;


/* =========================================================
   SCENE CONTROL
========================================================= */

function showScene(number) {

    document.querySelectorAll(".scene").forEach(scene => {
        scene.classList.remove("active");
    });

    const target = document.getElementById("scene" + number);

    if (!target) {
        console.error("Scene tidak ditemukan:", number);
        return;
    }

    target.classList.add("active");

    currentScene = number;

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    if (number === 3) {
        initMemoryGame();
    }

    if (number === 5) {
        initScrambleGame();
    }

    if (number === 6) {
        initObjectGame();
    }

    if (number === 14) {
        startMessage();
    }
}


function nextScene() {

    if (currentScene < 16) {
        showScene(currentScene + 1);
    }
}

function previousScene() {
    if (currentScene > 1) {
        showScene(currentScene - 1);
    }
}


/* =========================================================
   OPENING
========================================================= */

const introText =
    "birthday protocol detected... preparing something special.";

let introIndex = 0;

const typingText =
    document.getElementById("typingText");

const loadingBar =
    document.getElementById("loadingBar");

const loadingPercent =
    document.getElementById("loadingPercent");

const enterButton =
    document.getElementById("enterButton");


function typeIntro() {

    if (!typingText) return;

    if (introIndex < introText.length) {

        typingText.textContent +=
            introText[introIndex];

        introIndex++;

        setTimeout(typeIntro, 35);

    }
}


function startLoading() {

    let value = 0;

    const interval = setInterval(() => {

        value++;

        loadingBar.style.width =
            value + "%";

        loadingPercent.textContent =
            String(value).padStart(2, "0");

        if (value >= 100) {

            clearInterval(interval);

            enterButton.disabled = false;
        }

    }, 22);
}


window.addEventListener("load", () => {

    setTimeout(typeIntro, 500);

    setTimeout(startLoading, 800);

});


function startExperience() {

    showScene(2);

    startIdentification();
}

/* =========================================================
   IDENTIFICATION
========================================================= */

let identificationStarted = false;

function startIdentification() {

    if (identificationStarted) return;

    identificationStarted = true;

    const card =
        document.getElementById("idCard");

    const status =
        document.getElementById("scanStatus");

    const message =
        document.getElementById("scanMessage");

    const verification =
        document.getElementById("verificationText");

    const continueButton =
        document.getElementById("identityContinue");

    const messages = [
        "ANALYZING PERSONAL DATA",
        "MATCHING BIRTHDAY RECORD",
        "CHECKING DATE: 25.08",
        "VERIFYING SUBJECT",
        "PERSON IDENTIFIED"
    ];

    let index = 0;

    const cycle = setInterval(() => {

        message.textContent =
            messages[index];

        index++;

        if (index >= messages.length) {

            clearInterval(cycle);

            card.classList.add("verified");

            status.textContent =
                "VERIFIED";

            verification.textContent =
                "Identity confirmed.";

            // MUNCULKAN TEKS PENGANTAR & TOMBOL MULAI
            document.getElementById("noticeText").classList.remove("hidden");
            continueButton.classList.remove("hidden");
        }

    }, 650);
}

/* =========================================================
   GAME 1 — MEMORY MATCH
========================================================= */

const memorySymbols = [
    "✦",
    "○",
    "♡",
    "◇",
    "✺"
];

let memoryFirst = null;
let memorySecond = null;
let memoryLock = false;
let memoryMatches = 0;


function initMemoryGame() {

    const grid =
        document.getElementById("memoryGrid");

    if (!grid) return;

    if (grid.children.length > 0) return;

    const cards = [
        ...memorySymbols,
        ...memorySymbols
    ].sort(() => Math.random() - .5);

    cards.forEach(symbol => {

        const card =
            document.createElement("button");

        card.className = "memory-card";
        card.type = "button";

        card.innerHTML = `
            <div class="card-front">+</div>
            <div class="card-back">${symbol}</div>
        `;

        card.dataset.value = symbol;

        card.addEventListener(
            "click",
            () => flipMemoryCard(card)
        );

        grid.appendChild(card);
    });
}


function flipMemoryCard(card) {

    if (
        memoryLock ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");

    if (!memoryFirst) {

        memoryFirst = card;

        return;
    }

    memorySecond = card;

    memoryLock = true;

    if (
        memoryFirst.dataset.value ===
        memorySecond.dataset.value
    ) {

        memoryFirst.classList.add("matched");
        memorySecond.classList.add("matched");

        memoryMatches++;

        document.getElementById("memoryFeedback")
            .textContent =
            `${memoryMatches} / 8 MATCHED`;

        memoryFirst = null;
        memorySecond = null;

        memoryLock = false;

        if (memoryMatches === 5) {

            document.getElementById("memoryFeedback")
                .textContent =
                "MEMORY RESTORED ✓";

            setTimeout(() => {
                showScene(4);
            }, 1200);
        }

    } else {

        setTimeout(() => {

            memoryFirst.classList.remove("flipped");
            memorySecond.classList.remove("flipped");

            memoryFirst = null;
            memorySecond = null;

            memoryLock = false;

        }, 700);
    }
}


/* =========================================================
   GAME 2 — FIND DIFFERENCE
========================================================= */

let differencesFound = [];


function findDifference(number) {

    if (differencesFound.includes(number)) {
        return;
    }

    differencesFound.push(number);

    const button =
        document.querySelectorAll(
            ".difference-options button"
        )[number - 1];

    button.classList.add("selected");

    document.getElementById("differenceCount")
        .textContent =
        `${differencesFound.length} / 3`;

    document.getElementById("differenceFeedback")
        .textContent =
        "FOUND.";

    if (differencesFound.length === 3) {

        document.getElementById("differenceFeedback")
            .textContent =
            "VISUAL ANALYSIS COMPLETE ✓";

        setTimeout(() => {
            showScene(5);
        }, 1200);
    }
}


/* =========================================================
   GAME 3 — UNSCRAMBLE
========================================================= */

const scrambleWord = [
    "S",
    "I",
    "T",
    "O",
    "N",
    "G"
];

let scrambleSelected = [];


function initScrambleGame() {

    const slots =
        document.getElementById("scrambleSlots");

    const letters =
        document.getElementById("scrambleLetters");

    if (!slots || !letters) return;

    slots.innerHTML = "";
    letters.innerHTML = "";

    scrambleSelected = [];

    scrambleWord.forEach(() => {

        const slot =
            document.createElement("div");

        slot.className = "scramble-slot";

        slot.textContent = "_";

        slots.appendChild(slot);
    });

    const shuffled =
        [...scrambleWord]
            .sort(() => Math.random() - .5);

    shuffled.forEach((letter, index) => {

        const button =
            document.createElement("button");

        button.className = "letter-button";
        button.textContent = letter;

        button.addEventListener(
            "click",
            () => selectLetter(button, letter)
        );

        letters.appendChild(button);
    });
}


function selectLetter(button, letter) {

    if (button.classList.contains("used")) {
        return;
    }

    button.classList.add("used");

    scrambleSelected.push(letter);

    const slots =
        document.querySelectorAll(
            ".scramble-slot"
        );

    slots[scrambleSelected.length - 1]
        .textContent = letter;

    if (
        scrambleSelected.length ===
        scrambleWord.length
    ) {

        const result =
            scrambleSelected.join("");

        if (result === "SITONG") {

            document.getElementById("scrambleFeedback")
                .textContent =
                "FILE RESTORED ✓";

            setTimeout(() => {
                showScene(6);
            }, 1200);

        } else {

            document.getElementById("scrambleFeedback")
                .textContent =
                "WRONG SEQUENCE. TRY AGAIN.";

            setTimeout(() => {
                initScrambleGame();
            }, 800);
        }
    }
}


/* =========================================================
   GAME 4 — VISUAL SEARCH
========================================================= */

const objectTypes = [
    "FLOWER",
    "KOTAK",
    "MOON",
    "STAR"
];

const objectSymbols = {
    FLOWER: "✿",
    KOTAK: "□",
    MOON: "◐",
    STAR: "✦"
};

let objectRound = 1;
let targetObject = "";


function initObjectGame() {

    objectRound = 1;

    createObjectRound();
}


function createObjectRound() {

    const arena =
        document.getElementById("objectArena");

    const target =
        document.getElementById("targetName");

    const round =
        document.getElementById("roundCounter");

    if (!arena) return;

    arena.innerHTML = "";

    targetObject =
        objectTypes[
            Math.floor(
                Math.random() * objectTypes.length
            )
        ];

    target.textContent =
        targetObject;

    round.textContent =
        `ROUND ${objectRound} / 3`;

    const items = [];

    for (let i = 0; i < 9; i++) {

        let type;

        if (i === 0) {

            type = targetObject;

        } else {

            type =
                objectTypes[
                    Math.floor(
                        Math.random() *
                        objectTypes.length
                    )
                ];

            if (
                type === targetObject &&
                Math.random() > .25
            ) {
                type =
                    objectTypes[
                        Math.floor(
                            Math.random() *
                            objectTypes.length
                        )
                    ];
            }
        }

        items.push(type);
    }

    items.sort(() => Math.random() - .5);

    items.forEach(type => {

        const object =
            document.createElement("button");

        object.className = "object";
        object.type = "button";

        object.textContent =
            objectSymbols[type];

        object.dataset.type = type;

        object.style.left =
            Math.random() * 82 + 4 + "%";

        object.style.top =
            Math.random() * 75 + 5 + "%";

        object.addEventListener(
            "click",
            () => objectClicked(object)
        );

        arena.appendChild(object);
    });
}


function objectClicked(object) {

    const feedback =
        document.getElementById("objectFeedback");

    if (
        object.dataset.type ===
        targetObject
    ) {

        object.classList.add("correct-object");

        feedback.textContent =
            "FOUND ✓";

        if (objectRound >= 3) {

            feedback.textContent =
                "VISUAL SEARCH COMPLETE ✓";

            setTimeout(() => {
                showScene(7);
            }, 1000);

        } else {

            objectRound++;

            setTimeout(() => {
                createObjectRound();
            }, 650);
        }

    } else {

        feedback.textContent =
            "NOT THAT ONE.";

        object.animate(
            [
                { transform: "translateX(-4px)" },
                { transform: "translateX(4px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 250
            }
        );
    }
}


/* =========================================================
   GAME 5 — PASSWORD LOCK
========================================================= */

let enteredCode = "";


function pressKey(number) {

    if (enteredCode.length >= 4) {
        return;
    }

    enteredCode += number;

    updateCodeDisplay();

    if (enteredCode.length === 4) {

        setTimeout(checkCode, 250);
    }
}


function updateCodeDisplay() {

    const display =
        document.getElementById("codeDisplay");

    const visible =
        enteredCode
            .split("")
            .map(n => n)
            .join(" ");

    const empty =
        "_ ".repeat(
            4 - enteredCode.length
        );

    display.textContent =
        (visible + " " + empty).trim();
}


function clearCode() {

    enteredCode = "";

    updateCodeDisplay();

    document.getElementById("codeFeedback")
        .textContent = "";
}


function checkCode() {

    const feedback =
        document.getElementById("codeFeedback");

    if (enteredCode === "2508") {

        feedback.textContent =
            "ACCESS GRANTED ✓";

        setTimeout(() => {
            showScene(8);
        }, 1200);

    } else {

        feedback.textContent =
            "ACCESS DENIED.\nTRY AGAIN.";

        setTimeout(() => {
            clearCode();
        }, 800);
    }
}


/* =========================================================
   QUIZ 1 — CHAT
========================================================= */

function chatAnswer(button, correct) {

    const feedback =
        document.getElementById("chatFeedback");

    if (!correct) {

        button.classList.remove("wrong");

        void button.offsetWidth;

        button.classList.add("wrong");

        feedback.textContent =
            "hmm...\nthat doesn't sound like us.";

        return;
    }

    button.classList.add("correct");

    feedback.textContent =
        "CORRECT.\n" +
        "communication frequency: low\n" +
        "friendship status: somehow still strong.";

    setTimeout(() => {
        showScene(10);
    }, 2200);
}


/* =========================================================
   QUIZ 2 — FOOD
========================================================= */

function foodAnswer(button, answer) {

    const feedback =
        document.getElementById("foodFeedback");

    button.classList.add("correct");

    if (answer === "C") {

        feedback.textContent =
            "CORRECT.\n\n" +
            "food decision system: FAILED\n" +
            "30 minutes of discussion.\n" +
            "still no decision.";

    } else if (answer === "A") {

        feedback.textContent =
            "HMM.\n\n" +
            "rechecking friendship records...\n" +
            "RESULT: BOTH.";

    } else {

        feedback.textContent =
            "INTERESTING.\n\n" +
            "self-awareness detected.";

    }

    setTimeout(() => {
        showScene(11);
    }, 2500);
}


/* =========================================================
   CAKE
========================================================= */

let cakeActivated = false;


function lightCake() {

    if (cakeActivated) {
        return;
    }

    cakeActivated = true;

    const cake =
        document.getElementById("cake");

    const instruction =
        document.getElementById("cakeInstruction");

    const wish =
        document.getElementById("wishText");

    const continueButton =
        document.getElementById("cakeContinue");

    instruction.textContent =
        "MAKE A WISH.";

    cake.classList.add("lit");

    wish.textContent =
        "make it a good one.";

    /*
        Lilin menyala beberapa detik.
    */

    setTimeout(() => {

        cake.classList.add("extinguished");

        wish.textContent =
            "wish sent.";

        createConfetti();

    }, 4200);

    /*
        Setelah efek selesai,
        tombol lanjut muncul.
    */

    setTimeout(() => {

        continueButton.classList.remove("hidden");

    }, 5200);
}


/* =========================================================
   MESSAGE
========================================================= */

const messageLines = [

    "sebenernya aku jarang ngomong beginian hehe...",

    "tapi makasih ya, beb.",

    "udah jadi salah satu orang yang selalu bisa diandelin.",

    "kita memang ga tiap hari chat, ga tiap hari cerita, dan ga sering-sering banget ketemu.",

    "tapi setiap ketemu, rasanya tetap kayak ga pernah kehilangan cerita.",

    "semoga di umur yang baru ini banyak hal baik yang datang ke kamu, maybe aku ga cukup sering bilang ini, tp aku bnr bnr bnr bnr seneng bgt punya km in my life ^_^"

];

let messageLineIndex = 0;
let messageCharIndex = 0;


function startMessage() {

    const text =
        document.getElementById("messageText");

    const button =
        document.getElementById("messageContinue");

    text.textContent = "";

    button.classList.add("hidden");

    messageLineIndex = 0;

    messageCharIndex = 0;

    typeMessageLine();
}


function typeMessageLine() {

    const text =
        document.getElementById("messageText");

    if (
        messageLineIndex >=
        messageLines.length
    ) {

        document
            .getElementById("messageContinue")
            .classList.remove("hidden");

        return;
    }

    const current =
        messageLines[messageLineIndex];

    if (
        messageCharIndex <
        current.length
    ) {

        text.textContent +=
            current[messageCharIndex];

        messageCharIndex++;

        setTimeout(
            typeMessageLine,
            32
        );

    } else {

        messageLineIndex++;

        messageCharIndex = 0;

        setTimeout(() => {

            text.textContent += "\n";

            typeMessageLine();

        }, 500);
    }
}

/* =========================================================
   BIRTHDAY WISH
========================================================= */

function birthdayWish(button) {

    const feedback =
        document.getElementById("wishFeedback");

    const quickCheck =
        document.getElementById("quickCheck");

    const dealScreen =
        document.getElementById("dealScreen");

    const buttons =
        quickCheck.querySelectorAll(".quiz-options button");

    // Tandai pilihan yang dipilih
    buttons.forEach(btn => {
        btn.classList.remove("correct");
    });

    button.classList.add("correct");

    const choice =
        button.querySelector("span").textContent;

    if (choice === "A") {

        feedback.textContent =
            "VALID.\n\n" +
            "system agrees. uang memang selalu berguna.";

    } else if (choice === "B") {

        feedback.textContent =
            "GOOD CHOICE.\n\n" +
            "travel mode: ACTIVATED.";

    } else if (choice === "C") {

        feedback.textContent =
            "UNDERSTANDABLE.\n\n" +
            "semoga tahun ini hidupmu lebih ringan.";

    } else if (choice === "D") {

        feedback.textContent =
            "HAHA.\n\n" +
            "honest answer detected.";

    }

    setTimeout(() => {

        quickCheck.classList.add("hidden");

        dealScreen.classList.remove("hidden");

    }, 1800);
}

/* =========================================================
   FINAL
========================================================= */

function finishBirthday() {

    createConfetti();

    setTimeout(() => {
        showScene(16);
    }, 900);
}


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti() {

    const container =
        document.getElementById("particles");

    if (!container) return;

    const pieces = 55;

    for (let i = 0; i < pieces; i++) {

        const piece =
            document.createElement("span");

        piece.className = "confetti";

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.background =
            [
                "#9b6875",
                "#d8b7bc",
                "#c8b9a8",
                "#e5d4c8"
            ][
                Math.floor(
                    Math.random() * 4
                )
            ];

        piece.style.animationDuration =
            (Math.random() * 1.5 + 2.5) + "s";

        piece.style.animationDelay =
            Math.random() * .3 + "s";

        container.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 4500);
    }
}

