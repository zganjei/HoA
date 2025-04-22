import { Styrelsemedlem } from "@/types";

type BoardInfoProps = {
  styrelsemedlemmar: Styrelsemedlem[] | undefined | null; // Explicitly allow undefined or null
};

const BoardInfo: React.FC<BoardInfoProps> = ({ styrelsemedlemmar }) => (
  <div>
    <h3 className="font-bold">Styrelsemedlemmar:</h3>
    {styrelsemedlemmar ? (
      Array.isArray(styrelsemedlemmar) ? ( // Ensure it's an array before mapping
        styrelsemedlemmar.length > 0 ? (
          <ul>
            {styrelsemedlemmar.map((member, index) => (
              <li key={index}>
                <strong>{member.namn}</strong> - {member.roll}
              </li>
            ))}
          </ul>
        ) : (
          <p>Inga styrelsemedlemmar funna.</p>
        )
      ) : (
        <p className="text-red-500">Fel: Data för styrelsemedlemmar är inte i korrekt format.</p>
      )
    ) : (
      <p className="text-gray-500">Information om styrelsemedlemmar saknas.</p>
    )}
  </div>
);

export default BoardInfo;