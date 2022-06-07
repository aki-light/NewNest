import React from "react";
import styles from "../../../../styles/colorGame.module.css";

function GameResult(props: { isGameOver: boolean; totalScore: number }) {
  if (props.isGameOver) {
    return (
      <div>
        <div className={styles.gameResultTitle}>
          <span>Total Score</span>
        </div>
        <div className={styles.totalScore}>
          <span>{props.totalScore}</span>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default GameResult;
