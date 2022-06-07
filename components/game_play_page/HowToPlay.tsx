export default function HowToPlay({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white shadow-md rounded px-5 py-5"
      style={{ borderTop: "double 5px #dafec7", margin: "2% 2%" }}
    >
      <h2 className="text-3xl font-bold" style={{ marginBottom: "1%" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
