import { usePopup } from "@app/stores/popupStore";
import SpoolChangeModel from "./models/SpoolChangeModel";
import { useSpoolQuery } from "@app/hooks/spool";
import AmsSpoolChip from "./AmsSpoolChip";
import { Suspense, useState } from "react";
import useChangeStore from "@app/stores/spoolChangeStore";
import { useGetAmsTrayByTray, useGetAmsByTray } from "@app/hooks/status";
import { Tray } from "@app/types";
import { Palette,  Thermometer, RulerDimensionLine, WindArrowDown, SpoolIcon } from "lucide-react";
import Colour from "@app/deltae"

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
  
  return (<div className="absolute -translate-y-full -ml-8 z-50">
      <div className="rounded-2xl bg-gray-200 p-2 shadow-xl flex flex-col">
          <span className="text-sm text-gray-800">
            <h1 className=" font-bold text-xl text-center">Slot {parseInt(props.tray.id,10) + 1}</h1>
            <h2 className=" text-base text-center">{orgSpool ? ("Bambu " + props.tray.tray_sub_brands) : ("Other") }</h2>
            <p><SpoolIcon size="16" className="inline-block"/> {props.tray.tray_type} {orgSpool && (<RulerDimensionLine size="16" className="inline-block"/>)} {orgSpool && props.tray.tray_diameter}</p>
            <p><Palette size="16" className="inline-block"/> <div className="border-black border-2 aspect-square h-[16px] w-[16px] inline-block" style={{background: "#"+props.tray.tray_color.substring(0,6)}}></div>#{props.tray.tray_color.substring(0,6)}</p>
            <p><Thermometer size={16} className="inline-block" /> {props.tray.nozzle_temp_min}°C - {props.tray.nozzle_temp_max}°C</p>
            <p><WindArrowDown size={16} className="inline-block" /> {props.tray.k.toFixed(2)}</p>
          </span>
      </div>
  </div>);

}

export default function AmsSlot(props: AmsSlotProps) {
  const { data: spool } = useSpoolQuery(props.spoolId);
  const { open } = usePopup();
  const { setSpoolId } = useChangeStore();
  const [ visTooltip, setVisToolip ] = useState(false);


let popupTitle = {title:""};
console.log("trayid "+ props.trayId);
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
  let deltae = 0;
  if (tray?.tray_color && spool?.filament.color_hex) {
    deltae = Colour.deltaE00(Colour.hex2lab("#" + tray.tray_color.substring(0,6)),Colour.hex2lab(spool.filament.color_hex.substring(0,6)))
//    console.log(Colour.hex2lab("#" + tray.tray_color.substring(0,6)) + " " + tray.tray_color.substring(0,6));
//    console.log(Colour.hex2lab(spool.filament.color_hex) + " " + spool.filament.color_hex);
//    console.log(deltae);
  };

  
  return (
    <Suspense fallback={<AmsSpoolChip spool={null} />}>
      <div onClick={openChangeModel} onMouseEnter={() => {setVisToolip(!visTooltip)}} onMouseLeave={() => {setVisToolip(!visTooltip)}} className="cursor-pointer">
        {visTooltip && (
          <ToolTip tray={tray}/>
        )}
        <AmsSpoolChip
          spool={spool}
          active={props.active}
          showUsage
          showMaterial
        />
      </div>
    </Suspense>
  );
};