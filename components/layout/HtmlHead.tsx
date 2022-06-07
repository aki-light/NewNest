import Head from "next/head";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

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
        href={`${publicRuntimeConfig.staticFolder}/images/favicon.ico`}
      />
    </Head>
  );
}
