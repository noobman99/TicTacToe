import React from "react";

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
        this.gameEnd = false;

        // to refresh the component upon change, boardBack was added in state
        this.state = {
            Xmove : true
        };
    }

    squareConstruct(i) {
        return (
            <Square id={i} handleClick={(sqr) => this.handleClick(sqr)} gameEnd={this.gameEnd} />
        )
    }

    handleClick(square) {
        // to check if a move is valid or not
        if (this.gameEnd || (!square.isClickable)) {
            return 0;
        }
        // updating the move into class variables
        if (this.state.Xmove){
            this.Xpos.push(square.id);
        } else {
            this.Opos.push(square.id);
        }

        square.setUnclickable((this.state.Xmove ? "X" : "O"));  // set square to unclickable
        this.checkWin();  // to check if the game has ended

        this.setState({ Xmove : !this.state.Xmove});// switch moves and refresh footer
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
                this.gameEnd = true;
                break;
            }
        }
    }

    renderFooter(){
        if (this.gameEnd){
            // footer for when game has ended
            return (
                <div className="board-footer gameResult">
                    <span className="winnerChar">{this.state.Xmove ? "O" : "X"}</span><span>Won The Game</span>
                </div>
            )
        } else {
            // footer showing game state
            return(
                <div className="board-footer">
                    <span id="playermove">Player Move : </span>
                    <span id="playermoveValue"> {this.state.Xmove ? "X" : "O"} </span>
                </div>
                )
        }
    }

    render() {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // to use map function and create 9 gridcells

        return (
            <div className="board-holder">
                <div className="board-title">
                    <span className="tictoe">Tic</span>Tac<span className="tictoe">Toe</span>
                </div>
                <div className="board">
                    {arr.map((i) => this.squareConstruct(i))}
                </div>
                {this.renderFooter()}
            </div>
        )
    }
}

function Game() {
    return (
        <section className="game">
            <div className="game-inner">
                <Board />
            </div>
        </section>
    )
}

export default Game;