import { Tray } from "@app/types";
import { Palette,  Thermometer, RulerDimensionLine, WindArrowDown, SpoolIcon } from "lucide-react";

type ToolTipProps = {
  tray: Tray<string>;
}

export default function AmsSlotToolTip(props: ToolTipProps){
  if (props.tray == null) return null;

  const orgSpool = (parseInt(props.tray.tray_uuid) == 0  ? false : true);
  return (
    <div className="absolute z-40 left-1/2 -translate-x-1/2 bottom-full mb-0 w-max">
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