import Aside from "./Aside";
import { yearList, yearListStates } from "./types";

export default function DiaryContents({
  children,
  yearListStates,
  handleYearButtonClick,
}: {
  children: React.ReactNode;
  yearListStates: yearListStates;
  handleYearButtonClick: (value: yearList) => void;
}) {
  return (
    <div className="flex">
      <article className="w-4/5 order-2" style={{ margin: "1% 1% 0 1%" }}>
        {children}
      </article>
      <Aside
        yearListStates={yearListStates}
        handleYearButtonClick={handleYearButtonClick}
      />
    </div>
  );
}
