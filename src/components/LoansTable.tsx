import { LoanTableProps } from "@/types/types";

const LoanTable: React.FC<LoanTableProps> = ({ loanInfo }) => {
  if (!loanInfo) {
    return <p className="text-gray-500">Ingen låneinformation tillgänglig.</p>;
  }

  const loans = Array.isArray(loanInfo) ? loanInfo : [loanInfo];

  if (loans.length === 0) {
    return <p className="text-gray-500">Ingen låneinformation hittades.</p>;
  }

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
          {loans.map((loan, index) => (
            <tr key={index} className="text-sm text-gray-700 even:bg-gray-50">
              <td className="px-4 py-2 border">{loan.bank}</td>
              <td className="px-4 py-2 border">{loan.amount}</td>
              <td className="px-4 py-2 border">{loan.interest}</td>
              <td className="px-4 py-2 border">{loan.term}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanTable;