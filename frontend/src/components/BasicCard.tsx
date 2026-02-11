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
    <div className="max-w-md rounded-2xl bg-gray-50 p-4 shadow-xl">
      <div className="flex flex-row">
        <div className="mb-6 flex flex-grow items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            {props.icon}
          </div>
          <div className="flex-row h-12 content-center">
          <h2 className="text-xl font-semibold text-gray-800 ">{props.headline}</h2>
          {props.subline && (<h2 className="text-xs font-semibold text-gray-600">{props.subline}</h2>)}
          </div>
        </div>
        <div className="mb-6 flex flex-grow-0">
          {props.action}
        </div>
      </div>
        {props.children}
    </div>
  );

}