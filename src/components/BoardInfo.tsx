import { BoardInfoProps } from "@/types/types";


const BoardInfo: React.FC<BoardInfoProps> = ({ members }) => (
  <div>
    <h3 className="font-bold">Styrelsemedlemmar:</h3>
    {members ? (
      Array.isArray(members) ? ( // Ensure it's an array before mapping
        members.length > 0 ? (
          <ul>
            {members.map((member, index) => (
              <li key={index}>
                <strong>{member.name}</strong> - {member.role}
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