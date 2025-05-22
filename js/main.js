'use strict'

console.log('ok main')

var mins = '💣'
var FLAG = '🚩'

var SMILEY = '😊'
var WIN_SMILEY = '😎'
var LOSE_SMILEY = '😵'


var elRestart = document.querySelector('.board-game button')

var gLives = 3
var gTimerInterval
var gSeconds
var gMinesHit = 0


var gBoard = {
    minesAroundCount: 4,
    isRevealed: false,
    isMine: false,
    isMarked: false
}

// console.log('Board', gBoard)

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()

    renderBoard(gBoard)

    gLives = 3
    gMinesHit = 0

    setSmiley()
    minesCount()
    livesCount()
    resetTimer()
    // startTimer()

    // var elRestart = document.querySelector('.board-game button')
    elRestart.style.display = 'none'

}

function setLevel(level) {
    if (level === 'beginner') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (level === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (level === 'expert') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    minesCount()
    onInit()
}

function onRestart() {
    console.log('click on restart button')
    setSmiley()
    stopTimer()
    gTimerInterval = null

    gGame.isOn = false
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLives = 3
    gMinesHit = 0

    gTimerInterval = null

    var elWinLose = document.querySelector('.winlose h3')
    elWinLose.style.display = 'none'

    onInit()
}

// buildBoard()
function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            // console.log(j)
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }

        }

    }

    // board[1][1].isMine = true
    // board[2][3].isMine = true

    addRandomMines(board)

    setMinesNegsCount(board)


    console.table(board)
    return board

}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            if (board[i][j].isMine) continue

            board[i][j].minesAroundCount = countNeighborMines(board, i, j)

        }

    }
}

function countNeighborMines(board, rowIdx, colIdx) {
    // console.log('count')
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[i].length || (i === rowIdx && j == colIdx)) continue

            if (board[i][j].isMine) count++

        }

    }
    // console.log(count)
    return count

}

function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    console.log(elBoard)

    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var callClass = 'cell'

            var dataCell = `data-i="${i}" data-j="${j}"`

            strHTML += `<td 
                class="${callClass}" ${dataCell} 
                onclick="onCellClicked(this, ${i}, ${j})"
                oncontextmenu="onCellMarked(this, ${i}, ${j}); return false"
            ></td>`

            // return false - cancel the right click

        }
        strHTML += '</tr>'

    }

    elBoard.innerHTML = strHTML


}


function onCellClicked(elCell, i, j) {
    console.log(elCell, i, j)

    setSmiley()
    if (gGame.isOn && !gTimerInterval) {
        startTimer()
        // setSmiley()
    }

    if (!gGame.isOn || gBoard[i][j].isRevealed || gBoard[i][j].isMarked) return

    gBoard[i][j].isRevealed = true
    gGame.revealedCount++

    if (gBoard[i][j].isMine) {
        elCell.innerHTML = mins
        gMinesHit++
        gLives--
        livesCount()

        if (gLives <= 0) {
            console.log('gLives', gLives)
            console.log('gLevel.MINES', gLevel.MINES)
            gameOver(false)
        } else if (gMinesHit >= gLevel.MINES) {
            gameOver(false)
        }


    } else {
        var minsCount = gBoard[i][j].minesAroundCount
        elCell.innerHTML = minsCount > 0 ? minsCount : ''

        if (minsCount === 0) {
            elCell.classList.add('empty')
            expandReveal(gBoard, elCell, i, j)
        }

        checkGameOver()
    }

    elCell.classList.add('revealed')

}

function onCellMarked(elCell, i, j) {
    console.log('cell marked', elCell)

    if (!gGame.isOn || gBoard[i][j].isRevealed) return


    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        elCell.innerText = ''
        gGame.markedCount--
    } else {
        gBoard[i][j].isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
    }
    minesCount()
    checkGameOver()

}

function checkGameOver() {

    var totalCells = gLevel.SIZE * gLevel.SIZE // 16
    var totalMines = gLevel.MINES // 2
    var nonMineCells = totalCells - totalMines // 16-2 = 14

    console.log('gGame.revealedCount: ', gGame.revealedCount)
    console.log('nonMineCells: ', nonMineCells)
    console.log('gGame.markedCount: ', gGame.markedCount)
    console.log('totalMines: ', totalMines)
    if (gGame.revealedCount === nonMineCells && gGame.markedCount === totalMines) {
        console.log('gGame.revealedCount: ', gGame.revealedCount)
        console.log('nonMineCells: ', nonMineCells)
        console.log('gGame.markedCount: ', gGame.markedCount)
        console.log('totalMines: ', totalMines)
        gameOver(true)
    }



}

function minesCount() {
    var elMines = document.querySelector('.mines h4')
    console.log(elMines)

    if (elMines) {
        var leftMines = gLevel.MINES - gGame.markedCount
        elMines.innerText = leftMines
    }
}

function livesCount() {
    var elLives = document.querySelector('.lives h4')
    console.log(elLives)
    elLives.innerText = gLives

    if (gLives <= 0 && gLives < gLevel.MINES) {
        console.log('gLives', gLives)
        console.log('gLevel.MINES', gLevel.MINES)
        gameOver(false)
    }

}

function startTimer() {
    gSeconds = 0

    var elTimer = document.querySelector('.time h4')
    console.log(elTimer)
    elTimer.innerText = '0s'

    gTimerInterval = setInterval(function () {
        gSeconds++
        elTimer.innerHTML = gSeconds
    }, 1000)

}

function stopTimer() {
    clearInterval(gTimerInterval)
    return gSeconds
}

function resetTimer() {
    stopTimer()
    gSeconds = 0
    var elTimer = document.querySelector('.time h4')
    console.log(elTimer)
    elTimer.innerText = '0s'
    // document.querySelector('.time h4').innerText = '0s'
}

function setSmiley() {
    console.log('works')
    var elStatus = document.querySelector('.status h2')
    console.log(elStatus)
    elStatus.innerText = SMILEY
}

function gameOver(isWin) {
    // console.log('GAME OVER')
    stopTimer()
    gTimerInterval = null

    gGame.isOn = false

    var elWinLose = document.querySelector('.winlose h3')
    // console.log(elWinLose)

    if (isWin) {
        console.log('You found all Mines')
        elWinLose.innerText = 'YOU WIN'
        elWinLose.style.display = 'block'
        elRestart.style.display = 'block'
        document.querySelector('.status h2').innerText = WIN_SMILEY

    } else {
        console.log('GAME OVER')

        elWinLose.innerText = 'YOU LOSE'
        elWinLose.style.display = 'block'
        elRestart.style.display = 'block'
        document.querySelector('.status h2').innerText = LOSE_SMILEY
        // revealAllMines()
    }
    revealAllMines()

}
// TODO check the continue 
function expandReveal(board, elCell, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue // if the line out from board so continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[i].length || (i === rowIdx && j == colIdx)) continue

            if (board[i][j].isRevealed || board[i][j].isMarked) continue

            var dataCell = `[data-i="${i}"][data-j="${j}"]`
            var expandCell = document.querySelector(dataCell)

            if (expandCell) {
                board[i][j].isRevealed = true
                gGame.revealedCount++

                var minsCount = board[i][j].minesAroundCount
                expandCell.innerText = minsCount > 0 ? minsCount : ''
                expandCell.classList.add('revealed')

                if (minsCount === 0)
                    expandReveal(board, expandCell, i, j)
            }


        }

    }


}

function revealAllMines() {

    for (var i = 0; i < gLevel.SIZE; i++) {

        for (var j = 0; j < gLevel.SIZE; j++) {

            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {

                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.innerText = mins
                elCell.classList.add('mine')
            }
        }
    }
}

function addRandomMines(board) {
    var minesAdd = 0

    while (minesAdd < gLevel.MINES) {

        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)

        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesAdd++
        }

    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}
