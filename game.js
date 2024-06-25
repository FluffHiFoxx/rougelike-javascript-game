const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const difficulty = urlParams.get('difficulty');
const rows = 27
const cols = 54
const wallCount = 30
const timeoutForAnimation = 300
const cantSpawnOnIt = ["gate", "wall", "monster", "chest", "sword", "coin", "bush"]
let gameRunning = true
let intervalId;
let monsterNumber = 0;
let coinNumber = 0;
let chestNumber = 0;
let swordNumber = 0;
let monsterHp = 0;
let heroHp = 0;
let damage = 1;
let difficultyTimer = 0;
if (difficulty === 'Easy') {
    monsterNumber = 5;
    coinNumber = 10;
    chestNumber = 5;
    swordNumber = 1;
    monsterHp = 2;
    heroHp = 12;
    difficultyTimer = 3000;
} else if (difficulty === 'Medium') {
    monsterNumber = 10;
    coinNumber = 7;
    chestNumber = 3;
    swordNumber = 2;
    monsterHp = 3;
    heroHp = 8;
    difficultyTimer = 2000;
} else if (difficulty === 'Hard') {
    monsterNumber = 20;
    coinNumber = 4;
    chestNumber = 1;
    swordNumber = 3;
    monsterHp = 4;
    heroHp = 4;
    difficultyTimer = 1000;
}
let hpDisplayNumber = Math.round(heroHp / 4) - 1;

initGame();

function initGame() {
    this.drawBoard();
    this.drawWalls();
    this.populateBoard();
    this.initKeyUp();
    this.fillStats();
    this.startTimedEvents();
    this.moveCamera()
}

function refreshHpVisualisation (currentHeroHp) {
    let firstPool = document.querySelector('#hp-0')
    let secondPool = document.querySelector('#hp-1')
    let thirdPool = document.querySelector('#hp-2')
    switch (currentHeroHp) {
        case 11:
            thirdPool.classList.remove('hero-hp-4');
            thirdPool.classList.add('hero-hp-3');
            break;
        case 10:
            thirdPool.classList.remove('hero-hp-3');
            thirdPool.classList.add('hero-hp-2');
            break;
        case 9:
            thirdPool.classList.remove('hero-hp-2');
            thirdPool.classList.add('hero-hp-1');
            break;
        case 8:
            thirdPool.classList.remove('hero-hp-1');
            thirdPool.classList.add('hero-hp-0');
            break;
        case 7:
            secondPool.classList.remove('hero-hp-4');
            secondPool.classList.add('hero-hp-3');
            break;
        case 6:
            secondPool.classList.remove('hero-hp-3');
            secondPool.classList.add('hero-hp-2');
            break;
        case 5:
            secondPool.classList.remove('hero-hp-2');
            secondPool.classList.add('hero-hp-1');
            break;
        case 4:
            secondPool.classList.remove('hero-hp-1');
            secondPool.classList.add('hero-hp-0');
            break;
        case 3:
            firstPool.classList.remove('hero-hp-4');
            firstPool.classList.add('hero-hp-3');
            break;
        case 2:
            firstPool.classList.remove('hero-hp-3');
            firstPool.classList.add('hero-hp-2');
            break;
        case 1:
            firstPool.classList.remove('hero-hp-2');
            firstPool.classList.add('hero-hp-1');
            break;
        case 0:
            firstPool.classList.remove('hero-hp-1');
            firstPool.classList.add('hero-hp-0');
            break;
    }
}

function fillStats() {
    let statField = document.querySelector(".stats");
    statField.insertAdjacentHTML(
        'beforeend',
        '<div class="hud-hp"></div>'
    );
    document.querySelector(".hud-hp").setAttribute("data-hp", heroHp)
    statField.insertAdjacentHTML(
        'beforeend',
        '<div class="hud-coins"></div>'
    );
    statField.insertAdjacentHTML(
        'beforeend',
        '<div class="hud-coin-amount">0</div>'
    );

    let hpPool = document.querySelector(".hud-hp")
    for (let hp = 1; hp < heroHp; hp += 4) {
        hpPool.insertAdjacentHTML(
            'beforeend',
            `<div id="hp-${Math.round(hp/4)}" class="hero-hp-4"></div>`
        );
    }
}

function startTimedEvents() {
    if (!intervalId) {
        intervalId = setInterval(moveMonsters, difficultyTimer, monsterNumber)
    }
}

function drawBoard () {
    let gameField = document.querySelector(".game-field");
    this.setGameFieldSize(gameField);
    let cellIndex = 0
    for (let row = 0; row < rows; row++) {
        const rowElement = this.addRow(gameField);
        for (let col = 0; col < cols; col++) {
            this.addCell(rowElement, row, col);
            cellIndex++
        }
    }

}
function drawWalls () {
    let firstAndLastRowAndCol = document.querySelectorAll('[data-row="0"], [data-row="' + (rows - 1) + '"],' +
        '[data-col="0"], [data-col="' + (cols - 1) + '"]')
    for (let element of firstAndLastRowAndCol) {
        element.classList.add('wall')
    }
    let secondCol = Math.round(cols / 3)
    let thirdCol = Math.round((cols / 3) * 2)
    let rowGates = [`${Math.round(rows/6)}`, `${Math.round((rows/6) * 3)}`, `${Math.round((rows/6) * 5)}`]
    let colGates = [`${Math.round(cols/6)}`, `${Math.round((cols/6) * 3)}`, `${Math.round((cols/6) * 5)}`]
    let secondAndThirdCol = document.querySelectorAll('[data-col="' + secondCol + '"], [data-col="' + thirdCol + '"]')
    for (let element of secondAndThirdCol) {
        if (rowGates.includes(element.getAttribute('data-row'))) {
            element.classList.add("gate")
            continue
        }
        element.classList.add('wall')
    }
    let secondRow = Math.round(rows / 3)
    let thirdRow = Math.round((rows / 3) * 2)
    let secondAndThirdRow = document.querySelectorAll('[data-row="' + secondRow + '"], [data-row="' + thirdRow + '"]')
    for (let element of secondAndThirdRow) {
        if (colGates.includes(element.getAttribute('data-col'))) {
            element.classList.add("gate")
            continue
        }
        element.classList.add('wall')
    }
}
function addRow(gameField) {
    gameField.insertAdjacentHTML(
        'beforeend',
        '<div class="row"></div>'
    );
    return gameField.lastElementChild;
}
function addCell(rowElement, row, col) {
    rowElement.insertAdjacentHTML(
        'beforeend',
        `<div class="field"
                    data-row="${row}"
                    data-col="${col}"></div>`);
}
function setGameFieldSize(gameField) {
    gameField.style.width = (gameField.dataset.cellWidth * cols) + 'px';
    gameField.style.height = (gameField.dataset.cellHeight * rows) + 'px';
}


function heroMove(direction) {
    let heroCurrentPlace = document.querySelector(".hero");
    let heroCurrentRow = parseInt(heroCurrentPlace.dataset.row);
    let heroCurrentCol = parseInt(heroCurrentPlace.dataset.col);
    let newRow = heroCurrentRow;
    let newCol = heroCurrentCol;
    if (direction === 'up') {
        newRow -= 1;
    } else if (direction === "down") {
        newRow += 1;
    } else if (direction === "left") {
        newCol -= 1;
    } else if (direction === "right") {
        newCol += 1;
    }
    if (validateMovement("player", newRow, newCol)) {
        heroCurrentPlace.classList.remove('hero');
        heroCurrentPlace.removeAttribute("data-direction");
        let newHeroPlace = document.querySelector('[data-row="' + newRow + '"][data-col="' + newCol + '"]');
        if (newHeroPlace.classList.contains("coin")) {
            newHeroPlace.classList.remove("coin")
            let currentScore = parseInt(document.querySelector(".stats .hud-coin-amount").textContent);
            document.querySelector(".stats .hud-coin-amount").textContent = currentScore + 1;
        } else if (newHeroPlace.classList.contains("sword")) {
            newHeroPlace.classList.remove('sword');
            damage += 1;
            document.querySelector('.stats').removeAttribute('damage');
            document.querySelector('.stats').setAttribute('damage', damage);
        }
        newHeroPlace.classList.add('hero');
        newHeroPlace.setAttribute("data-direction", direction);
    } else {
        heroCurrentPlace.setAttribute("data-direction", direction);
    }
    moveCamera()
}

function validateMovement(type, row, col) {
    let newPlace = document.querySelector('[data-row="' + row + '"][data-col="' + col + '"]')
    if (type === "player") {
        if (newPlace.classList.contains("wall") || newPlace.classList.contains("monster") ||
            newPlace.classList.contains("chest") || newPlace.classList.contains("boss") ||
            newPlace.classList.contains("bush")) {
            return false;
            }
    } else if (type === "monster") {
        if (newPlace.classList.contains("wall") || newPlace.classList.contains("monster") ||
            newPlace.classList.contains("chest") || newPlace.classList.contains("boss") ||
            newPlace.classList.contains("bush") || newPlace.classList.contains("hero") ||
            newPlace.classList.contains("coins") || newPlace.classList.contains("sword")) {
            return false;
        }
    }
    return true;
}


function initKeyUp () {
    document.addEventListener('keydown', (event) => {
        event.preventDefault()
    })
    document.addEventListener('keyup', (event) => {
        let currentRow = document.querySelector(".hero").dataset.row
        let currentCol = document.querySelector(".hero").dataset.col
        if (gameRunning) {
        if (event.key === 'ArrowUp') {
            animateMovements("player", currentRow, currentCol, "move")
            setTimeout(heroMove, timeoutForAnimation, 'up');
        } else if (event.key === 'ArrowDown') {
            animateMovements("player", currentRow, currentCol, "move")
            setTimeout(heroMove, timeoutForAnimation, 'down');
        } else if (event.key === 'ArrowLeft') {
            animateMovements("player", currentRow, currentCol, "move")
            setTimeout(heroMove, timeoutForAnimation, 'left');
        } else if (event.key === 'ArrowRight') {
            animateMovements("player", currentRow, currentCol, "move")
            setTimeout(heroMove, timeoutForAnimation, 'right');
        } else if (event.key === ' ') {
            let currentPlace = document.querySelector(".hero")
            let currentRow = parseInt(currentPlace.dataset.row)
            let currentCol = parseInt(currentPlace.dataset.col)
            let newRow = currentRow
            let newCol = currentCol
            let direction = currentPlace.dataset.direction
            if (direction === 'up') {
                newRow -= 1;
            } else if (direction === "down") {
                newRow += 1;
            } else if (direction === "left") {
                newCol -= 1;
            } else if (direction === "right") {
                newCol += 1;
            }
            animateMovements('player', currentRow, currentCol, 'attack')
            attack("player", newRow, newCol)
            checkWinCondition()
            }
    }})
}

function animateMovements (type, currentRow, currentCol, attackOrMove) {
    let currentPlace = document.querySelector('[data-row="' + currentRow + '"][data-col="' + currentCol + '"]');
    function removeSpecificClass (className) {
        currentPlace.classList.remove(className);
    }
    if (type === 'player') {
        if (attackOrMove === 'attack') {
            currentPlace.classList.add('hero_attack')
            setTimeout(removeSpecificClass, timeoutForAnimation, 'hero_attack');
        } else if (attackOrMove === 'move'){
            currentPlace.classList.add('hero_move')
            setTimeout(removeSpecificClass, timeoutForAnimation, 'hero_move');
        }
    } else if (type === 'monster'){
        if (attackOrMove === 'attack') {
            currentPlace.classList.add('monster_attack')
            setTimeout(removeSpecificClass, timeoutForAnimation, 'monster_attack');
        } else if (attackOrMove === 'move'){
            currentPlace.classList.add('monster_move')
            setTimeout(removeSpecificClass, timeoutForAnimation, 'monster_move');
        }
    }
}

function checkNeighborCells(randomRow, randomCol) {
    let rowBefore = 0;
    if (randomRow !== 0) {rowBefore = randomRow - 1}
    let rowAfter = randomRow + 1;
    if (rowAfter > rows - 1) {rowAfter = randomRow}
    let colBefore = 0;
    if (randomCol !== 0) {colBefore = randomCol - 1}
    let colAfter = randomCol + 1;
    if (colAfter > cols - 1) {colAfter = randomCol}
    for (let i = rowBefore; i < rowAfter + 1; i++) {
        for (let element of cantSpawnOnIt) {
            if (document.querySelector('[data-row="' + i + '"][data-col="' + randomCol + '"]')
                .classList.contains(element)) {
                return false
            }
        }
    }
    for (let i = colBefore; i < colAfter + 1; i++) {
        for (let element of cantSpawnOnIt) {
            if (document.querySelector('[data-row="' + randomRow + '"][data-col="' + i + '"]')
                .classList.contains(element)) {
                return false
            }
        }
    }
    return true
}

function populateBoard() {
    spawnObjects('monster', monsterNumber);
    spawnObjects('bush', wallCount);
    spawnObjects('coin', coinNumber);
    spawnObjects('hero', 1);
    spawnObjects('chest', chestNumber);
    spawnObjects('sword', swordNumber)
}

function spawnObjects(objectName, numberOfObject) {
    for (let i=0; i<numberOfObject; i++) {
        let checkNeighbor = false;
        while (!checkNeighbor) {
            let randomRow = getRandomInt(0, rows);
            let randomCol = getRandomInt(0, cols);
            checkNeighbor = checkNeighborCells(randomRow, randomCol);
            if (checkNeighbor) {
                let objectToPlace = document.querySelector('[data-row="' + randomRow + '"][data-col="' + randomCol + '"]')
                objectToPlace.classList.add(objectName);
                if (objectName === 'hero') {
                    objectToPlace.setAttribute("data-direction", "down")
                    document.querySelector('.stats').setAttribute('damage', damage);
                }
                else if (objectName === 'monster') {
                    objectToPlace.setAttribute('id', "monster" + i)
                    objectToPlace.setAttribute("data-direction", "down")
                    objectToPlace.setAttribute("data-monster-hp", monsterHp)
                }
            }
        }
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function moveMonsters(monsterNumber) {
    for (let i = 0; i < monsterNumber; i++) {
        let currentMonster = document.getElementById("monster" + i)
        if (currentMonster == null) {
            continue
        }
        let currentMonsterRow = parseInt(currentMonster.dataset.row);
        let currentMonsterCol = parseInt(currentMonster.dataset.col);
        let newMonsterRow = currentMonsterRow
        let newMonsterCol = currentMonsterCol
        let randomInt = getRandomInt(1,6)
        let direction = currentMonster.dataset.direction
        let currentMonsterHp = currentMonster.dataset.monsterHp
        switch (randomInt) {
            case 1:
                newMonsterCol -= 1;
                direction = "left"
                break;
            case 2:
                newMonsterCol += 1;
                direction = "right"
                break;
            case 3:
                newMonsterRow -= 1;
                direction = "up"
                break;
            case 4:
                newMonsterRow += 1;
                direction = "down"
                break;
            default:
                if (direction === 'up') {
                    newMonsterRow -= 1;
                } else if (direction === "down") {
                    newMonsterRow += 1;
                } else if (direction === "left") {
                    newMonsterCol -= 1;
                } else if (direction === "right") {
                    newMonsterCol += 1;
                }
                animateMovements('monster', currentMonsterRow, currentMonsterCol, 'attack')
                attack("monster", newMonsterRow, newMonsterCol)
        }
        animateMovements("monster", currentMonsterRow, currentMonsterCol, "move")
        if (validateMovement("monster", newMonsterRow, newMonsterCol)) {
            function moveThatMonster () {
                currentMonster.classList.remove("monster")
                currentMonster.removeAttribute("id")
                currentMonster.removeAttribute("data-direction")
                currentMonster.removeAttribute("data-monster-hp")
                let newMonsterPlace = document.querySelector('[data-row="' + newMonsterRow
                    + '"][data-col="' + newMonsterCol + '"]');
                newMonsterPlace.classList.add('monster');
                newMonsterPlace.setAttribute("id", "monster" + i)
                newMonsterPlace.setAttribute("data-direction", direction);
                newMonsterPlace.setAttribute("data-monster-hp", currentMonsterHp)
            }
            setTimeout(moveThatMonster, timeoutForAnimation);
        } else {
                currentMonster.setAttribute("data-direction", direction);
            }
        }
}

function attack(type, attackedRow, attackedCol) {
    let currentScore = parseInt(document.querySelector(".stats .hud-coin-amount").textContent);
    let attackedPlace = document.querySelector(
        '[data-row="' + attackedRow + '"][data-col="' + attackedCol + '"]');
    let currentDamage = parseInt(document.querySelector('.stats').getAttribute('damage'));
    if (type === "player" && attackedPlace.classList.contains("chest")) {
        document.querySelector(".stats .hud-coin-amount").textContent = currentScore + 5
        attackedPlace.classList.remove("chest")
    } else if (attackedPlace.classList.contains("monster")) {
        attackedPlace.dataset.monsterHp -= currentDamage
        if (attackedPlace.dataset.monsterHp <= 0) {
            attackedPlace.classList.remove("monster")
            attackedPlace.removeAttribute("id")
            attackedPlace.removeAttribute("data-direction")
            attackedPlace.removeAttribute("data-monster-hp")
            document.querySelector(".stats .hud-coin-amount").textContent = currentScore + 2
        }
    } else if (attackedPlace.classList.contains("hero")) {
        document.querySelector(".hud-hp").dataset.hp -= 1
        refreshHpVisualisation(parseInt(document.querySelector(".hud-hp").dataset.hp))
        if (document.querySelector(".hud-hp").dataset.hp == 0) {
            youLose()
        }
    }
}

function youLose() {
    clearInterval(intervalId)
    gameRunning = false
    alert('You lost! :(')

}

function checkWinCondition() {
    if (document.querySelectorAll(".monster").length === 0) {
        clearInterval(intervalId);
        gameRunning = false;
        alert('You won! :)');
    }

}

function moveCamera(){
    let gameField = document.querySelector(".game-field");
    let heroPlace = document.querySelector(".hero");
    let gameFieldPositionX = gameField.getBoundingClientRect().x;
    let gameFieldPositionY = gameField.getBoundingClientRect().y;
    let heroPositionX = heroPlace.getBoundingClientRect().x;
    let heroPositionY = heroPlace.getBoundingClientRect().y;
    let cameraX = heroPositionX - gameFieldPositionX - 800;
    let cameraY = heroPositionY - gameFieldPositionY - 350;
    gameField.style.transformOrigin = `${cameraX}px ${cameraY}px`;
}