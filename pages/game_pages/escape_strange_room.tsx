import type { NextPage } from "next";
import GamePlayPage from "../../components/game_play_page/GamePlayPage";
import dynamic from "next/dynamic";
import Header from "../../components/layout/Header";
import HowToPlay from "../../components/game_play_page/HowToPlay";
import Paragraph from "../../components/game_play_page/Paragraph";
import { useRouter } from "next/router";
const Game = dynamic(
  import("../../components/game_play_page/EscapeFromStrangeRoom"),
  {
    ssr: false,
  }
);

const EscapeStrangeRoom: NextPage = () => {
  const title: string = "escape from strange room";
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
        <Paragraph
          title="セーブデータについて"
          sentence="このゲームはオートセーブ対応ですが、ブラウザにセーブデータを保存（正確にはブラウザを通してハードディスクに保存）しているのでCookieやキャッシュを消そうとしてこのサイトのサイトデータも一緒に消すと、セーブデータが消えてしまいます。"
        />
      </HowToPlay>
      <HowToPlay title="遊び方">
        <Paragraph
          title="移動"
          sentence="床をタップすると選択状態になり、もう一度タップすると移動できます。"
        />
        <Paragraph
          title="調べる"
          sentence="調べたいものに近づきタップすると調べることができます。"
        />
        <Paragraph
          title="アイテム確認"
          sentence="MENUボタンをタップし、メニューバーを開き、カバンのマークをタップすると持ち物を確認できます。"
        />
      </HowToPlay>
    </GamePlayPage>
  );
};

export default EscapeStrangeRoom;
