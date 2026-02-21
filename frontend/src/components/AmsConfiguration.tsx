import useSettings from "@app/hooks/useSettings";
import AmsSlot from "./AmsSlot";
import BasicCard from "./BasicCard";
import { Droplet, Spool, Thermometer } from "lucide-react";

import { useGetAmsByDirect } from "@app/hooks/status";
import StatusChip from "./BasicChip";


export type AmsCardProps = {
  id: number;
};



function amsCount(trayCount: number) {
  return Math.ceil(trayCount / 4);
}

export default function AmsConfiguration() {
  const { data } = useSettings();
  const trayCount = data.tray_count || 0;
  const amsQty = amsCount(trayCount);

  const amsComponents = [];
  for (let i = 0; i < amsQty; i++) {
    amsComponents.push(<AmsCard key={i} id={i} />);
  }
  
  return (
    <>
      {amsQty > 0 && (
        <>{amsComponents}</>
      )}

    </>
  );
}

export function AmsCard(props: AmsCardProps) {
  const { data } = useSettings();
  const start = props.id * 4;
  const end = start + 4;
  const trays = data.trays || {};
  const locked_trays = data.locked_trays || [];

  const ams = useGetAmsByDirect(props.id);
  
  const slots = [];
  for (let i = start; i < end; i++) {
    const spool = trays[i.toString()];
    slots.push(
      <AmsSlot
        key={i}
        amsId={props.id}
        trayId={i} 
        tray={ams.tray[i]}
        spoolId={spool}
        active={i == data.active_tray}
        locked={locked_trays.includes(i)}
      />,
    );
  }


  return (
<BasicCard headline={"AMS " + props.id + 1 } icon={<Spool />}>
  <div className="flex flex-row-reverse gap-4 mb-6 justify-items-end">
    <StatusChip text={ams.temp + "C"} state={"neutral"} icon={<Thermometer />} />
    <StatusChip text={ams.humidity + "%"} state={"neutral"} icon={<Droplet />} />
  </div>
  <div className="grid grid-cols-4 gap-4">
          {slots}
  </div>
</BasicCard>
  );
}
