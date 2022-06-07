import Image from "next/image";
import Link from "next/link";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

type GameIntroProps = {
  gameUrl: string;
  imageUrl: string;
  gameTitle: string;
  gameCaption: string;
};

export default function GameIntro({
  gameUrl,
  imageUrl,
  gameTitle,
  gameCaption,
}: GameIntroProps) {
  return (
    <div className="my-5 mr-1 w-64">
      <Link href={gameUrl}>
        <a>
          <img
            src={`${publicRuntimeConfig.staticFolder}${imageUrl}`}
            width={256}
            height={256}
            alt=""
          />
        </a>
      </Link>
      <Link href={gameUrl}>
        <a>
          <h3 className="text-xl font-bold text-center">{gameTitle}</h3>
        </a>
      </Link>
      <Link href={gameUrl}>
        <a>
          <p>{gameCaption}</p>
        </a>
      </Link>
    </div>
  );
}
