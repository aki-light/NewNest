import React, { useState } from "react";
import Board from "./components/Board";
import Result from "./components/Result";
import NextButton from "./components/NextButton";
import { colorNameTypes, squareParams } from "./Types";
import GameResult from "./components/GameResult";
import styles from "../../../styles/colorGame.module.css";

function App() {
  const colors = {
    red: "#fa3c3c",
    blue: "#2683fc",
    green: "#26fc4d",
    yellow: "#f9fc35",
    white: "#ffffff",
    purple: "#f743f1",
    orange: "#fa732a",
  };

  const colorNames = [
    "red",
    "blue",
    "green",
    "yellow",
    "white",
    "purple",
    "orange",
  ];

  const numberOfPlay = 10;

  let timeOutId: NodeJS.Timeout;

  const [gameStates, setGameStates] = useState({
    score: 0,
    totalScore: 0,
    countDown: numberOfPlay,
    isGameOver: false,
    isGameStarted: false,
    squareParamsList: shuffleColor(),
  });

  function handleSquareClick(isCorrect: boolean) {
    clearTimeout(timeOutId);
    if (isCorrect) {
      setGameStates((gameStates) => {
        return {
          ...gameStates,
          countDown: gameStates.countDown - 1,
          totalScore: gameStates.totalScore + 100,
          score: 1,
        };
      });
    } else {
      setGameStates((gameStates) => {
        return {
          ...gameStates,
          countDown: gameStates.countDown - 1,
          totalScore: gameStates.totalScore - 50,
          score: -1,
        };
      });
    }
  }

  function handleClickNext() {
    if (!gameStates.isGameStarted) {
      setGameStates((gameStates) => {
        return {
          ...gameStates,
          isGameStarted: true,
        };
      });
      timeOutId = setTimeout(() => {
        handleSquareClick(false);
      }, 3000);
    } else if (gameStates.isGameOver) {
      setGameStates((gameStates) => {
        return {
          ...gameStates,
          score: 0,
          countDown: numberOfPlay,
          totalScore: 0,
          isGameOver: false,
          squareParamsList: shuffleColor(),
        };
      });
      timeOutId = setTimeout(() => {
        handleSquareClick(false);
      }, 3000);
    } else if (gameStates.countDown <= 0) {
      setGameStates((gameStates) => {
        return {
          ...gameStates,
          score: 0,
          isGameOver: true,
        };
      });
    } else {
      setGameStates((gameStates) => {
        return {
          ...gameStates,
          score: 0,
          squareParamsList: shuffleColor(),
        };
      });
      timeOutId = setTimeout(() => {
        handleSquareClick(false);
      }, 3000);
    }
  }

  function shuffleColor(): squareParams[] {
    const squareParamsList = [];
    for (let i = 0; i < 9; i++) {
      squareParamsList.push(createSquareParams(false));
    }
    squareParamsList[Math.floor(Math.random() * 8)] = createSquareParams(true);
    return squareParamsList;
  }

  function createSquareParams(isCorrect: boolean): squareParams {
    if (isCorrect) {
      const colorName = colorNames[Math.floor(Math.random() * 7)];
      const color = colors[colorName as colorNameTypes];

      const squareParams = {
        colorName: colorName,
        bgColor: color,
        isCorrect: true,
        handleClick: handleSquareClick,
      };

      return squareParams;
    } else {
      const index = Math.floor(Math.random() * 7);
      const colorName = colorNames[index];
      const otherColorNames = [...colorNames];
      otherColorNames.splice(index, 1);
      const otherColorName = otherColorNames[Math.floor(Math.random() * 6)];
      const color = colors[otherColorName as colorNameTypes];

      const squareParams = {
        colorName: colorName,
        bgColor: color,
        isCorrect: false,
        handleClick: handleSquareClick,
      };

      return squareParams;
    }
  }

  return (
    <div className={styles.app}>
      <Result score={gameStates.score} />
      <Board
        squareParamsList={gameStates.squareParamsList}
        score={gameStates.score}
        isGameOver={gameStates.isGameOver}
        isGameStarted={gameStates.isGameStarted}
      />
      <GameResult
        isGameOver={gameStates.isGameOver}
        totalScore={gameStates.totalScore}
      />
      <NextButton
        score={gameStates.score}
        countDown={gameStates.countDown}
        isGameOver={gameStates.isGameOver}
        isGameStarted={gameStates.isGameStarted}
        handleClick={handleClickNext}
      />
    </div>
  );
}

export default App;
