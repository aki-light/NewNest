import HomePageTitle from "./HomePageTitle";
import Menu from "./Menu";

export default function Header() {
  const diaPath: string = "/diaries/dia_2022_6";

  return (
    <div
      className="shadow-md bg-cover text-center sm:text-left"
      style={{ backgroundImage: "url(/images/top-img2.jpg)" }}
    >
      <HomePageTitle />
      <Menu diaPath={diaPath} />
    </div>
  );
}
