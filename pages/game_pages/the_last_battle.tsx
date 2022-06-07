import type { NextPage } from "next";
import GamePlayPage from "../../components/game_play_page/GamePlayPage";
import dynamic from "next/dynamic";
import Header from "../../components/layout/Header";
import HowToPlay from "../../components/game_play_page/HowToPlay";
import Paragraph from "../../components/game_play_page/Paragraph";
import { useRouter } from "next/router";
const Game = dynamic(import("../../components/game_play_page/TheLastBattle"), {
  ssr: false,
});

const TheLastBattle: NextPage = () => {
  const title: string = "the last battle";
  const router = useRouter();

  router.events?.on("routeChangeComplete", () => {
    router.reload();
  });
  return (
    <GamePlayPage title={title}>
      <div className="min-h-screen" style={{ backgroundColor: "#222222" }}>
        <Header />
        <Game />
      </div>

      <HowToPlay title="注意">
        <Paragraph
          title="対応ブラウザについて"
          sentence="IEでは遊べません。Google Chrome、FireFox、Microsoft
              Edge、Safari、Operaでは動作確認済みです。遊べない場合はブラウザが古いバージョンでないか確認してください。"
        />
      </HowToPlay>
      <HowToPlay title="ステータス一覧">
        <Paragraph title="HP" sentence="体力・・・0になるとゲームオーバー" />
        <Paragraph title="FP" sentence="集中力・・・戦技をつかうのに消費する" />
        <Paragraph
          title="ATK"
          sentence="攻撃力・・・高いほど与えるダメージが高い"
        />
        <Paragraph
          title="DEF"
          sentence="守備力・・・高いほど受けるダメージが減る"
        />
        <Paragraph
          title="DV"
          sentence="回避・・・高いほど攻撃を回避しやすくなる"
        />
        <Paragraph
          title="HIT"
          sentence="命中・・・高いほど攻撃をミスしなくなる"
        />
        <Paragraph
          title="CRIT"
          sentence="クリティカル・・・高いほどクリティカルがでやすくなる"
        />
      </HowToPlay>
    </GamePlayPage>
  );
};

export default TheLastBattle;
