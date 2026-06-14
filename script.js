const modeDisplay = document.getElementById("modeDisplay");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const newGameBtn = document.getElementById("newGameBtn");
const pvpBtn = document.getElementById("pvp");
const aiBtn = document.getElementById("ai");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const draws = document.getElementById("draws");
const winLine = document.getElementById("winLine");
const easyBtn = document.getElementById("easy");
const mediumBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let gameMode = "";
let xWins = 0;
let oWins = 0;
let drawCount = 0;
let aiDifficulty = "medium";

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];
function selectDifficulty(button){
    easyBtn.classList.remove(
        "selected-difficulty"
    );
    mediumBtn.classList.remove(
        "selected-difficulty"
    );
    hardBtn.classList.remove(
        "selected-difficulty"
    );
    button.classList.add(
        "selected-difficulty"
    );
}
/* Add click listeners only once */
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});
/* Mode Selection */
pvpBtn.addEventListener("click", () => {
    gameMode = "pvp";
    modeDisplay.textContent = "Mode: Player vs Player";
    startGame();
});
aiBtn.addEventListener("click", () => {
    gameMode = "ai";
    modeDisplay.textContent = "Mode: Player vs Computer";
    startGame();
});
easyBtn.addEventListener("click", () => {
    aiDifficulty = "easy";
    selectDifficulty(easyBtn);
});
mediumBtn.addEventListener("click", () => {
    aiDifficulty = "medium";
    selectDifficulty(mediumBtn);
});
hardBtn.addEventListener("click", () => {
    aiDifficulty = "hard";
    selectDifficulty(hardBtn);
});
/* Start Game */
function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });
    winLine.style.display = "none";
    statusText.textContent = "🔵 Player X's Turn";
}
/* Handle Cell Click */
function handleCellClick() {
    const index = this.dataset.index;
    if (board[index] !== "" || !gameActive) {
        return;
    }
    board[index] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add(currentPlayer.toLowerCase());
    checkResult();
}

/* Check Result */
function checkResult() {
    let roundWon = false;
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            roundWon = true;
            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");
            drawWinningLine(combination);
            break;
        }
    }
    if (roundWon) {
        statusText.textContent =
        `🎉 Player ${currentPlayer} Wins!`;

        celebrateWin();

        gameActive = false;
        if (currentPlayer === "X") {
            xWins++;
            scoreX.textContent = xWins;
        } else {
            oWins++;
            scoreO.textContent = oWins;
        }
        return;
    }
    if (!board.includes("")) {
        statusText.textContent = "🤝 It's a Draw!";
        drawCount++;
        draws.textContent = drawCount;
        gameActive = false;
        return;
    }
    changePlayer();
}
/* Change Player */
function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    if (
        gameMode === "ai" &&
        currentPlayer === "O" &&
        gameActive
    ) {
        setTimeout(computerMove, 500);
    }
}
/* Restart Round */
restartBtn.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });
    statusText.textContent = "Player X's Turn";
    if (gameMode === "pvp") {
        modeDisplay.textContent = "Mode: Player vs Player";
    } else if (gameMode === "ai") {
        modeDisplay.textContent = "Mode: Player vs Computer";
    }
    winLine.style.display = "none";
});
/* New Game */
newGameBtn.addEventListener("click", () => {
    xWins = 0;
    oWins = 0;
    drawCount = 0;
    scoreX.textContent = 0;
    scoreO.textContent = 0;
    draws.textContent = 0;
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = false;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });
    modeDisplay.textContent = "Mode: Not Selected";
    statusText.textContent = "Choose a Game Mode";
    winLine.style.display = "none";
});
/* AI Move */
function computerMove() {
    let move;
    if(aiDifficulty === "easy"){
        let emptyCells = [];
        board.forEach((cell,index)=>{
            if(cell===""){
                emptyCells.push(index);
            }
        });
        move =
        emptyCells[
            Math.floor(Math.random()*emptyCells.length)
        ];
    }
    else if(aiDifficulty === "medium"){
        move = findBestMove("O");
        if(move === -1){
            move = findBestMove("X");
        }
        if(move === -1){
            let emptyCells = [];
            board.forEach((cell,index)=>{
                if(cell===""){
                    emptyCells.push(index);
                }
            });
            move =
            emptyCells[
                Math.floor(Math.random()*emptyCells.length)
            ];
        }
    }
    else if(aiDifficulty === "hard"){
        move = findBestMove("O");
        if(move === -1){
            move = findBestMove("X");
        }
        if(move === -1){
            if(board[4] === ""){
                move = 4;
            }
            else{
                let corners =
                [0,2,6,8].filter(
                    index => board[index] === ""
                );
                if(corners.length > 0){
                    move =
                    corners[
                        Math.floor(
                            Math.random() *
                            corners.length
                        )
                    ];
                }
                else{
                    let emptyCells = [];
                    board.forEach((cell,index)=>{
                        if(cell===""){
                            emptyCells.push(index);
                        }
                    });
                    move =
                    emptyCells[
                        Math.floor(
                            Math.random() *
                            emptyCells.length
                        )
                    ];
                }
            }
        }
    }
    board[move] = "O";
    cells[move].textContent = "O";
    cells[move].classList.add("o");
    checkResult();
}
/* Find Best Move */
function findBestMove(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        const values = [
            board[a],
            board[b],
            board[c]
        ];
        const playerCount =
            values.filter(value => value === player).length;
        const emptyCount =
            values.filter(value => value === "").length;
        if (playerCount === 2 && emptyCount === 1) {
            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }
    return -1;
}
function celebrateWin() {
    const duration = 2000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: 25,
            spread: 70,
            origin: {
                x: Math.random(),
                y: Math.random() * 0.5
            }
        });
    }, 250);
}function drawWinningLine(combination){
    const positions = {
        "0,1,2":{
            top:"16%",
            left:"0%",
            width:"100%",
            rotate:"0deg"
        },
        "3,4,5":{
            top:"50%",
            left:"0%",
            width:"100%",
            rotate:"0deg"
        },
        "6,7,8":{
            top:"84%",
            left:"0%",
            width:"100%",
            rotate:"0deg"
        },
        "0,3,6":{
            top:"50%",
            left:"16%",
            width:"100%",
            rotate:"90deg"
        },
        "1,4,7":{
            top:"50%",
            left:"50%",
            width:"100%",
            rotate:"90deg"
        },
        "2,5,8":{
            top:"50%",
            left:"84%",
            width:"100%",
            rotate:"90deg"
        },
        "0,4,8":{
            top:"50%",
            left:"0%",
            width:"140%",
            rotate:"45deg"
        },
        "2,4,6":{
            top:"50%",
            left:"0%",
            width:"140%",
            rotate:"-45deg"
        }
    };
    const key = combination.join(",");
    const line = positions[key];
    if(!line) return;
    winLine.style.display = "block";
    winLine.style.top = line.top;
    winLine.style.left = line.left;
    winLine.style.width = line.width;
    winLine.style.transform =
    `translateY(-50%) rotate(${line.rotate})`;
}