import type { NextPage } from "next";
import GamePlayPage from "../../components/game_play_page/GamePlayPage";
import Header from "../../components/layout/Header";
import HowToPlay from "../../components/game_play_page/HowToPlay";
import Paragraph from "../../components/game_play_page/Paragraph";
import App from "../../public/game_sources/mini_game_1/App";
import Comment from "../../components/game_play_page/Comment";

const ColorGame: NextPage = () => {
  const title: string = "color game";

  return (
    <GamePlayPage title={title}>
      <div className="min-h-screen" style={{ backgroundColor: "#222222" }}>
        <Header />
        <App />
      </div>

      <Comment collectionName="colorGameComments" />

      <HowToPlay title="遊び方">
        <Paragraph
          title=""
          sentence="3秒以内に、パネルに書かれた色の名前とパネルの背景色が同じものをクリックすると得点できます。"
        />
      </HowToPlay>
    </GamePlayPage>
  );
};

export default ColorGame;
