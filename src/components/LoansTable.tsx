import { Låneinformation } from "@/types";

type LoanTableProps = {
  loanInfo: Låneinformation | Låneinformation[];
};

const LoanTable: React.FC<LoanTableProps> = ({ loanInfo }) => {
  const loans = Array.isArray(loanInfo) ? loanInfo : [loanInfo];
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Bank</th>
            <th className="px-4 py-2 border">Belopp</th>
            <th className="px-4 py-2 border">Ränta</th>
            <th className="px-4 py-2 border">Löptid</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((lån, index) => (
            <tr key={index} className="text-sm text-gray-700 even:bg-gray-50">
              <td className="px-4 py-2 border">{lån.banknamn}</td>
              <td className="px-4 py-2 border">{lån.lånebelopp}</td>
              <td className="px-4 py-2 border">{lån.räntesats}</td>
              <td className="px-4 py-2 border">{lån.löptid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanTable;