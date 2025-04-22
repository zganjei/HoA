export type Member = {
    name: string;
    role: string;
  };
  
  export type LoanInformation = {
    bank: string;
    amount: string;
    interest: string;
    term: string;
  };
  
  export type SummaryData = {
    association: string;
    members: Member[];
    summary: string;
    loan: LoanInformation | LoanInformation[]; // Allow for single or multiple loans
  };

  
  export type SummaryDisplayProps = {
    summary: SummaryData | string | null;
  };
  
  export type FileUploaderProps = {
    onFileChange: (file: File | null) => void;
    onSubmit: (event: React.FormEvent) => void;
    loading: boolean;
  };

  export type SummaryTextProps = {
    summary?: string; // Make prop optional
  };

  export type LoanTableProps = {
    loanInfo?: LoanInformation | LoanInformation[]; // Make prop optional
  };

  export type BoardInfoProps = {
    members: Member[] | undefined | null; // Explicitly allow undefined or null
  };