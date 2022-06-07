export default function Article({
  title,
  date,
  paragraph,
}: {
  title: string;
  date: string;
  paragraph: string;
}) {
  return (
    <div
      className="shadow-md rounded pl-5 bg-skin"
      style={{
        borderTop: "solid 10px #ffeec4",
        marginBottom: "1%",
      }}
    >
      <header>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <h3 className="text-sm font-bold mb-1">{date}</h3>
      </header>
      <p className="text-justify text-base pr-5 pb-5">{paragraph}</p>
    </div>
  );
}
