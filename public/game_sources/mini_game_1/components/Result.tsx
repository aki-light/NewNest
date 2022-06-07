import React from "react";
import styles from "../../../../styles/colorGame.module.css";

function Result(props: { score: number }) {
  if (props.score === 1) {
    return (
      <div>
        <div className={styles.signO}>
          <span>○</span>
        </div>
        <div className={styles.pointText}>
          <span>+100</span>
        </div>
      </div>
    );
  } else if (props.score === -1) {
    return (
      <div>
        <div className={styles.signX}>
          <span>×</span>
        </div>
        <div className={styles.pointText}>
          <span>-50</span>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Result;
