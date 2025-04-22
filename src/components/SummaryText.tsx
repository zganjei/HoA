import { SummaryTextProps} from "@/types/types";
  
  const SummaryText: React.FC<SummaryTextProps> = ({ summary }) => (
    <div>
      <h3 className="font-bold">Sammanfattning:</h3>
      <p>{summary || "Ej funnet"}</p>
    </div>
  );
  
  export default SummaryText;