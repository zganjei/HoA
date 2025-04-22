type SummaryTextProps = {
    sammanfattning?: string; // Make prop optional
  };
  
  const SummaryText: React.FC<SummaryTextProps> = ({ sammanfattning }) => (
    <div>
      <h3 className="font-bold">Sammanfattning:</h3>
      <p>{sammanfattning || "Ej funnet"}</p>
    </div>
  );
  
  export default SummaryText;