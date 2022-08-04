import Link from "next/link";

export default function Menu({ diaPath }: { diaPath: string }) {
  return (
    <ul className="flex justify-around text-lg list-none text-white">
      <li>
        <Link href="/">
          <a>トップページ</a>
        </Link>
      </li>
      <li>
        <Link href={diaPath}>
          <a>開発日記</a>
        </Link>
      </li>
      <li>
        <Link href="/contact">
          <a>お問い合わせ</a>
        </Link>
      </li>
    </ul>
  );
}
