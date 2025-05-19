'use strict'

console.log('ok main')



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
    gBoard = buildBoard()

    renderBoard(gBoard)


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

    board[1][1].isMine = true
    board[2][3].isMine = true


    console.table(board)
    return board

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

        }
        strHTML += '</tr>'

    }

    elBoard.innerHTML = strHTML


}


function onCellClicked(elCell, i, j) {
    console.log(elCell, i, j)

}

function onCellMarked(elCell, i, j) {

}

function checkGameOver() {

}

function expandReveal(board, elCell, i, j) {

} 
