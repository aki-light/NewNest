import GameList from "./GameList";
import UpdateHistory from "./UpdateHistory";

export default function HomeContents() {
  return (
    <div className="flex" style={{ color: "#443322" }}>
      <section className="w-full" style={{ margin: "1% 2% 0 2%" }}>
        <UpdateHistory />
        <GameList />
      </section>
    </div>
  );
}
