import MonthList from "./MonthList";
import { yearList, yearListStates } from "./types";
import YearList from "./YearList";

export default function Aside({
  yearListStates,
  handleYearButtonClick,
}: {
  yearListStates: yearListStates;
  handleYearButtonClick: (value: yearList) => void;
}) {
  return (
    <aside className="w-1/5 order-1" style={{ margin: "1% 0 0 1%" }}>
      <h2 className="text-lg text-white font-bold text-center bg-brown">
        記事一覧
      </h2>
      <YearList
        year="2022"
        yearListStates={yearListStates}
        handleYearButtonClick={handleYearButtonClick}
      >
        <MonthList month="06" href="/diaries/dia_2022_6" />
      </YearList>
      <YearList
        year="2021"
        yearListStates={yearListStates}
        handleYearButtonClick={handleYearButtonClick}
      >
        <MonthList month="08" href="/diaries/dia_2021_8" />
        <MonthList month="09" href="/diaries/dia_2021_9" />
        <MonthList month="10" href="/diaries/dia_2021_10" />
      </YearList>
    </aside>
  );
}
