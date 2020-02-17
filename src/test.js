function sectorToXY(sector, index) {
    return [sector[0] * 3 + Math.floor(index / 3),
    sector[1] * 3 + index % 3]
}
// convert x,y of matrix to sector/index 
function xyToSector(x, y) {
    let sX = Math.floor(x / 3),
        sY = Math.floor(y / 3),
        index = (x - sX * 3) + 3 * (y - sY * 3)
    return [[sX, sY], index]
}
function noDuplicate(array) {
    array = array.filter(e => e !== 0)
    return (new Set(array)).size === array.length
}
class Sudoku {
    constructor() {
        this.init = [
            [7, 8, 2, 3, 1, 9, 5, 4, 6],
            [5, 4, 1, 6, 8, 7, 9, 2, 3],
            [3, 6, 9, 2, 4, 5, 7, 8, 1],
            [1, 5, 6, 8, 7, 2, 4, 3, 9],
            [8, 2, 4, 9, 3, 1, 6, 5, 7],
            [9, 7, 3, 4, 5, 6, 2, 1, 8],
            [2, 1, 5, 7, 6, 3, 8, 9, 4],
            [6, 3, 8, 5, 9, 4, 1, 7, 2],
            [4, 9, 7, 1, 2, 8, 3, 6, 0],
        ]
        this.current = JSON.parse(JSON.stringify(this.init))
        this.valid = Array(9).fill(0).map(x => Array(9).fill(1))
        this.cheated = false
        
    }

    generateArray() {
        return Array(9).fill(0).map(x => Array(9).fill(0).map(x => Math.ceil(Math.random() * 9)))
    }

    resetGame() {
        this.current = JSON.parse(JSON.stringify(this.init))
        this.valid = Array(9).fill(0).map(x => Array(9).fill(1))
        return this
    }

    newGame(mode) {
        this.init = this.generateArray()
        this.current = JSON.parse(JSON.stringify(this.init))
        return this
    }
    checkAlllegal() {
        for (let { row, col, number } of this.cells) {
            if (!this.validatePosition(row, col)) return false;
        }
        return true
    }

    solveGame() {
        for (let {row,col,number} of this.cells) {
           
            if (number===0) {
              
                for (let j=1; j<10; j++) {
                    this.current[row][col] = j;
                    if (this.validatePosition(row, col)) {
                        this.solveGame()
                       
                    }
                }
                this.current[row][col] = 0; 
                return
            }
        }
        console.log(this.current);
    }

    fillNumber(sector, index, num) {
        let [x, y] = sectorToXY(sector, index);
        this.current[x][y] = num

        return this
    }

    validatePosition(row, col) {
        return noDuplicate(this.getRow(row)) && noDuplicate(this.getCol(col)) && noDuplicate(this.getSector(row, col))
    }

    get cells() {
        let matrix = this.current;
        return {
            [Symbol.iterator]() {
                return {
                    index: 0,
                    next() {
                        if (this.index === 81) return { done: true }
                        let row = Math.floor(this.index / 9),
                            col = this.index % 9;
                        let number = matrix[row][col];
                        this.index++;
                        return { value: { row, col, number }, done: false }
                    }
                }
            }
        }
    }

    //get xth row
    getRow(x) { return this.current[x] }

    // get xth column
    getCol(x) { return this.current.map(row => row[x]) }

    // get x,y position as sector
    getSector(x, y) { return this.getThreeByThree(...xyToSector(x, y)[0]) }

    checkWon() {
        if (this.cheated) return false
        return checkAllValid()
    }
    checkAllValid() {
        for (let { row, col, number } of this.cells) {
            if (number === 0) return false;
            if (!this.validatePosition(row, col)) return false;
        }
        return true
    }

    // get i row, j column in terms of sectors. 3X3
    getThreeByThree(i, j) {
        let r = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                r.push(this.current[x + 3 * i][y + 3 * j])
            }
        }
        return r
    }

    getThreeByThreeInit(i, j) {
        let r = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                r.push(this.init[x + 3 * i][y + 3 * j] !== 0)
            }
        }
        return r
    }

    getThreeByThreeValid(i, j) {
        let r = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                r.push(this.validatePosition(x + 3 * i, y + 3 * j))
            }
        }
        return r
    }

}



function validateGrid(grid, row, col, i) {
    let r = grid[row];
    let c = grid.map(row => row[col]);
    let sec = [];
    let sX = Math.floor(row / 3),
        sY = Math.floor(col / 3);
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            sec.push(grid[x + 3 * sX][y + 3 * sY])
        }
    }
    return !r.includes(i) && !c.includes(i) && !sec.includes(i)
}

function solveGrid(grid) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0) {
                for (let i = 1; i < 10; i++) {
                    if (validateGrid(grid, row, col, i)) {
                        grid[row][col] = i
                        solveGrid(grid)
                    }
                    grid[row][col] = 0
                }
                return
            }
        }
    }
    console.log(grid);
}

solveGrid([
    [7, 8, 2, 3, 1, 9, 5, 4, 6],
    [5, 4, 1, 6, 8, 7, 9, 2, 3],
    [3, 6, 9, 2, 4, 5, 7, 8, 1],
    [1, 5, 6, 8, 7, 2, 4, 3, 9],
    [8, 2, 4, 9, 3, 1, 6, 5, 7],
    [9, 7, 3, 4, 5, 6, 2, 1, 8],
    [2, 1, 5, 7, 6, 3, 8, 9, 4],
    [6, 3, 8, 5, 9, 4, 1, 7, 2],
    [4, 9, 7, 1, 2, 8, 3, 0, 0],
])
