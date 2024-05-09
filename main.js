'use strict'

// Global Variables
var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

// Global Emojies
const BOMB = '💣'
const FLAG = '🚩'

// Start
function onInit() {
    gGame.isOn = false
    document.querySelector('.restart').innerHTML = '😃'
    gBoard = buildBoard()
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
    return board
}

function placeMines(board, i, j) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var randRow = getRandomInt(0, gLevel.SIZE)
        var randCol = getRandomInt(0, gLevel.SIZE)
        if (board[randRow][randCol].isMine || (randRow === i & randCol === j)) {
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

function revelCells(board, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue

            if (board[i][j].isMine) continue

            board[i][j].isShown = true
            document.querySelector(`.cell-${i}-${j}`).classList.add(`.reveal-cell`)
        }
    }
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {

            const className = `cell cell-${i}-${j}`
            const onCellClick = `onclick="onCellClicked(this, ${i}, ${j})"`
            const onRightClick = `oncontextmenu="rightClickFlag(event, this, ${i}, ${j}); return false;"`;

            strHTML += `<td class="${className}" ${onCellClick} ${onRightClick}>`

            strHTML += `${(gBoard[i][j].isMine && gBoard[i][j].isShown && (!gBoard[i][j].isMarked)) ? BOMB : ' '}`
            strHTML += `${(gBoard[i][j].isShown) ? board[i][j].minesAroundCount : ' '}`
            strHTML += `${(gBoard[i][j].isMarked) ? FLAG : ' '}`

            strHTML += `</td>`
        }
        strHTML += `</tr>`
    }
    elBoard.innerHTML = strHTML
}


function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]

    if (!gGame.isOn) {
        gGame.isOn = true
        placeMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
    }

    if (gGame.isOn === false || cell.isShown || cell.isMarked) return // not reaching need to fix

    if (cell.isMine) {
        revealMines(gBoard)
        document.querySelector('.restart').innerHTML = '😢'
        renderBoard(gBoard)
        setTimeout(() => {
            gameOver(false)
        }, 700);

    } else {
        cell.isShown = true
        revelCells(gBoard, i, j)
        renderBoard(gBoard)

        if (checkGameWin(gBoard)) {
            gameOver(true)
        }
    }
}


function revealMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) board[i][j].isShown = true
        }
    }
}

function gameOver(isWin) {

    if (isWin) {
        alert('Congratulations! You won!')
    } else {
        alert('Game Over! You clicked a mine.')
        gGame.isOn = false
    }
}

function chooseDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInit()
}

function rightClickFlag(event, elCell, i, j) {
    event.preventDefault()

    var cell = gBoard[i][j]
    if (!gGame.isOn || cell.isShown) return;

    cell.isMarked = !cell.isMarked
    elCell.innerText = cell.isMarked ? FLAG : ''

    renderBoard(gBoard)
}

function expandShown(board, elCell, i, j) {

}

function checkGameWin(board) {
    var countOpenNonMineCells = 0

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine && board[i][j].isShown) {
                countOpenNonMineCells++
            }
        }
    }
    var totalNonMineCells = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    return countOpenNonMineCells === totalNonMineCells
}
