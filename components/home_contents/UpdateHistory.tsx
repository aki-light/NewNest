export default function UpdateHistory() {
  return (
    <div
      className="bg-white shadow-md px-3 mb-7 overflow-y-scroll"
      style={{ borderTop: "double 5px #dafec7", height: "10%" }}
    >
      <h3 className="text-base font-bold mb-2">更新履歴</h3>

      <p className="pb-3 text-sm" style={{ borderTop: "1px dotted #432" }}>
        2022/5/21　色当てゲーム公開
      </p>
      <p className="pb-3 text-sm" style={{ borderTop: "1px dotted #432" }}>
        2021/12/08　「The last battle」 公開
      </p>
      <p className="pb-3 text-sm" style={{ borderTop: "1px dotted #432" }}>
        2021/08/19　サイト開設＆「奇妙な部屋からの脱出」公開
      </p>
    </div>
  );
}
