import { Styrelsemedlem } from "@/types";

type BoardInfoProps = {
  styrelsemedlemmar: Styrelsemedlem[];
};

const BoardInfo: React.FC<BoardInfoProps> = ({ styrelsemedlemmar }) => (
  <div>
    <h3 className="font-bold">Styrelsemedlemmar:</h3>
    <ul>
      {styrelsemedlemmar?.length ? (
        styrelsemedlemmar.map((member, index) => (
          <li key={index}>
            <strong>{member.namn}</strong> - {member.roll}
          </li>
        ))
      ) : (
        <p>Ej funnet</p>
      )}
    </ul>
  </div>
);

export default BoardInfo;