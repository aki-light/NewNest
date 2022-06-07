import type { NextPage } from "next";
import Article from "../../components/diary_contents/Article";
import DiaryPage from "../../components/diary_contents/DiaryPage";

const Dia_2022_6: NextPage = () => {
  return (
    <DiaryPage title="dia_2022_6">
      <Article
        title="色当てゲーム公開"
        date="2022/6/6"
        paragraph="かなり長い間日記を書いていませんでしたが、その間に、ラスボス戦だけのRPGとミニゲームとして、色当てゲームを公開しました。"
      />
    </DiaryPage>
  );
};

export default Dia_2022_6;
