let gridSize = 3;
let pieces = [];
let correctOrder = [];
let moves = 0;
let timerInterval;
let secondsElapsed = 0;

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const puzzleContainer = document.getElementById("puzzle-container");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const successMessage = document.getElementById("success-message");
const startButton = document.getElementById("start-button");
const gridSizeSelect = document.getElementById("grid-size");
const resetButton = document.getElementById("reset-button");
const playAgainButton = document.getElementById("play-again");

// Start the game
startButton.addEventListener("click", () => {
    gridSize = parseInt(gridSizeSelect.value, 10);
    welcomeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    moves = 0;
    resetTimer();
    initializeGame();
});

// Handle image upload
document.getElementById("upload-image").addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            initializeGame(reader.result);
        };
        reader.readAsDataURL(file);
    }
}

// Initialize game
function initializeGame(imageSrc) {
    puzzleContainer.innerHTML = "";
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        const pieceWidth = img.width / gridSize;
        const pieceHeight = img.height / gridSize;
        pieces = [];
        correctOrder = [];

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const div = document.createElement("div");
                div.classList.add("puzzle-piece");
                div.style.backgroundImage = `url(${img.src})`;
                div.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
                div.style.backgroundPosition = `${-x * 100}% ${-y * 100}%`;
                div.draggable = true;
                div.dataset.index = pieces.length;

                div.addEventListener("dragstart", handleDragStart);
                div.addEventListener("dragover", handleDragOver);
                div.addEventListener("drop", handleDrop);

                pieces.push(div);
                correctOrder.push(pieces.length - 1);
                puzzleContainer.appendChild(div);
            }
        }

        shufflePieces();
        startTimer();
    };
}

// Shuffle pieces
function shufflePieces() {
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    shuffledPieces.forEach(piece => puzzleContainer.appendChild(piece));
}

// Drag-and-drop handlers
let draggedPiece = null;

function handleDragStart(event) {
    draggedPiece = event.target;
    setTimeout(() => (draggedPiece.style.visibility = "hidden"), 0);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const targetPiece = event.target;

    if (draggedPiece && targetPiece !== draggedPiece) {
        const draggedIndex = Array.from(puzzleContainer.children).indexOf(draggedPiece);
        const targetIndex = Array.from(puzzleContainer.children).indexOf(targetPiece);

        puzzleContainer.insertBefore(draggedPiece, targetPiece);
        puzzleContainer.insertBefore(targetPiece, puzzleContainer.children[draggedIndex]);

        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        checkCompletion();
    }

    draggedPiece.style.visibility = "visible";
    draggedPiece = null;
}

// Check if puzzle is solved
function checkCompletion() {
    const currentOrder = Array.from(puzzleContainer.children).map(child => parseInt(child.dataset.index, 10));
    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        clearInterval(timerInterval);
        gameScreen.classList.add("hidden");
        successMessage.classList.remove("hidden");
    }
}

// Timer functions
function resetTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerDisplay.textContent = "Time: 00:00";
}

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        timerDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }, 1000);
}

// Reset game
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);

function resetGame() {
    clearInterval(timerInterval);
    gameScreen.classList.add("hidden");
    successMessage.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
    document.getElementById("upload-image").value = "";
}
