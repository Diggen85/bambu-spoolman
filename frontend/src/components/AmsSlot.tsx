
import { useSpoolQuery } from "@app/hooks/spool";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense, useState } from "react";

import { useGetAmsTrayByTray } from "@app/hooks/status";
import { TriangleAlert } from "lucide-react";
import Colour from "@app/deltae"

import SpoolSelectPopup from "./SpoolSelectPopUp";
import AmsSlotToolTip from "./AmsSlotToolTip";
import { Tray } from "@app/types";


export type AmsSlotProps = {
  spoolId: number;
  trayId: number;
  amsId?: number;
  tray: Tray<string>;
  active: boolean;
  locked: boolean;
};

export default function AmsSlot(props: AmsSlotProps) {
  const [ visTooltip, setVisToolip ] = useState(false);
  const [ visPopup, setVisPopup ] = useState(false);
  const { data: spool } = useSpoolQuery(props.spoolId);


  let spoolDeltae;
  if (props?.tray?.tray_color && spool?.filament.color_hex) {
    const deltae = Colour.deltaE00(Colour.hex2lab("#" + props?.tray?.tray_color.substring(0,6)),Colour.hex2lab(spool.filament.color_hex.substring(0,6)));
    if (deltae > 10) {
      spoolDeltae = (
      <div className="absolute z-10 left-1/2 -translate-x-1/2 -translate-y-16">
        <TriangleAlert className="text-yellow-600" fill="rgb(253 224 71)"/>
      </div>
      );
    } else if (deltae > 50) {
      spoolDeltae = (
      <div className="absolute z-10 left-1/2 -translate-x-1/2 -translate-y-16">
        <TriangleAlert className="text-red-600" fill="rgb(252 165 165)"/>
      </div>
      );
    }
  };

  return (

    <Suspense fallback={<AmsSpoolChip spool={null} />}>
      { visPopup && (
          <SpoolSelectPopup slot={props} closeFn={()=>{ setVisPopup(false)}}/>
      )}
      <div onClick={() => {setVisPopup(!visPopup)}} onMouseEnter={() => {setVisToolip(!visTooltip)}} onMouseLeave={() => {setVisToolip(!visTooltip)}} className="cursor-pointer relative">
        { visTooltip && (
            <AmsSlotToolTip tray={props.tray}/>
        )}
        <AmsSpoolChip
          spool={spool}
          locked={props.locked}
          showUsage
          showMaterial
        /> 
      {spoolDeltae}
      </div>
    </Suspense>
  );
};