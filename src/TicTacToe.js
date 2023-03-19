import React, { useState } from "react";

class Square extends React.Component {
    constructor(props){
        super(props);
        this.isClickable = true;
        this.id = this.props.id;
        this.value = this.props.value;
    }
    render() {
        const rownum = 0;
        const colnum = (this.id%3 || 3);
        return (
            <div className="cell" onClick={this.props.handleClick} style={{gridRow: rownum, gridColumn: colnum}}>
                {this.value}
            </div>
        )
    }
}

class Board extends React.Component{
    constructor(props){
        super(props);
        this.Xpos = [];
        this.Opos = [];
        this.gameEnd = false;
        this.state = {
            XMove : true,
            boardBack : Array(9).fill("")
        };
    }

    squareConstruct(i){
        return (
            <Square value={this.boardBack[i]} id={i}/>
        )
    }

    handleClick(square){
        if (this.gameEnd || (!square.isClickable)){
            return 0;
        }
        const boardcopy = this.state.boardBack.slice();
        const Xmove = this.state.XMove;
        boardcopy[square.id] = (Xmove ? "X" : "O");
        (Xmove ? this.Xpos : this.Opos).push(square.id);
        this.checkWin();
        if (!this.gameEnd){
            Xmove = !Xmove;
        }
        this.setState({
            Xmove : Xmove,
            boardBack : boardcopy
        });
    }

    checkWin(){
        const winPos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
        const playerMoves = (this.state.XMove ? this.Xpos : this.Opos);
        for (let i in winPos){
            let checkCounter = false;
            for (let j in i){
              if (playerMoves.includes(j)){
                checkCounter = true;
              } else {
                checkCounter = false;
                break;
              }
            }
            if (checkCounter){
              this.gameEnd = true;
              break;
            }
          }
    }

    render (){
        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8,];

        return (
            <div className="board">
                {arr.map((i) => this.squareConstruct(i))}
            </div>
        )
    }
}