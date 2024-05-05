'use strict'

// Global Variables
var gBoard
var gLevel
var gGame
var mineCount

const BOMB = '💣'

const ROWS = 4
const COLS = 4

// Main
function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {

    var board = []

    for (var i = 0; i < ROWS; i++) {
        board.push([])
        for (var j = 0; j < COLS; j++) {
            board[i][j] = createCell()
            if (i === 0 && j === 0) board[i][j].isMine = true
            if (i === 3 && j === 3) board[i][j].isMine = true
        }
    }
    return board
}

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = checkCellNegsCount(board, i, j)
            }
        }
    }
}

function checkCellNegsCount(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue

            if (board[i][j].isMine) {
                count++
            }
        }
    }
    return count
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {

            const className = `cell cell-${i}-${j}`
            const onCellClick = `onclick="onCellClicked(this, ${i}, ${j})"`

            strHTML += `<td class="${className}" ${onCellClick}></td>`
        }
        strHTML += `</tr>`
    }
    elBoard.innerHTML = strHTML

}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]

    if (cell.isMine) {
        console.log('Mine')
        gameOver(false)
    } else {
        setMinesNegsCount(gBoard)
    }
}


// function onCellClicked(elCell, i, j) {
//     var cell = gBoard[i][j]
//     if (cell.isShown || cell.isMarked) return

//     if (cell.isMine) {
//         cell.isShown = true
//         renderBoard(gBoard)
//         gameOver(false)
//     } else {
//         cell.isShown = true
//         gGame.shownCount++
//     }

//     if (gGame.shownCount === (ROWS * COLS - gLevel.MINES)) {
//         gameOver(true)
//     }

//     if (cell.minesAroundCount === 0) {
//         expandShown(gBoard, elCell, i, j)
//     }
//     renderBoard(gBoard)
// }

function onCellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function gameOver(isWin) {
    // gGame.isOn = false

    if (isWin) {
        alert('Congratulations! You won!')
    } else {
        alert('Game Over! You clicked a mine.')
    }
}