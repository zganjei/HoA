import { SummaryDisplayProps} from "@/types/types";
import BoardInfo from "./BoardInfo";
import LoansTable from "./LoansTable";
import SummaryText from "./SummaryText";


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
        <p>{summary.association}</p>
      </div>

      <BoardInfo members={summary.members} />

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">💰 Låneöversikt</h3>
        {summary.loan && Array.isArray(summary.loan) && summary.loan.length > 0 ? (
          <LoansTable loanInfo={summary.loan} />
        ) : (
          <p className="text-gray-500">Ingen låneinformation hittades.</p>
        )}
      </div>

      <SummaryText summary={summary.summary} />
    </div>
  );
};

export default SummaryDisplay;