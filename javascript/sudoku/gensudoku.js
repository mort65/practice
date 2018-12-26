"use strict";
let _verbose = false;
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
                this._values = [...this.values];
                for (let i = 0; i < this.values.length; i++) {
                    for (let j = 0; j < this.values.length; j++) {
                        if (this.sameCol(i, j) || this.sameRow(i, j) || this.sameCol(i, j)) {
                            if (this.values[i] && i !== j && this.values[i] === this.values[j]) {
                                if (defaultValues.length > 0) {
                                    if (defaultValues[i] !== this.values[i]) {
                                        showLog('Invalid Move');
                                        this.values[i] = 0;
                                    } else if (defaultValues[j] !== this.values[j]) {
                                        this.values[j] = 0;
                                        showLog('Invalid Move');
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
                if (this.values.filter(x => x === 0).length > 64) {
                    showLog("Insufficient Clues")
                    return false;
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
                                    do {
                                        do {
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


                                            if (exitLoop) break;
                                            changes = this.lookForTwinsInBlocks();
                                            if (this.isPuzzleSolved()) {
                                                exitLoop = true;
                                                break;
                                            }
                                        } while (changes);

                                        if (exitLoop) break;

                                        changes = this.lookForTwinsInRows();
                                        if (this.isPuzzleSolved()) {
                                            exitLoop = true;
                                            break;
                                        }
                                    } while (changes);

                                    if (exitLoop) break;

                                    changes = this.lookForTwinsInColumns();
                                    if (this.isPuzzleSolved()) {
                                        exitLoop = true;
                                        break;
                                    }
                                } while (changes);

                                if (exitLoop) break;

                                changes = this.lookForTripletsInBlocks();
                                if (this.isPuzzleSolved()) {
                                    exitLoop = true;
                                    break;
                                }
                            } while (changes);

                            if (exitLoop) break;

                            changes = this.lookForTripletsInRows();
                            if (this.isPuzzleSolved()) {
                                exitLoop = true;
                                break;
                            }
                        } while (changes);

                        if (exitLoop) break;

                        changes = this.lookForTripletsInColumns();
                        if (this.isPuzzleSolved()) {
                            exitLoop = true;
                            break;
                        }
                    } while (changes);

                } catch (ex) {
                    if (ex === 'Invalid Move') {
                        showLog("Puzzle not solved.")
                        this.array2Matrix(this._values, this.actual);
                    } else
                        throw ex;
                }

                this.matrix2Array(this.actual, this.values);

                if (this.isPuzzleSolved()) {
                    showLog("Puzzle solved.")
                    return true;
                }

                showLog('Solvig by brute force...');

                this._values = [...this.values];

                try {
                    this.solveSudokuByBruteForce(this._values);
                } catch (err) {
                    if (err === "Max Iterations") {
                        showLog('Max Iterations Error')
                        showLog("Puzzle not solved.")
                        return false;

                    } else throw err;
                }

                this.values = [...this._values];

                if (this.isPuzzleSolved(0)) {
                    showLog("Puzzle solved.")
                    return true;
                }
                showLog("Puzzle not solved.")
                return false;
            } else {
                showLog("Insufficient Clues")
                showLog("Can't solve the puzzle.")
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

    array2String(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            str += arr[i].toString();
        }
        return str;
    }

    string2Array(str, arr) {
        for (let i = 0; i < str.length; i++) {
            if (i < arr.length) {
                arr[i] = str[i];
            } else {
                arr.push(str[i]);
            }
        }
    }

    transposeArray(array, arrayLength) {
        var newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push([]);
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < arrayLength; j++) {
                newArray[j].push(array[i][j]);
            }
        }

        return newArray;
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

    lookForTwinsInBlocks() {
        let changes = false;

        //look for twins in each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                //if two possible values, check for twins
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 2) {

                    //scan by the block that the current cell is in
                    let startC = c - (c % 3);
                    let startR = r - (r % 3);

                    for (let rr = startR; rr < startR + 3; rr++) {
                        for (let cc = startC; cc < startC + 3; cc++) {

                            //for cells other than the pair of twins
                            if (!(cc === c && rr === r) && this.possible[cc][rr] === this.possible[c][r]) {

                                //twins found, remove the twins from all the other possible values in the block
                                for (let rrr = startR; rrr < startR + 3; rrr++) {
                                    for (let ccc = startC; ccc < startC + 3; ccc++) {

                                        //only check for empty cells
                                        if (this.actual[ccc][rrr] === 0 && this.possible[ccc][rrr] !== this.possible[c][r]) {

                                            //save a copy of the original possible value (twins)
                                            let original_possible = this.possible[ccc][rrr];

                                            //remove first twin number from possible values
                                            this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][0], '');

                                            //remove second twin number from possible values
                                            this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][1], '');

                                            //if the possible values are modified then set the change variable to true
                                            if (original_possible !== this.possible[ccc][rrr]) {
                                                showLog('lookForTwinsInBlocks possibles changed:', ccc, rrr);
                                                changes = true;
                                            }

                                            //if possible values reduced to empty string, then user placed a wrong move
                                            if (this.possible[ccc][rrr] === '')
                                                throw 'Invalid Move';

                                            //if left with 1 possible value for current cell, cell is confirmed
                                            if (this.possible[ccc][rrr].length === 1) {
                                                showLog('lookForTwinsInBlocks confirmed:', ccc, rrr);
                                                this.actual[ccc][rrr] = parseInt(this.possible[ccc][rrr]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        return changes;
    }

    lookForTwinsInRows() {
        let changes = false;

        //for each row,check each column in the row
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //if two possible values, check for twins
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 2) {

                    //scans columns in this row
                    for (let cc = c + 1; cc < 9; cc++) {

                        if (this.possible[cc][r] === this.possible[c][r]) {

                            //twin found, remove the twins from all the other possible values in the column
                            for (let ccc = 0; ccc < 9; ccc++) {

                                //only check for empty cells
                                if (this.actual[ccc][r] === 0 && ccc !== c && ccc !== cc) {

                                    //save a copy of the original possible value (twins)
                                    let original_possible = this.possible[ccc][r];

                                    //remove first twin number from possible values
                                    this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][0], '');

                                    //remove second twin number from possible values
                                    this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][1], '');

                                    //if the possible values are modified then set the change variable to true
                                    if (original_possible !== this.possible[ccc][r]) {
                                        showLog('lookForTwinsInRows possibles changed:', ccc, r);
                                        changes = true;
                                    }

                                    //if possible values reduced to empty string, then user placed a wrong move
                                    if (this.possible[ccc][r] === '')
                                        throw 'Invalid Move';

                                    //if left with 1 possible value for current cell, cell is confirmed
                                    if (this.possible[ccc][r].length === 1) {
                                        showLog('lookForTwinsInRows confirmed:', ccc, r);
                                        this.actual[ccc][r] = parseInt(this.possible[ccc][r]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTwinsInColumns() {
        let changes = false;

        //for each row,check each column in the column
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //if two possible values, check for twins
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 2) {

                    //scans rows in this column
                    for (let rr = r + 1; rr < 9; rr++) {

                        if (this.possible[c][rr] === this.possible[c][r]) {

                            //twin found, remove the twins from all the other possible values in the column
                            for (let rrr = 0; rrr < 9; rrr++) {

                                if (this.actual[c][rrr] === 0 && rrr !== r && rrr !== rr) {

                                    //save a copy of the original possible value (twins)
                                    let original_possible = this.possible[c][rrr];

                                    //remove first twin number from possible values
                                    this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][0], '');

                                    //remove second twin number from possible values
                                    this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][1], '');

                                    //if the possible values are modified then set the change variable to true
                                    if (original_possible !== this.possible[c][rrr]) {
                                        showLog('lookForTwinsInColumns possibles changed:', c, rrr);
                                        changes = true;
                                    }

                                    //if possible values reduced to empty string, then user placed a wrong move
                                    if (this.possible[c][rrr] === '')
                                        throw 'Invalid Move';

                                    //if left with 1 possible value for current cell, cell is confirmed
                                    if (this.possible[c][rrr].length === 1) {
                                        showLog('lookForTwinsInColumns confirmed:', c, rrr);
                                        this.actual[c][rrr] = parseInt(this.possible[c][rrr]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTripletsInBlocks() {
        let changes = false;

        //check each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //three possible values; check for triplets
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 3) {

                    //first potential triplet found
                    let tripletslocation = `${c}${r}`;

                    //scan by block
                    let startC = c - (c % 3);
                    let startR = r - (r % 3);

                    for (let rr = startR; rr < startR + 3; rr++) {
                        for (let cc = startC; cc < startC + 3; cc++) {
                            if (!(cc === c && rr === r) &&
                                ((this.possible[cc][rr] === this.possible[c][r]) ||
                                    (this.possible[cc][rr].length === 2 &&
                                        this.possible[c][r].indexOf(this.possible[cc][rr][0].toString()) > -1 &&
                                        this.possible[c][r].indexOf(this.possible[cc][rr][1].toString()) > -1))) {

                                //save the coordinates of the triplets
                                tripletslocation += `${cc}${rr}`;
                            }
                        }
                    }

                    //found 3 cells as triplets; remove all from other cells
                    if (tripletslocation.length === 6) {

                        //triplets found, remove each cell's possible values containing rhe triplet
                        for (let rrr = startR; rrr < startR + 3; rrr++) {
                            for (let ccc = startC; ccc < startC + 3; ccc++) {

                                //look for the cell that is not part of the 3 cells found
                                if (this.actual[ccc][rrr] === 0 &&
                                    ccc !== parseInt(tripletslocation[0].toString()) &&
                                    rrr !== parseInt(tripletslocation[1].toString()) &&
                                    ccc !== parseInt(tripletslocation[2].toString()) &&
                                    rrr !== parseInt(tripletslocation[3].toString()) &&
                                    ccc !== parseInt(tripletslocation[4].toString()) &&
                                    rrr !== parseInt(tripletslocation[5].toString())) {

                                    //save the original possible values
                                    let original_possible = this.possible[ccc][rrr];

                                    //remove first triplet number from possible values
                                    this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][0], '');

                                    //remove second triplet number from possible values
                                    this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][1], '');

                                    //remove third triplet number from possible values
                                    this.possible[ccc][rrr] = this.possible[ccc][rrr].replace(this.possible[c][r][2], '');

                                    //if the possible values are modified then set the change variable to true
                                    if (original_possible !== this.possible[ccc][rrr]) {
                                        showLog('lookForTripletsInBlocks possibles changed:', ccc, rrr);
                                        changes = true;
                                    }

                                    //if possible values reduced to empty string, then user placed a wrong move
                                    if (this.possible[ccc][rrr] === '')
                                        throw 'Invalid Move';

                                    //if left with 1 possible value for current cell, cell is confirmed
                                    if (this.possible[ccc][rrr].length === 1) {
                                        showLog('lookForTripletsInBlocks confirmed:', ccc, rrr);
                                        this.actual[ccc][rrr] = parseInt(this.possible[ccc][rrr]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTripletsInRows() {
        let changes = false;

        //check each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //three possible values; check for triplets
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 3) {

                    //first potential triplet found
                    let tripletslocation = `${c}${r}`;

                    //scan columns in this row
                    for (let cc = 0; cc < 9; cc++) {
                        if ((cc !== c) &&
                            ((this.possible[cc][r] === this.possible[c][r]) ||
                                (this.possible[cc][r].length === 2 &&
                                    this.possible[c][r].indexOf(this.possible[cc][r][0].toString()) > -1 &&
                                    this.possible[c][r].indexOf(this.possible[cc][r][1].toString()) > -1))) {

                            //save the coordinates of the triplets
                            tripletslocation += `${cc}${r}`;
                        }
                    }

                    //found 3 cells as triplets; remove all from other cells
                    if (tripletslocation.length === 6) {

                        //triplets found, remove each cell's possible values containing rhe triplet
                        for (let ccc = 0; ccc < 9; ccc++) {

                            //look for the cell that is not part of the 3 cells found
                            if (this.actual[ccc][r] === 0 &&
                                ccc !== parseInt(tripletslocation[0].toString()) &&
                                ccc !== parseInt(tripletslocation[2].toString()) &&
                                ccc !== parseInt(tripletslocation[4].toString())) {

                                //save the original possible values
                                let original_possible = this.possible[ccc][r];

                                //remove first triplet number from possible values
                                this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][0], '');

                                //remove second triplet number from possible values
                                this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][1], '');

                                //remove third triplet number from possible values
                                this.possible[ccc][r] = this.possible[ccc][r].replace(this.possible[c][r][2], '');

                                //if the possible values are modified then set the change variable to true
                                if (original_possible !== this.possible[ccc][r]) {
                                    showLog('lookForTripletsInRows possibles changed:', ccc, r);
                                    changes = true;
                                }

                                //if possible values reduced to empty string, then user placed a wrong move
                                if (this.possible[ccc][r] === '')
                                    throw 'Invalid Move';

                                //if left with 1 possible value for current cell, cell is confirmed
                                if (this.possible[ccc][r].length === 1) {
                                    showLog('lookForTripletsInRows confirmed:', ccc, r);
                                    this.actual[ccc][r] = parseInt(this.possible[ccc][r]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return changes;
    }

    lookForTripletsInColumns() {
        let changes = false;

        //check each cell
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                //three possible values; check for triplets
                if (this.actual[c][r] === 0 && this.possible[c][r].length === 3) {

                    //first potential triplet found
                    let tripletslocation = `${c}${r}`;

                    //scan rows in this column
                    for (let rr = 0; rr < 9; rr++) {
                        if ((rr !== r) &&
                            ((this.possible[c][rr] === this.possible[c][r]) ||
                                (this.possible[c][rr].length === 2 &&
                                    this.possible[c][r].indexOf(this.possible[c][rr][0].toString()) > -1 &&
                                    this.possible[c][r].indexOf(this.possible[c][rr][1].toString()) > -1))) {

                            //save the coordinates of the triplets
                            tripletslocation += `${c}${rr}`;
                        }
                    }

                    //found 3 cells as triplets; remove all from other cells
                    if (tripletslocation.length === 6) {

                        //triplets found, remove each cell's possible values containing rhe triplet
                        for (let rrr = 0; rrr < 9; rrr++) {

                            //look for the cell that is not part of the 3 cells found
                            if (this.actual[c][rrr] === 0 &&
                                rrr !== parseInt(tripletslocation[1].toString()) &&
                                rrr !== parseInt(tripletslocation[3].toString()) &&
                                rrr !== parseInt(tripletslocation[5].toString())) {

                                //save the original possible values
                                let original_possible = this.possible[c][rrr];

                                //remove first triplet number from possible values
                                this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][0], '');

                                //remove second triplet number from possible values
                                this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][1], '');

                                //remove third triplet number from possible values
                                this.possible[c][rrr] = this.possible[c][rrr].replace(this.possible[c][r][2], '');

                                //if the possible values are modified then set the change variable to true
                                if (original_possible !== this.possible[c][rrr]) {
                                    showLog('lookForTripletsInColumns possibles changed:', c, rrr);
                                    changes = true;
                                }

                                //if possible values reduced to empty string, then user placed a wrong move
                                if (this.possible[c][rrr] === '')
                                    throw 'Invalid Move';

                                //if left with 1 possible value for current cell, cell is confirmed
                                if (this.possible[c][rrr].length === 1) {
                                    showLog('lookForTripletsInColumns confirmed:', c, rrr);
                                    this.actual[c][rrr] = parseInt(this.possible[c][rrr]);
                                }
                            }
                        }
                    }
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
                    this.actual[cPos][rPos] = n;
                    changes = true;
                }
            }
        }
        return changes;
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

    solveSudokuByBruteForce(v) {
        if (typeof this.solveSudokuByBruteForce.iters === 'undefined')
            this.solveSudokuByBruteForce.iters = 1;
        else {
            if (this.solveSudokuByBruteForce.iters > 99999) {
                this.solveSudokuByBruteForce.iters = undefined;
                throw "Max Iterations";
            }
            this.solveSudokuByBruteForce.iters++;
        }
        let i = v.indexOf(0);
        if (i === -1) {
            this._values = v;
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
                this.solveSudokuByBruteForce(v);
            }
        }
    }
}

const showLog = l => {
    if (_verbose) {
        console.log(l);
    }
}


const genPuzzles = () => {
    postMessage(genPuzzle());
    setTimeout("genPuzzles()", 500);
}


const genPuzzle = () => {
    let puzzle = [];
    let idx = [];
    let count = 0;
    let rand
    let sdk = new Sudoku(puzzle);

    for (let i = 0; i < 81; i++) {
        idx.push(i);
        puzzle.push(0);
    }

    for (let i = 0; i < 6561; i++) {
        let emptyCount = puzzle.filter(x => x === 0).length;
        rand = Math.random(0, 1);
        if ((emptyCount < 65) && ((emptyCount <= 45) || (rand > 0.9))) {
            break;
        }
        let j = Math.round((Math.random(0, 1) * (idx.length - 1)));
        let vals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // removing invald clues from vals
        for (let k = 0; k < puzzle.length; k++) {
            if (vals.length === 0) {
                break;
            }
            if (sdk.sameRow(idx[j], k) || sdk.sameCol(idx[j], k) || sdk.sameBlock(idx[j], k)) {
                let l = vals.indexOf(k)
                if (l > -1) {
                    vals.splice(l, 1);
                }
            }
        }
        if (vals.length > 0) {
            let val = 0;
            if (count < 9) {
                count = 0;
                for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
                    if (puzzle.indexOf(i) > -1) {
                        count++;
                    }
                }
            }
            if (count < 9) {
                for (let v of vals) {
                    if (puzzle.filter(x => x === v).length === 0) {
                        val = v;
                        break;
                    }
                }
            }
            if (val > 0) {
                puzzle[idx[j]] = val;
            } else {
                if (vals.length > 1) {
                    //counting each number in the puzzle
                    let counts = vals.map(i => puzzle.filter(x => x === i).length);
                    let mins = [];
                    //finding numbers with minimum count in the puzzle
                    for (let i = 0; i < counts.length; i++) {
                        if (mins.length === 0) {
                            mins.push(vals[i]);
                            continue;
                        }
                        if (counts[i] < mins[0]) {
                            mins = [];
                            mins.push(vals[i]);
                        } else if (counts[i] === mins[0]) {
                            mins.push(vals[i]);
                        }
                    }
                    vals = mins;
                }
                puzzle[idx[j]] = vals[Math.round(Math.random(0, 1) * (vals.length - 1))];
            }

            idx.splice(j, 1);

            for (let i = 0; i < puzzle.length; i++) {
                for (let j = 0; j < puzzle.length; j++) {
                    if ((i !== j) && puzzle[i] > 0 && puzzle[j] > 0) {
                        if (sdk.sameRow(i, j) || sdk.sameCol(i, j) || sdk.sameBlock(i, j)) {
                            if (puzzle[i] === puzzle[j]) {
                                puzzle[i] = 0;
                                if (idx.indexOf(i) === -1) {
                                    let index = 0
                                    for (let k of idx) {
                                        if (k < i) {
                                            index++
                                            continue;
                                        }
                                        break;
                                    }
                                    idx.splice(index, 0, i);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    let strPuzzle = '';
    for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] > 0) {
            strPuzzle += puzzle[i].toString();
        } else {
            strPuzzle += '.';
        }
    }
    if (strPuzzle !== '' && sdk.solve()) {
        return strPuzzle;
    }
    return "";
}

genPuzzles();
