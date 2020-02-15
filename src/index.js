import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <div className="square">
            <button className="square-inside" onClick={props.onClick} style={props.style}>
                {props.value}
            </button></div>
    );
}


class ThreeByThreeBoard extends React.Component {
    render() {
        let fill = this.props.fill;
        
        let r = [];
        for (let i=0;i<9;i++) {
            r.push(
                <Square key= {i} value={fill[i]} onClick={(e) => this.props.onClick(i,this.props.sec,e)} />
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

class InputMenu extends React.Component {
    
    render() {   
        return (
            <div className="inputmenu" style={this.props.showMenu}>
                <div className="board-row">
                    <Square style={{ background: 'aqua', "lineHeight":"20px"}} value={1} onClick={() => this.props.onClick(1)} />
                    <Square style={{ background: 'aqua', "lineHeight": "20px" }} value={2} onClick={() => this.props.onClick(2)} />
                    <Square style={{ background: 'aqua', "lineHeight": "20px" }} value={3} onClick={() => this.props.onClick(3)} />
                </div>
                <div className="board-row">
                    <Square style={{ background: 'aqua', "lineHeight": "20px" }} value={4} onClick={() => this.props.onClick(4)} />
                    <Square style={{ background: 'aqua', "lineHeight": "20px" }} value={5} onClick={() => this.props.onClick(5)} />
                    <Square style={{ background: 'aqua', "lineHeight": "20px" }} value={6} onClick={() => this.props.onClick(6)} />
                </div>
                <div className="board-row">
                    <Square style={{ background: 'aqua', "lineHeight":"20px"}} value={7} onClick={() => this.props.onClick(7)} />
                    <Square style={{ background: 'aqua', "lineHeight":"20px"}} value={8} onClick={() => this.props.onClick(8)} />
                    <Square style={{ background: 'aqua', "lineHeight":"20px"}} value={9} onClick={() => this.props.onClick(9)} />
                </div>
            </div>
        )  
    }

    componentDidMount() {
        console.log('enter');
    }

    componentWillUnmount() {
        console.log('leave');
    }
  
}


class Sudoku {
    constructor () {
        this.fill = this.generateArray()
    }

    generateArray () {
       return Array(9).fill(0).map(x=>Array(9).fill(0).map(x=>Math.ceil(Math.random()*9)))
    }

    // get i row, j column in terms of sectors.
    getThreeByThree(i,j) {
        let r = [];
        for (let x=0; x<3; x++) {
            for (let y=0; y <3; y++) {
                r.push(this.fill[x+3*i][y+3*j])
            }
        }
        return r
    }

}

class Board extends React.Component {
    render () {
        
        let board = [];
        for (let i of [0,1,2]) {
            for (let j of [0,1,2]) {
                board.push(
                    <ThreeByThreeBoard key={i*3+j} fill={this.props.fill.getThreeByThree(i,j)} sec={[i,j]} onClick={this.props.onClick} />
                )
            }
        }
        return (
            < div className="sudoku" >
                < div className="board-row" >
                   {board.slice(0,3)}
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


class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fill: new Sudoku(),
            showMenu:false,
        }
        this.handleClick = this.handleClick.bind(this)
        this.removeInputMenu = this.removeInputMenu.bind(this)
        
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(index,sector,e) {
        // console.log(index,sector,e);
        let x = e.clientX, y = e.clientY
        this.setState({showMenu:{left:x-100/2,top:y-100/2}}) 
        // let el = () => { this.setState({ showMenu: false }); document.removeEventListener('click',el)}
        document.body.addEventListener('click', this.removeInputMenu)
    }
    
    removeInputMenu(e) {
        console.log(e.target);
        this.setState({ showMenu: false });
        document.body.removeEventListener('click', this.removeInputMenu)
    }

    handleMenuClick() {

    }

    render() {    
        return (
            <div className="game">
                    <Board fill = {this.state.fill} onClick ={this.handleClick}/>
                {this.state.showMenu ? <InputMenu showMenu={this.state.showMenu} onClick={this.handleMenuClick} />: null}
                <div className="game-info">
                    {/* <div>{status}</div>
                    <ol>{moves}</ol> */}
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



function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[b] === squares[a] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null;
}
