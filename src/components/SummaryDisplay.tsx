import { SummaryData } from "@/types/types";
import BoardInfo from "./BoardInfo";
import LoansTable from "./LoansTable"; // Uppdaterat komponentnamn
import SummaryText from "./SummaryText";

type SummaryDisplayProps = {
  summary: SummaryData | string | null;
};

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  if (typeof summary === "string") {
    return <p>{summary}</p>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold">Föreningens Namn:</h3>
        <p>{summary.föreningens_namn}</p>
      </div>

      <BoardInfo styrelsemedlemmar={summary.styrelsemedlemmar} />

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">💰 Låneöversikt</h3>
        {summary.låneinformation && Array.isArray(summary.låneinformation) && summary.låneinformation.length > 0 ? (
          <LoansTable loanInfo={summary.låneinformation} />
        ) : (
          <p className="text-gray-500">Ingen låneinformation hittades.</p>
        )}
      </div>

      <SummaryText sammanfattning={summary.sammanfattning} />
    </div>
  );
};

export default SummaryDisplay;