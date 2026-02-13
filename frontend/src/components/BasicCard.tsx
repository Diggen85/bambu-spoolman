import { ReactNode } from "react";

export type BasicCardProps = {
  headline: string | undefined;
  subline?: string | undefined;
  icon: JSX.Element;
  action?: JSX.Element;
  children: ReactNode | ReactNode[];
};



export default function BasicCard(props: BasicCardProps) {

  return (
    <div className="rounded-2xl bg-gray-50 p-4 shadow-xl flex flex-col">
      <div className="flex flex-row mb-4 gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            {props.icon}
          </div>
          <div className="h-12 content-center flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 ">{props.headline}</h2>
          {props.subline && (<h2 className="text-xs font-semibold text-gray-600">{props.subline}</h2>)}
          </div>
        <div className="items-top flex flex-grow-0">
          {props.action}
        </div>
      </div>
        {props.children}
    </div>
  );

}