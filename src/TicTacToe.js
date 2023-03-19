import React from "react";

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
        this.XMove = true;
        this.Xpos = [];
        this.Opos = [];
        this.gameEnd = false;
        this.boardBack = Array(9).fill("");
    }

    squareConstruct(i){
        return (
            <Square value={this.boardBack[i]} id={i}/>
        )
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