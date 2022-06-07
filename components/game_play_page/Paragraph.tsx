export default function Paragraph({
  title,
  sentence,
}: {
  title: string;
  sentence: string;
}) {
  return (
    <div style={{ borderTop: "dashed #000000", marginBottom: "2%" }}>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-lg">{sentence}</p>
    </div>
  );
}
