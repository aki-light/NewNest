export default function GameIntro({
  gameCategory,
  children
}: {gameCategory: string, children: React.ReactNode;}) {
  return (
    <>
      <header
        className="bg-white shadow-md mb-2 text-2xl pl-7 font-bold py-1"
        style={{ borderTop: "double 5px #dafec7" }}
      >
        <h2>{gameCategory}</h2>
      </header>
      <div className="bg-white shadow-md flex flex-wrap justify-center rounded mb-3">
        {children}
      </div>
    </>
  );
}
