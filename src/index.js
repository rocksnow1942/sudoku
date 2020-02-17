import React from 'react';
import ReactDOM from 'react-dom';
import './skeleton.css';
import './index.css';


function Square(props) {
    let color = props.isinit? 'black' : props.ishint? "green": "blue";
    let text = props.value !== 0 ? props.value: "";
    let backgroundColor = props.backgroundColor;
    let click = props.isinit ? null : props.ishint ? null : props.onClick;
    return (
        <div className="square">
            <button className="square-inside"
                onClick={click}
                onMouseEnter={props.onHover}
                onMouseLeave={() => { props.onHover(null) }}
                style={{color,backgroundColor}}>
                {text}
            </button>
        </div>
    );
}


class ThreeByThreeBoard extends React.Component {
    render() {
        let fill = this.props.fill;
        let r = [];
        let backgroundColor;
        let [x,y] = this.props.hovering;
        
        for (let i=0;i<9;i++) {
            let [blockX,blockY] = sectorToXY(this.props.sec, i) // this is the curent rendering block.
            if (!this.props.isvalid[i]) {
                backgroundColor = '#FF666F'
            } else if (x===blockX && y === blockY) {
                backgroundColor = '#DDDDDD'
            } else if (x === blockX || y===blockY) {
                backgroundColor = '#F5F5F5'
            } 
            else {
                backgroundColor = "#fff"
            }
            r.push(
                <Square key= {i} value={fill[i]} isinit={this.props.init[i]} 
                ishint = {this.props.hint[i]}
                onClick={(e) => this.props.onClick(i,this.props.sec,e)} 
                onHover={(enter)=> {
                    if(enter!==null) {
                        this.props.onHover(blockX,blockY)
                    } else {
                        this.props.onHover(-1,-1)
                    }
                }} 
                backgroundColor ={backgroundColor}
                isvalid={this.props.isvalid[i]}/>
            )
        }
        return (
            <div className="three-board">
                <div className="board-row">
                    {r.slice(0, 3)}
                </div>
                <div className="board-row">
                    {r.slice(3, 6)}
                </div>
                <div className="board-row">
                    {r.slice(6, 9)}
                </div>
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        let board = [];
        for (let i of [0, 1, 2]) {
            for (let j of [0, 1, 2]) {
                board.push(
                    <ThreeByThreeBoard key={i * 3 + j} fill={this.props.sudoku.getThreeByThree(i, j)} 
                        sec={[i, j]} onClick={this.props.onClick}
                        onHover = {this.props.onHover} 
                        hovering = {this.props.hovering}
                        init = {this.props.sudoku.getThreeByThreeInit(i,j)} 
                        hint = {this.props.sudoku.getThreeByThreeHint(i,j)}
                        isvalid = {this.props.sudoku.getThreeByThreeValid(i,j)}/>
                )
            }
        }
        return (
            < div className="sudoku" >
                
                < div className="board-row" >
                    {board.slice(0, 3)}
                </div >
                <div className="board-row">
                    {board.slice(3, 6)}
                </div>
                <div className="board-row">
                    {board.slice(6, 9)}
                
                </div>
            </div >
        )
    }
}

class Dialog extends React.Component {
    render () {
        if (!this.props.show) {return null};
        return (
            <div className="backdrop">
                <div className="modal">
                    <div align='center' style={{ height:"40%"}}>
                        {this.props.children}
                    </div>
                    <hr/>
                   <div className='row'>
                       <div className='six columns' align='right'>
                            <button onClick={() => { this.props.onClose(true) }}>Yes</button>
                       </div>
                        <div className='six columns' align='left'>
                            <button onClick={() => { this.props.onClose(false)}}>No</button>
                       </div>
                      
                   </div>
                </div>
            </div>
        )

    }
 }

class GameMenu extends React.Component {
    constructor (props) {
        super(props);
        this.state = {mode:this.props.game.state.mode, 
            modalOpen:false,
            modalOnClose:null,
            modalContent:null,
            message:"",
            solution:[],
            currentShowing:0};
        this.resetGame = this.resetGame.bind(this)
        this.selectMode = this.selectMode.bind(this)
        this.newGame = this.newGame.bind(this)
        this.solveGame = this.solveGame.bind(this)
        this.clearMenu = this.clearMenu.bind(this)
        this.showSolutions = this.showSolutions.bind(this)
        this.showHint = this.showHint.bind(this)
    }
    clearMenu () {
        this.setState({ message: "", solution: [], currentShowing: 0})
    }
    solveGame () {
        let self = this; 
        this.setState({
            modalOpen: true, modalOnClose (e) {
                if (e) {
                    let curGame = self.props.game.state.sudoku
                    let solution = [];
                    curGame.cheated = true;
                    curGame.solveGame((r) => { solution.push(r) }, ()=>{return solution.length>10})
                    // Object.assign(mockGame,this.props.game.state.sudoku);
                    
                    if (solution.length===1) {
                        self.props.game.setState({ sudoku: curGame.setState(solution[0]) })
                    } else if (solution.length===0) {
                        self.setState({ message: <h5 style={{ 'margin': 'auto' }}>No solution found.</h5>})
                    } else {
                        self.props.game.setState({ sudoku: curGame.setState(solution[0]) })
                        self.setState({ 
                            solution,
                            currentShowing: 0,
                            message: <h5 style={{ 'margin': 'auto' }}>Multiple solutions.</h5> })
                    }
                   
                }; self.setState({ modalOpen: false })},
                modalContent: <h3>Want to give up?</h3>
        })
        
    }

    showHint() {
        let game = this.props.game;
        let solution = null;
        solveGrid(game.state.sudoku.init,(r) => { solution = r }, () => { return solution!==null });

        for (let row=0; row<9;row++) {
            
            for (let col=0;col<9;col++) {
                let c = game.state.sudoku.current[row][col];
                if (c!==0 && c!==solution[row][col]) {
                    game.setState((state) => {
                        let sudoku = state.sudoku;
                        sudoku.hint[row][col] = sudoku.current[row][col] = solution[row][col];
                        return { sudoku }
                    });
                    return 
                }
            }
        }
        if (game.state.showMenu.position) {
            let [fX, fY] = sectorToXY(game.state.showMenu.position.sector, game.state.showMenu.position.index);
            game.setState((state) => {
                let sudoku = state.sudoku; 
                sudoku.hint[fX][fY] = sudoku.current[fX][fY] = solution[fX][fY];
                return { sudoku }
            })
        } 
    }

    resetGame () {
        let self = this;
        this.setState({
            modalOpen: true, modalOnClose (e){
                if (e) {
                    self.clearMenu()
                    self.props.game.setState((state) => ({
                        sudoku: state.sudoku.resetGame()
                    }))};
                self.setState({modalOpen:false})
                },
            modalContent: <h3>Want to reset the current game?</h3>
                })
    }
    newGame () {
        let self = this;
        this.setState({
            modalOpen:true,
            modalOnClose(e) {
                if(e) {
                    self.clearMenu()
                    self.props.game.setState((state) => ({
                        sudoku: state.sudoku.newGame(state.mode)
                    }))
                };
                self.setState({modalOpen:false});
            },
            modalContent:<h3>Want to start a new game?</h3>
        })
    }
    selectMode (e) {
        let mode = e.target.textContent.toLowerCase();
        this.props.game.setState({mode})
        this.setState({mode})
    }

    showSolutions(i) {
        let index = this.state.currentShowing+i;
        if (index<this.state.solution.length && index>0) {
           
            this.props.game.setState({ sudoku: this.props.game.state.sudoku.setState(this.state.solution[index]) })
            this.setState({currentShowing:index})
        }
        
    }

    render () {
        let solutionButtons = null;
        if (this.state.solution.length>1) {
            solutionButtons = ( <div>
                <button onClick={() => this.showSolutions(-1)}>Prev</button>
                <button onClick={() => this.showSolutions(1)}>Next</button> 
            </div> )
        }
        return (
            <div className='gamemenu'>
                <Dialog show={this.state.modalOpen} onClose={this.state.modalOnClose}> 
                    {this.state.modalContent}
                </Dialog>
                <button className="button" onClick={this.resetGame}>Reset</button>
                <button onClick={this.newGame}>New Game</button>
                <button onClick = {this.showHint}>Hint</button>
                <button onClick={this.solveGame}>Solve</button>
                <button onClick={this.selectMode} className={this.state.mode==="easy"? "selected":null}>Easy</button>
                <button onClick={this.selectMode} className={this.state.mode==="normal"? "selected":null}>Normal</button>
                <button onClick={this.selectMode} className={this.state.mode==="hard"? "selected":null}>Hard</button>
                <button onClick={this.selectMode} className={this.state.mode==="expert"? "selected":null}>Expert</button>
                {this.state.message?this.state.message:null}
                {solutionButtons}
            </div>
            
        )
    }
}

class InputMenu extends React.Component {
    render() {
        let ele = []   
        for (let i=1; i<10; i++) {
            ele.push(
                <div key={i}  className="square">
                    <button className="square-inside" onClick={() => this.props.onClick(i, this.props.showMenu.position)} 
                    style={{ background: 'aqua', "lineHeight": "20px" }}>
                      {i}
                    </button>
                </div>)
        }

        return (
            <div className="inputmenu" style={this.props.showMenu.style}>
                <div className="board-row">
                   {ele.slice(0,3)}
                </div>
                <div className="board-row">
                    {ele.slice(3, 6)}
                </div>
                <div className="board-row">
                    {ele.slice(6, 9)}
                </div>
               
                <div className="square" style={{ margin: "0px", "paddingTop":"30%"}}>
                    <button className="square-inside" onClick={() => this.props.onClick(0, this.props.showMenu.position)}
                        style={{ background: 'aqua', "lineHeight": "20px", }}>
                        Clear
                    </button>

                </div>

            </div>
        )  
    }

    componentDidMount() {
        document.addEventListener('click', this.props.removeInputMenu)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.props.removeInputMenu)
    }
  
}

// convert Sector / Index notation to row,col in the matrix. 
function sectorToXY(sector,index) {
    return [sector[0]*3 + Math.floor(index/3), 
            sector[1]*3 + index % 3]
}
// convert x,y of matrix to sector/index 
function xyToSector(x,y) {
    let sX = Math.floor(x/3),
        sY = Math.floor(y/3),
        index = (x-sX*3) + 3*(y-sY*3)
    return [[sX,sY],index]
}

function noDuplicate(array) {
    array = array.filter(e=>e!==0)
    return (new Set(array)).size === array.length
}


function validateGrid(grid,row,col,i) {
    let r = grid[row];
    let c = grid.map(row=>row[col]);
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkGrid(grid) {
    for (let row of grid) {
        if (row.includes(0)) return false
    }
    return true
}

function fillGrid(grid) {
    const picks=[1,2,3,4,5,6,7,8,9];
    shuffle(picks)
    let needbreak = false;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0) {
                for (let value of picks) {
                    if (validateGrid(grid,row,col,value)) {
                        grid[row][col]=value
                        if (checkGrid(grid)) return true
                        else {
                            if (fillGrid(grid)) {
                                return true
                            }
                        }
                    };
                };
                needbreak = true;
                grid[row][col] = 0
                break;
            }
        };
        if (needbreak) {break}
    }
}


function solveGrid(grid,callback,stopcondition) {
    if (stopcondition()) {return}
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0) {
                for (let i = 1; i < 10; i++) {
                    if (validateGrid(grid,row, col, i)) {
                        grid[row][col] = i
                        solveGrid(grid,callback,stopcondition)
                    }
                    grid[row][col] = 0
                }
                return
            }
        }
    }
    callback(JSON.parse(JSON.stringify(grid)))
}

class Sudoku {
    constructor () {
        this.init = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
        this.current =JSON.parse(JSON.stringify(this.init))
        this.hint = Array(9).fill(0).map(x=>Array(9).fill(0))
        this.cheated = false;
        this.solveGame = this.solveGame.bind(this);
    }

    setState (state) {
        this.current = state
        return this
    }


    generateArray(mode) {
        // generate a valid array by random with 1 solution
        let attempt = {easy:1,normal:5,hard:10,expert:15}[mode];
        let grid = (Array(9).fill(0).map(x => Array(9).fill(0)));
        fillGrid(grid)
        
        while(attempt>0){
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
           
            let old = grid[row][col];
            grid[row][col]=0;
            let count = 0;
            solveGrid(grid,()=>{count+=1},()=>count>1)
            if (count>1) {
                grid[row][col]=old;
                attempt -= 1
            }
        }
        return grid
    }

    resetGame() {
        this.current = JSON.parse(JSON.stringify(this.init))
        this.hint = Array(9).fill(0).map(x => Array(9).fill(0))
        this.cheated = false;
        return this
    }

    newGame(mode) {
        this.cheated = false;
        this.init = this.generateArray(mode)
        this.hint = Array(9).fill(0).map(x => Array(9).fill(0))
        this.current = JSON.parse(JSON.stringify(this.init))
        return this
    }

    solveGame(callback,stopcondition) {
        const picks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (stopcondition()) {return}
        for (let { row, col, number } of this.cells) {
            if (number === 0) {
                for (let j of picks) {
                    this.current[row][col] = j;
                    if (this.validatePosition(row, col)) {
                        this.solveGame(callback,stopcondition)
                    }
                }
                this.current[row][col] = 0;
                return false
            }
        } 
        callback(JSON.parse(JSON.stringify(this.current)))
    }



    

    fillNumber(sector,index,num) {
        let [x, y] = sectorToXY(sector,index,);
        this.current[x][y] = num
        
        return this
    }

    validatePosition(row,col) {
       return noDuplicate(this.getRow(row)) && noDuplicate(this.getCol(col)) && noDuplicate(this.getSector(row,col))
    }

    get cells () {
        let matrix = this.current;
        return  {[Symbol.iterator]() {
                return {
                    index: 0,
                    next() {
                        if (this.index === 81) return {done:true}
                        let row = Math.floor(this.index / 9),
                            col = this.index % 9;
                        let number = matrix[row][col];
                        this.index++;
                        return { value: { row, col, number }, done:false }
                    }
                }
            }
        }
    }

    //get xth row
    getRow (x) {return this.current[x]}

    // get xth column
    getCol (x) {return this.current.map(row=>row[x])}

    // get x,y position as sector
    getSector (x,y) {return this.getThreeByThree(...xyToSector(x,y)[0])}

    checkWon() {
        if (this.cheated) return false
        for (let { row, col, number } of this.cells) {
            if (number === 0) return false;
            if (!this.validatePosition(row,col)) return false;
        }
        return true
    }

    // get i row, j column in terms of sectors. 3X3
    getThreeByThree(i,j) {
        let r = [];
        for (let x=0; x<3; x++) {
            for (let y=0; y <3; y++) {
                r.push(this.current[x+3*i][y+3*j])
            }
        }
        return r
    }

    getThreeByThreeInit(i,j) {
        let r = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                r.push(this.init[x + 3 * i][y + 3 * j]!==0)
            }
        }
        return r
    }

    getThreeByThreeHint(i, j) {
        let r = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                r.push(this.hint[x + 3 * i][y + 3 * j] !== 0)
            }
        }
        return r
    }

    getThreeByThreeValid(i,j) {
        let r = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                r.push(this.validatePosition(x + 3 * i, y + 3 * j))
            }
        }
        return r
    }

}


class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sudoku: new Sudoku(),
            showMenu:false,
            hovering:[-1,-1],
            mode: 'easy',
        }
        this.history = [];
        this.handleBoardClick = this.handleBoardClick.bind(this)
        this.removeInputMenu = this.removeInputMenu.bind(this)
        this.handleBoardHover = this.handleBoardHover.bind(this)
        this.handleMenuClick = this.handleMenuClick.bind(this)
    
    }

    handleBoardClick(index,sector,e) {
        let x = e.clientX, y = e.clientY
        this.setState({ currentFocus: {index,sector} ,showMenu: { style: { left: x - 100 / 2, top: y - 100 / 2 }, position: { index, sector}}}) 
       
    }

    handleBoardHover(i,j) {
        this.setState({hovering:[i,j]})
    }
    
    removeInputMenu(e) {
        this.setState({ showMenu: false });
        // document.body.removeEventListener('click', this.removeInputMenu)
    }

    handleMenuClick(num,{index,sector}) {
        this.setState((state, props) => ({
            sudoku: state.sudoku.fillNumber(sector, index, num),
        }))
    }


    render() {    
        return (
            <div className='container'>
            <h1 align='center'>Sudoku Game </h1>
            <div className="game">
                    <Board sudoku = {this.state.sudoku} 
                    hovering = {this.state.hovering}
                    onClick ={this.handleBoardClick} 
                    onHover = {this.handleBoardHover}
                    />
                {this.state.showMenu ? <InputMenu showMenu={this.state.showMenu} onClick={this.handleMenuClick} removeInputMenu={this.removeInputMenu} />: null}
                <div className="game-info">
                    {/* <div>{status}</div>
                    <ol>{moves}</ol> */}
                    {this.state.sudoku.checkWon()? <h1>You Won!</h1> : null}
                    <GameMenu game = {this}/>
                </div>
            </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

