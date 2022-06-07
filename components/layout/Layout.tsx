import Footer from "./Footer";
import Header from "./Header";
import HtmlHead from "./HtmlHead";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export default function Layout({ title, children }: LayoutProps) {
  const history: string = "2021-2022";

  return (
    <>
      <HtmlHead title={title} />

      <div className="min-h-screen relative pb-28 box-border">
        <Header />
        {children}
        <Footer history={history} />
      </div>
    </>
  );
}
