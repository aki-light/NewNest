import type { NextPage } from "next";
import Article from "../../components/diary_contents/Article";
import DiaryPage from "../../components/diary_contents/DiaryPage";

const Dia_2021_9: NextPage = () => {
  return (
    <DiaryPage title="dia_2021_9">
      <Article
        title="モチベーションが．．．"
        date="2021/9/26"
        paragraph="前回の日記の更新からだいぶ経ってしまいましたが、とりあえず今作っているRPGの製作は順調に進んでいます。日記の更新は今までは不定期でしたが、これからは週1のペースで書こうと思います。今作っているRPGは戦闘パートの大枠が出来上がったところです。思った通りRPGの戦闘についてのプログラミングは比較的簡単で自分の考えた通りの実装がいまのところ出来ています。ですが、前にも書いたように難易度調整に一体どれくらいかかるのか見当もつきません。このゲームはエンディング分岐を考えているので、できれば試行錯誤してなんとかトゥルーエンドを達成できるような難易度にしたいのですが、1人で調整をやるとなったら1人でゲームを何百回もプレイしないといけないわけなのでテストプレイヤーを募集するしかないのかなと考えています。最近はゲーム製作のモチベーションが下がり気味です。当初はゲームサイトを作ってアフィリエイトで稼ごうと思っていたのですが、最近はそんなことは無理なのではないかと自信が無くなってきています。とりあえずあと1年か2年やってみて手ごたえがなければ人生の方向転換をしようと思います。飼っている鳥の話ですが、先日体調が悪くなってしまって病院に行った結果、腸炎という診断で薬をあげれば数日で良くなるとのことで、実際にいまはピンピンしています。薬は苦いから飲んでくれないのではと思っていたところ、おいしそうに飲んでくれたので助かりました。鳥の病院となるとしっかりとしたところは少なく、当日予約がとれたところが車で片道2時間半かかり久しぶりの長距離ドライブでかなり疲れました。"
      />
      <Article
        title="財布にカビ"
        date="2021/9/10"
        paragraph="装備・アイテム選択画面と会話パートをあらかた作り終えました。装備・アイテム選択画面は武器や防具の種類やパラメーターなどの細かいところがたくさん残っていますがとりあえず戦闘パートを作り終えてからその調整をしたいと思います。今日クレジットカード決済のために財布をいつも入れているバッグから取り出したところ財布にカビが生えていました．．．倹約家の証ですね。"
      />
      <Article
        title="装備選択画面"
        date="2021/9/6"
        paragraph="1週間ほど日記を更新しませんでしたが製作をサボっていたわけではないので安心してください。といってもこれをみてくれてる人はいないと思いますが．．．今は主人公の装備とアイテムを選択する画面を作っています。作ってる途中で思ったのですが、主人公の体力や攻撃力などのパラメーターの種類を作り過ぎたせいでゲームバランスの調整がえらく大変になり、ゲーム製作時間の大半をその調整に費やすことになりそうです。作ってて大変なのは、ゲーム画面の大きさに限りがある以上は表示できる文字数も限られているので武器の名前とかパラメーターとかのレイアウトをよく考えないといけないことです。文字の大きさや位置調整にはかなり時間をつかいました。装備選択画面はほとんど完成しているので、次は会話パートになります。最近あるＭＭＯにとてもはまってしまって面白すぎて逆に辛いです。なかなかゲーム製作や他のやらなければいけないことがはかどらないというのもありますし、いつかはこの楽しさも終わってしまうのかと思うと悲しくなります。本当にそのＭＭＯに出会ったおかげで、ここ10年で今が一番楽しいです。正確にはＭＭＯでの他のプレイヤーとの交流が、あまり人と関わってこなかった自分にとってとても新鮮で楽しいです。ゲーム内の距離感というのが自分を変えているような気がします。ゲームとゲーム製作の両立を頑張りたいと思います。"
      />
    </DiaryPage>
  );
};

export default Dia_2021_9;
