import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getUserData } from "../../prisma/utils";
import { UserQuery } from "../../types/user";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { useEffect, useRef, useState } from "react";
import onClickedOut from "../../util/onClickOutside";

type Props = {
  data: UserQuery;
};

export default function User({ data }: Props) {
  const colorPickerRef = useRef(null);
  const { fullName, connections } = data;
  const [isColorPicking, setIsColorPicking] = useState(false);
  const [color, setColor] = useColor("hex", data.color);
  onClickedOut(colorPickerRef, () => setIsColorPicking(false));

  return (
    <div className="block">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-center text-xl">{fullName}</h2>
        <div className="flex flex-row items-center border border-slate-300 rounded-xl p-2 relative">
          <div className="text-sm text-center pr-3 opacity-40 w-24 leading-tight">
            Favourite color:
          </div>
          <div
            className={
              `p-3 rounded-xl text-sm cursor-pointer border-2 ` +
              `${!isColorPicking ? "border-slate-700" : "border-slate-300"}`
            }
            style={{ backgroundColor: color.hex }}
            onClick={() => setIsColorPicking((state) => !state)}
          >
            <span className="mix-blend-overlay text-white">{color.hex}</span>
          </div>
          <div
            className={
              `absolute top-full right-0 transition-all duration-500 shadow-sm ` +
              `${
                isColorPicking
                  ? "pointer-events-auto opacity-100 shadow-2xl"
                  : "pointer-events-none opacity-0"
              }`
            }
          >
            <ColorPicker
              width={300}
              height={228}
              color={color}
              onChange={setColor}
              hideHSV
              dark
            />
          </div>
        </div>
      </div>
      <h2 className="text-sm font-bold text-left my-10">Connections</h2>
      {connections && (
        <div className="max-w-2xl mx-auto border border-slate-300 rounded-xl p-2 pb-0">
          {connections.map(({ connector }, index) => (
            <Link
              key={connector.fullName + connector.color + connector.id}
              href={"/user/" + connector.id}
            >
              <div
                className={
                  `flex w-full flex-row flex-wrap p-3 justify-between border mb-2 ` +
                  `border-slate-300 items-center bg-white hover:bg-slate-300 rounded`
                }
              >
                <div className="">{connector.fullName}</div>
                <div
                  key={connector.fullName + connector.color}
                  className="p-2 text-xs rounded-lg border-2 box-border"
                  style={{ borderColor: connector.color }}
                >
                  {connector.color}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  if (!id || typeof id !== "string" || isNaN(parseInt(id))) {
    return { notFound: true };
  }

  const data = await getUserData(parseInt(id));
  return { props: { data } };
}
