import StartGame from "../../public/game_sources/rpg_1/src";
import { useEffect } from "react";

export default function TheLastBattle() {
  useEffect(() => {
    StartGame.startGame();
  });

  return <div id="play-game"></div>;
}
