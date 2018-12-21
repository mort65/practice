let caption = null;
let selectedIndex = null;
let defaultValues = []
let cells = []
let values = []
let sudoku = null;
let undoes = []
let redoes = []

class Sudoku {
    constructor(values) {
        this.values = values;
        this._values = [];
        this.possible = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.actual = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];

        this.solve = () => {
            //Atleast 17 clues are needed to solve a sudoku
            if (this.values.filter(x => x === 0).length < 65) {
                for (let i = 0; i < this.values.length; i++) {
                    for (let j = 0; j < this.values.length; j++) {
                        if (this.sameCol(i, j) || this.sameRow(i, j) || this.sameCol(i, j)) {
                            if (this.values[i] && i !== j && this.values[i] === this.values[j]) {
                                if (defaultValues.length > 0) {
                                    if (defaultValues[i] !== this.values[i]) {
                                        console.log('Invalid Move');
                                        this.values[i] = 0;
                                    } else if (defaultValues[j] !== this.values[j]) {
                                        this.values[j] = 0;
                                        console.log('Invalid Move');
                                    } else {
                                        return false;
                                    }
                                } else {
                                    this.values[i] = 0;
                                }
                            }
                        }
                    }
                }
                let changes = false;
                let exitLoop = false;
                this.array2Matrix(this.values, this.actual);
                for (let i = 0; i < this.possible.length; i++) {
                    this.possible[i] = ['', '', '', '', '', '', '', '', ''];
                }
                try {
                    do {
                        do {
                            do {
                                do {
                                    changes = this.checkColumnAndRows();
                                    if (this.isPuzzleSolved()) {
                                        exitLoop = true;
                                        break;
                                    }
                                } while (changes);

                                if (exitLoop) break;

                                changes = this.lookForLoneRangersinBlocks();
                                if (this.isPuzzleSolved()) {
                                    exitLoop = true;
                                    break;
                                }
                            } while (changes);

                            if (exitLoop) break;

                            changes = this.lookForLoneRangersinRows();
                            if (this.isPuzzleSolved()) {
                                exitLoop = true;
                                break;
                            }
                        } while (changes);

                        if (exitLoop) break;

                        changes = this.lookForLoneRangersinColumns();
                        if (this.isPuzzleSolved()) {
                            exitLoop = true;
                            break;
                        }
                    } while (changes);

                } catch (ex) {
                    if (ex === 'Invalid Move') {
                        console.log('Invalid Move')
                        return false;
                    } else
                        throw ex;
                }

                this.matrix2Array(this.actual, this.values);

                if (this.isPuzzleSolved()) {
                    return true;
                }

                this.cloneArray(this.values, this._values);

                try {
                    this.solveSudokuRecursivly(this._values);
                } catch (err) {
                    if (err === "Max Iterations") {
                        console.log('Max Iterations')
                        return false;

                    } else throw err;
                }
                this.cloneArray(this._values, this.values);
                if (this.isPuzzleSolved(0)) {
                    return true;
                }
                return false;
            } else {
                return false
            }
        };
    }

    matrix2Array(matrix, arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = matrix[parseInt(i % 9)][parseInt(i / 9)];
        }
    }

    array2Matrix(arr, matrix) {
        for (let i = 0; i < matrix.length; i++) {
            let r = 0;
            for (let j = 0; j < arr.length; j++) {
                if ((j % 9) === i) {
                    matrix[i][r] = arr[j];
                    r++;
                }
            }
        }
    }

    sameRow(i, j) {
        return parseInt(i / 9) === parseInt(j / 9);
    }
    sameCol(i, j) {
        return (i - j) % 9 === 0;
    }
    sameBlock(i, j) {
        return (parseInt(i / 27) === parseInt(j / 27) && parseInt(i % 9 / 3) === parseInt(j % 9 / 3));
    }

    calculatePossibleValues(col, row) {
        let str;
        if (this.possible[col][row] === '') {
            str = '123456789';
        } else str = this.possible[col][row];

        //check by column
        for (let r = 0; r < 9; r++) {
            if (this.actual[col][r] !== 0) {
                str = str.replace(this.actual[col][r].toString(), '');
            }

        }

        //check by row
        for (let c = 0; c < 9; c++) {
            if (this.actual[c][row] !== 0) {
                str = str.replace(this.actual[c][row].toString(), '');
            }

        }

        //check by block
        let startC = col - (col % 3);
        let startR = row - (row % 3);
        for (let rr = startR; rr <= startR + 2; rr++) {
            for (let cc = startC; cc <= startC + 2; cc++) {
                if (this.actual[cc][rr] !== 0) {
                    str = str.replace(this.actual[cc][rr].toString(), '');
                }
            }
        }

        //if possible value is empty then throw invalid move
        if (str === '') {
            throw 'Invalid Move';
        }
        return str;
    }

    checkColumnAndRows() {
        let changes = false;

        //check all cells
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.actual[col][row] === 0) {
                    try {
                        this.possible[col][row] = this.calculatePossibleValues(col, row);
                    } catch (ex) {
                        throw 'Invalid Move';
                    }
                    if (this.possible[col][row].length === 1) {
                        //the number is confirmed
                        this.actual[col][row] = parseInt(this.possible[col][row]);
                        changes = true;
                    }
                }
            }
        }
        return changes;
    }

    lookForLoneRangersinBlocks() {
        let changes = false;
        let nextBlock;
        let occurrence;
        let cPos, rPos;

        //check for numbers 1 to 9
        for (let n = 1; n < 10; n++) {

            //check the 9 blocks
            for (let r = 0; r < 9; r += 3) {
                for (let c = 0; c < 9; c += 3) {
                    nextBlock = false;

                    //check within  the block
                    occurrence = 0;
                    for (let rr = 0; rr < 3; rr++) {
                        for (let cc = 0; cc < 3; cc++) {
                            if (this.actual[c + cc][r + rr] === 0 && this.possible[c + cc][r + rr].length > 0 && this.possible[c + cc][r + rr].indexOf(n.toString()) > -1) {
                                occurrence++;
                                cPos = c + cc;
                                rPos = r + rr;
                                if (occurrence > 1) {
                                    nextBlock = true;
                                    break;
                                }
                            }
                        }
                        if (nextBlock) break;
                    }
                    if (!nextBlock && occurrence === 1) {
                        //the number confirmed
                        this.actual[cPos][rPos] = n;
                        changes = true;
                    }
                }

            }

        }
        return changes;
    }

    lookForLoneRangersinRows() {
        let changes = false;
        let occurrence;
        let cPos, rPos;

        //check by row
        for (let r = 0; r < 9; r++) {
            for (let n = 1; n < 10; n++) {
                occurrence = 0;
                for (let c = 0; c < 9; c++) {
                    if (this.actual[c][r] === 0 && this.possible[c][r].length > 0 && this.possible[c][r].indexOf(n.toString()) > -1) {
                        occurrence++;

                        //if multiple occurrences, not a  lone ranger anymore
                        if (occurrence > 1) break;
                        cPos = c;
                        rPos = r;
                    }
                }
                if (occurrence === 1) {
                    //number is confirmed
                    //console.log(cPos, rPos, n);
                    this.actual[cPos][rPos] = n;
                    changes = true;
                }
            }
        }
        return changes;
    }

    lookForLoneRangersinColumns() {
        let changes = false;
        let occurrence;
        let cPos, rPos;

        //check by column
        for (let c = 0; c < 9; c++) {
            for (let n = 1; n < 10; n++) {
                occurrence = 0;
                for (let r = 0; r < 9; r++) {
                    if (this.actual[c][r] === 0 && this.possible[c][r].length > 0 && this.possible[c][r].indexOf(n.toString()) > -1) {
                        occurrence++;

                        //if multiple occurrences, not a  lone ranger anymore
                        if (occurrence > 1) break;
                        cPos = c;
                        rPos = r;
                    }
                }
                if (occurrence === 1) {
                    //number is confirmed
                    //console.log(cPos, rPos, n);
                    this.actual[cPos][rPos] = n;
                    changes = true;
                }
            }
        }
        return changes;
    }

    cloneArray(srcArr, dstArr) {
        for (let i = 0; i < srcArr.length; i++) {
            dstArr[i] = srcArr[i]
        }
    }

    isPuzzleSolved(m = 1) {
        if (m) {
            for (let c = 0; c < 9; c++) {
                if (this.actual[c].indexOf(0) !== -1) return false;
            }
            return true;
        } else {
            let isSolved = true;
            if (this._values.length === this.values.length) {
                for (let j = 0; j < this._values.length; j++) {
                    if (!isSolved) {
                        break;
                    }
                    if (this._values[j] > 0) {
                        for (let k = 0; k < this._values.length; k++) {
                            if (j !== k) {
                                if (this.sameRow(j, k) || this.sameCol(j, k) || this.sameBlock(j, k)) {
                                    if (this._values[j] === this._values[k]) {
                                        isSolved = false;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        isSolved = false;
                        break;
                    }
                }
            } else {
                isSolved = false;
            }
            return isSolved;
        }
    }

    solveSudokuRecursivly(v) {
        if (typeof this.solveSudokuRecursivly.iters == 'undefined')
            this.solveSudokuRecursivly.iters = 1;
        else {
            if (this.solveSudokuRecursivly.iters > 99999) {
                this.solveSudokuRecursivly.iters = undefined;
                throw "Max Iterations";
            }
            this.solveSudokuRecursivly.iters++;
        }
        let i = v.indexOf(0);
        if (i === -1) {
            this._values = v;
            this.solveSudokuRecursivly.iters = undefined;
            return;
        }
        let excludedNumbers = [];
        for (let j = 0; j < this.values.length; j++) {
            if (this.sameRow(i, j) || this.sameCol(i, j) || this.sameBlock(i, j)) {
                if (excludedNumbers.indexOf(v[j]) === -1) {
                    excludedNumbers.push(v[j]);
                }
            }
        }
        for (let m of '123456789') {
            if (excludedNumbers.indexOf(parseInt(m)) === -1) {
                v = v.slice(0, i).concat(parseInt(m), v.slice(i + 1, v.length));
                this.solveSudokuRecursivly(v);
            }
        }
    }
}

solve = () => {
    let start = performance.now();
    let solved = false
    solved = sudoku.solve();
    if (!solved && defaultValues.length > 0) {
        let values = [];
        for (let i of defaultValues) {
            values.push(i);
        }
        let s = new Sudoku(values);
        solved = s.solve();
        if (solved) {
            sudoku.values = s.values;
        }
    }
    let end = performance.now();
    for (let i = 0; i < cells.length; i++) {
        if (sudoku.values[i]) {
            cells[i].innerText = sudoku.values[i];
        } else {
            cells[i].innerText = '';
        }
        cells[i].style.backgroundColor = "white";
    }
    undoes = [];
    redoes = [];
    selectedIndex = null;
    if (solved)
        caption.innerText = `Solved in ${end - start} ms.`;
}

select = index => {
    if (selectedIndex === index) {
        cells[selectedIndex].style.backgroundColor = "white";
        selectedIndex = null;
        return;
    }
    if (cells[index].innerText) {
        let conflict = false;
        for (let i = 0; i < cells.length; i++) {
            if (i !== index) {
                if (sudoku.sameRow(i, index) || sudoku.sameCol(i, index) || sudoku.sameBlock(i, index)) {
                    if (cells[i].innerText === cells[index].innerText) {
                        cells[index].style.backgroundColor = "red";
                        conflict = true;
                        break;
                    }
                }
            }
        }
        if (!conflict) {
            cells[index].style.backgroundColor = "green";
        }
    } else {
        cells[index].style.backgroundColor = "green";
    }
    if (selectedIndex !== null) {
        cells[selectedIndex].style.backgroundColor = "white";
    }
    selectedIndex = index;
}

normalize = n => {
    return n > 9 ? "" + n : "0" + n;
}

recordChange = (index, oldValue, newValue) => {
    if (newValue !== oldValue) {
        undoes.push(`${normalize(index)}${normalize(oldValue)}${normalize(newValue)}`);
    }
}

isCleared = () => {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].style.fontWeight === "normal") {
            return false;
        }
    }
    return true;
}
update = (keyCode, index, record = true) => {
    if (index === null || (cells[index].style.fontWeight === 'bold' && !isCleared())) {
        return;
    }
    let solved = false;
    if (selectedIndex !== null) {
        cells[selectedIndex].backgroundColor = "white";
    }
    cells[index].backgroundColor = "white";
    switch (keyCode) {
        case 48:
        case 96:
        case 46:
        case 8:
            if (record) {
                recordChange(index, sudoku.values[index], 0);
                cells[index].style.backgroundColor = "green";
            } else {
                cells[index].style.backgroundColor = "white";
                selectedIndex = null;
            }
            cells[index].innerText = "";
            sudoku.values[index] = 0;
            caption.innerText = 'Sudoku';
            return;
        case 49:
        case 97:
            if (record) {
                recordChange(index, sudoku.values[index], 1);
            }
            cells[index].innerText = "1";
            sudoku.values[index] = 1;
            break;
        case 50:
        case 98:
            if (record) {
                recordChange(index, sudoku.values[index], 2);
            }
            cells[index].innerText = "2";
            sudoku.values[index] = 2;
            break;
        case 51:
        case 99:
            if (record) {
                recordChange(index, sudoku.values[index], 3);
            }
            cells[index].innerText = "3";
            sudoku.values[index] = 3;
            break;
        case 52:
        case 100:
            if (record) {
                recordChange(index, sudoku.values[index], 4);
            }
            cells[index].innerText = "4";
            sudoku.values[index] = 4;
            break;
        case 53:
        case 101:
            if (record) {
                recordChange(index, sudoku.values[index], 5);
            }
            cells[index].innerText = "5";
            sudoku.values[index] = 5;
            break;
        case 54:
        case 102:
            if (record) {
                recordChange(index, sudoku.values[index], 6);
            }
            cells[index].innerText = "6";
            sudoku.values[index] = 6;
            break;
        case 55:
        case 103:
            if (record) {
                recordChange(index, sudoku.values[index], 7);
            }
            cells[index].innerText = "7";
            sudoku.values[index] = 7;
            break;

        case 56:
        case 104:
            if (record) {
                recordChange(index, sudoku.values[index], 8);
            }
            cells[index].innerText = "8";
            sudoku.values[index] = 8;
            break;
        case 57:
        case 105:
            if (record) {
                recordChange(index, sudoku.values[index], 9);
            }
            cells[index].innerText = "9";
            sudoku.values[index] = 9;
            break;
        default:
            return;
    }
    if (record) {
        let conflict = false;
        let finished = true;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].innerText || '123456789'.indexOf(cells[i].innerText) === -1) {
                finished = false;
            }
            if (i !== index) {
                if (sudoku.sameRow(i, index) || sudoku.sameCol(i, index) || sudoku.sameBlock(i, index)) {
                    if (cells[i].innerText === cells[index].innerText) {
                        cells[index].style.backgroundColor = "red";
                        conflict = true;
                        break;
                    }
                }
            }
        }
        if (!conflict) {
            if (finished) {
                solved = true;
                for (let i = 0; i < cells.length; i++) {
                    if (!solved) {
                        break;
                    }
                    for (let j = 0; j < cells.length; j++) {
                        if (i != j) {
                            if (sudoku.sameRow(i, j) || sudoku.sameCol(i, j) || sudoku.sameBlock(i, j)) {
                                if (sudoku.values[i] === sudoku.values[j]) {
                                    solved = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (solved) {
                    caption.innerText = 'Sudoku Solved.'
                    cells[index].style.backgroundColor = "green";
                }
            } else {
                cells[index].style.backgroundColor = "green";
            }
        }
    } else {
        cells[index].style.backgroundColor = "white";
        selectedIndex = null;
    }
    if (!solved) {
        caption.innerText = 'Sudoku';
    }
}

clear = () => {
    for (let i = 0; i < cells.length; i++) {
        sudoku.values[i] = 0;
        cells[i].innerText = '';
        cells[i].style.fontWeight = "bold";
    }
    if (selectedIndex !== null) {
        cells[selectedIndex].style.backgroundColor = "white";
    }
    selectedIndex = null;
    caption.innerText = "Sudoku";
    defaultValues = [];
    undoes = [];
    redoes = [];
}

reset = () => {
    if (defaultValues.length > 0) {
        for (let i = 0; i < defaultValues.length; i++) {
            if (defaultValues[i]) {
                cells[i].innerText = defaultValues[i];
                cells[i].style.fontWeight = "bold";
            } else {
                cells[i].innerText = '';
                cells[i].style.fontWeight = "normal";
            }
            sudoku.values[i] = defaultValues[i];
        }
        if (selectedIndex !== null) {
            cells[selectedIndex].style.backgroundColor = "white";
        }
        selectedIndex = null;
        caption.innerText = "Sudoku";
    } else {
        clear();
    }
    undoes = [];
    redoes = [];
}

readFile = e => {
    let file = e.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = e => {
        let content = e.target.result.replace(/\s/g, "");
        let values = [];
        let isBold = true;
        for (let i = 0; i < content.length; i++) {
            if ('1234567890.*'.indexOf(content[i] > -1)) {
                if (values.length === cells.length)
                    break;
                switch (content[i]) {
                    case '0':
                    case '.':
                        values.push(0);
                        isBold = true;
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        if (isBold) {
                            values.push(parseInt(content[i]));
                        } else {
                            values.push(parseInt(content[i]) * -1);
                            isBold = true;
                        }
                        break;
                    case '*':
                        isBold = false;
                        break;
                    default:
                        alert("The file format is incorrect.");
                        return;
                }
            } else {
                alert("The file format is incorrect.");
                return;
            }
        }
        for (let i = 0; i < values.length; i++) {
            if (i === cells.length)
                break;
            sudoku.values[i] = Math.abs(values[i])
            if (values[i] > 0) {
                cells[i].style.fontWeight = "bold";
                defaultValues[i] = sudoku.values[i];
            } else {
                cells[i].style.fontWeight = "normal";
                defaultValues[i] = 0;
            }
            cells[i].style.backgroundColor = "white";
            if (sudoku.values[i]) {
                cells[i].innerText = sudoku.values[i];
            } else {
                cells[i].innerText = '';
            }
        }
        if (values.length < cells.length) {
            for (let i = values.length; i < cells.length; i++) {
                cells[i].style.fontWeight = "normal";
                sudoku.values[i] = 0;
                defaultValues[i] = 0;
                cells[i].innerText = '';
            }
        }
        undoes = [];
        redoes = [];
        caption.innerText = 'Sudoku';
    };
    reader.readAsText(file, 'utf-8');
}

loadSudoku = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = () => {
        readFile(input);
    }
}

savefile = (filename, data) => {
    let blob = new Blob([data], {
        type: 'text/csv'
    });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        URL.revokeObjectURL(elem);
    }
}

saveSudoku = () => {
    let str = "";
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerText && cells[i].style.fontWeight === 'bold') {
            str += cells[i].innerText;
        } else {
            if (cells[i].innerText) {
                str += `*${cells[i].innerText}`;
            } else {
                str += "*0";
            }
        }
        if (i < cells.length - 1 && (i + 1) % 9 === 0) {
            str += `
`;
        }
    }
    savefile('sudoku.txt', str);
}

undo = () => {
    if (undoes.length > 0) {
        let change = undoes[undoes.length - 1];
        let index = parseInt(change.slice(0, 2));
        let oldValue = parseInt(change.slice(2, 4));
        redoes.push(undoes.pop());
        update(48 + oldValue, index, false);
    }
}

redo = () => {
    if (redoes.length > 0) {
        let change = redoes[redoes.length - 1];
        let index = parseInt(change.slice(0, 2));
        let oldValue = parseInt(change.slice(4, 6));
        undoes.push(redoes.pop());
        update(48 + oldValue, index, false);
    }
}

window.onload = () => {
    let table = document.getElementsByTagName("table")[0];
    let solveButton = document.getElementById('btnSolve');
    let clearButton = document.getElementById('btnClear');
    let resetButton = document.getElementById('btnReset');
    let loadButton = document.getElementById('btnLoad');
    let saveButton = document.getElementById('btnSave');
    let undoButton = document.getElementById('btnUndo');
    let redoButton = document.getElementById('btnRedo');
    let tbodies = table.getElementsByTagName("tbody");
    caption = table.getElementsByTagName("caption")[0];


    for (let tbody of tbodies) {
        let trs = tbody.getElementsByTagName("tr");
        for (let tr of trs) {
            let tds = tr.getElementsByTagName("td");
            for (td of tds) {
                if (td.innerText) {
                    values.push(parseInt(td.innerText));
                    defaultValues.push(parseInt(td.innerText));
                    td.style.fontWeight = "bold";
                } else {
                    values.push(0);
                    defaultValues.push(0);
                    td.style.fontWeight = "normal";
                }
                cells.push(td);
            }
        }
    }

    sudoku = new Sudoku(values);

    solveButton.onclick = () => {
        solve();
    }

    clearButton.onclick = () => {
        clear();
    }
    resetButton.onclick = () => {
        reset();
    }
    loadButton.onclick = () => {
        loadSudoku();
    }
    saveButton.onclick = () => {
        saveSudoku();
    }
    undoButton.onclick = () => {
        undo();
    }
    redoButton.onclick = () => {
        redo();
    }
    for (let i = 0; i < cells.length; i++)
        cells[i].onclick = () => {
            select(i);
        }

    document.addEventListener('keydown', (event) => {
        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 46 || event.keyCode == 8) { //0-9,del,backspace
            update(event.keyCode, selectedIndex);
        }
    });
}
