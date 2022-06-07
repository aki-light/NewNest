import { yearList, yearListStates } from "./types";

export default function YearList({
  year,
  children,
  yearListStates,
  handleYearButtonClick,
}: {
  year: yearList;
  children: React.ReactNode;
  yearListStates: yearListStates;
  handleYearButtonClick: (value: yearList) => void;
}) {
  const clickHandler = () => {
    handleYearButtonClick(year);
  };

  return (
    <div className="relative">
      <div
        className="font-bold text-lg block bg-white text-center py-5 cursor-pointer hover:bg-skin"
        onClick={(e) => {
          clickHandler();
          e.stopPropagation();
        }}
      >
        <h3>{year}</h3>
      </div>
      {yearListStates[year] ? (
        <ul
          className="absolute grid bg-white px-2 py-2 shadow-md rounded text-2xl font-bold text-brown"
          style={{
            top: "0",
            left: "105%",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          {children}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
}
