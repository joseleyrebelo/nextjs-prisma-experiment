import Link from "next/link";
import { UserQuery } from "../types/user";

const UserCard = ({ id, fullName, color, connections }: UserQuery) => {
  return (
    <Link href={"/user/" + id}>
      <div className="rounded-md p-5 shadow-xl bg-white mb-10 transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <h3 className="">{fullName}</h3>
          <div
            className="p-3 rounded-xl text-sm"
            style={{ backgroundColor: color }}
          >
            <span className="mix-blend-overlay text-white">{color}</span>
          </div>
        </div>
        {connections && (
          <div className="flex flex-row flex-wrap m-3 justify-start items-center">
            {connections.map(({ connector }) => (
              <div
                key={connector.fullName + connector.color + connector.id}
                className="p-2 text-xs rounded-lg border-2"
                style={{ borderColor: connector.color }}
              >
                {connector.fullName}
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default UserCard;
