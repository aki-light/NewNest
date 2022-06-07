import React from "react";
import styles from "../../../../styles/colorGame.module.css";

function NextButton(props: {
  score: number;
  countDown: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  handleClick: () => void;
}) {
  if (!props.isGameStarted) {
    return (
      <button className={styles.nextButton} onClick={props.handleClick}>
        {"START"}
      </button>
    );
  } else if (props.isGameOver) {
    return (
      <button className={styles.nextButton} onClick={props.handleClick}>
        {"RESTART"}
      </button>
    );
  } else if (props.countDown <= 0 && !props.isGameOver) {
    return (
      <button className={styles.nextButton} onClick={props.handleClick}>
        {"RESULT"}
      </button>
    );
  } else if (props.score !== 0) {
    return (
      <button className={styles.nextButton} onClick={props.handleClick}>
        {"NEXT"}
      </button>
    );
  } else {
    return <div></div>;
  }
}

export default NextButton;
