import React from "react";

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.isClickable = true;
    }

    setUnclickable(){
        this.isClickable = false;
    }

    render() {
        const rownum = (this.props.id - (this.props.id % 3 || 3))/3 + 1;
        const colnum = (this.props.id % 3 || 3);
        const squaredat = {
            isClickable: this.isClickable,
            id: this.props.id,
            setUnclickable: () => this.setUnclickable()
        };
        return (
            <div className={`cell${this.isClickable ? " clickable" : ""}`} onClick={() => this.props.handleClick(squaredat)} style={{ gridRow: rownum, gridColumn: colnum }} key={this.props.id}>
                {this.props.value}
            </div>
        )
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.Xpos = [];
        this.Opos = [];
        this.gameEnd = false;
        this.Xmove = true;
        this.state = {
            boardBack: Array(9).fill("")
        };
    }

    squareConstruct(i) {
        return (
            <Square value={this.state.boardBack[i]} id={i} handleClick={(sqr) => this.handleClick(sqr)} />
        )
    }

    handleClick(square) {
        if (this.gameEnd || (!square.isClickable)) {
            return 0;
        }
        const boardcopy = this.state.boardBack.slice();
        boardcopy[square.id] = (this.Xmove ? "X" : "O");
        if (this.Xmove){
            this.Xpos.push(square.id);
        } else {
            this.Opos.push(square.id);
        }
        square.setUnclickable();
        this.checkWin();
        this.Xmove = !this.Xmove;
        this.setState({
            boardBack: boardcopy
        });
    }

    checkWin() {
        const winPos = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
        console.log(this.Xmove);
        let playerMoves =[];
        if (this.Xmove){
            playerMoves = this.Xpos;
        } else {
            playerMoves = this.Opos;
        }
        console.log(playerMoves);
        for (let i=0; i<8; i++) {
            let checkCounter = false;
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

    render() {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        return (
            <div className="board">
                {arr.map((i) => this.squareConstruct(i))}
            </div>
        )
    }
}

function Game() {
    return (
        <section className="game">
            <div className="board-holder">
                <Board />
            </div>
        </section>
    )
}

export default Game;