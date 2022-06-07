import Link from "next/link";

export default function MonthList({
  href,
  month,
}: {
  href: string;
  month: string;
}) {
  return (
    <li>
      <Link href={href}>
        <a className="hover:bg-brown hover:text-white">{month}</a>
      </Link>
    </li>
  );
}
