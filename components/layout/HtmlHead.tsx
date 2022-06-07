import Head from "next/head";

export default function HtmlHead({ title }: { title: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta
        name="description"
        content="ブラウザゲーム(HTML5ゲーム)を制作しています。I am making browser game (HTML5 game)."
      />
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href="/images/favicon.ico"
      />
    </Head>
  );
}
