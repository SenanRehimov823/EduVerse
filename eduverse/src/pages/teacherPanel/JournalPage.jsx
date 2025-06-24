import React from "react";
import JournalTable from "../../components/journal/JournalTable";

const JournalPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Müəllim Jurnalı</h1>
      <p>Aşağıdan dərs seçərək jurnala baxa bilərsiniz:</p>
      <JournalTable />
    </div>
  );
};

export default JournalPage;
