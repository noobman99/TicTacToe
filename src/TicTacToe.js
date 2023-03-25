import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

let playerNames = ["Jay", "Viru"];

class Square extends React.Component {
    constructor(props) {
        super(props);  // required before using this property
        this.isClickable = true;
        this.state = {
            value : ""
        };
    }

    setUnclickable(val){ // to export unclickable function to handleClick
        this.isClickable = false;
        this.setState({value : val});
    }

    render() {
        const rownum = (this.props.id - (this.props.id % 3 || 3))/3 + 1;
        const colnum = (this.props.id % 3 || 3);
        // data set for handleClick function
        const squaredat = {
            isClickable: this.isClickable,
            id: this.props.id,
            setUnclickable: (val) => this.setUnclickable(val)
        };

        return (
            // clickable - for styling and check, cellactive - for hover effect
            <div key={String(this.props.id)} className={`cell${this.isClickable ? " clickable" : ""}${(this.props.gameEnd || (!this.isClickable)) ? "" : " cellactive"}`} onClick={() => this.props.handleClick(squaredat)} style={{ gridRow: rownum, gridColumn: colnum }}>
                {this.state.value}
            </div>
        )
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.Xpos = []; // positions of X
        this.Opos = []; // positions of O
        this.gameEnd = [false, false]; //[gameend, draw?]

        // to refresh the component upon change, boardBack was added in state
        this.state = {
            Xmove : true,
            boardBack : Array(9).fill(""),
            score : [0, 0]
        };
    }

    squareConstruct(i) {
        return (
            <Square id={i} handleClick={(sqr) => this.handleClick(sqr)} gameEnd={this.gameEnd} />
        )
    }

    handleClick(square) {
        // to check if a move is valid or not
        if (this.gameEnd[0] || (!square.isClickable)) {
            return 0;
        }
        // updating the move into class variables
        if (this.state.Xmove){
            this.Xpos.push(square.id);
        } else {
            this.Opos.push(square.id);
        }

        let newboard = this.state.boardBack.slice();

        square.setUnclickable((this.state.Xmove ? "X" : "O"));  // set square to unclickable
        this.checkWin();  // to check if the game has ended

        this.setState((state) => {return { 
            Xmove : !state.Xmove,
            boardBack : newboard,
            score : state.score
        }});// switch moves and refresh footer
    }

    checkWin() {
        // winning positions
        const winPos = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

        let playerMoves =[];
        if (this.state.Xmove){
            playerMoves = this.Xpos;
        } else {
            playerMoves = this.Opos;
        }

        // checking if a winning position is attained
        for (let i=0; i<8; i++) {
            let checkCounter = false;  // if checkCounter is true, winning position is attained

            for (let j=0; j<3; j++) {
                if (playerMoves.includes(winPos[i][j])) {
                    checkCounter = true;
                } else {
                    checkCounter = false;
                    break;
                }
            }

            if (checkCounter) {
                let scoredummy = this.state.score.slice();
                scoredummy[(!this.state.Xmove) & 1] += 1;
                console.log(scoredummy);
                this.setState({
                    score : scoredummy,
                    Xmove : this.state.Xmove,
                    boardBack : this.state.boardBack,
                });
                this.gameEnd = [true, false];
                break;
            }
        }

        if ((this.Opos.length + this.Xpos.length)===9 && (!this.gameEnd[0])){
            this.gameEnd = [true, true];
        }
    }

    renderFooter(){
        if (this.gameEnd[0]){
            // footer for when game has ended
            console.log(this.state.score);
            if (this.gameEnd[1]){
                // if game has tied
                return (
                    <div className="board-footer gameResult">
                        The game is <span className="winnerChar">Tied!</span>
                    </div>
                )
            } else {
                // if a player won the game
                return (
                    <div className="board-footer gameResult">
                        <span className="winnerChar">{playerNames[(this.state.Xmove) & 1]}</span> Won the game.
                    </div>
                )
            }
        } else {
            // footer showing game state
            return(
                <div className="board-footer">
                    <span id="playermove">{playerNames[(!this.state.Xmove) & 1]}'s Move : </span>
                    <span className="playermoveValue"> {this.state.Xmove ? "X" : "O"} </span>
                </div>
                )
        }
    }

    render() {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // to use map function and create 9 gridcells

        return (
            <div className="boardholder-inner">
                <div className="board">
                    {arr.map((i) => this.squareConstruct(i))}
                </div>
                {this.renderFooter()}
                <div className="scoreboard">
                    <span className="playermoveValue" style={{gridRow:1, gridColumn:2}}>{this.state.score[0]}</span>
                    <span className="playermoveValue" style={{gridRow:1, gridColumn:4}}>{this.state.score[1]}</span>
                    <span className="playerName" style={{gridRow:2, gridColumn:2}}>{playerNames[0]}</span>
                    <span className="playerName" style={{gridRow:2, gridColumn:4}}>{playerNames[1]}</span>
                </div>
            </div>
        )
    }
}

function PlayerForm(){
    let [p1C, setP1C] = useState(true);
    let [p1N, setP1N] = useState("");
    let [p2N, setP2N] = useState("");

    const startgame = () => {
        if (p1C) {
            playerNames = [p1N , p2N];
        } else {
            playerNames = [p2N, p1N];
        }
        console.log(playerNames);
    }

    return (
        <div className="player-form">
            <form onSubmit={(e) => e.preventDefault()} className="player-form">
                <label className="playername">Player 1</label>
                <input type="text" name="player1Name" id="p1N" value={p1N} onChange={(e) => setP1N(e.target.value)} />
                <span className="playermoveValue" onClick={() => setP1C(!p1C)}>{p1C ? "X" : "O"}</span>
                <label className="playername">Player 2</label>
                <input type="text" name="player2Name" id="p2N" value={p2N} onChange={(e) => setP2N(e.target.value)} />
                <span className="playermoveValue" onClick={() => setP1C(!p1C)}>{p1C ? "O" : "X"}</span>
                <Link><button className="startGame" onClick={() => startgame()}>Start Game</button></Link>
            </form>
        </div>
    )
}


function Game() {
    return (
        <Router>
            <section className="game">
                <div className="game-inner">
                    <div className="board-holder">
                        <div className="board-title">
                            <span className="tictoe">Tic</span>Tac<span className="tictoe">Toe</span>
                        </div>
                        <Routes>
                            <Route path="/game" element={<Board />} />
                            <Route path="/" element={<PlayerForm />} />
                        </Routes>
                    </div>
                </div>
            </section>
        </Router>
    )
}

export default Game;