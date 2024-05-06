'use strict'

// Global Variables
var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

const BOMB = '💣'

// Start
function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

// Model
function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: " ",
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    placeMines(board)
    return board
}

function placeMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randRow = getRandomInt(0, gLevel.SIZE)
        var randCol = getRandomInt(0, gLevel.SIZE)
        if (board[randRow][randCol].isMine) {
            i--
        } else board[randRow][randCol].isMine = true

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
    if (count === 0) return ''
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
            strHTML += `<td class="${className}" ${onCellClick}>`

            strHTML += `${(gBoard[i][j].isMine && gBoard[i][j].isShown) ? BOMB : ' '}`

            strHTML += `</td>`
        }
        strHTML += `</tr>`
    }
    elBoard.innerHTML = strHTML
}


function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (!gGame.isOn || cell.isShown || cell.isMarked) return

    if (cell.isMine) {
        cell.isShown = true
        renderBoard(gBoard)
        gameOver(false)
    } else {
        console.log('Mine')
        setMinesNegsCount(gBoard)
    }
}


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
    gGame.isOn = false

    if (isWin) {
        alert('Congratulations! You won!')
    } else {
        alert('Game Over! You clicked a mine.')
    }
}