import Footer from "../layout/Footer";
import HtmlHead from "../layout/HtmlHead";

export default function GamePlayPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const history: string = "2021-2022";

  return (
    <>
      <HtmlHead title={title} />

      <div className="min-h-screen relative pb-28 box-border">
        {children}
        <Footer history={history} />
      </div>
    </>
  );
}
