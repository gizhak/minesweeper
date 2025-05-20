'use strict'

console.log('ok main')

var mins = '💣'
var FLAG = '🚩'

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

    onInit()
}

function onRestart() {
    console.log('click on restart button')

    var elWinLose = document.querySelector('h3')
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

    if (!gGame.isOn || gBoard[i][j].isRevealed || gBoard[i][j].isMarked) return

    gBoard[i][j].isRevealed = true
    gGame.revealedCount++

    if (gBoard[i][j].isMine) {
        elCell.innerHTML = mins
        gameOver(false)

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

    checkGameOver()

}

function checkGameOver() {

    var totalCells = gLevel.SIZE * gLevel.SIZE // 16
    var totalMines = gLevel.MINES // 2
    var nonMineCells = totalCells - totalMines // 16-2 = 14

    if (gGame.revealedCount === nonMineCells && gGame.markedCount === totalMines) {
        gameOver(true)
    }

}


function gameOver(isWin) {
    // console.log('GAME OVER')
    gGame.isOn = false

    var elWinLose = document.querySelector('h3')
    // console.log(elWinLose)

    if (isWin) {
        console.log('You found all Mines')
        elWinLose.innerText = 'YOU WIN'
        elWinLose.style.display = 'block'


    } else {
        console.log('GAME OVER')
        elWinLose.innerText = 'YOU LOSE'
        elWinLose.style.display = 'block'
        revealAllMines()
    }

}
// TODO check the continue 
function expandReveal(board, elCell, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue // check again ....

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
