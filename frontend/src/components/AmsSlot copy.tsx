import { usePopup } from "@app/stores/popupStore";
import SpoolChangeModel from "./models/SpoolChangeModel";
import { useSpoolQuery } from "@app/hooks/spool";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense, useState } from "react";
import useChangeStore from "@app/stores/spoolChangeStore";
import { useGetAmsTrayByTray, useGetAmsByTray } from "@app/hooks/status";
import { Tray } from "@app/types";
import { Palette,  Thermometer, RulerDimensionLine, WindArrowDown, SpoolIcon, TriangleAlert } from "lucide-react";
import Colour from "@app/helpers/deltae"

type AmsSlotProps = {
  spoolId: number;
  trayId: number;
  amsId?: number;
  active: boolean;
  locked: boolean;
};

type ToolTipProps = {
  tray: Tray<string>;
}

function ToolTip(props: ToolTipProps){
  if (props.tray == null) return null;

  const orgSpool = (parseInt(props.tray.tray_uuid) == 0  ? false : true);
  return (
    <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-0 w-max">
      <div className="rounded-2xl shadow-xl flex flex-col border-2 border-gray-300">
          <div className="bg-gray-600 text-gray-200 rounded-t-2xl p-2">
            <h1 className=" font-bold text-xl text-center">Slot {parseInt(props.tray.id,10) + 1}</h1>
          </div>
          <div className="text-sm text-gray-800  bg-gray-200 rounded-b-2xl px-4 pb-4">
            <h2 className=" text-base text-center">{orgSpool ? ("Bambu " + props.tray.tray_sub_brands) : ("Other") }</h2>
            <p><SpoolIcon size="16" className="inline-block"/> {props.tray.tray_type} {orgSpool && (<RulerDimensionLine size="16" className="inline-block"/>)} {orgSpool && props.tray.tray_diameter}</p>
            <p><Palette size="16" className="inline-block"/> <div className="border-black border-2 aspect-square h-[16px] w-[16px] inline-block" style={{background: "#"+props.tray.tray_color.substring(0,6)}}></div>#{props.tray.tray_color.substring(0,6)}</p>
            <p><Thermometer size={16} className="inline-block" /> {props.tray.nozzle_temp_min}°C - {props.tray.nozzle_temp_max}°C</p>
            <p><WindArrowDown size={16} className="inline-block" /> {props.tray.k.toFixed(2)}</p>
          </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent top-full border-t-[16px] shadow-xl border-gray-300"/>
    </div>);

}

export default function AmsSlot(props: AmsSlotProps) {
  const { data: spool } = useSpoolQuery(props.spoolId);
  const { open } = usePopup();
  const { setSpoolId } = useChangeStore();
  const [ visTooltip, setVisToolip ] = useState(false);


let popupTitle = {title:""};
if (props.trayId == 255) {
  popupTitle = {title:"Update external Spool"};
} else {
  popupTitle = {title: ("Update AMS " + useGetAmsByTray(props.trayId).id + " Slot " + useGetAmsTrayByTray(props.trayId).id.toString()) };
}

  const openChangeModel = () => {
    setSpoolId(props.spoolId);
    open(<SpoolChangeModel trayId={props.trayId} locked={props.locked} />, popupTitle);
  };



  const tray = useGetAmsTrayByTray(props.trayId); 
  let spoolDeltae;
  if (tray?.tray_color && spool?.filament.color_hex) {
    const deltae = Colour.deltaE00(Colour.hex2lab("#" + tray.tray_color.substring(0,6)),Colour.hex2lab(spool.filament.color_hex.substring(0,6)));
    if (deltae > 10) {
      spoolDeltae = (
      <div className="absolute z-50 left-1/2 -translate-x-1/2 -translate-y-16">
        <TriangleAlert className="text-yellow-600" fill="rgb(253 224 71)"/>
      </div>
      );
    } else if (deltae > 50) {
      spoolDeltae = (
      <div className="absolute z-50 left-1/2 -translate-x-1/2 -translate-y-16">
        <TriangleAlert className="text-red-600" fill="rgb(252 165 165)"/>
      </div>
      );
    }
  };
  return (
    <Suspense fallback={<AmsSpoolChip spool={null} />}>
      <div onClick={openChangeModel} onMouseEnter={() => {setVisToolip(!visTooltip)}} onMouseLeave={() => {setVisToolip(!visTooltip)}} className="cursor-pointer relative">
        {visTooltip && (
          <ToolTip tray={tray}/>
        )}
        <AmsSpoolChip
          spool={spool}
          active={props.active}
          showUsage
          showMaterial
        /> 
      {spoolDeltae}
      </div>
    </Suspense>
  );
};