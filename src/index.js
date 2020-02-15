import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <div className="square">
            <button className="square-inside" onClick={props.onClick}>
                {props.value}
            </button></div>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return (<Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />);
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>

        );
    }
}



class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{ squares: Array(9).fill(null), }],
            xISNext: true,
            stepNumber: 0,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({ squares: squares }),
            stepNumber: history.length, xIsNext: !this.state.xIsNext
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner:' + winner;
        } else {
            status = 'Next player: ' + (this.state.xISNext ? 'X' : 'O');
        }
        const moves = history.map((_step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (<li key={move}><button onClick={() => this.jumpTo(move)}>{desc}</button></li>)
        })

        return (
            <div className="game">
                <div className="sudoku">
                    <div className="board-row">
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                    </div>
                    <div className="board-row">
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                    </div>
                    <div className="board-row">
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                        <div className="three-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                        </div>
                    </div>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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


// class LoginControl extends React.Component{
//     constructor(props) {
//         super(props);
//         this.handleLoginClick = this.handleLoginClick.bind(this)
//         this.handleLogoutClick = this.handleLogoutClick.bind(this)
//         this.state = {isLoggedIn:false}
//     }

//     handleLoginClick () {
//         this.setState({isLoggedIn: true});
//     }

//     handleLogoutClick () {
//         this.setState({isLoggedIn:false})
//     }

//     render() {
//         const isLoggedIn = this.state.isLoggedIn;
//         let button;
//         button = isLoggedIn ? <LogoutButton onClick={this.handleLogoutClick}/> : 
//                             <LoginButton onClick={this.handleLoginClick} />;
//         return ( <div>
//             <Greeting isLoggedIn={isLoggedIn}></Greeting>
//             {button}
//         </div> )
//     }
// }


// function LogoutButton(props) {
//     return <button onClick= {props.onClick}>LogOut</button>
// }

// function LoginButton(props) {
//     return <button onClick = {props.onClick}>LogIn</button>
// }

// function Greeting(props) {
//     if (props.isLoggedIn) {
//         return <h1>Log in: ({props.isLoggedIn ? "True" : "False"})</h1>
//     } else {
//         return null
//     }

// }


// ReactDOM.render(<LoginControl/>,document.getElementById('root'))



// class NumberList extends React.Component {
//     constructor (props) {
//         super(props)
//         this.state = {number:props.number}
//     }

//     render () {

//         const numberList = Array.from(Array(10).keys()).map(e => e  + this.state.number);
//         return (<ul>
//             {numberList.map((e, i) => <li key={e}>{e}</li>)}
//         </ul>)
//     }

//     componentDidMount () {
//         this.timerID = setInterval(() => {
//             this.setState((state,props)=>({
//                 number: state.number + 1
//             }))
//         }, 1000);
//     }

//     componentWillUnmount() {
//         clearInterval(this.timerID)
//     }

// }

// ReactDOM.render(<NumberList number={5}></NumberList>,document.getElementById(
//     'root'
// ))



// class NameForm extends React.Component {
//     constructor (props) {
//         super(props);
//         this.state = { value: ["coconut"]};
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleChange (e) {
//         console.log(e.target.value)
//         this.setState({ value: [e.target.value]})
//     }

//     handleSubmit (e) {
//         alert('submit' + this.state.value)
//         e.preventDefault();
//     }

//     render() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//         <label>
//           Pick your favorite flavor:
//           <select value={["lime"]} multiple={true} onChange={this.handleChange}>
//             <option value="grapefruit">Grapefruit</option>
//             <option value="lime">Lime</option>
//             <option value="coconut">Coconut</option>
//             <option value="mango">Mango</option>
//           </select>
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//         )
//     }
// }
// ReactDOM.render(<NameForm/>, document.getElementById(
//     'root'
// ))


// ReactDOM.render(<input value="hi" />, document.getElementById(
//     'root'
// ));



