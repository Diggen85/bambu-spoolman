import useSpoolsQuery from "@app/hooks/Spools";
import { Spool } from "@app/types";


import classNames from "classnames";
import { SelectHTMLAttributes, useLayoutEffect } from "react";
import { cva } from "class-variance-authority";

import AmsSpoolChip from "./AmsSpoolChip";
import { ArrowBigRightDash } from "lucide-react";

const input = cva(["border", "rounded", "p1"], {
  variants: {
    disabled: {
      true: ["cursor-not-allowed", "bg-gray-100", "border-gray-200"],
      false: ["border-gray-300"],
    },
  },
});

export default function HTMLSpoolsSelect({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const { data } = useSpoolsQuery();
  
  return (
    <select
      {...props}
      className={classNames(
        input({ disabled: props.disabled }),
        className,
      )}
    >
    {data.map((item: Spool) =>
        <option key={item.id} value={item.id}>{item.id}: {item.filament.name} - {item.filament.vendor.name}</option>
    )}
    </select>
  );
}


export function SpoolSelect({spoolId, onClick}: {spoolId: string, onClick(id: number): undefined}) {
  const {data} = useSpoolsQuery();
  
  //Jump in SpoolSelect
  useLayoutEffect(() => {
    const container = document.getElementById("SpoolSelect");
    container && (container.scrollTop = ((parseInt(spoolId,10) - 2 ) * 82)-2);
  }, []);
  
  return (
    <div className="flex flex-grow max-h-[250px] bg-gray-200 rounded-lg insetshadow">
      <div id="SpoolSelect"
        className="flex flex-col my-2
                    overflow-y-scroll overflow-x-hidden snap-y touch-pan-y overscroll-contain
                    rounded-lg gap-y-4 scrollbar
                    bg-transparent"
        >
      {data.map((item: Spool) => 
        <div key={item.id} className="flex items-center px-1 mx-1
          bg-gray-100 border-[1px] border-gray-300 shadow-md rounded-lg
          snap-center "
          >
            <div className="size-fit">
              <AmsSpoolChip 
                      spool={item}
                      size="small"
                      showUsage
                      />
            </div>
            <div className="flex-grow p-2 whitespace-nowrap overflow-hidden" >
                <div className="text-xs font-semibold ">{item.filament?.name || "none"}</div>
                <div className="text-xs ">
                    {item.filament.vendor?.name || "none"}
                </div>
                <div className="text-xs text-gray-600 ">
                    {item.filament?.material} - {(item.remaining_length/1000).toFixed(2)}m - {item.remaining_weight.toFixed(2)}g
                </div>
            </div>
            <div className="flex rounded items-center aspect-square
              bg-gray-300 text-gray-800 hover:bg-gray-700 hover:text-gray-300" 
              >
              <button className="flex-grow aspect-square p-1" onClick={() =>{onClick(item.id)}}>
                <ArrowBigRightDash className="h-[16px] aspect-square"/>
              </button>
            </div> 
        </div>
      )}
      </div>
    </div>
  );
}
