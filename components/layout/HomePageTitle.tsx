import Link from "next/link";
import Image from "next/image";
import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default function HomePageTitle() {
  return (
    <div className="pl-5 pt-2 pb-2">
      <img
        src={`${publicRuntimeConfig.staticFolder}/images/home-title.png`}
        width={191}
        height={35}
        alt="title"
      />
    </div>
  );
}
