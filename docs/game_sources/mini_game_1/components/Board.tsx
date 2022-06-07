import React, { useState } from "react";
import Square from "./Square";
import { squareParams } from "../Types";

function Board(props: {
  squareParamsList: squareParams[];
  score: number;
  isGameOver: boolean;
  isGameStarted: boolean;
}) {
  function renderSquare(squareParams: squareParams) {
    return (
      <Square
        colorName={squareParams.colorName}
        bgColor={squareParams.bgColor}
        isCorrect={squareParams.isCorrect}
        handleClick={props.score === 0 ? squareParams.handleClick : () => {}}
      />
    );
  }

  if (props.isGameOver || !props.isGameStarted) {
    return <div></div>;
  }

  return (
    <div>
      <div>
        {renderSquare(props.squareParamsList[0])}
        {renderSquare(props.squareParamsList[1])}
        {renderSquare(props.squareParamsList[2])}
      </div>
      <div>
        {renderSquare(props.squareParamsList[3])}
        {renderSquare(props.squareParamsList[4])}
        {renderSquare(props.squareParamsList[5])}
      </div>
      <div>
        {renderSquare(props.squareParamsList[6])}
        {renderSquare(props.squareParamsList[7])}
        {renderSquare(props.squareParamsList[8])}
      </div>
    </div>
  );
}

export default Board;
