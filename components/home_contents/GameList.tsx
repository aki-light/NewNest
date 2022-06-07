import GameIntro from "./GameIntro";
import GameCategory from "./GameCategory";

export default function GameList() {
  return (
    <>
      <GameCategory gameCategory="RPG">
        <GameIntro
          gameUrl="/game_pages/the_last_battle"
          imageUrl="/images/the_last_battle_img.png"
          gameTitle="The last battle"
          gameCaption="ラスボス戦だけのRPGです。（笑）"
        />
      </GameCategory>

      <GameCategory gameCategory="脱出ゲーム">
        <GameIntro
          gameUrl="/game_pages/escape_strange_room"
          imageUrl="/images/escape_game_image.png"
          gameTitle="奇妙な部屋からの脱出"
          gameCaption="記念すべき第1作目の脱出ゲームです。"
        />
      </GameCategory>

      <GameCategory gameCategory="ミニゲーム">
        <GameIntro
          gameUrl="/game_pages/color_game"
          imageUrl="/images/color_game_img.png"
          gameTitle="色当てゲーム"
          gameCaption="色の名前と背景色が一致しているパネルを当てるゲームです。"
        />
      </GameCategory>
    </>
  );
}
