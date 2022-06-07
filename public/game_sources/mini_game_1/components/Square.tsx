import React, { useEffect, useState } from "react";
import { squareParams } from "../Types";
import styles from "../../../../styles/colorGame.module.css";

function Square(props: squareParams) {
  const [isCorrect, setIsCorrect] = useState(props.isCorrect);

  function handleClick(): void {
    props.handleClick(isCorrect);
  }

  useEffect(() => {
    setIsCorrect(props.isCorrect);
  });

  return (
    <button
      className={styles.square}
      style={{ background: props.bgColor }}
      onClick={handleClick}
    >
      {props.colorName}
    </button>
  );
}

export default Square;
