import React, { useState } from "react";
import DiaryContents from "../../components/diary_contents/DiaryContents";
import Layout from "../../components/layout/Layout";
import { yearList } from "./types";

export default function DiaryPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [yearListStates, setYearListStates] = useState({
    "2021": false,
    "2022": false,
  });

  const allClose = () => {
    setYearListStates((yearListStates) => {
      return {
        "2021": false,
        "2022": false,
      };
    });
  };

  const handleYearButtonClick = (year: yearList) => {
    allClose();
    if (!yearListStates[year]) {
      setYearListStates((yearListStates) => {
        return {
          ...yearListStates,
          [year]: true,
        };
      });
    }
  };

  return (
    <div onClick={allClose}>
      <Layout title={title}>
        <DiaryContents
          yearListStates={yearListStates}
          handleYearButtonClick={handleYearButtonClick}
        >
          {children}
        </DiaryContents>
      </Layout>
    </div>
  );
}
